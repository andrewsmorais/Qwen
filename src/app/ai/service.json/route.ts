import { PLANOS } from "@/lib/planos";
import { CARDS, SO_NO_CHATAI } from "@/lib/oferta";
import { SITE, precoLegivel, reaisDe } from "@/lib/seo/site";

/** O serviço e os planos, em JSON, das mesmas fontes que o checkout cobra. */
export const dynamic = "force-static";

export function GET() {
  return Response.json({
    name: SITE.nome,
    url: SITE.url,
    summary: SITE.definicao,
    category: "CRM com IA para WhatsApp",
    capabilities: [...new Set([...CARDS.flatMap((c) => c.recursos), ...SO_NO_CHATAI.map((d) => d.titulo)])],
    currency: "BRL",
    plans: CARDS.map((c) => ({
      name: PLANOS[c.slug].name,
      price_monthly: reaisDe(PLANOS[c.slug].price_monthly),
      price_label: precoLegivel(c.slug),
      on_request: PLANOS[c.slug].sob_consulta,
      description: c.descricao,
      highlights: c.principais,
      features: c.recursos,
      url: `${SITE.url}/#precos`,
    })),
    differentials: SO_NO_CHATAI,
    signup: `${SITE.url}/#precos`,
    last_updated: SITE.ultimaAtualizacao,
  });
}
