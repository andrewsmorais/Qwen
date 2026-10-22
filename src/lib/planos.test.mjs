import test from "node:test";
import assert from "node:assert/strict";
import { PLANOS, selecionarPlano } from "./planos.ts";
import { fimDoCiclo } from "./ciclo-assinatura.ts";

for (const [slug, seats, prices] of [
  ["essencial", 1, [8990, 24273, 86304]],
  ["impulso", 3, [14990, 40473, 143904]],
  ["escala", 5, [21990, 59373, 211104]],
]) {
  for (const [index, cycle] of ["monthly", "quarterly", "yearly"].entries()) {
    test(`${slug} ${cycle}: valor pelo ciclo completo e mínimo contratado`, () => {
      assert.equal(
        selecionarPlano(slug, cycle, undefined).value,
        (prices[index] * seats) / 100,
      );
      assert.equal(
        selecionarPlano(slug, cycle, seats + 1).value,
        (prices[index] * (seats + 1)) / 100,
      );
    });
  }
}
for (const seats of [0, 1, -1, 1.5, Infinity, NaN, "3", 1001])
  test(`recusa atendentes inválidos ${seats}`, () => {
    assert.throws(() => selecionarPlano("impulso", "monthly", seats));
  });
test("descontos: trimestral 10% e anual 20% sobre o mensal", () => {
  for (const [slug, plano] of Object.entries(PLANOS)) {
    assert.equal(plano.price_quarterly, Math.round(plano.price_monthly * 3 * 0.9), slug);
    assert.equal(plano.price_yearly, Math.round(plano.price_monthly * 12 * 0.8), slug);
  }
});
test("só o Escala é sob consulta", () => {
  assert.equal(PLANOS.essencial.sob_consulta, false);
  assert.equal(PLANOS.impulso.sob_consulta, false);
  assert.equal(PLANOS.escala.sob_consulta, true);
});
test("não aceita plano ou ciclo inventados", () => {
  assert.throws(() => selecionarPlano("__proto__", "monthly", 3));
  assert.throws(() => selecionarPlano("impulso", "weekly", 3));
});
test("pagamento renova pelo ciclo sem estourar o último dia do mês", () => {
  assert.equal(fimDoCiclo("2027-01-31", "monthly"), "2027-02-28T00:00:00.000Z");
  assert.equal(fimDoCiclo("2028-02-29", "yearly"), "2029-02-28T00:00:00.000Z");
  assert.equal(
    fimDoCiclo("2026-10-16", "quarterly"),
    "2027-01-16T00:00:00.000Z",
  );
  assert.equal(fimDoCiclo("2026-02-30", "monthly"), null);
  assert.equal(fimDoCiclo("2026-10-16", "inventado"), null);
});
