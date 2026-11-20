import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo/site";

/** `/sitemap.xml` — as páginas públicas, com a data da última mudança de conteúdo. */
export default function sitemap(): MetadataRoute.Sitemap {
  return SITE.paginas.map((p) => ({
    // A home sem barra no fim: é como o Next imprime o canonical dela.
    url: `${SITE.url}${p.caminho === "/" ? "" : p.caminho}`,
    lastModified: SITE.ultimaAtualizacao,
    changeFrequency: p.caminho === "/" ? "weekly" : "monthly",
    priority: p.caminho === "/" ? 1 : p.caminho === "/sobre-nos" || p.caminho === "/contato" ? 0.6 : 0.3,
  }));
}
