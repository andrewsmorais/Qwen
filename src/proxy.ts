import { NextResponse, type NextRequest } from "next/server";

/**
 * A PÁGINA INICIAL EM MARKDOWN PARA QUEM PEDE MARKDOWN.
 *
 * Assistentes de IA que buscam a página ao vivo (para responder alguém) podem
 * pedir `Accept: text/markdown`. Para esses, a página inicial responde com o
 * resumo completo em Markdown (`/llms-full.txt`), que é o mesmo conteúdo, sem o
 * peso do HTML. Navegador e Googlebot pedem `text/html` e recebem a página de
 * sempre. `Vary: Accept` avisa os caches de que as duas respostas existem.
 */
export function proxy(request: NextRequest) {
  const aceita = request.headers.get("accept") ?? "";
  if (/\btext\/markdown\b/i.test(aceita) && !/\btext\/html\b/i.test(aceita)) {
    const resposta = NextResponse.rewrite(new URL("/llms-full.txt", request.url));
    resposta.headers.set("Vary", "Accept");
    // Nenhum cache compartilhado guarda esta versão: um proxy que ignore o
    // `Vary` não pode, nunca, servir Markdown a um navegador na página inicial.
    resposta.headers.set("Cache-Control", "private, no-store");
    return resposta;
  }
  const resposta = NextResponse.next();
  resposta.headers.set("Vary", "Accept");
  return resposta;
}

export const config = {
  matcher: "/",
};
