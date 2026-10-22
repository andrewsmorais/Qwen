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
    ["essencial", "monthly", "R$ 214,00"],
    ["essencial", "quarterly", "R$ 582,00"],
    ["essencial", "yearly", "R$ 2.064,00"],
    ["impulso", "monthly", "R$ 477,00"],
    ["impulso", "quarterly", "R$ 1.287,00"],
    ["impulso", "yearly", "R$ 4.572,00"],
    ["escala", "monthly", "R$ 702,00"],
    ["escala", "quarterly", "R$ 1.899,00"],
    ["escala", "yearly", "R$ 6.732,00"],
  ] as const)("%s %s mostra o total do mínimo de atendentes", (plano, ciclo, total) => {
    const html = modal(plano, ciclo);
    expect(html).toContain(total);
    expect(html).toContain(`Total para ${PLANOS[plano].min_attendants} atendentes`);
    expect(html).toContain('id="checkout-attendants"');
    expect(html).toContain(`min="${PLANOS[plano].min_attendants}"`);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("aumentar os atendentes recalcula o valor exibido", () => {
    expect(modal("impulso", "quarterly", 4)).toContain("Total para 4 atendentes: R$ 1.716,00");
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
    for (const total of ["R$ 214,00", "R$ 477,00", "R$ 702,00"]) expect(html).toContain(total);
  });
});
