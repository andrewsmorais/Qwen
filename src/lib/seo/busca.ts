import { PLANOS } from "@/lib/planos";
import { CARDS, PERGUNTAS_FREQUENTES, SO_NO_CHATAI } from "@/lib/oferta";
import { SITE, precoLegivel } from "@/lib/seo/site";

/**
 * A BUSCA INTERNA DO SITE — `/busca?q=...`.
 *
 * Procura no MESMO conteúdo que a página mostra: perguntas frequentes, planos e
 * seus recursos, diferenciais e as páginas do site. Não há banco nem serviço
 * externo: o índice nasce de `lib/oferta.ts`, `lib/planos.ts` e `SITE.paginas`,
 * então o que a busca acha é sempre o que está publicado.
 *
 * É ela que torna verdadeiro o `SearchAction` do JSON-LD do site: o Google e os
 * agentes de IA podem mandar alguém direto para `/busca?q=<termo>`.
 */
export type ResultadoDaBusca = {
  tipo: "Pergunta frequente" | "Plano" | "Diferencial" | "Página";
  titulo: string;
  trecho: string;
  url: string;
};

/** Minúsculas e sem acento: "preço" acha "preco", "Agendamento" acha "agendamento". */
export function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/** Palavras curtas e comuns não ajudam a achar nada. */
const PALAVRAS_VAZIAS = new Set([
  "a", "o", "as", "os", "de", "da", "do", "das", "dos", "e", "em", "no", "na", "nos", "nas",
  "um", "uma", "com", "por", "para", "pra", "que", "se", "ao", "eu", "meu", "minha", "voce",
  "como", "qual", "quais", "tem", "ter", "e", "ou",
]);

export function termosDaBusca(q: string): string[] {
  return [
    ...new Set(
      normalizar(q)
        .split(/[^a-z0-9]+/)
        .filter((t) => t.length >= 2 && !PALAVRAS_VAZIAS.has(t)),
    ),
  ];
}

/**
 * Palavras que o cliente usa e que a página diz de outro jeito. Pouco e
 * explícito: cada linha aqui é uma pergunta real que ficaria sem resposta.
 */
const SINONIMOS: Record<string, string[]> = {
  preco: ["custa", "mes"],
  precos: ["custa", "mes"],
  valor: ["custa", "mes"],
  valores: ["custa", "mes"],
  mensalidade: ["custa", "mes"],
  quanto: ["custa"],
  gratis: ["gratis", "teste"],
  robo: ["chatbot", "agente"],
  bot: ["chatbot"],
  zap: ["whatsapp"],
  zapzap: ["whatsapp"],
  agenda: ["agendamento", "agenda"],
  agendar: ["agendamento"],
  marcar: ["agendamento"],
  humano: ["atendente", "equipe"],
};

/** A raiz de uma palavra longa: "agendar" acha "agendamento", "atendentes" acha "atendente". */
function raiz(t: string): string {
  return t.length >= 6 ? t.slice(0, Math.max(5, t.length - 3)) : t;
}

/** Uma busca nunca é maior que isto: o resto é cortado, sem erro. */
export const TETO_DA_BUSCA = 120;

function indice(): Array<ResultadoDaBusca & { texto: string }> {
  const itens: ResultadoDaBusca[] = [
    ...PERGUNTAS_FREQUENTES.map((f) => ({
      tipo: "Pergunta frequente" as const,
      titulo: f.q,
      trecho: f.a,
      url: "/#ajuda",
    })),
    ...CARDS.map((c) => ({
      tipo: "Plano" as const,
      titulo: `${PLANOS[c.slug].name} — ${precoLegivel(c.slug)}`,
      trecho: `${c.descricao} ${[...c.principais, ...c.recursos].join(" · ")}`,
      url: "/#precos",
    })),
    ...SO_NO_CHATAI.map((d) => ({
      tipo: "Diferencial" as const,
      titulo: d.titulo,
      trecho: d.texto,
      url: "/#precos",
    })),
    ...SITE.paginas.map((p) => ({
      tipo: "Página" as const,
      titulo: p.titulo,
      trecho: p.descricao,
      url: p.caminho,
    })),
  ];
  return itens.map((i) => ({ ...i, texto: normalizar(`${i.titulo} ${i.trecho}`) }));
}

/**
 * Os resultados, do mais para o menos relevante. Acha quem tem QUALQUER termo
 * (quem digita uma frase não deve ficar sem nada), e ordena por quantos termos
 * casaram — no título valem o dobro.
 */
export function buscar(q: string, limite = 20): ResultadoDaBusca[] {
  const termos = termosDaBusca(q.slice(0, TETO_DA_BUSCA));
  if (termos.length === 0) return [];
  return indice()
    .map((item) => {
      const titulo = normalizar(item.titulo);
      let pontos = 0;
      for (const t of termos) {
        const formas = [raiz(t), ...(SINONIMOS[t] ?? [])];
        if (formas.some((f) => titulo.includes(f))) pontos += 2;
        else if (formas.some((f) => item.texto.includes(f))) pontos += 1;
      }
      return { item, pontos };
    })
    .filter((r) => r.pontos > 0)
    .sort((a, b) => b.pontos - a.pontos)
    .slice(0, limite)
    .map(({ item }) => ({ tipo: item.tipo, titulo: item.titulo, trecho: item.trecho, url: item.url }));
}
