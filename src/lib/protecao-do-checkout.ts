import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { origemDoCartao } from "@/lib/asaas/origem-cartao";

/**
 * Proteção do checkout público (auditoria de 04/11/2026, decisões de 11/11):
 *
 * 1. LIMITE POR ORIGEM. Sem conta, qualquer um chamava `tokenize-card` (teste de
 *    cartão roubado contra o Asaas, em nome desta conta) e `create-payment`
 *    (contas e organizações com teste grátis em volume). Janela deslizante em
 *    memória — a página roda num contêiner só —, por IP do cabeçalho que o proxy
 *    GRAVA (`ORIGEM_CARTAO_CABECALHO`, o mesmo do cartão; nunca o que o cliente
 *    escreve). Sem esse cabeçalho configurado, todos dividem um balde global
 *    largo: não trava a venda, mas põe teto no volume.
 *
 * 2. CAPTCHA (Cloudflare Turnstile), como o mercado faz no cadastro: liga quando
 *    `TURNSTILE_SECRET_KEY` está no `.env` (e `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
 *    no build da página). Sem a chave, nada muda — a atualização não exige
 *    editar o `.env`.
 */

type Janela = { limite: number; janelaMs: number };
export const LIMITES = {
  "tokenize-card": { limite: 10, janelaMs: 10 * 60 * 1000 },
  "create-payment": { limite: 5, janelaMs: 10 * 60 * 1000 },
} satisfies Record<string, Janela>;
const BALDE_GLOBAL = { limite: 120, janelaMs: 10 * 60 * 1000 };

const batidas = new Map<string, number[]>();

/** `true` = pode seguir. Guarda a batida. Exportada para teste. */
export function cabeNaJanela(
  chave: string,
  j: Janela,
  agora = Date.now(),
): boolean {
  const recentes = (batidas.get(chave) ?? []).filter(
    (t) => agora - t < j.janelaMs,
  );
  if (recentes.length >= j.limite) {
    batidas.set(chave, recentes);
    return false;
  }
  recentes.push(agora);
  batidas.set(chave, recentes);
  if (batidas.size > 10_000) {
    // Teto de memória: descarta as chaves mais antigas.
    for (const k of [...batidas.keys()].slice(0, 2_000)) batidas.delete(k);
  }
  return true;
}

export function esquecerBatidas(): void {
  batidas.clear();
}

export function limitarPorOrigem(
  req: NextRequest,
  rota: keyof typeof LIMITES,
  ambiente: Record<string, string | undefined> = process.env,
): NextResponse | null {
  const ip = origemDoCartao(req, ambiente);
  const ok = ip
    ? cabeNaJanela(`${rota}:${ip}`, LIMITES[rota])
    : cabeNaJanela(`${rota}:global`, BALDE_GLOBAL);
  if (ok) return null;
  return NextResponse.json(
    {
      error:
        "Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo.",
    },
    { status: 429, headers: { "Retry-After": "600" } },
  );
}

/** Confere o token do Turnstile quando a chave está configurada. */
export async function exigirHumano(
  req: NextRequest,
  token: unknown,
  ambiente: Record<string, string | undefined> = process.env,
  opts: { fetch?: typeof fetch } = {},
): Promise<NextResponse | null> {
  const segredo = (ambiente.TURNSTILE_SECRET_KEY ?? "").trim();
  if (!segredo) return null;
  const recusa = NextResponse.json(
    {
      error:
        "Não conseguimos confirmar que é você. Recarregue a página e tente de novo.",
      code: "captcha",
    },
    { status: 400 },
  );
  if (typeof token !== "string" || !token || token.length > 4096) return recusa;
  try {
    const corpo = new URLSearchParams({ secret: segredo, response: token });
    const ip = origemDoCartao(req, ambiente);
    if (ip) corpo.set("remoteip", ip);
    const res = await (opts.fetch ?? fetch)(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: corpo, signal: AbortSignal.timeout(5000) },
    );
    const json = (await res.json().catch(() => null)) as {
      success?: unknown;
    } | null;
    return json?.success === true ? null : recusa;
  } catch {
    // Cloudflare fora do ar: recusa (a chave está ligada, então o dono quer a prova).
    return recusa;
  }
}
