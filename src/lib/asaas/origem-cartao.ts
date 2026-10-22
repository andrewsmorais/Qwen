import { isIP } from "node:net";
import type { NextRequest } from "next/server";

/**
 * IP de quem está comprando, exigido pelo Asaas no pagamento com cartão.
 *
 * O NextRequest não expõe o socket do cliente, então o IP só pode vir de um
 * cabeçalho — e cabeçalho qualquer um forja. Por isso NENHUM cabeçalho é
 * aceito por padrão: o dono da instalação diz qual cabeçalho o proxy da frente
 * GRAVA (sobrescrevendo o que o cliente mandou) em `ORIGEM_CARTAO_CABECALHO`.
 *
 * Na VPS da Hostinger o proxy é o Traefik, que sobrescreve `X-Real-Ip` com o
 * endereço da conexão: `ORIGEM_CARTAO_CABECALHO=x-real-ip`. Isso só é seguro
 * se a aplicação NÃO for alcançável sem passar pelo proxy (porta publicada só
 * na rede interna do Docker). Não use `x-forwarded-for`: o Traefik acrescenta
 * ao valor que veio do cliente, e o primeiro item é o que o cliente escreveu.
 *
 * Em desenvolvimento local com o Asaas Sandbox segue valendo o IP fictício.
 */
export function origemDoCartao(
  req: NextRequest,
  ambiente: Record<string, string | undefined> = process.env,
): string | null {
  const cabecalho = (ambiente.ORIGEM_CARTAO_CABECALHO ?? "").trim().toLowerCase();
  if (cabecalho && cabecalho !== "x-forwarded-for") {
    const valor = (req.headers.get(cabecalho) ?? "").trim();
    // Um valor só, e que seja IP de verdade. Lista ou lixo = sem origem.
    if (valor && !valor.includes(",") && isIP(valor) !== 0) return valor;
    return null;
  }
  if (
    ambiente.NODE_ENV === "development" &&
    ambiente.ASAAS_BASE_URL === "https://api-sandbox.asaas.com" &&
    ["127.0.0.1", "localhost", "[::1]"].includes(req.nextUrl.hostname)
  ) {
    return "127.0.0.1";
  }
  return null;
}
