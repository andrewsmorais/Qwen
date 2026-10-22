import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase";
import {
  findOrCreateCustomer,
  createSubscription,
  getSubscriptionPayments,
  getPixQrCode,
} from "@/lib/asaas/client";
import crypto from "crypto";
import { selecionarPlano } from "@/lib/planos";
import { origemDoCartao } from "@/lib/asaas/origem-cartao";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body))
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    for (const value of [
      body.plan_slug,
      body.plan_type,
      body.billing_cycle,
      body.customer_name,
      body.customer_email,
      body.customer_cpf_cnpj,
      body.phone,
      body.company_name,
      body.customer?.name,
      body.customer?.email,
      body.customer?.cpfCnpj,
      body.customer?.phone,
      body.customer?.postalCode,
      body.customer?.addressNumber,
    ]) {
      if (value !== undefined && value !== null && typeof value !== "string")
        return NextResponse.json(
          { error: "Confira os campos de cadastro e do plano." },
          { status: 400 },
        );
    }

    // 1. Extração e normalização de parâmetros
    const planSlug = (body.plan_slug || body.plan_type || "")
      .toLowerCase()
      .trim();
    const billingCycle = (body.billing_cycle || "monthly").toLowerCase().trim();
    const billingType = body.billing_type || "CREDIT_CARD";
    if (!["CREDIT_CARD", "PIX", "BOLETO"].includes(billingType))
      return NextResponse.json(
        { error: "Forma de pagamento inválida." },
        { status: 400 },
      );
    if (
      billingType === "CREDIT_CARD" &&
      (typeof body.credit_card_token !== "string" || !body.credit_card_token)
    ) {
      return NextResponse.json(
        { error: "Confirme os dados do cartão antes de continuar." },
        { status: 400 },
      );
    }
    let selecao;
    const remoteIp = billingType === "CREDIT_CARD" ? origemDoCartao(req) : null;
    if (billingType === "CREDIT_CARD" && !remoteIp)
      return NextResponse.json(
        {
          error:
            "Pagamento com cartão indisponível até configurar a origem segura da compra. Selecione PIX ou boleto.",
        },
        { status: 503 },
      );
    try {
      selecao = selecionarPlano(planSlug, billingCycle, body.attendants);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Seleção inválida." },
        { status: 400 },
      );
    }

    if (!planSlug || !["essencial", "impulso", "escala"].includes(planSlug)) {
      return NextResponse.json(
        {
          error: "Plano inválido ou não informado (essencial, impulso, escala)",
        },
        { status: 400 },
      );
    }

    if (selecao.plano.sob_consulta) {
      return NextResponse.json(
        {
          error:
            "O plano Escala é sob consulta. Fale com a gente para combinar a implantação.",
        },
        { status: 400 },
      );
    }

    if (!["monthly", "quarterly", "yearly"].includes(billingCycle)) {
      return NextResponse.json(
        { error: "Ciclo de faturamento inválido (monthly, quarterly, yearly)" },
        { status: 400 },
      );
    }

    const customerObj = body.customer || {};
    const customerName = (customerObj.name || body.customer_name || "").trim();
    const customerEmail = (customerObj.email || body.customer_email || "")
      .trim()
      .toLowerCase();
    const rawCpfCnpj = (
      customerObj.cpfCnpj ||
      body.customer_cpf_cnpj ||
      ""
    ).trim();
    const cleanCpfCnpj = rawCpfCnpj.replace(/\D/g, "");
    const rawPhone = (customerObj.phone || body.phone || "").trim();
    const cleanPhone = rawPhone.replace(/\D/g, "");

    if (!customerName || !customerEmail || !cleanCpfCnpj) {
      return NextResponse.json(
        {
          error:
            "Dados cadastrais incompletos (nome, e-mail e CPF/CNPJ são obrigatórios)",
        },
        { status: 400 },
      );
    }

    if (cleanCpfCnpj.length !== 11 && cleanCpfCnpj.length !== 14) {
      return NextResponse.json(
        { error: "CPF ou CNPJ inválido" },
        { status: 400 },
      );
    }

    const supabase = createSupabaseAdmin();

    // Confirmar o preço ANTES de criar conta, cliente ou cobrança. Falha de
    // catálogo não pode cair num preço alternativo nem deixar conta pela metade.
    const { data: dbPlan, error: planError } = await supabase
      .from("plans")
      .select(
        "id, name, min_attendants, price_monthly, price_quarterly, price_yearly",
      )
      .eq("slug", planSlug)
      .maybeSingle();
    if (
      planError ||
      !dbPlan ||
      dbPlan.min_attendants !== selecao.plano.min_attendants ||
      dbPlan.price_monthly !== selecao.plano.price_monthly ||
      dbPlan.price_quarterly !== selecao.plano.price_quarterly ||
      dbPlan.price_yearly !== selecao.plano.price_yearly
    ) {
      return NextResponse.json(
        {
          error:
            "Não foi possível confirmar os valores deste plano. Tente novamente em instantes.",
        },
        { status: 503 },
      );
    }

    let targetOrgId = body.organization_id
      ? String(body.organization_id).trim()
      : null;

    // 2. Verificação de Identidade e Isolamento de Organização (Correção P0 + Ajuste 1)
    if (targetOrgId) {
      // Caso 1: Usuário informou organization_id existente.
      // O solicitante DEVE estar autenticado e pertencer à organização com papel admin ou manager.
      if (!UUID_REGEX.test(targetOrgId)) {
        return NextResponse.json(
          { error: "Formato de organization_id inválido" },
          { status: 400 },
        );
      }

      const authHeader = req.headers.get("authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
          {
            error:
              "Autenticação obrigatória: para associar assinaturas a uma organização existente, envie o token de sessão do Supabase.",
          },
          { status: 401 },
        );
      }

      const token = authHeader.replace(/^Bearer\s+/i, "");
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser(token);

      if (authError || !user) {
        return NextResponse.json(
          { error: "Sessão inválida ou expirada" },
          { status: 401 },
        );
      }

      const { data: membership, error: memError } = await supabase
        .from("user_organizations")
        .select("role")
        .eq("user_id", user.id)
        .eq("organization_id", targetOrgId)
        .is("revoked_at", null)
        .maybeSingle();

      if (
        memError ||
        !membership ||
        !["admin", "manager"].includes(membership.role)
      ) {
        return NextResponse.json(
          {
            error:
              "Acesso negado: seu usuário não possui autorização administrativa sobre esta organização.",
          },
          { status: 403 },
        );
      }

      const { data: anterior, error: anteriorError } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("organization_id", targetOrgId)
        .limit(1)
        .maybeSingle();
      if (anteriorError)
        return NextResponse.json(
          { error: "Não foi possível conferir sua assinatura." },
          { status: 503 },
        );
      if (anterior)
        return NextResponse.json(
          {
            error:
              "Sua organização já possui uma assinatura. Gerencie-a em Plano e cobrança; uma segunda cobrança não foi criada.",
          },
          { status: 409 },
        );
    } else {
      // Caso 2: Onboarding self-service de novo cliente.
      // Requer cadastro de identidade (Supabase Auth) e criação controlada de organização.
      const password = body.password ? String(body.password) : "";
      if (!password || password.length < 8) {
        return NextResponse.json(
          {
            error:
              "Para criar sua conta de acesso e proteger sua organização, defina uma senha com no mínimo 8 caracteres.",
          },
          { status: 400 },
        );
      }

      // Tenta criar usuário no Supabase Auth
      const { data: authData, error: createAuthError } =
        await supabase.auth.admin.createUser({
          email: customerEmail,
          password: password,
          email_confirm: true,
          user_metadata: {
            name: customerName,
            full_name: customerName,
            phone: cleanPhone,
          },
        });

      if (createAuthError) {
        const errorMsg = (createAuthError.message || "").toLowerCase();
        if (
          errorMsg.includes("already registered") ||
          errorMsg.includes("unique") ||
          createAuthError.status === 422
        ) {
          return NextResponse.json(
            {
              error:
                "Este e-mail já possui cadastro. Faça login para gerenciar sua assinatura.",
            },
            { status: 409 },
          );
        }
        return NextResponse.json(
          { error: "Não foi possível criar sua conta. Tente novamente." },
          { status: 500 },
        );
      }

      const newUserId = authData.user.id;
      const newOrgId = crypto.randomUUID();
      const slugBase =
        customerName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "")
          .slice(0, 30) || "org";
      const orgSlug = `${slugBase}-${Date.now().toString(36)}`;

      // Cria a organização
      const { error: orgError } = await supabase.from("organizations").insert({
        id: newOrgId,
        slug: orgSlug,
        legal_name: body.company_name || customerName,
        display_name: body.company_name || customerName,
        cnpj: cleanCpfCnpj,
        status: "active",
      });

      if (orgError) {
        return NextResponse.json(
          { error: "Erro ao criar organização no banco de dados" },
          { status: 500 },
        );
      }

      // Vincula o usuário como admin da nova organização
      const { error: memError } = await supabase
        .from("user_organizations")
        .insert({
          user_id: newUserId,
          organization_id: newOrgId,
          role: "admin",
        });

      if (memError) {
        return NextResponse.json(
          { error: "Erro ao vincular administrador à organização" },
          { status: 500 },
        );
      }

      targetOrgId = newOrgId;
    }

    // 3. Autoridade de Preço e Plano (Server-side canonical pricing)
    const planId = dbPlan.id;
    const planName = selecao.plano.name;
    const { seats, asaasCycle, value } = selecao;

    // O banco existente não tem UNIQUE(organization_id). O mesmo id derivado
    // da organização usa a PK existente para reservar uma única contratação,
    // inclusive quando duas abas passam juntas pela consulta anterior.
    const reservationBytes = crypto
      .createHash("sha256")
      .update(`chatai:subscription:${targetOrgId}`)
      .digest()
      .subarray(0, 16);
    reservationBytes[6] = (reservationBytes[6]! & 0x0f) | 0x40;
    reservationBytes[8] = (reservationBytes[8]! & 0x3f) | 0x80;
    const reservationHex = reservationBytes.toString("hex");
    const reservationId = `${reservationHex.slice(0, 8)}-${reservationHex.slice(8, 12)}-${reservationHex.slice(12, 16)}-${reservationHex.slice(16, 20)}-${reservationHex.slice(20)}`;
    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + 7 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const { error: reservaError } = await supabase
      .from("subscriptions")
      .insert({
        id: reservationId,
        organization_id: targetOrgId,
        plan_id: planId,
        plan_type: planSlug,
        seats,
        // suspended é válido no schema atual; a reserva não libera teste antes
        // de o Asaas confirmar a criação. Não exige alteração de schema.
        billing_cycle: billingCycle,
        status: "suspended",
        current_period_start: now.toISOString(),
        current_period_end: expiresAt,
        expires_at: expiresAt,
        updated_at: now.toISOString(),
      });
    if (reservaError)
      return NextResponse.json(
        {
          error:
            reservaError.code === "23505"
              ? "Já existe uma assinatura ou uma tentativa em andamento. Entre em Plano e cobrança antes de tentar novamente."
              : "Não foi possível reservar sua assinatura. Nenhuma cobrança foi criada.",
        },
        { status: reservaError.code === "23505" ? 409 : 503 },
      );

    // 4. Gestão Idempotente de Cliente Asaas
    let asaasCustomerId = "";
    const { data: existingAsaasCust, error: customerLookupError } =
      await supabase
        .from("asaas_customers")
        .select("asaas_customer_id")
        .eq("organization_id", targetOrgId)
        .maybeSingle();

    if (customerLookupError)
      return NextResponse.json(
        {
          error:
            "Não foi possível conferir o cadastro de cobrança. Nenhuma assinatura foi criada no Asaas.",
        },
        { status: 503 },
      );

    if (existingAsaasCust?.asaas_customer_id) {
      asaasCustomerId = existingAsaasCust.asaas_customer_id;
    } else {
      const customer = await findOrCreateCustomer({
        name: customerName,
        email: customerEmail,
        cpfCnpj: cleanCpfCnpj,
        phone: cleanPhone || undefined,
        postalCode:
          (customerObj.postalCode || "").replace(/\D/g, "") || undefined,
        addressNumber: customerObj.addressNumber || undefined,
        externalReference: targetOrgId,
      });
      asaasCustomerId = customer.id;

      // A reserva anterior serializa a contratação desta organização. O schema
      // existente só garante unicidade do cliente Asaas, não de organization_id.
      // Inserir preserva vínculos de outros tenants quando o CPF/CNPJ é repetido.
      const { error: customerSaveError } = await supabase
        .from("asaas_customers")
        .insert({
          organization_id: targetOrgId,
          asaas_customer_id: customer.id,
          email: customer.email,
          name: customer.name,
        });
      if (customerSaveError)
        return NextResponse.json(
          {
            error:
              customerSaveError.code === "23505"
                ? "Este cadastro de cobrança já está vinculado. A assinatura não foi criada; entre em contato para conferir o vínculo antes de tentar novamente."
                : "Não foi possível vincular o cadastro de cobrança. A assinatura não foi criada; entre em contato antes de tentar novamente.",
          },
          { status: customerSaveError.code === "23505" ? 409 : 503 },
        );
    }

    // 5. Criação de Assinatura no Asaas (Trial de 7 dias)
    const nextDueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const subParams: Parameters<typeof createSubscription>[0] = {
      customer: asaasCustomerId,
      billingType: billingType,
      value: value,
      nextDueDate: nextDueDate,
      cycle: asaasCycle,
      description: `ChatAI Online - Plano ${planName}`,
      externalReference: targetOrgId,
    };

    if (billingType === "CREDIT_CARD" && body.credit_card_token) {
      subParams.creditCardToken = body.credit_card_token;
      subParams.remoteIp = remoteIp!;
    }

    const subscription = await createSubscription(subParams);

    // 6. Registro no Supabase (Status conforme Ajuste 2: trialing ou pending, NUNCA active)
    // O teste de sete dias faz parte do contrato de todos os meios. A primeira
    // cobrança só vence depois dele; criar assinatura não confirma pagamento.
    const initialStatus = "trialing";

    const subscriptionPayload: Record<string, unknown> = {
      organization_id: targetOrgId,
      plan_type: planSlug,
      seats: seats,
      billing_cycle: billingCycle,
      asaas_customer_id: asaasCustomerId,
      asaas_subscription_id: subscription.id,
      asaas_payment_id: null,
      status: initialStatus,
      current_period_start: now.toISOString(),
      current_period_end: expiresAt,
      expires_at: expiresAt,
      updated_at: now.toISOString(),
    };

    if (planId) {
      subscriptionPayload.plan_id = planId;
    }

    const { data: savedSubscriptions, error: subError } = await supabase
      .from("subscriptions")
      .update(subscriptionPayload)
      .eq("organization_id", targetOrgId)
      .eq("id", reservationId)
      .eq("status", "suspended")
      .is("asaas_subscription_id", null)
      .select("id");

    if (subError || savedSubscriptions?.length !== 1) {
      return NextResponse.json(
        {
          error:
            "A assinatura foi enviada ao Asaas, mas o vínculo local não foi confirmado. Não repita o pagamento; entre em contato para conferir essa tentativa.",
        },
        { status: 503 },
      );
    }

    // 7. Dados de pagamento para PIX ou Boleto
    let pixQrCode: string | null = null;
    let pixPayload: string | null = null;
    let boletoUrl: string | null = null;
    let firstPaymentId = subscription.id;

    if (billingType === "PIX" || billingType === "BOLETO") {
      try {
        const paymentsRes = await getSubscriptionPayments(subscription.id);
        const firstPay = paymentsRes?.data?.[0];
        if (firstPay?.id) {
          firstPaymentId = firstPay.id;
          if (billingType === "PIX") {
            const qr = await getPixQrCode(firstPay.id);
            pixQrCode = qr.encodedImage;
            pixPayload = qr.payload;
          } else if (billingType === "BOLETO") {
            boletoUrl = firstPay.bankSlipUrl || firstPay.invoiceUrl || null;
          }
        }
      } catch {
        // O contrato já foi criado. Não repetir cobrança por falha dos detalhes.
      }
    }

    return NextResponse.json({
      ok: true,
      success: true,
      organization_id: targetOrgId,
      asaas_subscription_id: subscription.id,
      payment_id: firstPaymentId,
      pixQrCode,
      pixPayload,
      boletoUrl,
      status: initialStatus,
      seats,
      value,
      billing_cycle: billingCycle,
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Não foi possível concluir o checkout. Se a tentativa anterior já foi confirmada, entre na sua conta antes de tentar novamente.",
      },
      { status: 500 },
    );
  }
}
