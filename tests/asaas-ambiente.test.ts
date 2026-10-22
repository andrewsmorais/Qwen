import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const fetchSimulado = vi.fn();

beforeEach(() => {
  vi.resetModules();
  fetchSimulado.mockReset();
  fetchSimulado.mockResolvedValue(
    Response.json({ id: "pay_ficticio", status: "PENDING" }),
  );
  vi.stubGlobal("fetch", fetchSimulado);
  vi.stubEnv("ASAAS_API_KEY", "credencial-ficticia-sem-valor-real");
  vi.stubEnv("ASAAS_BASE_URL", undefined);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("ambiente financeiro selecionado sem nenhuma requisição real", () => {
  it("tokenização usa o endpoint oficial e encaminha origem de homologação", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const { tokenizeCreditCard } = await import("../src/lib/asaas/client");
    const params = {
      customer: "cus_ficticio",
      remoteIp: "127.0.0.1",
      creditCard: {
        holderName: "Fictício",
        number: "4111111111111111",
        expiryMonth: "12",
        expiryYear: "2030",
        ccv: "123",
      },
      creditCardHolderInfo: {
        name: "Fictício",
        email: "ficticio@example.test",
        cpfCnpj: "12345678901",
        postalCode: "01001000",
        addressNumber: "1",
        phone: "11999999999",
      },
    };
    await tokenizeCreditCard(params);
    expect(fetchSimulado).toHaveBeenCalledExactlyOnceWith(
      "https://api-sandbox.asaas.com/v3/creditCard/tokenizeCreditCard",
      expect.objectContaining({ body: JSON.stringify(params) }),
    );
  });
  it.each([
    ["development", "https://api-sandbox.asaas.com"],
    ["test", "https://api-sandbox.asaas.com"],
    ["production", "https://api.asaas.com"],
  ] as const)("%s usa a URL padrão correspondente", async (ambiente, url) => {
    vi.stubEnv("NODE_ENV", ambiente);
    const { getPayment } = await import("../src/lib/asaas/client");
    await getPayment("pay_ficticio");
    expect(fetchSimulado).toHaveBeenCalledExactlyOnceWith(
      `${url}/v3/payments/pay_ficticio`,
      expect.objectContaining({
        headers: expect.objectContaining({
          access_token: "credencial-ficticia-sem-valor-real",
        }),
      }),
    );
  });

  it.each([
    ["development", "https://api.asaas.com"],
    ["production", "https://api-sandbox.asaas.com"],
    ["test", "https://asaas.example.test"],
  ] as const)(
    "%s respeita a URL explicitamente configurada: %s",
    async (ambiente, url) => {
      vi.stubEnv("NODE_ENV", ambiente);
      vi.stubEnv("ASAAS_BASE_URL", url);
      const { getPayment } = await import("../src/lib/asaas/client");
      await getPayment("pay_ficticio");
      expect(fetchSimulado).toHaveBeenCalledWith(
        `${url}/v3/payments/pay_ficticio`,
        expect.any(Object),
      );
    },
  );

  it("URL vazia mantém o padrão Sandbox em desenvolvimento", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("ASAAS_BASE_URL", "");
    const { getPayment } = await import("../src/lib/asaas/client");
    await getPayment("pay_ficticio");
    expect(fetchSimulado).toHaveBeenCalledWith(
      "https://api-sandbox.asaas.com/v3/payments/pay_ficticio",
      expect.any(Object),
    );
  });

  it.each(["development", "production"] as const)(
    "%s sem chave falha antes de chamar fetch",
    async (ambiente) => {
      vi.stubEnv("NODE_ENV", ambiente);
      vi.stubEnv("ASAAS_API_KEY", undefined);
      const { getPayment, createSubscription } =
        await import("../src/lib/asaas/client");
      await expect(getPayment("pay_ficticio")).rejects.toThrow(
        "ASAAS_API_KEY não configurada",
      );
      await expect(
        createSubscription({
          customer: "cus_ficticio",
          billingType: "PIX",
          value: 477,
          nextDueDate: "2030-01-01",
          cycle: "MONTHLY",
        }),
      ).rejects.toThrow("ASAAS_API_KEY não configurada");
      expect(fetchSimulado).not.toHaveBeenCalled();
    },
  );
});
