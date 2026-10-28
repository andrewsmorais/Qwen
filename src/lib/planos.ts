/**
 * Valores em centavos por PLANO e por CICLO completo, iguais à oferta e à
 * tabela `plans` do Supabase (o checkout recusa a compra se divergirem).
 * Trimestral = 10% de desconto sobre 3 meses; anual = 20% sobre 12 meses.
 *
 * Desde 27/10/2026 o preço é por plano, não por atendente: cada plano já traz
 * os usuários da equipe (Essencial 2, Impulso 4, Escala a partir de 6) e o
 * CRM conta a cota pelo próprio catálogo (`lib/billing/catalogo.ts` do CRM).
 * `seats` segue existindo no pedido e na assinatura, sempre 1.
 *
 * O Escala é sob consulta: o preço aparece como "a partir de", mas ele não se
 * contrata pelo checkout — o dono da plataforma ativa no CRM depois da proposta.
 */
export const PLANOS = {
  essencial: {
    name: "Essencial",
    min_attendants: 1,
    price_monthly: 8990,
    price_quarterly: 24273,
    price_yearly: 86304,
    sob_consulta: false,
  },
  impulso: {
    name: "Impulso",
    min_attendants: 1,
    price_monthly: 14990,
    price_quarterly: 40473,
    price_yearly: 143904,
    sob_consulta: false,
  },
  escala: {
    name: "Escala",
    min_attendants: 1,
    price_monthly: 34990,
    price_quarterly: 94473,
    price_yearly: 335904,
    sob_consulta: true,
  },
} as const;
export type Plano = keyof typeof PLANOS;
export type Ciclo = "monthly" | "quarterly" | "yearly";

export function selecionarPlano(
  slug: unknown,
  ciclo: unknown,
  /** Legado (preço por atendente). Só aceita ausente ou 1. */
  attendants?: unknown,
) {
  if (typeof slug !== "string" || !Object.hasOwn(PLANOS, slug))
    throw new Error("Selecione um plano válido.");
  if (ciclo !== "monthly" && ciclo !== "quarterly" && ciclo !== "yearly")
    throw new Error("Selecione um ciclo válido.");
  if (attendants !== undefined && attendants !== null && attendants !== 1)
    throw new Error("O preço agora é por plano: não há quantidade de atendentes.");
  const plano = PLANOS[slug as Plano];
  const seats = 1;
  return {
    slug: slug as Plano,
    ciclo,
    seats,
    plano,
    cycleCents: plano[`price_${ciclo}`],
    asaasCycle: ciclo.toUpperCase() as "MONTHLY" | "QUARTERLY" | "YEARLY",
    value: plano[`price_${ciclo}`] / 100,
  };
}
