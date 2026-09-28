import { NextRequest, NextResponse } from "next/server";
import { getPayment } from "@/lib/asaas/client";
import { createSupabaseAdmin } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ payment_id: string }> }
) {
  try {
    const { payment_id } = await params;

    if (!payment_id) {
      return NextResponse.json({ error: "payment_id obrigatório" }, { status: 400 });
    }

    // Buscar status no Asaas (fonte da verdade)
    const payment = await getPayment(payment_id);

    // Também buscar no banco local
    const supabase = createSupabaseAdmin();
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("asaas_payment_id", payment_id)
      .single();

    return NextResponse.json({
      payment_id: payment.id,
      asaas_status: payment.status,
      billing_type: payment.billingType,
      value: payment.value,
      confirmed_date: payment.confirmedDate || null,
      local_status: subscription?.status || null,
      plan_type: subscription?.plan_type || null,
      expires_at: subscription?.expires_at || null,
    });

  } catch (error) {
    console.error("[check-payment] Error:", error);
    return NextResponse.json({ error: "Erro ao verificar pagamento" }, { status: 500 });
  }
}
