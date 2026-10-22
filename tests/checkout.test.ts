import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const m = vi.hoisted(() => ({
  plan: {} as Record<string, unknown>,
  subscription: null as Record<string, unknown> | null,
  customerRecord: null as Record<string, unknown> | null,
  planError: false,
  member: true,
  reservaError: false,
  customerLookupError: false,
  customerSaveError: false,
  zeroUpdatedRows: false,
  updateError: false,
  updates: [] as Record<string, unknown>[],
  inserts: [] as { table: string; value: Record<string, unknown> }[],
  reservedIds: new Set<string>(),
  chamadas: [] as unknown[][],
  criar: vi.fn(),
  createUser: vi.fn(),
  customer: vi.fn(),
  payments: vi.fn(),
  pix: vi.fn(),
}));
vi.mock("@/lib/asaas/client", () => ({
  createSubscription: m.criar,
  findOrCreateCustomer: m.customer,
  getSubscriptionPayments: m.payments,
  getPixQrCode: m.pix,
}));
vi.mock("@/lib/supabase", () => ({
  createSupabaseAdmin: () => ({
    auth: {
      getUser: async () => ({ data: { user: { id: "usuario" } }, error: null }),
      admin: { createUser: m.createUser },
    },
    from: (table: string) => {
      let operation: "read" | "insert" | "update" | "upsert" = "read";
      let value: Record<string, unknown> = {};
      const filters: [string, unknown][] = [];
      let result: { data: unknown; error: { code: string } | null } | undefined;
      const execute = () => {
        if (result) return result;
        const finish = (data: unknown, code?: string) => {
          result = { data, error: code ? { code } : null };
          return result;
        };
        if (operation === "insert") {
          m.inserts.push({ table, value: structuredClone(value) });
          if (table === "asaas_customers") {
            if (m.customerSaveError) return finish(null, "indisponivel");
            m.customerRecord = structuredClone(value);
          }
          if (table === "subscriptions") {
            const id = String(value.id);
            if (m.reservaError || m.reservedIds.has(id))
              return finish(null, "23505");
            m.reservedIds.add(id);
            m.subscription = {
              asaas_subscription_id: null,
              ...structuredClone(value),
            };
          }
          return finish([{ id: value.id ?? "linha" }]);
        }
        if (operation === "upsert") {
          if (table === "asaas_customers") return finish(null, "42P10");
          return finish([{ id: "linha" }]);
        }
        if (operation === "update") {
          if (m.updateError) return finish(null, "indisponivel");
          const current = m.subscription;
          if (
            m.zeroUpdatedRows ||
            !current ||
            !filters.every(([key, expected]) => current[key] === expected)
          )
            return finish([]);
          m.subscription = { ...current, ...structuredClone(value) };
          return finish([{ id: current.id }]);
        }
        if (table === "plans")
          return finish(
            structuredClone(m.plan),
            m.planError ? "indisponivel" : undefined,
          );
        if (table === "user_organizations")
          return finish(m.member ? { role: "admin" } : null);
        if (table === "asaas_customers")
          return finish(
            structuredClone(m.customerRecord),
            m.customerLookupError ? "indisponivel" : undefined,
          );
        if (table === "subscriptions")
          return finish(structuredClone(m.subscription));
        return finish(null);
      };
      const q = {
        select: (...args: unknown[]) => {
          m.chamadas.push([table, "select", ...args]);
          return q;
        },
        eq: (key: string, expected: unknown) => {
          m.chamadas.push([table, "eq", key, expected]);
          filters.push([key, expected]);
          return q;
        },
        is: (key: string, expected: unknown) => {
          m.chamadas.push([table, "is", key, expected]);
          filters.push([key, expected]);
          return q;
        },
        limit: () => q,
        maybeSingle: async () => execute(),
        insert: (input: Record<string, unknown>) => {
          operation = "insert";
          value = input;
          return q;
        },
        update: (input: Record<string, unknown>) => {
          operation = "update";
          value = input;
          m.updates.push(structuredClone(input));
          return q;
        },
        upsert: (input: Record<string, unknown>) => {
          operation = "upsert";
          value = input;
          return q;
        },
        then: (resolve: (input: unknown) => unknown) =>
          Promise.resolve(execute()).then(resolve),
      };
      return q;
    },
  }),
}));

import { POST as checkout } from "../src/app/api/asaas/create-payment/route";
import { POST as webhook } from "../src/app/api/asaas/webhook/route";

const ORG = "11111111-1111-4111-8111-111111111111";
const body = {
  organization_id: ORG,
  plan_slug: "impulso",
  billing_cycle: "monthly",
  attendants: 3,
  billing_type: "PIX",
  customer: {
    name: "Cliente Teste",
    email: "cliente@example.com",
    cpfCnpj: "12345678901",
  },
};
const secret = "segredo-exclusivo-de-teste-sem-valor-real";

beforeEach(() => {
  vi.clearAllMocks();
  m.chamadas = [];
  m.updates = [];
  m.inserts = [];
  m.reservedIds.clear();
  m.subscription = null;
  m.customerRecord = null;
  m.member = true;
  m.planError = false;
  m.reservaError = false;
  m.customerLookupError = false;
  m.customerSaveError = false;
  m.zeroUpdatedRows = false;
  m.updateError = false;
  m.plan = {
    id: "plano",
    name: "Impulso",
    min_attendants: 3,
    price_monthly: 15900,
    price_quarterly: 42900,
    price_yearly: 152400,
  };
  m.criar.mockResolvedValue({ id: "sub_teste" });
  m.customer.mockResolvedValue({ id: "cus_teste" });
  m.payments.mockResolvedValue({ data: [] });
  vi.stubEnv("ASAAS_WEBHOOK_SECRET", secret);
  vi.stubGlobal(
    "fetch",
    vi.fn(() => {
      throw new Error("Rede proibida neste teste");
    }),
  );
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
const request = (
  data: unknown,
  headers: Record<string, string> = { authorization: "Bearer sessao-de-teste" },
) =>
  new NextRequest("http://localhost/api", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "content-type": "application/json", ...headers },
  });

describe("checkout sem nenhuma chamada financeira real", () => {
  it.each([
    ["monthly", 477],
    ["quarterly", 1287],
    ["yearly", 4572],
  ])(
    "Impulso %s cobra ciclo completo para 3 atendentes",
    async (cycle, value) => {
      const res = await checkout(
        request({ ...body, billing_cycle: cycle, value: 0.01 }),
      );
      expect(res.status).toBe(200);
      expect(m.criar).toHaveBeenCalledWith(
        expect.objectContaining({ value, cycle: String(cycle).toUpperCase() }),
      );
      expect(m.updates[0]).toMatchObject({
        organization_id: ORG,
        plan_id: "plano",
        plan_type: "impulso",
        seats: 3,
        status: "trialing",
        asaas_payment_id: null,
      });
      expect(m.chamadas).toContainEqual([
        "user_organizations",
        "is",
        "revoked_at",
        null,
      ]);
    },
  );
  it("catálogo divergente falha antes de criar conta ou assinatura", async () => {
    m.plan.price_monthly = 24700;
    expect((await checkout(request(body))).status).toBe(503);
    expect(m.criar).not.toHaveBeenCalled();
    expect(m.createUser).not.toHaveBeenCalled();
  });
  it.each([1, 1.5, "3", 1001])(
    "rejeita atendentes inválidos %s antes de efeito",
    async (attendants) => {
      expect((await checkout(request({ ...body, attendants }))).status).toBe(
        400,
      );
      expect(m.criar).not.toHaveBeenCalled();
    },
  );
  it("não associa organização sem sessão", async () => {
    expect((await checkout(request(body, {}))).status).toBe(401);
    expect(m.criar).not.toHaveBeenCalled();
  });
  it("não aceita vínculo revogado ou ausente", async () => {
    m.member = false;
    expect((await checkout(request(body))).status).toBe(403);
    expect(m.criar).not.toHaveBeenCalled();
  });
  it("reserva duplicada não cria segunda assinatura", async () => {
    m.reservaError = true;
    expect((await checkout(request(body))).status).toBe(409);
    expect(m.criar).not.toHaveBeenCalled();
  });
  it("assinatura anterior não é substituída por uma segunda cobrança", async () => {
    m.subscription = { id: "antiga" };
    expect((await checkout(request(body))).status).toBe(409);
    expect(m.criar).not.toHaveBeenCalled();
  });
  it("reserva usa PK determinística e situação válida no schema atual", async () => {
    expect((await checkout(request(body))).status).toBe(200);
    const reserva = m.inserts.find(
      (item) => item.table === "subscriptions",
    )!.value;
    expect(reserva).toMatchObject({
      organization_id: ORG,
      status: "suspended",
    });
    expect(reserva.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    expect(m.chamadas).toContainEqual([
      "subscriptions",
      "eq",
      "id",
      reserva.id,
    ]);
    expect(m.chamadas).toContainEqual([
      "subscriptions",
      "eq",
      "status",
      "suspended",
    ]);
    expect(m.chamadas).toContainEqual([
      "subscriptions",
      "is",
      "asaas_subscription_id",
      null,
    ]);
  });
  it("duas abas da mesma organização disputam a mesma PK antes do Asaas", async () => {
    const responses = await Promise.all([
      checkout(request(body)),
      checkout(request(body)),
    ]);
    expect(responses.map((res) => res.status).sort()).toEqual([200, 409]);
    expect(m.criar).toHaveBeenCalledTimes(1);
    const reservas = m.inserts.filter((item) => item.table === "subscriptions");
    expect(reservas).toHaveLength(2);
    expect(reservas[0]!.value.id).toBe(reservas[1]!.value.id);
  });
  it("update sem linhas não anuncia assinatura vinculada", async () => {
    m.zeroUpdatedRows = true;
    const res = await checkout(request(body));
    expect(res.status).toBe(503);
    expect(m.criar).toHaveBeenCalledTimes(1);
    expect(m.subscription?.status).toBe("suspended");
    expect(await res.json()).not.toHaveProperty("success", true);
  });
  it("falha ao consultar cliente impede criar cliente e assinatura externos", async () => {
    m.customerLookupError = true;
    expect((await checkout(request(body))).status).toBe(503);
    expect(m.customer).not.toHaveBeenCalled();
    expect(m.criar).not.toHaveBeenCalled();
  });
  it("falha ao persistir cliente impede criar assinatura externa", async () => {
    m.customerSaveError = true;
    expect((await checkout(request(body))).status).toBe(503);
    expect(m.customer).toHaveBeenCalledTimes(1);
    expect(m.criar).not.toHaveBeenCalled();
  });
  it("reutiliza cliente existente sem criar outro no Asaas", async () => {
    m.customerRecord = { asaas_customer_id: "cus_existente" };
    expect((await checkout(request(body))).status).toBe(200);
    expect(m.customer).not.toHaveBeenCalled();
    expect(m.criar).toHaveBeenCalledWith(
      expect.objectContaining({ customer: "cus_existente" }),
    );
  });
});

describe("webhook autenticado preserva o plano e acompanha a cobrança", () => {
  beforeEach(() => {
    m.subscription = {
      id: "contrato",
      organization_id: ORG,
      asaas_subscription_id: "sub_teste",
      billing_cycle: "quarterly",
      status: "trialing",
      current_period_start: "2026-10-16T00:00:00.000Z",
      current_period_end: "2026-10-23T00:00:00.000Z",
      updated_at: "2026-10-16T00:00:00Z",
    };
  });
  const event = (name: string) => ({
    event: name,
    payment: {
      subscription: "sub_teste",
      id: "pay_teste",
      dueDate: "2026-10-23",
    },
    subscription: { id: "sub_teste", status: "ACTIVE" },
  });
  const send = (name: string) =>
    webhook(request(event(name), { "asaas-access-token": secret }));
  it("recusa token inválido antes de escrever", async () => {
    expect((await webhook(request(event("PAYMENT_RECEIVED"), {}))).status).toBe(
      401,
    );
    expect(m.updates).toEqual([]);
  });
  it.each([
    "SUBSCRIPTION_CREATED",
    "SUBSCRIPTION_UPDATED",
    "PAYMENT_CREATED",
    "PAYMENT_AUTHORIZED",
    "SUBSCRIPTION_SPLIT_DISABLED",
  ])("%s não significa pagamento", async (name) => {
    expect((await send(name)).status).toBe(200);
    expect(m.updates).toEqual([]);
  });
  it.each(["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED"])(
    "%s renova três meses sem mudar plano ou vagas",
    async (name) => {
      expect((await send(name)).status).toBe(200);
      expect(m.updates[0]).toMatchObject({
        status: "active",
        current_period_end: "2027-01-23T00:00:00.000Z",
      });
      expect(m.updates[0]).not.toHaveProperty("plan_id");
      expect(m.updates[0]).not.toHaveProperty("seats");
      expect(m.chamadas).toContainEqual([
        "subscriptions",
        "eq",
        "organization_id",
        ORG,
      ]);
    },
  );
  it.each(["PAYMENT_REFUNDED", "PAYMENT_CHARGEBACK_REQUESTED"])(
    "%s suspende sem apagar a organização",
    async (name) => {
      expect((await send(name)).status).toBe(200);
      expect(m.subscription).toMatchObject({
        status: "suspended",
        organization_id: ORG,
        current_period_end: "2027-01-23T00:00:00.000Z",
      });
    },
  );
  it.each([
    ["PAYMENT_REFUNDED", "PAYMENT_CONFIRMED"],
    ["PAYMENT_CHARGEBACK_REQUESTED", "PAYMENT_RECEIVED"],
  ])(
    "%s seguido de %s atrasado mantém suspensão",
    async (suspensao, confirmacao) => {
      expect((await send("PAYMENT_CONFIRMED")).status).toBe(200);
      expect((await send(suspensao)).status).toBe(200);
      const writes = m.updates.length;
      expect((await send(confirmacao)).status).toBe(200);
      expect(m.updates).toHaveLength(writes);
      expect(m.subscription).toMatchObject({
        status: "suspended",
        current_period_end: "2027-01-23T00:00:00.000Z",
      });
    },
  );
  it("estorno antes da primeira confirmação reserva o período e impede replay", async () => {
    expect((await send("PAYMENT_REFUNDED")).status).toBe(200);
    expect((await send("PAYMENT_CONFIRMED")).status).toBe(200);
    expect(m.updates).toHaveLength(1);
    expect(m.subscription).toMatchObject({
      status: "suspended",
      current_period_end: "2027-01-23T00:00:00.000Z",
    });
  });
  it.each(["SUBSCRIPTION_INACTIVATED", "SUBSCRIPTION_DELETED"])(
    "%s cancela recorrência preservando período já contratado",
    async (name) => {
      expect((await send(name)).status).toBe(200);
      expect(m.updates[0]).toMatchObject({ status: "canceled" });
      expect(m.updates[0]).not.toHaveProperty("current_period_end");
    },
  );
  it.each(["suspended", "past_due"])(
    "cancelamento não converte %s em canceled com acesso futuro",
    async (status) => {
      m.subscription!.status = status;
      m.subscription!.current_period_end = "2027-01-23T00:00:00.000Z";
      expect((await send("SUBSCRIPTION_DELETED")).status).toBe(200);
      expect(m.subscription!.status).toBe(status);
      expect(m.subscription!.canceled_at).toEqual(expect.any(String));
    },
  );
  it("confirmação posterior preserva cancelamento e somente credita período pago", async () => {
    expect((await send("SUBSCRIPTION_DELETED")).status).toBe(200);
    expect((await send("PAYMENT_CONFIRMED")).status).toBe(200);
    expect(m.subscription).toMatchObject({
      status: "canceled",
      current_period_end: "2027-01-23T00:00:00.000Z",
    });
  });
  it("assinatura desconhecida nunca é vinculada por externalReference", async () => {
    m.subscription = null;
    expect((await send("PAYMENT_RECEIVED")).status).toBe(200);
    expect(m.updates).toEqual([]);
  });
  it("evento de período antigo não encurta período pago posterior", async () => {
    m.subscription!.current_period_end = "2028-01-01T00:00:00Z";
    await send("PAYMENT_RECEIVED");
    expect(m.updates).toEqual([]);
  });
  it("webhook com update sem linhas pede reentrega", async () => {
    m.zeroUpdatedRows = true;
    expect((await send("PAYMENT_RECEIVED")).status).toBe(503);
    expect(m.subscription!.status).toBe("trialing");
  });
});
