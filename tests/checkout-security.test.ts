import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { PLANOS } from "../src/lib/planos";

const m = vi.hoisted(() => ({
  plans: {} as Record<string, Record<string, unknown>>,
  role: "admin" as string | null,
  revoked: false,
  user: { id: "usuario-autenticado" } as { id: string } | null,
  subscription: null as Record<string, unknown> | null,
  lookupError: false,
  updateError: false,
  zeroUpdatedRows: false,
  customerInsertError: null as string | null,
  asaasCustomers: [] as Record<string, unknown>[],
  queries: [] as unknown[][],
  inserts: [] as { table: string; data: Record<string, unknown> }[],
  updates: [] as Record<string, unknown>[],
  createUser: vi.fn(),
  customer: vi.fn(),
  createSubscription: vi.fn(),
  payments: vi.fn(),
  pix: vi.fn(),
}));

vi.mock("@/lib/asaas/client", () => ({
  findOrCreateCustomer: m.customer,
  createSubscription: m.createSubscription,
  getSubscriptionPayments: m.payments,
  getPixQrCode: m.pix,
}));
vi.mock("@/lib/supabase", () => ({
  createSupabaseAdmin: () => ({
    auth: {
      getUser: async () => ({ data: { user: m.user }, error: null }),
      admin: { createUser: m.createUser },
    },
    from: (table: string) => {
      let operation: "read" | "insert" | "update" | "upsert" = "read";
      let input: Record<string, unknown> = {};
      const filters: [string, unknown][] = [];
      let result: { data: unknown; error: { code: string } | null } | undefined;
      const execute = () => {
        if (result) return result;
        const finish = (data: unknown, code?: string) => {
          result = { data, error: code ? { code } : null };
          return result;
        };
        if (operation === "insert") {
          m.inserts.push({ table, data: structuredClone(input) });
          if (table === "asaas_customers") {
            if (m.customerInsertError)
              return finish(null, m.customerInsertError);
            if (
              m.asaasCustomers.some(
                (row) => row.asaas_customer_id === input.asaas_customer_id,
              )
            )
              return finish(null, "23505");
            m.asaasCustomers.push(structuredClone(input));
          }
          if (table === "subscriptions")
            m.subscription = {
              asaas_subscription_id: null,
              ...structuredClone(input),
            };
          return finish([{ id: input.id ?? "linha" }]);
        }
        if (operation === "upsert")
          // O schema real não tem UNIQUE(organization_id) nesta tabela.
          return table === "asaas_customers"
            ? finish(null, "42P10")
            : finish([{ id: "linha" }]);
        if (operation === "update") {
          if (m.updateError) return finish(null, "database_unavailable");
          if (
            m.zeroUpdatedRows ||
            !m.subscription ||
            !filters.every(([key, value]) => m.subscription![key] === value)
          )
            return finish([]);
          m.subscription = { ...m.subscription, ...structuredClone(input) };
          return finish([{ id: m.subscription.id }]);
        }
        if (table === "plans") {
          const slug = filters.find(([key]) => key === "slug")?.[1];
          return finish(structuredClone(m.plans[String(slug)] ?? null));
        }
        if (table === "user_organizations") {
          const requiresActive = filters.some(
            ([key, value]) => key === "revoked_at" && value === null,
          );
          return finish(
            m.role && !(requiresActive && m.revoked) ? { role: m.role } : null,
          );
        }
        if (table === "subscriptions") {
          if (m.lookupError) return finish(null, "database_unavailable");
          const row = m.subscription;
          return finish(
            row && filters.every(([key, value]) => row[key] === value)
              ? structuredClone(row)
              : null,
          );
        }
        if (table === "asaas_customers") {
          const row = m.asaasCustomers.find((candidate) =>
            filters.every(([key, value]) => candidate[key] === value),
          );
          return finish(row ? structuredClone(row) : null);
        }
        return finish(null);
      };
      const q = {
        select: (...args: unknown[]) => {
          m.queries.push([table, "select", ...args]);
          return q;
        },
        eq: (key: string, value: unknown) => {
          filters.push([key, value]);
          m.queries.push([table, "eq", key, value]);
          return q;
        },
        is: (key: string, value: unknown) => {
          filters.push([key, value]);
          m.queries.push([table, "is", key, value]);
          return q;
        },
        limit: () => q,
        maybeSingle: async () => execute(),
        insert: (data: Record<string, unknown>) => {
          operation = "insert";
          input = data;
          return q;
        },
        upsert: (data: Record<string, unknown>) => {
          operation = "upsert";
          input = data;
          return q;
        },
        update: (data: Record<string, unknown>) => {
          operation = "update";
          input = data;
          m.updates.push(structuredClone(data));
          return q;
        },
        then: (resolve: (value: unknown) => unknown) =>
          Promise.resolve(execute()).then(resolve),
      };
      return q;
    },
  }),
}));

import { POST as checkout } from "../src/app/api/asaas/create-payment/route";
import { POST as webhook } from "../src/app/api/asaas/webhook/route";

const ORG = "6e77bc3e-d673-4e17-8a75-d29b4e989f65";
const NEW_USER = "usuario-novo-ficticio";
const SECRET = "segredo-ficticio-exclusivo-desta-suite";
const base = {
  organization_id: ORG,
  plan_slug: "impulso",
  billing_cycle: "monthly",
  billing_type: "PIX",
  customer: {
    name: "Cliente Fictício",
    email: "cliente@example.test",
    cpfCnpj: "12345678901",
    phone: "11999999999",
  },
};
const request = (
  body: unknown,
  headers: Record<string, string> = { Authorization: "Bearer sessao-ficticia" },
) =>
  new NextRequest("http://localhost/api", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json", ...headers },
  });

beforeEach(() => {
  vi.clearAllMocks();
  m.plans = Object.fromEntries(
    Object.entries(PLANOS).map(([slug, plan]) => [
      slug,
      { id: "plano-" + slug, ...plan },
    ]),
  );
  m.role = "admin";
  m.revoked = false;
  m.user = { id: "usuario-autenticado" };
  m.subscription = null;
  m.lookupError = false;
  m.updateError = false;
  m.zeroUpdatedRows = false;
  m.customerInsertError = null;
  m.asaasCustomers = [];
  m.queries = [];
  m.inserts = [];
  m.updates = [];
  m.createUser.mockResolvedValue({
    data: { user: { id: NEW_USER } },
    error: null,
  });
  m.customer.mockResolvedValue({ id: "cus_ficticio" });
  m.createSubscription.mockResolvedValue({ id: "sub_ficticia" });
  m.payments.mockResolvedValue({ data: [] });
  vi.stubEnv("ASAAS_WEBHOOK_SECRET", SECRET);
  vi.stubEnv("NODE_ENV", "development");
  vi.stubEnv("ASAAS_BASE_URL", "https://api-sandbox.asaas.com");
  vi.stubGlobal(
    "fetch",
    vi.fn(() => {
      throw new Error("Nenhuma rede permitida nesta suite");
    }),
  );
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("autorização e cadastro nas rotas reais", () => {
  it.each(["org_123456", "invalid-id", "../malicious", "12345"])(
    "rejeita UUID de organização inválido: %s",
    async (organization_id) => {
      const res = await checkout(request({ ...base, organization_id }));
      expect(res.status).toBe(400);
      expect(await res.json()).toMatchObject({
        error: "Formato de organization_id inválido",
      });
      expect(m.createSubscription).not.toHaveBeenCalled();
      expect(m.inserts).toEqual([]);
    },
  );
  it.each(["admin", "manager"])(
    "UUID válido e papel %s autorizam a organização da sessão",
    async (role) => {
      m.role = role;
      expect((await checkout(request(base))).status).toBe(200);
      expect(m.queries).toContainEqual([
        "user_organizations",
        "eq",
        "user_id",
        "usuario-autenticado",
      ]);
      expect(m.queries).toContainEqual([
        "user_organizations",
        "eq",
        "organization_id",
        ORG,
      ]);
      expect(m.queries).toContainEqual([
        "user_organizations",
        "is",
        "revoked_at",
        null,
      ]);
      expect(m.createSubscription).toHaveBeenCalledWith(
        expect.objectContaining({ externalReference: ORG }),
      );
    },
  );
  it("organização existente sem sessão recebe 401 antes de qualquer escrita", async () => {
    expect((await checkout(request(base, {}))).status).toBe(401);
    expect(m.inserts).toEqual([]);
    expect(m.createSubscription).not.toHaveBeenCalled();
  });
  it("sessão inválida recebe 401 antes de qualquer escrita", async () => {
    m.user = null;
    expect((await checkout(request(base))).status).toBe(401);
    expect(m.inserts).toEqual([]);
    expect(m.customer).not.toHaveBeenCalled();
  });
  it.each(["viewer", "agent", "member", "guest", "billing_viewer"])(
    "papel %s não gerencia contratação",
    async (role) => {
      m.role = role;
      expect((await checkout(request(base))).status).toBe(403);
      expect(m.inserts).toEqual([]);
      expect(m.createSubscription).not.toHaveBeenCalled();
    },
  );
  it("vínculo revogado não autoriza uma contratação", async () => {
    m.revoked = true;
    expect((await checkout(request(base))).status).toBe(403);
    expect(m.createSubscription).not.toHaveBeenCalled();
  });
  it.each([undefined, "", "short", "1234567"])(
    "cadastro novo recusa senha insuficiente %s",
    async (password) => {
      expect(
        (
          await checkout(
            request({ ...base, organization_id: undefined, password }),
          )
        ).status,
      ).toBe(400);
      expect(m.createUser).not.toHaveBeenCalled();
      expect(m.inserts).toEqual([]);
      expect(m.createSubscription).not.toHaveBeenCalled();
    },
  );
  it("e-mail existente retorna 409 sem criar outra organização", async () => {
    m.createUser.mockResolvedValue({
      data: { user: null },
      error: { message: "User already registered", status: 422 },
    });
    const res = await checkout(
      request({
        ...base,
        organization_id: undefined,
        password: "senha-exclusiva-de-teste",
      }),
    );
    expect(res.status).toBe(409);
    expect(m.inserts).toEqual([]);
    expect(m.customer).not.toHaveBeenCalled();
    expect(m.createSubscription).not.toHaveBeenCalled();
  });
  it("cadastro real da rota vincula usuário novo como admin e usa a mesma org na assinatura", async () => {
    const res = await checkout(
      request({
        ...base,
        organization_id: undefined,
        password: "senha-exclusiva-de-teste",
        company_name: "Empresa Fictícia",
      }),
    );
    expect(res.status).toBe(200);
    const org = m.inserts.find(({ table }) => table === "organizations")!.data;
    const member = m.inserts.find(
      ({ table }) => table === "user_organizations",
    )!.data;
    expect(org).toMatchObject({
      legal_name: "Empresa Fictícia",
      status: "active",
    });
    expect(org).not.toHaveProperty("ai_budget_cents");
    expect(org.id).toEqual(expect.any(String));
    expect(member).toMatchObject({
      user_id: NEW_USER,
      organization_id: org.id,
      role: "admin",
    });
    expect(m.subscription?.organization_id).toBe(org.id);
    expect(m.createSubscription).toHaveBeenCalledWith(
      expect.objectContaining({ externalReference: org.id }),
    );
    expect(m.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "cliente@example.test",
        email_confirm: true,
      }),
    );
  });
});

describe("recontratar pela página (assinatura anterior da mesma organização)", () => {
  const anterior = (over: Record<string, unknown>) => ({
    id: "assinatura-anterior",
    organization_id: ORG,
    status: "canceled",
    current_period_end: "2026-01-01T00:00:00.000Z",
    asaas_subscription_id: "sub_antiga",
    updated_at: "2026-01-01T00:00:00.000Z",
    ...over,
  });

  it("cancelada e vencida: contrata de novo REUSANDO a mesma linha (uma assinatura por organização)", async () => {
    m.subscription = anterior({});
    const res = await checkout(request(base));
    expect(res.status).toBe(200);
    expect(m.createSubscription).toHaveBeenCalledOnce();
    expect(m.subscription?.id).toBe("assinatura-anterior");
    expect(m.inserts.filter((i) => i.table === "subscriptions")).toEqual([]);
  });

  it("em atraso: recusa com 409 e manda pagar a fatura — assinatura nova cobraria em dobro", async () => {
    m.subscription = anterior({ status: "past_due", current_period_end: "2026-12-01T00:00:00.000Z" });
    const res = await checkout(request(base));
    expect(res.status).toBe(409);
    expect(await res.json()).toMatchObject({ code: "em_atraso", error: expect.stringContaining("Pagar a fatura em aberto") });
    expect(m.createSubscription).not.toHaveBeenCalled();
  });

  it("ativa: continua recusando", async () => {
    m.subscription = anterior({ status: "active", current_period_end: "2099-01-01T00:00:00.000Z" });
    const res = await checkout(request(base));
    expect(res.status).toBe(409);
    expect(m.createSubscription).not.toHaveBeenCalled();
  });

  it("outra aba recontratou no meio (estado mudou): zero linhas trocadas → 409, sem cobrança", async () => {
    m.subscription = anterior({});
    m.zeroUpdatedRows = true;
    const res = await checkout(request(base));
    expect(res.status).toBe(409);
    expect(m.createSubscription).not.toHaveBeenCalled();
  });
});

describe("contrato, período de teste e autoridade do preço na rota", () => {
  it("insere o vínculo de cobrança sem exigir UNIQUE da organização no schema", async () => {
    const res = await checkout(request(base));
    expect(res.status).toBe(200);
    expect(m.asaasCustomers).toEqual([
      expect.objectContaining({
        organization_id: ORG,
        asaas_customer_id: "cus_ficticio",
      }),
    ]);
    expect(m.createSubscription).toHaveBeenCalledOnce();
  });
  it("cliente Asaas de outra organização não é reatribuído nem recebe nova assinatura", async () => {
    m.asaasCustomers = [
      {
        id: "vinculo-anterior",
        organization_id: "outra-organizacao",
        asaas_customer_id: "cus_ficticio",
        email: "anterior@example.test",
      },
    ];
    const before = structuredClone(m.asaasCustomers);
    const res = await checkout(request(base));
    expect(res.status).toBe(409);
    expect(await res.json()).toMatchObject({
      error: expect.stringContaining("já está vinculado"),
    });
    expect(m.asaasCustomers).toEqual(before);
    expect(m.createSubscription).not.toHaveBeenCalled();
    expect(m.subscription?.status).toBe("suspended");
  });
  it("falha ao gravar cliente mantém reserva e não cria assinatura no Asaas", async () => {
    m.customerInsertError = "database_unavailable";
    const res = await checkout(request(base));
    expect(res.status).toBe(503);
    expect(m.asaasCustomers).toEqual([]);
    expect(m.createSubscription).not.toHaveBeenCalled();
    expect(m.subscription?.status).toBe("suspended");
  });
  it("reutiliza somente o vínculo já consultado pela organização autorizada", async () => {
    m.asaasCustomers = [
      { organization_id: ORG, asaas_customer_id: "cus_da_org" },
    ];
    const before = structuredClone(m.asaasCustomers);
    const res = await checkout(request(base));
    expect(res.status).toBe(200);
    expect(m.asaasCustomers).toEqual(before);
    expect(m.customer).not.toHaveBeenCalled();
    expect(m.createSubscription).toHaveBeenCalledWith(
      expect.objectContaining({ customer: "cus_da_org" }),
    );
    expect(m.queries).toContainEqual([
      "asaas_customers",
      "eq",
      "organization_id",
      ORG,
    ]);
  });
  it.each(["CREDIT_CARD", "PIX", "BOLETO"])(
    "%s inicia teste, sem registrar pagamento ativo",
    async (billing_type) => {
      const res = await checkout(
        request({ ...base, billing_type, credit_card_token: "token-ficticio" }),
      );
      expect(res.status).toBe(200);
      expect(await res.json()).toMatchObject({ status: "trialing", seats: 1 });
      expect(m.subscription).toMatchObject({
        status: "trialing",
        asaas_payment_id: null,
      });
      expect(m.updates.some((update) => update.status === "active")).toBe(
        false,
      );
    },
  );
  it("cartão em produção falha antes de cadastrar ou cobrar sem origem atestada", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const res = await checkout(
      request({
        ...base,
        billing_type: "CREDIT_CARD",
        credit_card_token: "token-ficticio",
      }),
    );
    expect(res.status).toBe(503);
    expect(m.inserts).toEqual([]);
    expect(m.createUser).not.toHaveBeenCalled();
    expect(m.createSubscription).not.toHaveBeenCalled();
  });
  it.each([
    ["essencial", "monthly", 89.9, "MONTHLY"],
    ["impulso", "quarterly", 404.73, "QUARTERLY"],
    ["essencial", "yearly", 863.04, "YEARLY"],
  ] as const)(
    "ignora preço do cliente: %s %s cobra o preço do plano",
    async (plan_slug, billing_cycle, value, cycle) => {
      const res = await checkout(
        request({
          ...base,
          plan_slug,
          billing_cycle,
          value: 0.01,
          price: 1,
        }),
      );
      expect(res.status).toBe(200);
      expect(m.createSubscription).toHaveBeenCalledWith(
        expect.objectContaining({ value, cycle }),
      );
      expect(await res.json()).toMatchObject({
        seats: 1,
        value,
        billing_cycle,
      });
    },
  );
  it("plano Escala é sob consulta: recusa antes de qualquer efeito", async () => {
    const res = await checkout(
      request({ ...base, plan_slug: "escala" }),
    );
    expect(res.status).toBe(400);
    expect(m.createSubscription).not.toHaveBeenCalled();
    expect(m.createUser).not.toHaveBeenCalled();
    expect(m.inserts).toEqual([]);
  });
  it.each([0, 2, 2.5, "3"])(
    "preço é por plano: recusa quantidade de atendentes %s",
    async (attendants) => {
      expect((await checkout(request({ ...base, attendants }))).status).toBe(
        400,
      );
      expect(m.createSubscription).not.toHaveBeenCalled();
      expect(m.inserts).toEqual([]);
    },
  );
  it("ciclo inválido não cria cliente nem assinatura", async () => {
    expect(
      (await checkout(request({ ...base, billing_cycle: "weekly" }))).status,
    ).toBe(400);
    expect(m.customer).not.toHaveBeenCalled();
    expect(m.createSubscription).not.toHaveBeenCalled();
  });
});

describe("webhook real autentica, limita reconciliação e pede repetição após falha", () => {
  beforeEach(() => {
    m.subscription = {
      id: "contrato-conhecido",
      organization_id: ORG,
      asaas_subscription_id: "sub_ficticia",
      billing_cycle: "monthly",
      status: "trialing",
      current_period_start: "2026-10-16T00:00:00.000Z",
      current_period_end: "2026-10-23T00:00:00.000Z",
      updated_at: "2026-10-16T00:00:00.000Z",
    };
  });
  const event = (name: string) => ({
    event: name,
    payment: {
      id: "pay_ficticio",
      subscription: "sub_ficticia",
      externalReference: ORG,
      dueDate: "2026-10-23",
    },
    subscription: { id: "sub_ficticia", status: "ACTIVE" },
  });
  const send = (name: string) =>
    webhook(request(event(name), { "asaas-access-token": SECRET }));
  it.each([undefined, "", "token-incorreto", "X" + SECRET.slice(1)])(
    "recusa token de webhook inválido %s",
    async (token) => {
      const headers: Record<string, string> =
        token === undefined ? {} : { "asaas-access-token": token };
      expect(
        (await webhook(request(event("PAYMENT_CONFIRMED"), headers))).status,
      ).toBe(401);
      expect(m.queries).toEqual([]);
      expect(m.updates).toEqual([]);
    },
  );
  it.each(["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED"])(
    "somente liquidação %s ativa o período pago",
    async (name) => {
      expect((await send(name)).status).toBe(200);
      expect(m.subscription).toMatchObject({
        status: "active",
        asaas_payment_id: "pay_ficticio",
        current_period_end: "2026-11-23T00:00:00.000Z",
      });
    },
  );
  it("atraso da cobrança atual restringe o plano", async () => {
    expect((await send("PAYMENT_OVERDUE")).status).toBe(200);
    expect(m.subscription?.status).toBe("past_due");
  });
  it("atraso de período já pago não restringe plano ativo", async () => {
    await send("PAYMENT_RECEIVED");
    const before = structuredClone(m.subscription);
    const writes = m.updates.length;
    expect((await send("PAYMENT_OVERDUE")).status).toBe(200);
    expect(m.subscription).toEqual(before);
    expect(m.updates).toHaveLength(writes);
  });
  it("cancelamento seguido de atraso e liquidação conserva recorrência cancelada", async () => {
    expect((await send("SUBSCRIPTION_DELETED")).status).toBe(200);
    expect((await send("PAYMENT_OVERDUE")).status).toBe(200);
    expect((await send("PAYMENT_RECEIVED")).status).toBe(200);
    expect(m.subscription).toMatchObject({
      status: "canceled",
      current_period_end: "2026-11-23T00:00:00.000Z",
    });
  });
  it.each(["past_due", "suspended"])(
    "liquidação de contrato anteriormente cancelado em %s conserva cancelamento",
    async (status) => {
      m.subscription!.status = status;
      m.subscription!.canceled_at = "2026-10-17T00:00:00.000Z";
      expect((await send("PAYMENT_RECEIVED")).status).toBe(200);
      expect(m.subscription).toMatchObject({
        status: "canceled",
        canceled_at: "2026-10-17T00:00:00.000Z",
        current_period_end: "2026-11-23T00:00:00.000Z",
      });
    },
  );
  it("cancelamento não faz confirmação do mesmo período desfazer estorno", async () => {
    await send("SUBSCRIPTION_DELETED");
    await send("PAYMENT_REFUNDED");
    const before = structuredClone(m.subscription);
    const writes = m.updates.length;
    expect((await send("PAYMENT_RECEIVED")).status).toBe(200);
    expect(m.subscription).toEqual(before);
    expect(m.subscription?.status).toBe("suspended");
    expect(m.updates).toHaveLength(writes);
  });
  it.each([
    "PAYMENT_CREATED",
    "PAYMENT_AUTHORIZED",
    "SUBSCRIPTION_CREATED",
    "SUBSCRIPTION_UPDATED",
    "PAYMENT_DELETED",
    "SUBSCRIPTION_SPLIT_DISABLED",
  ])("%s não comprova liquidação", async (name) => {
    expect((await send(name)).status).toBe(200);
    expect(m.subscription?.status).toBe("trialing");
    expect(m.updates).toEqual([]);
  });
  it("assinatura desconhecida não é reatribuída pelo externalReference", async () => {
    const incoming = event("PAYMENT_CONFIRMED");
    incoming.payment.subscription = "sub_desconhecida";
    incoming.subscription.id = "sub_desconhecida";
    const before = structuredClone(m.subscription);
    const res = await webhook(
      request(incoming, { "asaas-access-token": SECRET }),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ received: true, matched: false });
    expect(m.subscription).toEqual(before);
    expect(m.updates).toEqual([]);
    expect(m.queries).toContainEqual([
      "subscriptions",
      "eq",
      "asaas_subscription_id",
      "sub_desconhecida",
    ]);
    expect(m.queries).not.toContainEqual([
      "subscriptions",
      "eq",
      "organization_id",
      ORG,
    ]);
  });
  it("falha de leitura no banco retorna 503 para repetir evento", async () => {
    m.lookupError = true;
    expect((await send("PAYMENT_CONFIRMED")).status).toBe(503);
    expect(m.updates).toEqual([]);
  });
  it("falha de atualização no banco retorna 503 e preserva situação anterior", async () => {
    m.updateError = true;
    expect((await send("PAYMENT_CONFIRMED")).status).toBe(503);
    expect(m.subscription?.status).toBe("trialing");
  });
  it("concorrência que produz zero linhas retorna 503 para repetir evento", async () => {
    m.zeroUpdatedRows = true;
    expect((await send("PAYMENT_RECEIVED")).status).toBe(503);
    expect(m.subscription?.status).toBe("trialing");
  });
});
