import { describe, expect, it } from "vitest";

import { PLANOS } from "@/lib/planos";
import { CARDS, DEFINICAO, PERGUNTAS_FREQUENTES } from "@/lib/oferta";
import { gerarLlmsTxt } from "@/lib/seo/llms";
import {
  SITE,
  jsonLdOrganizacao,
  jsonLdPerguntas,
  jsonLdProduto,
  jsonLdSeguro,
  jsonLdSite,
} from "@/lib/seo/site";

/**
 * O que os robôs de busca e de IA leem tem de dizer o MESMO que a página e o
 * checkout. O defeito que isto vigia já aconteceu: o `llms.txt` e o JSON-LD
 * ficaram com preço, plano e recurso de outra época, e a página mostrava outra
 * coisa — é o preço errado que uma IA citaria.
 */
describe("SEO/GEO — o que os robôs leem bate com a página", () => {
  it("os preços do JSON-LD são os do checkout (lib/planos.ts)", () => {
    const ofertas = jsonLdProduto().offers.offers as Array<Record<string, unknown>>;
    for (const card of CARDS) {
      const p = PLANOS[card.slug];
      const oferta = ofertas.find((o) => o.name === p.name)!;
      const esperado = (p.price_monthly / 100).toFixed(2);
      if (p.sob_consulta) {
        expect((oferta.priceSpecification as Record<string, unknown>).minPrice).toBe(esperado);
        expect(oferta.price).toBeUndefined();
      } else {
        expect(oferta.price).toBe(esperado);
      }
    }
  });

  it("não declara avaliação de clientes que a página não mostra", () => {
    const tudo = JSON.stringify([jsonLdProduto(), jsonLdOrganizacao(), jsonLdSite()]);
    expect(tudo).not.toMatch(/aggregateRating|ratingValue|reviewCount/i);
  });

  it("não declara busca interna que o site não tem", () => {
    expect(JSON.stringify(jsonLdSite())).not.toMatch(/SearchAction/);
  });

  it("o FAQPage é exatamente a lista de perguntas da página, e começa pela definição", () => {
    const faq = jsonLdPerguntas().mainEntity;
    expect(faq.map((q) => q.name)).toEqual(PERGUNTAS_FREQUENTES.map((f) => f.q));
    expect(PERGUNTAS_FREQUENTES[0].a).toBe(DEFINICAO);
  });

  it("o llms.txt traz cada plano com o preço da página e nenhum resto de oferta antiga", () => {
    const txt = gerarLlmsTxt();
    expect(txt.startsWith(`# ${SITE.nome}\n\n> ${DEFINICAO}`)).toBe(true);
    expect(txt).toContain("Essencial — R$ 89,90/mês");
    expect(txt).toContain("Impulso — R$ 149,90/mês");
    expect(txt).toContain("Escala — a partir de R$ 349,90/mês");
    // Preços e promessas que já saíram da oferta.
    expect(txt).not.toMatch(/R\$ 107|R\$ 159|R\$ 234|campanhas em massa|WhatsApp ilimitado/i);
    // O cliente não vê provedor nem modelo de IA.
    expect(txt).not.toMatch(/OpenAI|Anthropic|OpenRouter|Gemini|GPT-|Claude/);
    // Links para as páginas: é o que os assistentes seguem.
    for (const p of SITE.paginas) expect(txt).toContain(`(${SITE.url}${p.caminho === "/" ? "" : p.caminho})`);
  });

  it("o JSON-LD não fecha a tag <script> antes da hora", () => {
    expect(jsonLdSeguro({ texto: "</script><script>alert(1)</script>" })).not.toContain("</script>");
  });
});
