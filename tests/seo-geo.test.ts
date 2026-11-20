import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { PLANOS } from "@/lib/planos";
import { CARDS, DEFINICAO, PERGUNTAS_FREQUENTES } from "@/lib/oferta";
import { gerarLlmsTxt } from "@/lib/seo/llms";
import sitemap from "@/app/sitemap";
import { WHATSAPP_COMERCIAL, linkDoWhatsapp } from "@/lib/urls";
import {
  IMAGEM_DE_COMPARTILHAMENTO,
  SITE,
  jsonLdDaPagina,
  metadadosDaPagina,
  jsonLdOrganizacao,
  jsonLdPerguntas,
  jsonLdProduto,
  jsonLdSeguro,
  jsonLdSite,
} from "@/lib/seo/site";
import { buscar } from "@/lib/seo/busca";

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

  it("o SearchAction aponta para a busca que existe de verdade", () => {
    const acao = jsonLdSite().potentialAction;
    expect(acao["@type"]).toBe("SearchAction");
    expect(acao.target.urlTemplate).toBe(`${SITE.url}/busca?q={search_term_string}`);
    expect(existsSync(path.resolve(__dirname, "../src/app/busca/page.tsx"))).toBe(true);
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
    expect(txt).toContain("Escala — R$ 349,90/mês");
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

describe("busca interna", () => {
  it("acha sem acento e sem maiúscula", () => {
    const r = buscar("PRECO");
    expect(r[0]?.titulo).toBe("Quanto custa o ChatAI Online?");
  });

  it("acha o recurso dentro do plano e o diferencial", () => {
    const titulos = buscar("agendamento").map((r) => r.titulo);
    expect(titulos).toContain("Agendamento automático");
    expect(titulos.some((t) => t.startsWith("Essencial"))).toBe(true);
  });

  it("acha a página pelo segmento do cliente", () => {
    expect(buscar("barbearia").map((r) => r.url)).toContain("/sobre-nos");
  });

  it("busca vazia, só de palavras comuns ou gigante não quebra", () => {
    expect(buscar("")).toEqual([]);
    expect(buscar("de para com")).toEqual([]);
    expect(() => buscar("x".repeat(10_000))).not.toThrow();
  });

  it("todo resultado leva a um endereço do próprio site", () => {
    for (const r of buscar("whatsapp ia plano funil")) expect(r.url.startsWith("/")).toBe(true);
  });
});

describe("SEO por página (20/11/2026)", () => {
  const internas = SITE.paginas.filter((p) => p.caminho !== "/");

  it("cada página interna tem título, descrição, canonical e cartão de compartilhamento PRÓPRIOS", () => {
    const titulos = new Set<string>();
    for (const p of internas) {
      const m = metadadosDaPagina(p.caminho);
      const og = m.openGraph as Record<string, unknown>;
      expect(m.alternates?.canonical).toBe(p.caminho);
      expect(og.url).toBe(p.caminho);
      expect(og.title).toContain(p.tituloSeo);
      expect(og.images).toEqual([IMAGEM_DE_COMPARTILHAMENTO]);
      expect((m.twitter as Record<string, unknown>).images).toEqual([IMAGEM_DE_COMPARTILHAMENTO]);
      expect(p.descricao.length).toBeGreaterThan(70);
      expect(p.descricao.length).toBeLessThanOrEqual(185);
      titulos.add(p.tituloSeo);
    }
    // Título repetido entre páginas é o primeiro problema que o Google aponta.
    expect(titulos.size).toBe(internas.length);
  });

  it("a imagem de compartilhamento existe e tem 1200×630", () => {
    const arquivo = path.resolve(__dirname, "../public", IMAGEM_DE_COMPARTILHAMENTO.url.slice(1));
    expect(existsSync(arquivo)).toBe(true);
    const cabecalho = readFileSync(arquivo);
    expect(cabecalho.readUInt32BE(16)).toBe(1200);
    expect(cabecalho.readUInt32BE(20)).toBe(630);
  });

  it("toda página interna traz a migalha Início › Página e o tipo certo", () => {
    for (const p of internas) {
      const grafo = jsonLdDaPagina(p.caminho)["@graph"] as Array<Record<string, unknown>>;
      expect(grafo[0]["@type"]).toBe(p.tipo);
      const migalha = grafo[1].itemListElement as Array<Record<string, unknown>>;
      expect(migalha.map((i) => i.item)).toEqual([SITE.url, `${SITE.url}${p.caminho}`]);
    }
  });

  it("o mapa do site usa o MESMO endereço que o canonical de cada página", () => {
    for (const item of sitemap()) {
      const caminho = item.url.slice(SITE.url.length) || "/";
      expect(SITE.paginas.some((p) => p.caminho === caminho)).toBe(true);
    }
    expect(sitemap()[0].url).toBe(SITE.url);
  });

  it("o botão 'Testar o agente' leva ao mesmo WhatsApp comercial do site", () => {
    expect(SITE.whatsappComercial.replace(/\D/g, "")).toBe(WHATSAPP_COMERCIAL);
    expect(linkDoWhatsapp("oi")).toBe(`https://wa.me/${WHATSAPP_COMERCIAL}?text=oi`);
    expect(gerarLlmsTxt(false)).toContain(`https://wa.me/${WHATSAPP_COMERCIAL}`);
  });
});
