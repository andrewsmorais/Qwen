import { PLANOS } from "@/lib/planos";
import { CARDS, PERGUNTAS_FREQUENTES, SO_NO_CHATAI } from "@/lib/oferta";
import { SITE, precoLegivel } from "@/lib/seo/site";

/**
 * O `llms.txt` (https://llmstxt.org): o resumo em Markdown que assistentes de IA
 * (ChatGPT, Claude, Perplexity) leem para entender o site sem renderizar a
 * página. O Google Search não o usa — para o Google valem a página e o JSON-LD.
 *
 * Gerado da mesma oferta que a página mostra (`lib/oferta.ts` + `lib/planos.ts`):
 * o arquivo estático antigo ficou com preço, plano e recurso de outra época, e é
 * exatamente isso que uma IA citaria.
 */
export function gerarLlmsTxt(): string {
  const l: string[] = [];
  l.push(`# ${SITE.nome}`, "", `> ${SITE.definicao}`, "");
  l.push(
    "Plataforma brasileira (SaaS), em português, para empresas de qualquer segmento — comércio, serviços, clínicas, salões e barbearias — atenderem e venderem pelo WhatsApp. O dono se cadastra sozinho, conecta o próprio número pelo QR Code e configura o agente de IA e o chatbot sem saber programar.",
    "",
  );
  l.push("## Páginas", "");
  for (const p of SITE.paginas) l.push(`- [${p.titulo}](${SITE.url}${p.caminho === "/" ? "" : p.caminho}): ${p.descricao}`);
  l.push(`- [Entrar no CRM](${SITE.crm}): acesso de quem já é cliente.`, "");

  l.push("## Planos e preços (BRL)", "");
  for (const card of CARDS) {
    const p = PLANOS[card.slug];
    l.push(`### ${p.name} — ${precoLegivel(card.slug)}`, "", card.descricao, "");
    for (const item of card.principais) l.push(`- ${item}`);
    if (card.rotuloDaLista.startsWith("Tudo do")) l.push("", `${card.rotuloDaLista}`, "");
    for (const item of card.recursos) l.push(`- ${item}`);
    l.push("");
  }
  l.push(
    "Trimestral com 10% de desconto e anual com 20%. Essencial e Impulso incluem 7 dias de teste grátis. Uso de IA sem limite, sem taxa de setup, cancele quando quiser.",
    "",
  );

  l.push("## Diferenciais", "");
  for (const d of SO_NO_CHATAI) l.push(`- **${d.titulo}**: ${d.texto}`);
  l.push("");

  l.push("## Perguntas frequentes", "");
  for (const f of PERGUNTAS_FREQUENTES) l.push(`### ${f.q}`, "", f.a, "");

  l.push("## Contato", "");
  l.push(`- E-mail: ${SITE.email}`);
  l.push(`- WhatsApp comercial: ${SITE.whatsappComercial}`);
  l.push(`- WhatsApp de suporte: ${SITE.whatsappSuporte}`);
  l.push(
    `- Endereço: ${SITE.endereco.rua}, CEP ${SITE.endereco.cep} – ${SITE.endereco.cidade}/${SITE.endereco.estado}, Brasil`,
  );
  l.push("", `Atualizado em ${SITE.ultimaAtualizacao}.`, "");
  return l.join("\n");
}
