import { NextRequest, NextResponse } from "next/server";
import { getPayment } from "@/lib/asaas/client";
import { createSupabaseAdmin } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ payment_id: string }> },
) {
  try {
    const { payment_id } = await params;
    if (!/^pay_[A-Za-z0-9_]+$/.test(payment_id))
      return NextResponse.json(
        { error: "Identificador de pagamento inválido." },
        { status: 400 },
      );
    const bearer = req.headers
      .get("authorization")
      ?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!bearer)
      return NextResponse.json(
        { error: "Entre na sua conta para consultar o pagamento." },
        { status: 401 },
      );
    const supabase = createSupabaseAdmin();
    const { data: auth, error: authError } =
      await supabase.auth.getUser(bearer);
    if (authError || !auth.user)
      return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
    const { data: memberships, error: memberError } = await supabase
      .from("user_organizations")
      .select("organization_id, role")
      .eq("user_id", auth.user.id)
      .is("revoked_at", null)
      .in("role", ["admin", "manager"]);
    if (memberError)
      return NextResponse.json(
        { error: "Não foi possível conferir o acesso à cobrança." },
        { status: 503 },
      );
    const orgIds = (memberships ?? [])
      .filter((member) => ["admin", "manager"].includes(member.role))
      .map((member) => member.organization_id);
    if (!orgIds.length)
      return NextResponse.json(
        { error: "Sem acesso ao pagamento." },
        { status: 403 },
      );

    // Cobranças pendentes ainda não têm asaas_payment_id gravado pelo evento
    // de liquidação. A autorização é pelo vínculo da assinatura retornada pelo
    // provedor com uma organização administrativa da sessão, nunca pelo body.
    const payment = await getPayment(payment_id);
    if (
      payment.id !== payment_id ||
      typeof payment.subscription !== "string" ||
      !/^sub_[A-Za-z0-9_]+$/.test(payment.subscription)
    )
      return NextResponse.json(
        { error: "Pagamento não encontrado." },
        { status: 404 },
      );
    const { data: subscription, error: lookupError } = await supabase
      .from("subscriptions")
      .select("organization_id, status, plan_type, expires_at")
      .eq("asaas_subscription_id", payment.subscription)
      .in("organization_id", orgIds)
      .maybeSingle();
    if (lookupError)
      return NextResponse.json(
        { error: "Não foi possível conferir a assinatura." },
        { status: 503 },
      );
    if (!subscription || !orgIds.includes(subscription.organization_id))
      return NextResponse.json(
        { error: "Pagamento não encontrado." },
        { status: 404 },
      );
    return NextResponse.json(
      {
        payment_id: payment.id,
        asaas_status: payment.status,
        billing_type: payment.billingType,
        value: payment.value,
        confirmed_date: payment.confirmedDate || null,
        local_status: subscription.status,
        plan_type: subscription.plan_type,
        expires_at: subscription.expires_at,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Não foi possível consultar o pagamento agora." },
      { status: 503 },
    );
  }
}
