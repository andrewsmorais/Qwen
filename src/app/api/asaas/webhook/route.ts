import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase";
import type { AsaasWebhookEvent, SubscriptionStatus } from "@/lib/asaas/types";
import crypto from "crypto";

function validateAsaasToken(req: NextRequest): boolean {
  const secret = process.env.ASAAS_WEBHOOK_SECRET;
  const token = req.headers.get("asaas-access-token");
  if (!secret || !token) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(secret);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  try {
    if (!validateAsaasToken(req)) {
      console.error("[Webhook] Invalid token detected");
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const rawBody = await req.text();
    const event: AsaasWebhookEvent = JSON.parse(rawBody);

    console.log("[Webhook] Event received:", event.event, "Payment:", event.payment?.id);

    if (!event.payment?.id) {
      return NextResponse.json({ received: true });
    }

    const supabase = createSupabaseAdmin();
    const paymentId = event.payment.id;

    let newStatus: SubscriptionStatus | null = null;
    let expiresAt: string | null = null;

    switch (event.event) {
      case "PAYMENT_CONFIRMED":
      case "PAYMENT_RECEIVED": {
        newStatus = "confirmed";
        // Determinar duração baseada na descrição ou plan_type
        const description = event.payment.description?.toLowerCase() || "";
        const isAnnual = description.includes("anual") || description.includes("annual");
        const daysToAdd = isAnnual ? 365 : 30;
        expiresAt = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();
        break;
      }

      case "PAYMENT_OVERDUE":
        newStatus = "overdue";
        break;

      case "PAYMENT_DELETED":
      case "PAYMENT_REFUNDED":
        newStatus = "cancelled";
        break;

      default:
        console.log("[Webhook] Unhandled event:", event.event);
        return NextResponse.json({ received: true });
    }

    if (newStatus) {
      const updateData: Record<string, unknown> = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };

      if (expiresAt) {
        updateData.expires_at = expiresAt;
      }

      const { error } = await supabase
        .from("subscriptions")
        .update(updateData)
        .eq("asaas_payment_id", paymentId);

      if (error) {
        console.error("[Webhook] DB update error:", error);
        // Retorna 200 mesmo assim para o Asaas não reenviar
      } else {
        console.log("[Webhook] Subscription updated:", paymentId, "→", newStatus);
      }
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("[Webhook] Processing error:", error);
    // Sempre retorna 200 para evitar retries infinitos do Asaas
    return NextResponse.json({ received: true });
  }
}
