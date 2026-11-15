import { SITE } from "@/lib/seo/site";

/** Resumo do site para assistentes de IA, das mesmas fontes da página. */
export const dynamic = "force-static";

export function GET() {
  return Response.json({
    name: SITE.nome,
    url: SITE.url,
    language: SITE.idioma,
    summary: SITE.definicao,
    description: SITE.descricao,
    category: "CRM com IA para WhatsApp",
    country: "BR",
    contact: { email: SITE.email, whatsapp_sales: SITE.whatsappComercial, whatsapp_support: SITE.whatsappSuporte },
    llms_txt: `${SITE.url}/llms.txt`,
    sitemap: `${SITE.url}/sitemap.xml`,
    last_updated: SITE.ultimaAtualizacao,
  });
}
