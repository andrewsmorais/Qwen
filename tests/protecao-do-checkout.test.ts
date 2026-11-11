/**
 * Checkout público (auditoria de 04/11/2026, decisões de 11/11/2026):
 * limite por origem, CAPTCHA opcional e um teste grátis por empresa.
 */
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  cabeNaJanela,
  esquecerBatidas,
  exigirHumano,
  limitarPorOrigem,
} from "@/lib/protecao-do-checkout";
import { primeiraCobranca, temDireitoAoTeste } from "@/lib/teste-gratis";

const pedido = (ip?: string) =>
  new NextRequest("https://chataionline.io/api/asaas/create-payment", {
    method: "POST",
    headers: ip ? { "x-real-ip": ip } : {},
  });
const ambiente = { ORIGEM_CARTAO_CABECALHO: "x-real-ip" };

beforeEach(() => esquecerBatidas());

describe("limite por origem", () => {
  it("a 6ª criação de conta do mesmo IP em 10 minutos recebe 429; outro IP segue", () => {
    for (let i = 0; i < 5; i++) expect(limitarPorOrigem(pedido("1.2.3.4"), "create-payment", ambiente)).toBeNull();
    const barrado = limitarPorOrigem(pedido("1.2.3.4"), "create-payment", ambiente);
    expect(barrado?.status).toBe(429);
    expect(barrado?.headers.get("retry-after")).toBe("600");
    expect(limitarPorOrigem(pedido("5.6.7.8"), "create-payment", ambiente)).toBeNull();
  });

  it("o cabeçalho de IP só vale quando o dono configurou qual o proxy grava", () => {
    // Sem ORIGEM_CARTAO_CABECALHO, trocar o x-real-ip não abre balde novo: todos
    // caem no global.
    for (let i = 0; i < 120; i++) cabeNaJanela("create-payment:global", { limite: 120, janelaMs: 600_000 });
    expect(limitarPorOrigem(pedido("9.9.9.9"), "create-payment", {})?.status).toBe(429);
  });

  it("a janela desliza", () => {
    const j = { limite: 2, janelaMs: 1000 };
    expect(cabeNaJanela("x", j, 0)).toBe(true);
    expect(cabeNaJanela("x", j, 10)).toBe(true);
    expect(cabeNaJanela("x", j, 20)).toBe(false);
    expect(cabeNaJanela("x", j, 1011)).toBe(true);
  });
});

describe("CAPTCHA (Turnstile)", () => {
  it("sem a chave no .env, não exige nada (a atualização não pede edição do .env)", async () => {
    expect(await exigirHumano(pedido(), undefined, {})).toBeNull();
  });

  it("com a chave: sem token recusa; token válido passa; token recusado pelo Cloudflare recusa", async () => {
    const env = { TURNSTILE_SECRET_KEY: "segredo-de-teste" };
    expect((await exigirHumano(pedido(), undefined, env))?.status).toBe(400);
    const valida = vi.fn(async () => new Response('{"success":true}'));
    expect(await exigirHumano(pedido(), "tok", env, { fetch: valida as never })).toBeNull();
    const invalida = vi.fn(async () => new Response('{"success":false}'));
    expect((await exigirHumano(pedido(), "tok", env, { fetch: invalida as never }))?.status).toBe(400);
  });
});

describe("um teste grátis por empresa", () => {
  it("documento novo ganha os 7 dias; recontratação ou documento que já contratou, não", () => {
    expect(temDireitoAoTeste({ recontratacao: false, outrasComAssinatura: 0 })).toBe(true);
    expect(temDireitoAoTeste({ recontratacao: true, outrasComAssinatura: 0 })).toBe(false);
    expect(temDireitoAoTeste({ recontratacao: false, outrasComAssinatura: 1 })).toBe(false);
  });

  it("a primeira cobrança vence em 7 dias com teste, e hoje sem", () => {
    const agora = new Date("2026-11-11T12:00:00Z");
    expect(primeiraCobranca(true, agora)).toBe("2026-11-18");
    expect(primeiraCobranca(false, agora)).toBe("2026-11-11");
  });
});
