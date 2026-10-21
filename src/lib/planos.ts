/** Valores em centavos por atendente e por CICLO completo, iguais à oferta. */
export const PLANOS = {
  essencial: {
    name: "Essencial",
    min_attendants: 2,
    price_monthly: 10700,
    price_quarterly: 29100,
    price_yearly: 103200,
  },
  impulso: {
    name: "Impulso",
    min_attendants: 3,
    price_monthly: 15900,
    price_quarterly: 42900,
    price_yearly: 152400,
  },
  escala: {
    name: "Escala",
    min_attendants: 3,
    price_monthly: 23400,
    price_quarterly: 63300,
    price_yearly: 224400,
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
