import { gerarLlmsTxt } from "@/lib/seo/llms";

/** `/llms-full.txt` — o `llms.txt` com o conteúdo completo, para assistentes de IA. */
export const dynamic = "force-static";

export function GET() {
  return new Response(gerarLlmsTxt(true), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
