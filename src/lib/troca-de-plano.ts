/**
 * Troca de plano pedida no CRM (Plano e cobrança › Trocar de plano, migration
 * 0508 do CRM). O CRM grava o pedido na assinatura; o dinheiro passa pelo
 * Asaas, e quem confirma o dinheiro é ESTE webhook. Por isso é aqui que:
 *
 *   - o UPGRADE pago vira plano novo: a cobrança avulsa da diferença confirma,
 *     a recorrência passa a cobrar o valor do plano novo e a assinatura troca.
 *     A identidade é o id da cobrança gravado pelo CRM (`troca_pagamento_id`),
 *     nunca o `externalReference`, que é texto livre;
 *   - a cobrança da diferença que vence, é apagada ou estornada antes de valer
 *     desfaz o pedido (o cliente segue no plano de antes);
 *   - o DOWNGRADE agendado se consolida quando a renovação do período em que
 *     ele vale é paga (o CRM já o aplica pela data; aqui a assinatura passa a
 *     dizer o mesmo, e o e-mail de "plano reduzido" sai pelo gatilho do banco).
 */
import type { SupabaseClient } from "@supabase/supabase-js";

export const LIMPA_TROCA = {
  troca_plano: null,
  troca_tipo: null,
  troca_efetiva_em: null,
  troca_pagamento_id: null,
  troca_valor_cents: null,
  troca_link: null,
  troca_pedida_em: null,
} as const;

export type PlanoDoCatalogo = {
  id: string;
  price_monthly: number;
  price_quarterly: number | null;
  price_yearly: number | null;
};

/** O valor do ciclo inteiro, em centavos (a mesma conta do checkout). */
export function valorDoCiclo(p: PlanoDoCatalogo, ciclo: string): number | null {
  if (!(p.price_monthly > 0)) return null;
  if (ciclo === "monthly") return p.price_monthly;
  if (ciclo === "quarterly") return p.price_quarterly ?? p.price_monthly * 3;
  if (ciclo === "yearly") return p.price_yearly ?? p.price_monthly * 12;
  return null;
}

export async function planoDoCatalogo(
  supabase: SupabaseClient,
  slug: string,
): Promise<PlanoDoCatalogo | null> {
  const { data, error } = await supabase
    .from("plans")
    .select("id, price_monthly, price_quarterly, price_yearly")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data || typeof data.id !== "string") return null;
  return data as PlanoDoCatalogo;
}

/** Cobrança avulsa de troca? (sem recorrência, com a referência do CRM). */
export function ehCobrancaDeTroca(payment: unknown): payment is {
  id: string;
  externalReference: string;
} {
  const p = payment as Record<string, unknown> | null;
  return (
    !!p &&
    !p.subscription &&
    typeof p.id === "string" &&
    /^pay_[A-Za-z0-9_]+$/.test(p.id) &&
    typeof p.externalReference === "string" &&
    p.externalReference.startsWith("troca:")
  );
}

/**
 * O downgrade agendado vale para o período que começa nesta data? Compara só
 * a data (o fim do período e o vencimento da renovação caem no mesmo dia).
 */
export function downgradeVenceu(
  sub: {
    troca_tipo?: unknown;
    troca_plano?: unknown;
    troca_efetiva_em?: unknown;
  },
  dueDate: string,
): sub is {
  troca_tipo: "downgrade";
  troca_plano: string;
  troca_efetiva_em: string;
} {
  return (
    sub.troca_tipo === "downgrade" &&
    (sub.troca_plano === "essencial" || sub.troca_plano === "impulso") &&
    typeof sub.troca_efetiva_em === "string" &&
    dueDate >= sub.troca_efetiva_em.slice(0, 10)
  );
}
