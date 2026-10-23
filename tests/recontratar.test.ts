import { describe, expect, it } from "vitest";
import { podeRecontratar } from "../src/lib/recontratar";

const agora = new Date("2026-10-22T12:00:00Z");
const base = {
  status: null,
  current_period_end: null,
  asaas_subscription_id: null,
  updated_at: null,
};

describe("quem pode contratar de novo", () => {
  it("cancelada com o período terminado: pode", () => {
    expect(
      podeRecontratar(
        {
          ...base,
          status: "canceled",
          current_period_end: "2026-10-01T00:00:00Z",
        },
        agora,
      ),
    ).toEqual({ pode: true });
  });
  it("cancelada ainda dentro do período pago: não (ainda tem acesso)", () => {
    expect(
      podeRecontratar(
        {
          ...base,
          status: "canceled",
          current_period_end: "2026-11-01T00:00:00Z",
        },
        agora,
      ).pode,
    ).toBe(false);
  });
  it("em atraso: não — o Asaas segue cobrando, pagar a fatura", () => {
    expect(podeRecontratar({ ...base, status: "past_due" }, agora)).toEqual({
      pode: false,
      motivo: "em_atraso",
    });
  });
  it("tentativa que falhou há mais de 10 min (conta presa): pode", () => {
    expect(
      podeRecontratar(
        { ...base, status: "suspended", updated_at: "2026-10-22T11:00:00Z" },
        agora,
      ),
    ).toEqual({ pode: true });
  });
  it("tentativa de agora há pouco: não (outra aba pode estar terminando)", () => {
    expect(
      podeRecontratar(
        { ...base, status: "suspended", updated_at: "2026-10-22T11:58:00Z" },
        agora,
      ),
    ).toEqual({ pode: false, motivo: "tentativa_em_andamento" });
  });
  it("suspensa COM assinatura no Asaas, ativa e em teste: não", () => {
    expect(
      podeRecontratar(
        {
          ...base,
          status: "suspended",
          asaas_subscription_id: "sub_1",
          updated_at: "2026-01-01T00:00:00Z",
        },
        agora,
      ).pode,
    ).toBe(false);
    expect(podeRecontratar({ ...base, status: "active" }, agora).pode).toBe(
      false,
    );
    expect(podeRecontratar({ ...base, status: "trialing" }, agora).pode).toBe(
      false,
    );
  });
});
