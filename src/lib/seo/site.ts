import type { Metadata } from "next";
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
 * reais publicadas), CPF do responsável (documento de pessoa física: fica só
 * no rodapé, não vira dado para robô) nem redes sociais
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
  ultimaAtualizacao: "2026-11-20",
  /**
   * As páginas públicas. `titulo` é o nome curto (llms.txt, migalhas);
   * `tituloSeo` é o <title> da aba e do Google (o layout acrescenta
   * " | ChatAI Online"); `descricao` é a meta description — até ~155
   * caracteres, com a palavra que a pessoa busca no começo.
   */
  paginas: [
    {
      caminho: "/",
      titulo: "Página inicial",
      tituloSeo: "CRM com IA para WhatsApp que vende por você",
      tipo: "WebPage",
      descricao: "O que é o ChatAI Online, recursos, planos e perguntas frequentes.",
    },
    {
      caminho: "/sobre-nos",
      titulo: "Sobre o ChatAI Online",
      tituloSeo: "Sobre nós: quem faz o CRM com IA para WhatsApp",
      tipo: "AboutPage",
      descricao:
        "A missão do ChatAI Online e os negócios que ele atende: barbearias, salões de beleza e estética, comércio e lojas, clínicas e consultórios, prestadores de serviços e manutenção.",
    },
    {
      caminho: "/contato",
      titulo: "Contato",
      tituloSeo: "Contato: fale com a equipe pelo WhatsApp ou e-mail",
      tipo: "ContactPage",
      descricao:
        "Fale com a equipe do ChatAI Online pelo WhatsApp comercial, pelo WhatsApp de suporte ou pelo e-mail suporte@chataionline.io. Atendimento em português.",
    },
    {
      caminho: "/termos",
      titulo: "Termos de Uso",
      tituloSeo: "Termos de Uso",
      tipo: "WebPage",
      descricao:
        "Termos de Uso do ChatAI Online: teste grátis de 7 dias no cartão, planos, cobrança, cancelamento, uso do WhatsApp e responsabilidades dos agentes de IA.",
    },
    {
      caminho: "/privacidade",
      titulo: "Política de Privacidade",
      tituloSeo: "Política de Privacidade (LGPD)",
      tipo: "WebPage",
      descricao:
        "Como o ChatAI Online trata dados pessoais segundo a LGPD: papéis de controlador e operador, dados coletados, finalidades, segurança e direitos do titular.",
    },
    {
      caminho: "/reembolso",
      titulo: "Política de Reembolso",
      tituloSeo: "Política de Cancelamento e Reembolso",
      tipo: "WebPage",
      descricao:
        "Como cancelar a assinatura do ChatAI Online e pedir reembolso: garantia de 7 dias, prazos de devolução por Pix, cartão e boleto, e planos anuais.",
    },
    {
      caminho: "/cookies",
      titulo: "Política de Cookies",
      tituloSeo: "Política de Cookies",
      tipo: "WebPage",
      descricao:
        "Quais cookies o site do ChatAI Online usa, para que servem e como desativá-los no navegador.",
    },
  ],
} as const;

/**
 * A imagem dos cartões de compartilhamento (WhatsApp, Google, redes sociais),
 * 1200×630. A fonte dela é `docs/imagem-de-compartilhamento.html`: mudou o
 * preço ou a frase, tire a foto de novo e substitua `public/compartilhar.png`.
 */
export const IMAGEM_DE_COMPARTILHAMENTO = {
  url: "/compartilhar.png",
  width: 1200,
  height: 630,
  alt: "ChatAI Online: CRM com IA para WhatsApp. Agente de IA e chatbot que atendem, agendam e vendem por você.",
} as const;

export type CaminhoDePagina = (typeof SITE.paginas)[number]["caminho"];

function pagina(caminho: CaminhoDePagina) {
  return SITE.paginas.find((p) => p.caminho === caminho)!;
}

/**
 * Os metadados de uma página interna: título, descrição, endereço canônico e
 * o cartão de compartilhamento (Open Graph e X) COM O ENDEREÇO DELA. Sem isto
 * cada página herdava do layout o título e o `og:url` da página inicial, e o
 * link de /contato compartilhado no WhatsApp aparecia como a home.
 */
export function metadadosDaPagina(caminho: CaminhoDePagina): Metadata {
  const p = pagina(caminho);
  const tituloCompleto = `${p.tituloSeo} | ${SITE.nome}`;
  return {
    title: p.tituloSeo,
    description: p.descricao,
    alternates: { canonical: caminho },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: SITE.nome,
      url: caminho,
      title: tituloCompleto,
      description: p.descricao,
      images: [IMAGEM_DE_COMPARTILHAMENTO],
    },
    twitter: {
      card: "summary_large_image",
      title: tituloCompleto,
      description: p.descricao,
      images: [IMAGEM_DE_COMPARTILHAMENTO],
    },
  };
}

/**
 * Dado estruturado de uma página interna: a página (AboutPage, ContactPage ou
 * WebPage) e a migalha "Início › Página", que o Google mostra no resultado.
 */
export function jsonLdDaPagina(caminho: CaminhoDePagina) {
  const p = pagina(caminho);
  const url = `${SITE.url}${caminho}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": p.tipo,
        "@id": `${url}#pagina`,
        url,
        name: `${p.tituloSeo} | ${SITE.nome}`,
        description: p.descricao,
        inLanguage: SITE.idioma,
        isPartOf: { "@id": ID_SITE },
        about: { "@id": caminho === "/sobre-nos" || caminho === "/contato" ? ID_ORG : ID_APP },
        breadcrumb: { "@id": `${url}#migalhas` },
        dateModified: SITE.ultimaAtualizacao,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#migalhas`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: SITE.url },
          { "@type": "ListItem", position: 2, name: p.titulo, item: url },
        ],
      },
    ],
  };
}

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
    // WebApplication (subtipo de SoftwareApplication): o CRM roda no navegador.
    "@type": "WebApplication",
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
    author: { "@id": ID_ORG },
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
