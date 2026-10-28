import { afterEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PLANOS, type Plano, type Ciclo } from "../src/lib/planos";
import { CheckoutModal } from "../src/components/checkout/CheckoutModal";
import { Pricing } from "../src/components/Pricing";

vi.mock("@/lib/supabase", () => ({
  createSupabaseClient: () => {
    throw new Error("Consulta de sessão proibida durante renderização");
  },
}));

afterEach(() => vi.unstubAllGlobals());

const modal = (planType: Plano, billingCycle: Ciclo) => {
  vi.stubGlobal("fetch", vi.fn(() => { throw new Error("Rede proibida neste teste"); }));
  return renderToStaticMarkup(createElement(CheckoutModal, {
    isOpen: true, onClose: () => {}, planType, billingCycle,
  }));
};

describe("o valor informado é o do plano e do ciclo (preço por plano)", () => {
  it.each([
    ["essencial", "monthly", "R$\u00a089,90"],
    ["essencial", "quarterly", "R$\u00a0242,73"],
    ["essencial", "yearly", "R$\u00a0863,04"],
    ["impulso", "monthly", "R$\u00a0149,90"],
    ["impulso", "quarterly", "R$\u00a0404,73"],
    ["impulso", "yearly", "R$\u00a01.439,04"],
  ] as const)("%s %s mostra o valor do plano, sem quantidade de atendentes", (plano, ciclo, total) => {
    const html = modal(plano, ciclo);
    expect(html).toContain(total);
    expect(html).toContain(`Plano ${PLANOS[plano].name}: ${total}`);
    expect(html).not.toContain('id="checkout-attendants"');
    expect(html).not.toContain("atendentes");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("débito permanece visível e indisponível para assinatura", () => {
    const html = modal("impulso", "monthly");
    expect(html).toMatch(/<button[^>]*disabled=""[^>]*>[\s\S]*?Débito[\s\S]*?Indisponível para assinaturas[\s\S]*?<\/button>/);
  });

  it("cards mensais: preço por plano, os números de cada plano e o Escala sob consulta", () => {
    const html = renderToStaticMarkup(createElement(Pricing));
    for (const total of ["89,90", "149,90", "349,90"]) expect(html).toContain(total);
    for (const numero of [
      "2 números de WhatsApp", "1 agente de IA", "1 chatbot", "CRM com 2 funis",
      "4 números de WhatsApp", "2 agentes de IA", "2 chatbots", "CRM com 4 funis",
      "A partir de 6 números de WhatsApp", "Radar de conversas", "Só no ChatAI",
    ]) expect(html).toContain(numero);
    // Escala é sob consulta: mostra "a partir de" e leva ao contato, não ao checkout.
    expect(html).toContain("a partir de");
    expect(html).toContain("Falar com especialista");
    expect(html).toContain('href="/contato"');
    expect(html).not.toContain("atendente/mês");
  });
});
