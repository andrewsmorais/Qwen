import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const m = vi.hoisted(() => ({
  sub: null as Record<string, unknown> | null,
  updates: [] as Array<{
    valor: Record<string, unknown>;
    filtros: [string, unknown][];
  }>,
  atualizarValor: vi.fn(),
  apagarCobranca: vi.fn(async () => ({ deleted: true })),
}));

vi.mock("@/lib/asaas/client", () => ({
  updateSubscriptionValue: m.atualizarValor,
  deletePayment: m.apagarCobranca,
}));
vi.mock("@/lib/supabase", () => ({
  createSupabaseAdmin: () => ({
    rpc: async () => ({ data: null, error: null }),
    from: (tabela: string) => {
      const filtros: [string, unknown][] = [];
      let valor: Record<string, unknown> | null = null;
      const executar = () => {
        if (valor) {
          const atual = m.sub;
          const casa = !!atual && filtros.every(([k, v]) => atual[k] === v);
          m.updates.push({ valor, filtros: [...filtros] });
          if (casa) m.sub = { ...atual, ...valor };
          return { data: casa ? [{ id: atual!.id }] : [], error: null };
        }
        if (tabela === "plans") {
          const slug = filtros.find(([k]) => k === "slug")?.[1];
          const planos: Record<string, unknown> = {
            essencial: {
              id: "p-ess",
              price_monthly: 8990,
              price_quarterly: 24273,
              price_yearly: 86304,
            },
            impulso: {
              id: "p-imp",
              price_monthly: 14990,
              price_quarterly: 40473,
              price_yearly: 143904,
            },
            escala: {
              id: "p-esc",
              price_monthly: 34990,
              price_quarterly: 94473,
              price_yearly: 335904,
            },
          };
          return { data: planos[String(slug)] ?? null, error: null };
        }
        const atual = m.sub;
        const casa = !!atual && filtros.every(([k, v]) => atual[k] === v);
        return { data: casa ? structuredClone(atual) : null, error: null };
      };
      const q = {
        select: () => q,
        eq: (k: string, v: unknown) => {
          filtros.push([k, v]);
          return q;
        },
        update: (v: Record<string, unknown>) => {
          valor = v;
          return q;
        },
        maybeSingle: async () => executar(),
        then: (r: (x: unknown) => unknown) =>
          Promise.resolve(executar()).then(r),
      };
      return q;
    },
  }),
}));

import { POST as webhook } from "../src/app/api/asaas/webhook/route";

const SEGREDO = "segredo-do-webhook";
const ORG = "11111111-1111-4111-8111-111111111111";
const SUB = "22222222-2222-4222-8222-222222222222";

function evento(nome: string, payment: Record<string, unknown>) {
  return webhook(
    new NextRequest("http://x/api/asaas/webhook", {
      method: "POST",
      headers: {
        "asaas-access-token": SEGREDO,
        "content-type": "application/json",
      },
      body: JSON.stringify({ event: nome, payment }),
    }),
  );
}

const diferenca = {
  id: "pay_diferenca",
  externalReference: `troca:${SUB}`,
  subscription: null,
};

beforeEach(() => {
  vi.stubEnv("ASAAS_WEBHOOK_SECRET", SEGREDO);
  m.updates = [];
  m.apagarCobranca.mockClear();
  m.atualizarValor
    .mockReset()
    .mockResolvedValue({ id: "sub_rec", value: 149.9 });
  m.sub = {
    id: SUB,
    organization_id: ORG,
    asaas_subscription_id: "sub_rec",
    billing_cycle: "monthly",
    status: "active",
    plan_id: "p-ess",
    plan_type: "essencial",
    troca_tipo: "upgrade",
    troca_plano: "impulso",
    troca_pagamento_id: "pay_diferenca",
    troca_pedida_em: "2026-11-10T00:00:00.000Z",
    current_period_start: "2026-11-01T00:00:00.000Z",
    current_period_end: "2026-12-01T00:00:00.000Z",
    canceled_at: null,
    updated_at: "2026-11-10T00:00:00.000Z",
  };
});

describe("troca de plano no webhook — auditoria de 19/11", () => {
  it("diferença vencida é apagada no Asaas, para não poder ser paga depois", async () => {
    const res = await evento("PAYMENT_OVERDUE", diferenca);
    expect(res.status).toBe(200);
    expect(m.apagarCobranca).toHaveBeenCalledWith("pay_diferenca");
    expect(m.sub).toMatchObject({ plan_type: "essencial", troca_tipo: null });
  });

  it("pago com a assinatura cancelada: 200, sem efeito, nunca 503 em laço", async () => {
    m.sub = { ...m.sub!, status: "canceled" };
    const res = await evento("PAYMENT_CONFIRMED", diferenca);
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ applied: false });
    expect(m.atualizarValor).not.toHaveBeenCalled();
    expect(m.sub).toMatchObject({ plan_type: "essencial", troca_tipo: null });
  });

  it("pago depois de o período renovar: não compra o período novo pelo preço velho", async () => {
    m.sub = { ...m.sub!, current_period_start: "2026-12-01T00:00:00.000Z" };
    const res = await evento("PAYMENT_CONFIRMED", diferenca);
    expect(res.status).toBe(200);
    expect(m.atualizarValor).not.toHaveBeenCalled();
    expect(m.sub).toMatchObject({ plan_type: "essencial" });
  });

  it("estorno da diferença já aplicada suspende a conta", async () => {
    await evento("PAYMENT_CONFIRMED", diferenca);
    expect(m.sub).toMatchObject({ plan_type: "impulso", troca_aplicada_pagamento_id: "pay_diferenca" });
    const res = await evento("PAYMENT_CHARGEBACK_REQUESTED", diferenca);
    expect(res.status).toBe(200);
    expect(m.sub).toMatchObject({ status: "suspended" });
  });

  it("subida para o Escala também é aplicada", async () => {
    m.sub = { ...m.sub!, troca_plano: "escala" };
    const res = await evento("PAYMENT_CONFIRMED", diferenca);
    expect(res.status).toBe(200);
    expect(m.atualizarValor).toHaveBeenCalledWith("sub_rec", 349.9);
    expect(m.sub).toMatchObject({ plan_type: "escala", plan_id: "p-esc", limites_personalizados: null });
  });
});

describe("troca de plano no webhook", () => {
  it("diferença paga: a recorrência passa a cobrar o Impulso e a assinatura troca", async () => {
    const res = await evento("PAYMENT_CONFIRMED", diferenca);
    expect(res.status).toBe(200);
    expect(m.atualizarValor).toHaveBeenCalledWith("sub_rec", 149.9);
    expect(m.sub).toMatchObject({
      plan_id: "p-imp",
      plan_type: "impulso",
      contracted_amount_cents: 14990,
      troca_tipo: null,
      troca_pagamento_id: null,
    });
  });

  it("reentrega depois de aplicada não faz nada", async () => {
    await evento("PAYMENT_CONFIRMED", diferenca);
    m.atualizarValor.mockClear();
    const res = await evento("PAYMENT_RECEIVED", diferenca);
    expect(res.status).toBe(200);
    expect(m.atualizarValor).not.toHaveBeenCalled();
  });

  it("a identidade é o id gravado, não o externalReference", async () => {
    const res = await evento("PAYMENT_CONFIRMED", {
      ...diferenca,
      id: "pay_outra",
    });
    expect(await res.json()).toMatchObject({ matched: false });
    expect(m.sub).toMatchObject({ plan_type: "essencial" });
  });

  it("Asaas fora do ar: 503 e a assinatura não troca (o Asaas reentrega)", async () => {
    m.atualizarValor.mockRejectedValue(new Error("fora"));
    const res = await evento("PAYMENT_CONFIRMED", diferenca);
    expect(res.status).toBe(503);
    expect(m.sub).toMatchObject({
      plan_type: "essencial",
      troca_tipo: "upgrade",
    });
  });

  it("diferença vencida: o pedido some e o cliente segue no plano de antes", async () => {
    const res = await evento("PAYMENT_OVERDUE", diferenca);
    expect(res.status).toBe(200);
    expect(m.sub).toMatchObject({
      plan_type: "essencial",
      troca_tipo: null,
      troca_plano: null,
    });
  });

  it("renovação paga ADIANTADA não antecipa a descida", async () => {
    vi.useFakeTimers({ now: new Date("2026-11-25T12:00:00.000Z") });
    try {
      m.sub = {
        ...m.sub!,
        plan_id: "p-imp",
        plan_type: "impulso",
        troca_tipo: "downgrade",
        troca_plano: "essencial",
        troca_pagamento_id: null,
        troca_efetiva_em: "2026-12-01T00:00:00.000Z",
      };
      const res = await evento("PAYMENT_CONFIRMED", {
        id: "pay_renovacao",
        subscription: "sub_rec",
        dueDate: "2026-12-01",
      });
      expect(res.status).toBe(200);
      expect(m.sub).toMatchObject({ plan_type: "impulso", troca_tipo: "downgrade" });
    } finally {
      vi.useRealTimers();
    }
  });

  it("renovação do período do downgrade consolida o plano menor", async () => {
    vi.useFakeTimers({ now: new Date("2026-12-01T03:00:00.000Z") });
    m.sub = {
      ...m.sub!,
      plan_id: "p-imp",
      plan_type: "impulso",
      troca_tipo: "downgrade",
      troca_plano: "essencial",
      troca_pagamento_id: null,
      troca_efetiva_em: "2026-12-01T00:00:00.000Z",
    };
    const res = await evento("PAYMENT_CONFIRMED", {
      id: "pay_renovacao",
      subscription: "sub_rec",
      dueDate: "2026-12-01",
    });
    expect(res.status).toBe(200);
    expect(m.sub).toMatchObject({
      plan_id: "p-ess",
      plan_type: "essencial",
      contracted_amount_cents: 8990,
      troca_tipo: null,
      current_period_end: "2027-01-01T00:00:00.000Z",
    });
    vi.useRealTimers();
  });

  it("controle: renovação sem troca não mexe no plano", async () => {
    m.sub = {
      ...m.sub!,
      troca_tipo: null,
      troca_plano: null,
      troca_pagamento_id: null,
    };
    await evento("PAYMENT_CONFIRMED", {
      id: "pay_renovacao",
      subscription: "sub_rec",
      dueDate: "2026-12-01",
    });
    expect(m.sub).toMatchObject({ plan_type: "essencial", plan_id: "p-ess" });
  });
});
