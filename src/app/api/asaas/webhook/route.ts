import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase";
import { fimDoCiclo } from "@/lib/ciclo-assinatura";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const secret = process.env.ASAAS_WEBHOOK_SECRET;
  const token = req.headers.get("asaas-access-token");
  if (
    !secret ||
    !token ||
    Buffer.byteLength(secret) !== Buffer.byteLength(token) ||
    !crypto.timingSafeEqual(Buffer.from(secret), Buffer.from(token))
  ) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  try {
    const event = await req.json();
    const evento = event?.event;
    const subId = event?.payment?.subscription ?? event?.subscription?.id;
    if (typeof subId !== "string" || !subId.startsWith("sub_")) {
      return NextResponse.json({ received: true, matched: false });
    }
    const supabase = createSupabaseAdmin();
    // A identidade é a assinatura armazenada, nunca só a organização de um
    // evento antigo. Não reatribuir uma cobrança desconhecida via externalReference.
    const { data: sub, error: lookupError } = await supabase
      .from("subscriptions")
      .select(
        "id, organization_id, billing_cycle, current_period_start, current_period_end, status, canceled_at, updated_at",
      )
      .eq("asaas_subscription_id", subId)
      .maybeSingle();
    if (lookupError)
      return NextResponse.json(
        { error: "Subscription lookup failed" },
        { status: 503 },
      );
    if (!sub) return NextResponse.json({ received: true, matched: false });
    const update: Record<string, unknown> = {};
    const dueDate = event?.payment?.dueDate;
    if (evento === "PAYMENT_CONFIRMED" || evento === "PAYMENT_RECEIVED") {
      const fim =
        typeof dueDate === "string"
          ? fimDoCiclo(dueDate, sub.billing_cycle)
          : null;
      if (!fim)
        return NextResponse.json(
          { error: "Invalid payment period" },
          { status: 422 },
        );
      // Reentrega do mesmo evento é idempotente; liquidação antiga não encurta
      // nem reativa um período posterior já persistido.
      if (
        sub.current_period_end &&
        Date.parse(fim) <= Date.parse(sub.current_period_end)
      ) {
        return NextResponse.json({ received: true });
      }
      // A marca canônica sobrevive a atraso/estorno. Creditar uma nova fatura
      // paga não recria a recorrência. Uma reativação futura terá de ser
      // explícita e limpar canceled_at depois da confirmação do provedor.
      update.status =
        sub.status === "canceled" || sub.canceled_at ? "canceled" : "active";
      update.current_period_start = dueDate + "T00:00:00.000Z";
      update.current_period_end = fim;
      update.expires_at = fim;
      if (typeof event.payment.id === "string")
        update.asaas_payment_id = event.payment.id;
    } else if (evento === "PAYMENT_OVERDUE") {
      if (typeof dueDate !== "string")
        return NextResponse.json(
          { error: "Invalid payment period" },
          { status: 422 },
        );
      // Uma fatura aberta pode vencer depois do cancelamento. Conservar a
      // situação permite creditar a liquidação sem reativar essa recorrência.
      if (sub.status === "canceled")
        return NextResponse.json({ received: true });
      // Ignorar atraso de uma fatura de antes do período pago atual.
      if (
        sub.status === "active" &&
        sub.current_period_start &&
        dueDate <= String(sub.current_period_start).slice(0, 10)
      )
        return NextResponse.json({ received: true });
      update.status = "past_due";
    } else if (
      evento === "SUBSCRIPTION_DELETED" ||
      evento === "SUBSCRIPTION_INACTIVATED" ||
      (evento === "SUBSCRIPTION_UPDATED" &&
        event.subscription?.status === "INACTIVE")
    ) {
      // Cancelar recorrência não desfaz estorno, contestação ou inadimplência.
      // Esses estados não podem ganhar acesso por terem uma data futura.
      if (!["suspended", "past_due", "pending"].includes(sub.status))
        update.status = "canceled";
      update.canceled_at = new Date().toISOString();
    } else if (
      evento === "PAYMENT_REFUNDED" ||
      evento === "PAYMENT_CHARGEBACK_REQUESTED"
    ) {
      const fim =
        typeof dueDate === "string"
          ? fimDoCiclo(dueDate, sub.billing_cycle)
          : null;
      if (!fim)
        return NextResponse.json(
          { error: "Invalid payment period" },
          { status: 422 },
        );
      if (
        fim &&
        sub.current_period_end &&
        Date.parse(fim) < Date.parse(sub.current_period_end)
      )
        return NextResponse.json({ received: true });
      update.status = "suspended";
      // A situação suspende o acesso. A data continua marcando a última fatura
      // tratada para impedir que uma confirmação atrasada a libere novamente.
      update.current_period_end =
        sub.current_period_end &&
        Date.parse(sub.current_period_end) > Date.parse(fim)
          ? sub.current_period_end
          : fim;
      update.expires_at = update.current_period_end;
    } else {
      // SUBSCRIPTION_CREATED/UPDATED e eventos de split descrevem a recorrência,
      // não comprovam liquidação. Não ampliar plano/vagas nem ativar pagamento.
      return NextResponse.json({ received: true });
    }
    update.updated_at = new Date().toISOString();
    const mutation = supabase
      .from("subscriptions")
      .update(update)
      .eq("organization_id", sub.organization_id)
      .eq("id", sub.id)
      .eq("asaas_subscription_id", subId)
      // Concorrência: um evento não sobrescreve um período que mudou na leitura.
      .eq("status", sub.status)
      .eq("updated_at", sub.updated_at);
    const { data: updated, error } = await mutation.select("id");
    if (error)
      return NextResponse.json(
        { error: "Subscription update failed" },
        { status: 503 },
      );
    if (!updated?.length)
      return NextResponse.json(
        { error: "Subscription changed; retry event" },
        { status: 503 },
      );
    if (evento === "PAYMENT_REFUNDED") {
      // Avisa o CRM, que escreve ao cliente "reembolso confirmado". Só o estorno
      // (não a contestação) e só depois de a assinatura ter sido suspensa. É
      // cortesia: falhar aqui nunca desfaz nem repete o que o webhook já gravou.
      // O CRM deduplica por pagamento, então a reentrega do evento não duplica.
      try {
        await supabase.rpc("emit_event", {
          p_event_type: "reembolso.confirmado",
          p_entity_kind: "subscription",
          p_entity_id: sub.id,
          p_payload: {
            payment_id:
              typeof event?.payment?.id === "string" ? event.payment.id : null,
            value:
              typeof event?.payment?.value === "number"
                ? event.payment.value
                : null,
            billing_type:
              typeof event?.payment?.billingType === "string"
                ? event.payment.billingType
                : null,
          },
          p_metadata: { source: "asaas-webhook" },
          p_organization_id: sub.organization_id,
        });
      } catch {
        // sem aviso ao cliente; o reembolso em si já está registrado
      }
    }
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
