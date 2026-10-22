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

const modal = (planType: Plano, billingCycle: Ciclo, attendants?: number) => {
  vi.stubGlobal("fetch", vi.fn(() => { throw new Error("Rede proibida neste teste"); }));
  return renderToStaticMarkup(createElement(CheckoutModal, {
    isOpen: true, onClose: () => {}, planType, billingCycle, attendants,
  }));
};

describe("o valor informado corresponde à quantidade e ao ciclo contratados", () => {
  it.each([
    ["essencial", "monthly", "R$ 89,90"],
    ["essencial", "quarterly", "R$ 242,73"],
    ["essencial", "yearly", "R$ 863,04"],
    ["impulso", "monthly", "R$ 449,70"],
    ["impulso", "quarterly", "R$ 1.214,19"],
    ["impulso", "yearly", "R$ 4.317,12"],
    ["escala", "monthly", "R$ 1.099,50"],
    ["escala", "quarterly", "R$ 2.968,65"],
    ["escala", "yearly", "R$ 10.555,20"],
  ] as const)("%s %s mostra o total do mínimo de atendentes", (plano, ciclo, total) => {
    const html = modal(plano, ciclo);
    expect(html).toContain(total);
    expect(html).toContain(`Total para ${PLANOS[plano].min_attendants} ${PLANOS[plano].min_attendants === 1 ? "atendente" : "atendentes"}`);
    expect(html).toContain('id="checkout-attendants"');
    expect(html).toContain(`min="${PLANOS[plano].min_attendants}"`);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("aumentar os atendentes recalcula o valor exibido", () => {
    expect(modal("impulso", "quarterly", 4)).toContain("Total para 4 atendentes: R$ 1.618,92");
  });

  it("quantidade inválida não mostra um total contratado válido", () => {
    const html = modal("impulso", "monthly", 1);
    expect(html).toContain("Informe uma quantidade inteira válida para conferir o total.");
    expect(html).not.toContain("Total para 1 atendentes");
  });

  it("débito permanece visível e indisponível para assinatura", () => {
    const html = modal("impulso", "monthly");
    expect(html).toMatch(/<button[^>]*disabled=""[^>]*>[\s\S]*?Débito[\s\S]*?Indisponível para assinaturas[\s\S]*?<\/button>/);
  });

  it("cartões mensais informam o total da contratação mínima", () => {
    const html = renderToStaticMarkup(createElement(Pricing));
    for (const total of ["R$ 89,90", "R$ 449,70"]) expect(html).toContain(total);
    // Escala é sob consulta: mostra "a partir de" e leva ao contato, não ao checkout.
    expect(html).toContain("a partir de");
    expect(html).toContain("Falar com a gente");
    expect(html).toContain('href="/contato"');
    expect(html).toContain("1 atendente incluído");
  });
});
