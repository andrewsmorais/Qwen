/**
 * Valores em centavos por atendente e por CICLO completo, iguais à oferta e à
 * tabela `plans` do Supabase (o checkout recusa a compra se divergirem).
 * Trimestral = 10% de desconto sobre 3 meses; anual = 20% sobre 12 meses.
 *
 * O Escala é sob consulta: o preço aparece como "a partir de", mas ele não se
 * contrata pelo checkout — a implantação da API oficial é combinada antes.
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
    min_attendants: 3,
    price_monthly: 14990,
    price_quarterly: 40473,
    price_yearly: 143904,
    sob_consulta: false,
  },
  escala: {
    name: "Escala",
    min_attendants: 5,
    price_monthly: 21990,
    price_quarterly: 59373,
    price_yearly: 211104,
    sob_consulta: true,
  },
} as const;
export type Plano = keyof typeof PLANOS;
export type Ciclo = "monthly" | "quarterly" | "yearly";

export function selecionarPlano(
  slug: unknown,
  ciclo: unknown,
  attendants: unknown,
) {
  if (typeof slug !== "string" || !Object.hasOwn(PLANOS, slug))
    throw new Error("Selecione um plano válido.");
  if (ciclo !== "monthly" && ciclo !== "quarterly" && ciclo !== "yearly")
    throw new Error("Selecione um ciclo válido.");
  const plano = PLANOS[slug as Plano];
  const seats =
    attendants === undefined || attendants === null
      ? plano.min_attendants
      : attendants;
  if (
    typeof seats !== "number" ||
    !Number.isSafeInteger(seats) ||
    seats < plano.min_attendants ||
    seats > 1000
  ) {
    throw new Error(
      `Informe uma quantidade inteira entre ${plano.min_attendants} e 1000 atendentes.`,
    );
  }
  return {
    slug: slug as Plano,
    ciclo,
    seats,
    plano,
    cycleCents: plano[`price_${ciclo}`],
    asaasCycle: ciclo.toUpperCase() as "MONTHLY" | "QUARTERLY" | "YEARLY",
    value: (plano[`price_${ciclo}`] * seats) / 100,
  };
}
