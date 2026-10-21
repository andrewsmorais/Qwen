import test from "node:test";
import assert from "node:assert/strict";
import { selecionarPlano } from "./planos.ts";
import { fimDoCiclo } from "./ciclo-assinatura.ts";

for (const [slug, seats, prices] of [
  ["essencial", 2, [10700, 29100, 103200]],
  ["impulso", 3, [15900, 42900, 152400]],
  ["escala", 3, [23400, 63300, 224400]],
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
