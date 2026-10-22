import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const m = vi.hoisted(() => ({
  customer: vi.fn(),
  tokenize: vi.fn(),
  payment: vi.fn(),
  user: { id: "usuario-ficticio" } as { id: string } | null,
  memberships: [{ organization_id: "org-propria", role: "admin" }] as Record<
    string,
    unknown
  >[],
  subscription: {
    organization_id: "org-propria",
    asaas_subscription_id: "sub_propria",
    asaas_payment_id: null,
    status: "trialing",
    plan_type: "impulso",
    expires_at: "2030-01-08T00:00:00.000Z",
  } as Record<string, unknown> | null,
  queries: [] as unknown[][],
}));
vi.mock("@/lib/asaas/client", () => ({
  findOrCreateCustomer: m.customer,
  tokenizeCreditCard: m.tokenize,
  getPayment: m.payment,
}));
vi.mock("@/lib/supabase", () => ({
  createSupabaseAdmin: () => ({
    auth: { getUser: async () => ({ data: { user: m.user }, error: null }) },
    from: (table: string) => {
      const filters: [string, unknown][] = [];
      const execute = () => {
        const rows =
          table === "user_organizations"
            ? m.memberships
            : m.subscription
              ? [m.subscription]
              : [];
        const selected = rows.filter((row) =>
          filters.every(
            ([key, value]) =>
              key === "user_id" ||
              (key === "revoked_at"
                ? row[key] == null
                : Array.isArray(value)
                  ? value.includes(row[key])
                  : row[key] === value),
          ),
        );
        return { data: selected, error: null };
      };
      const q = {
        select: () => q,
        eq: (key: string, value: unknown) => {
          filters.push([key, value]);
          m.queries.push([table, "eq", key, value]);
          return q;
        },
        is: (key: string, value: unknown) => {
          filters.push([key, value]);
          return q;
        },
        in: (key: string, value: unknown[]) => {
          filters.push([key, value]);
          m.queries.push([table, "in", key, value]);
          return q;
        },
        single: async () => ({ ...execute(), data: execute().data[0] ?? null }),
        maybeSingle: async () => ({
          ...execute(),
          data: execute().data[0] ?? null,
        }),
        then: (resolve: (result: unknown) => unknown) =>
          Promise.resolve(execute()).then(resolve),
      };
      return q;
    },
  }),
}));
import { POST as tokenize } from "../src/app/api/asaas/tokenize-card/route";
import { GET as checkPayment } from "../src/app/api/asaas/check-payment/[payment_id]/route";

const card = {
  customer: {
    name: "Cliente Fictício",
    email: "cliente@example.test",
    cpfCnpj: "12345678901",
  },
  holder_name: "Cliente Fictício",
  card_number: "4111111111111111",
  expiry_month: "12",
  expiry_year: "30",
  ccv: "123",
  holder_info: {
    name: "Cliente Fictício",
    email: "cliente@example.test",
    cpfCnpj: "12345678901",
    postalCode: "01001000",
    addressNumber: "1",
    phone: "11999999999",
  },
};
const cardRequest = (body: unknown) =>
  new NextRequest("http://127.0.0.1:3001/api/asaas/tokenize-card", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
const paymentRequest = (authorization = "Bearer sessao-ficticia") =>
  new NextRequest("http://127.0.0.1:3001/api/asaas/check-payment/pay_proprio", {
    headers: { authorization },
  });

beforeEach(() => {
  vi.clearAllMocks();
  m.user = { id: "usuario-ficticio" };
  m.memberships = [{ organization_id: "org-propria", role: "admin" }];
  m.subscription = {
    organization_id: "org-propria",
    asaas_subscription_id: "sub_propria",
    asaas_payment_id: null,
    status: "trialing",
    plan_type: "impulso",
    expires_at: "2030-01-08T00:00:00.000Z",
  };
  m.queries = [];
  m.customer.mockResolvedValue({ id: "cus_ficticio" });
  m.tokenize.mockResolvedValue({
    creditCardToken: "token-ficticio",
    creditCardBrand: "VISA",
    creditCardNumber: "1111",
  });
  m.payment.mockResolvedValue({
    id: "pay_proprio",
    subscription: "sub_propria",
    status: "PENDING",
    billingType: "PIX",
    value: 477,
  });
  vi.stubEnv("NODE_ENV", "development");
  vi.stubEnv("ASAAS_BASE_URL", "https://api-sandbox.asaas.com");
  vi.stubGlobal(
    "fetch",
    vi.fn(() => {
      throw new Error("Rede proibida nesta suíte");
    }),
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("tokenização valida todos os campos antes de efeitos", () => {
  it.each(["", "12", "41111111111111111111"])(
    "número inválido %s não cria cliente",
    async (number) => {
      expect(
        (await tokenize(cardRequest({ ...card, card_number: number }))).status,
      ).toBe(400);
      expect(m.customer).not.toHaveBeenCalled();
      expect(m.tokenize).not.toHaveBeenCalled();
    },
  );
  it("titular incompleto não cria cliente", async () => {
    expect(
      (await tokenize(cardRequest({ ...card, holder_info: {} }))).status,
    ).toBe(400);
    expect(m.customer).not.toHaveBeenCalled();
  });
  it("normaliza o ano do campo MM/AA e transmite a origem local somente ao Sandbox", async () => {
    expect((await tokenize(cardRequest(card))).status).toBe(200);
    expect(m.tokenize).toHaveBeenCalledWith(
      expect.objectContaining({
        remoteIp: "127.0.0.1",
        creditCard: expect.objectContaining({ expiryYear: "2030" }),
      }),
    );
  });
  it.each([
    ["production", "https://api-sandbox.asaas.com", "http://127.0.0.1:3001"],
    ["development", "https://api.asaas.com", "http://127.0.0.1:3001"],
    [
      "development",
      "https://api-sandbox.asaas.com",
      "https://vendas.example.test",
    ],
  ])(
    "não inventa origem fora do Sandbox local: %s %s %s",
    async (environment, baseUrl, url) => {
      vi.stubEnv("NODE_ENV", environment);
      vi.stubEnv("ASAAS_BASE_URL", baseUrl);
      const req = new NextRequest(url + "/api/asaas/tokenize-card", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "203.0.113.9",
          "x-real-ip": "203.0.113.9",
        },
        body: JSON.stringify({ ...card, remoteIp: "203.0.113.9" }),
      });
      expect((await tokenize(req)).status).toBe(503);
      expect(m.customer).not.toHaveBeenCalled();
      expect(m.tokenize).not.toHaveBeenCalled();
    },
  );
  it.each([
    { expiry_month: "13" },
    { expiry_year: "20" },
    { expiry_month: 12 },
    { ccv: "12" },
    { ccv: 123 },
    { card_number: 4111111111111111 },
  ])("campos inválidos não chegam ao provedor: %j", async (change) => {
    expect((await tokenize(cardRequest({ ...card, ...change }))).status).toBe(
      400,
    );
    expect(m.customer).not.toHaveBeenCalled();
    expect(m.tokenize).not.toHaveBeenCalled();
  });
  it("erro do provedor não é registrado com dados do cartão", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    m.tokenize.mockRejectedValueOnce(new Error("detalhe-financeiro-ficticio"));
    const response = await tokenize(cardRequest(card));
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("detalhe-financeiro-ficticio");
    expect(log).not.toHaveBeenCalled();
    log.mockRestore();
  });
});

describe("consulta de cobrança pendente autoriza pela assinatura da organização", () => {
  const call = (req = paymentRequest(), id = "pay_proprio") =>
    checkPayment(req, { params: Promise.resolve({ payment_id: id }) });
  it("consulta PIX ainda PENDING mesmo com asaas_payment_id local nulo", async () => {
    const response = await call();
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      payment_id: "pay_proprio",
      asaas_status: "PENDING",
      local_status: "trialing",
    });
    expect(m.queries).toContainEqual([
      "subscriptions",
      "eq",
      "asaas_subscription_id",
      "sub_propria",
    ]);
    expect(m.queries).toContainEqual([
      "subscriptions",
      "in",
      "organization_id",
      ["org-propria"],
    ]);
  });
  it("cobrança de outra assinatura não revela dados financeiros", async () => {
    m.payment.mockResolvedValue({
      id: "pay_proprio",
      subscription: "sub_alheia",
      value: 999999,
    });
    const response = await call();
    expect(response.status).toBe(404);
    expect(await response.text()).not.toContain("999999");
  });
  it("sem sessão não chama o provedor", async () => {
    expect((await call(paymentRequest(""))).status).toBe(401);
    expect(m.payment).not.toHaveBeenCalled();
  });
  it.each(["viewer", "agent"])(
    "papel %s não consulta valores no provedor",
    async (role) => {
      m.memberships = [{ organization_id: "org-propria", role }];
      expect((await call()).status).toBe(403);
      expect(m.payment).not.toHaveBeenCalled();
    },
  );
  it("identificador malformado não é interpolado na URL do provedor", async () => {
    expect((await call(paymentRequest(), "pay_foo/outra-rota")).status).toBe(
      400,
    );
    expect(m.payment).not.toHaveBeenCalled();
  });
  it("vínculo revogado não consulta valores no provedor", async () => {
    m.memberships = [
      {
        organization_id: "org-propria",
        role: "admin",
        revoked_at: "2026-10-01",
      },
    ];
    expect((await call()).status).toBe(403);
    expect(m.payment).not.toHaveBeenCalled();
  });
  it("sessão inválida não consulta valores no provedor", async () => {
    m.user = null;
    expect((await call()).status).toBe(401);
    expect(m.payment).not.toHaveBeenCalled();
  });
  it("pagamento sem recorrência vinculada não revela valor", async () => {
    m.payment.mockResolvedValueOnce({
      id: "pay_proprio",
      subscription: null,
      value: 123456,
    });
    const response = await call();
    expect(response.status).toBe(404);
    expect(await response.text()).not.toContain("123456");
  });
  it("falha do provedor responde sem dado privado e sem escrita local", async () => {
    m.payment.mockRejectedValueOnce(new Error("detalhe-financeiro-ficticio"));
    const response = await call();
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("detalhe-financeiro-ficticio");
  });
});
