import { PERGUNTAS_FREQUENTES } from "@/lib/oferta";
import { SITE } from "@/lib/seo/site";

/** As perguntas frequentes da página, em JSON, para assistentes de IA. */
export const dynamic = "force-static";

export function GET() {
  return Response.json({
    name: SITE.nome,
    url: `${SITE.url}/#ajuda`,
    language: SITE.idioma,
    faqs: PERGUNTAS_FREQUENTES.map((f) => ({ question: f.q, answer: f.a })),
    last_updated: SITE.ultimaAtualizacao,
  });
}
