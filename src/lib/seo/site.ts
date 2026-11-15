import { PLANOS, type Plano } from "@/lib/planos";
import { CARDS, DEFINICAO, PERGUNTAS_FREQUENTES, SO_NO_CHATAI } from "@/lib/oferta";

/**
 * O QUE OS MECANISMOS DE BUSCA E DE IA LEEM SOBRE O CHATAI ONLINE.
 *
 * Tudo aqui vem do que a própria página já mostra (rodapé, Contato, Termos,
 * cards de plano). Nada é inventado para "agradar o robô": dado estruturado que
 * não bate com a página é motivo de penalização no Google e de citação errada
 * no ChatGPT/Perplexity.
 *
 * Por isso NÃO existem aqui: avaliação/nota de clientes (não há avaliações
 * reais publicadas), CNPJ (o número do rodapé
 * precisa ser conferido antes de virar dado estruturado) nem redes sociais
 * (`sameAs`) — entram quando existirem de verdade.
 */
export const SITE = {
  nome: "ChatAI Online",
  url: "https://chataionline.io",
  crm: "https://crm.chataionline.io",
  logo: "https://chataionline.io/logo.png",
  /** A frase que define o produto — a primeira que uma IA deveria citar. */
  definicao: DEFINICAO,
  descricao:
    "CRM com IA para WhatsApp: agente de IA e chatbot que atendem 24h, agendam horários e organizam as vendas num funil. Teste grátis por 7 dias.",
  idioma: "pt-BR",
  email: "suporte@chataionline.io",
  /** Botão "Fale com a gente" do site e página Contato. */
  whatsappComercial: "+55 12 99184-2793",
  /** Termos de Uso e Política de Privacidade (Telefone/WhatsApp de Suporte). */
  whatsappSuporte: "+55 12 98166-7389",
  responsavel: "Andrews Rocha De Morais",
  endereco: {
    rua: "Avenida Marginal, 761",
    cep: "11687-147",
    cidade: "Ubatuba",
    estado: "SP",
    pais: "BR",
  },
  /**
   * Última mudança de CONTEÚDO da página (texto, plano, preço). Vai para o
   * sitemap e para o `dateModified`. Atualize à mão quando mudar a oferta —
   * data automática de build diria "mudou" a cada deploy, e isso é mentira.
   */
  ultimaAtualizacao: "2026-11-15",
  paginas: [
    { caminho: "/", titulo: "Página inicial", descricao: "O que é o ChatAI Online, recursos, planos e perguntas frequentes." },
    { caminho: "/sobre", titulo: "Sobre o ChatAI Online", descricao: "Missão e para quais negócios o ChatAI Online foi feito: barbearias, salões de beleza e estética, comércio e lojas, clínicas e consultórios, prestadores de serviços e manutenção." },
    { caminho: "/contato", titulo: "Contato", descricao: "WhatsApp e e-mail da equipe." },
    { caminho: "/termos", titulo: "Termos de Uso", descricao: "Regras de uso da plataforma." },
    { caminho: "/privacidade", titulo: "Política de Privacidade", descricao: "Como os dados são tratados (LGPD)." },
    { caminho: "/reembolso", titulo: "Política de Reembolso", descricao: "Cancelamento e reembolso." },
    { caminho: "/cookies", titulo: "Política de Cookies", descricao: "Cookies usados no site." },
  ],
} as const;

export const reaisDe = (centavos: number) => (centavos / 100).toFixed(2);

/** O texto de preço de um plano, como a página mostra. */
export function precoLegivel(slug: Plano): string {
  const p = PLANOS[slug];
  const mensal = (p.price_monthly / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  return p.sob_consulta ? `a partir de R$ ${mensal}/mês (proposta sob medida)` : `R$ ${mensal}/mês`;
}

const ID_ORG = `${SITE.url}/#organizacao`;
const ID_SITE = `${SITE.url}/#site`;
const ID_APP = `${SITE.url}/#produto`;

/** Organização: quem é, como falar com ela, onde fica. */
export function jsonLdOrganizacao() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ID_ORG,
    name: SITE.nome,
    url: SITE.url,
    logo: SITE.logo,
    description: SITE.definicao,
    email: SITE.email,
    founder: { "@type": "Person", name: SITE.responsavel },
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.endereco.rua,
      postalCode: SITE.endereco.cep,
      addressLocality: SITE.endereco.cidade,
      addressRegion: SITE.endereco.estado,
      addressCountry: SITE.endereco.pais,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: SITE.whatsappComercial.replace(/[^\d+]/g, ""),
        email: SITE.email,
        availableLanguage: ["Portuguese"],
        areaServed: "BR",
      },
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: SITE.whatsappSuporte.replace(/[^\d+]/g, ""),
        email: SITE.email,
        availableLanguage: ["Portuguese"],
        areaServed: "BR",
      },
    ],
  };
}

/**
 * O site, com a busca interna (`/busca?q=`, `lib/seo/busca.ts`). O
 * `SearchAction` só existe porque a página de busca existe de verdade.
 */
export function jsonLdSite() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": ID_SITE,
    name: SITE.nome,
    url: SITE.url,
    inLanguage: SITE.idioma,
    publisher: { "@id": ID_ORG },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE.url}/busca?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

/** O produto, com os planos e preços que a página mostra. */
export function jsonLdProduto() {
  const ofertas = CARDS.map((card) => {
    const p = PLANOS[card.slug];
    return {
      "@type": "Offer",
      name: p.name,
      description: `${card.descricao} ${card.principais.join(", ")}.`,
      priceCurrency: "BRL",
      ...(p.sob_consulta
        ? {
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              priceCurrency: "BRL",
              minPrice: reaisDe(p.price_monthly),
              unitText: "MONTH",
            },
          }
        : {
            price: reaisDe(p.price_monthly),
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: reaisDe(p.price_monthly),
              priceCurrency: "BRL",
              unitText: "MONTH",
            },
          }),
      url: `${SITE.url}/#precos`,
      availability: "https://schema.org/InStock",
    };
  });
  const precos = CARDS.map((c) => PLANOS[c.slug].price_monthly);
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": ID_APP,
    name: SITE.nome,
    url: SITE.url,
    description: SITE.definicao,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "CRM com IA para WhatsApp",
    operatingSystem: "Web",
    inLanguage: SITE.idioma,
    publisher: { "@id": ID_ORG },
    featureList: [
      ...new Set([...CARDS.flatMap((c) => c.recursos), ...SO_NO_CHATAI.map((d) => `${d.titulo}: ${d.texto}`)]),
    ],
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "BRL",
      lowPrice: reaisDe(Math.min(...precos)),
      highPrice: reaisDe(Math.max(...precos)),
      offerCount: String(ofertas.length),
      offers: ofertas,
    },
  };
}

/** A página inicial, com a data da última mudança de conteúdo. */
export function jsonLdPaginaInicial() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE.url}/#pagina`,
    url: SITE.url,
    name: `${SITE.nome} | CRM com IA para WhatsApp`,
    description: SITE.descricao,
    inLanguage: SITE.idioma,
    isPartOf: { "@id": ID_SITE },
    about: { "@id": ID_APP },
    dateModified: SITE.ultimaAtualizacao,
  };
}

/** As perguntas frequentes — exatamente as que a página mostra. */
export function jsonLdPerguntas() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PERGUNTAS_FREQUENTES.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/**
 * JSON dentro de `<script type="application/ld+json">`: escapa `<` para um
 * texto com `</script>` nunca fechar a tag antes da hora.
 */
export function jsonLdSeguro(dado: unknown): string {
  return JSON.stringify(dado).replace(/</g, "\\u003c");
}
