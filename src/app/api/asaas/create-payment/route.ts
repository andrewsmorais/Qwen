import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase";
import { findOrCreateCustomer, createPayment, getPixQrCode } from "@/lib/asaas/client";
import type { CreatePaymentRequest, BillingType } from "@/lib/asaas/types";

// Validação simples de CPF/CNPJ (formato)
function isValidCpfCnpj(value: string): boolean {
  const cleaned = value.replace(/\D/g, "");
  return cleaned.length === 11 || cleaned.length === 14;
}

export async function POST(req: NextRequest) {
  try {
    const body: CreatePaymentRequest = await req.json();

    // ── Validações ──
    if (!body.organization_id || !body.customer_name || !body.customer_email || !body.customer_cpf_cnpj || !body.value || !body.plan_type || !body.billing_type) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
    }

    if (!isValidCpfCnpj(body.customer_cpf_cnpj)) {
      return NextResponse.json({ error: "CPF/CNPJ inválido" }, { status: 400 });
    }

    const validBillingTypes: BillingType[] = ["PIX", "BOLETO", "CREDIT_CARD", "DEBIT_CARD"];
    if (!validBillingTypes.includes(body.billing_type)) {
      return NextResponse.json({ error: "Método de pagamento inválido" }, { status: 400 });
    }

    if ((body.billing_type === "CREDIT_CARD" || body.billing_type === "DEBIT_CARD") && !body.credit_card_token) {
      return NextResponse.json({ error: "Token do cartão é obrigatório" }, { status: 400 });
    }

    // ── 1. Buscar/criar cliente no Asaas ──
    const customer = await findOrCreateCustomer({
      name: body.customer_name,
      email: body.customer_email,
      cpfCnpj: body.customer_cpf_cnpj.replace(/\D/g, ""),
      phone: body.customer_phone,
    });

    // ── 2. Montar payload de pagamento ──
    const paymentPayload: Record<string, unknown> = {
      customer: customer.id,
      billingType: body.billing_type,
      value: body.value,
      description: `Assinatura Plano ${body.plan_type.charAt(0).toUpperCase() + body.plan_type.slice(1)} - ChatAI Online`,
      externalReference: body.organization_id,
    };

    // Configurações específicas por método - 7 DIAS DE TESTE GRÁTIS
    switch (body.billing_type) {
      case "PIX":
        // PIX e Boleto vencem rápido, mas o acesso já é liberado por 7 dias.
        paymentPayload.dueDate = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        break;

      case "BOLETO":
        paymentPayload.dueDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        paymentPayload.postalService = false;
        break;

      case "CREDIT_CARD":
        // Cartão de crédito: A cobrança só acontece daqui a 7 dias!
        paymentPayload.dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        paymentPayload.creditCardToken = body.credit_card_token;
        if (body.installment_count && body.installment_count > 1) {
          const count = Math.min(body.installment_count, 12);
          paymentPayload.installmentCount = count;
          paymentPayload.installmentValue = Math.round((body.value / count) * 100) / 100;
        }
        break;

      case "DEBIT_CARD":
        paymentPayload.dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        paymentPayload.creditCardToken = body.credit_card_token;
        break;
    }

    // ── 3. Criar pagamento no Asaas ──
    const payment = await createPayment(paymentPayload);

    // ── 4. Salvar no Supabase (Status TRIAL + 7 dias grátis) ──
    const supabase = createSupabaseAdmin();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    
    const { error: dbError } = await supabase.from("subscriptions").upsert({
      organization_id: body.organization_id,
      asaas_customer_id: customer.id,
      asaas_payment_id: payment.id,
      status: "trial", // ATIVANDO O TRIAL
      expires_at: expiresAt, // EXPIRA EM 7 DIAS
      plan_type: body.plan_type,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: "organization_id",
    });

    if (dbError) {
      console.error("[DB Error] Saving subscription:", dbError);
      // Não bloqueia — o pagamento já foi criado no Asaas
    }

    // ── 5. Retornar resposta conforme método ──
    if (body.billing_type === "PIX") {
      // Buscar QR Code do PIX
      const pixData = await getPixQrCode(payment.id);
      return NextResponse.json({
        success: true,
        payment_id: payment.id,
        pixQrCode: pixData.encodedImage,
        pixPayload: pixData.payload,
      });
    }

    if (body.billing_type === "BOLETO") {
      return NextResponse.json({
        success: true,
        payment_id: payment.id,
        boletoUrl: payment.invoiceUrl,
        bankSlipUrl: payment.bankSlipUrl,
      });
    }

    // CREDIT_CARD / DEBIT_CARD
    return NextResponse.json({
      success: true,
      payment_id: payment.id,
      status: payment.status,
    });

  } catch (error) {
    console.error("[create-payment] Error:", error);
    const message = error instanceof Error ? error.message : "Erro interno ao processar pagamento";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
