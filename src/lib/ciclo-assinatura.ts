export function fimDoCiclo(dueDate: string, ciclo: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) return null;
  const inicio = new Date(`${dueDate}T00:00:00.000Z`);
  if (
    !Number.isFinite(inicio.getTime()) ||
    inicio.toISOString().slice(0, 10) !== dueDate
  )
    return null;
  const meses =
    ciclo === "monthly"
      ? 1
      : ciclo === "quarterly"
        ? 3
        : ciclo === "yearly"
          ? 12
          : 0;
  if (!meses) return null;
  const fim = new Date(
    Date.UTC(inicio.getUTCFullYear(), inicio.getUTCMonth() + meses, 1),
  );
  const ultimo = new Date(
    Date.UTC(fim.getUTCFullYear(), fim.getUTCMonth() + 1, 0),
  ).getUTCDate();
  fim.setUTCDate(Math.min(inicio.getUTCDate(), ultimo));
  return fim.toISOString();
}
