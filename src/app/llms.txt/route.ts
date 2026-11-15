import { gerarLlmsTxt } from "@/lib/seo/llms";

/** `/llms.txt` — gerado no build da mesma oferta que a página mostra. */
export const dynamic = "force-static";

export function GET() {
  return new Response(gerarLlmsTxt(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
