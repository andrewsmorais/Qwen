import type { NextRequest } from "next/server";

/**
 * IP fictício exclusivamente para homologação local. NextRequest não expõe o
 * socket do cliente e os headers encaminhados não têm fronteira de confiança
 * configurada neste projeto. Não tratar x-forwarded-for nem um campo do body
 * como origem atestada. A implantação de cartão exige resolver essa fronteira.
 */
export function origemDoCartao(req: NextRequest): string | null {
  if (
    process.env.NODE_ENV === "development" &&
    process.env.ASAAS_BASE_URL === "https://api-sandbox.asaas.com" &&
    ["127.0.0.1", "localhost", "[::1]"].includes(req.nextUrl.hostname)
  ) {
    return "127.0.0.1";
  }
  return null;
}
