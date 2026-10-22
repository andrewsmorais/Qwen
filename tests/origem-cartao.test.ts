import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { origemDoCartao } from "../src/lib/asaas/origem-cartao";

const req = (headers: Record<string, string> = {}, url = "https://chataionline.io/api/asaas/create-payment") =>
  new NextRequest(url, { headers });

describe("IP do comprador para o cartão", () => {
  it("sem cabeçalho configurado, nenhum cabeçalho é aceito", () => {
    expect(origemDoCartao(req({ "x-real-ip": "200.1.2.3" }), { NODE_ENV: "production" })).toBeNull();
  });

  it("com o cabeçalho do proxy configurado, usa o IP que o proxy gravou", () => {
    const amb = { NODE_ENV: "production", ORIGEM_CARTAO_CABECALHO: "X-Real-IP" };
    expect(origemDoCartao(req({ "x-real-ip": "200.1.2.3" }), amb)).toBe("200.1.2.3");
    expect(origemDoCartao(req({ "x-real-ip": "2804:14c::1" }), amb)).toBe("2804:14c::1");
  });

  it("valor que não é um IP só, ou ausente, não vira origem", () => {
    const amb = { ORIGEM_CARTAO_CABECALHO: "x-real-ip" };
    expect(origemDoCartao(req({ "x-real-ip": "1.1.1.1, 2.2.2.2" }), amb)).toBeNull();
    expect(origemDoCartao(req({ "x-real-ip": "<script>" }), amb)).toBeNull();
    expect(origemDoCartao(req({}), amb)).toBeNull();
  });

  it("x-forwarded-for é recusado mesmo se configurado: o primeiro item é do cliente", () => {
    const amb = { ORIGEM_CARTAO_CABECALHO: "x-forwarded-for" };
    expect(origemDoCartao(req({ "x-forwarded-for": "9.9.9.9" }), amb)).toBeNull();
  });

  it("sandbox local continua com o IP fictício", () => {
    const amb = { NODE_ENV: "development", ASAAS_BASE_URL: "https://api-sandbox.asaas.com" };
    expect(origemDoCartao(req({}, "http://localhost:3001/api/asaas/create-payment"), amb)).toBe("127.0.0.1");
  });
});
