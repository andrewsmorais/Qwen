import { PLANOS, type Plano } from "@/lib/planos";

/**
 * A OFERTA, num lugar só: os cards de plano, os diferenciais e as perguntas
 * frequentes. A página mostra isto, e o que os robôs de IA leem (JSON-LD,
 * `llms.txt`, `/ai/*.json`) é gerado DAQUI — mudar o texto de um plano muda os
 * dois juntos, e nenhum robô cita preço ou recurso que a página não mostra.
 *
 * Os quatro números em destaque de cada card são o limite que o CRM conta e
 * barra (`lib/billing/catalogo.ts` no DeskcommCRM): mudar aqui sem mudar lá
 * vende uma coisa e entrega outra.
 */

export type CardDoPlano = {
  slug: Plano;
  tag: string;
  descricao: string;
  destaque?: boolean;
  rotuloDaLista: string;
  /** Os números do plano — o que o CRM conta. Vão em negrito. */
  principais: string[];
  recursos: string[];
};

export const CARDS: CardDoPlano[] = [
  {
    slug: "essencial",
    tag: "Organiza",
    descricao: "Para organizar atendimento, CRM e IA em uma única operação.",
    rotuloDaLista: "Recursos incluídos",
    principais: [
      "2 números de WhatsApp",
      "1 agente de IA",
      "1 chatbot",
      "CRM com 2 funis",
    ],
    recursos: [
      "Agendamento pela IA na conversa",
      "Agendamento pelo chatbot",
      "Agenda com Google Meet",
      "Radar de conversas",
      "Caixa de entrada compartilhada",
      "Base de conhecimento para a IA",
      "IA que entende áudio e foto",
      "IA passa a conversa para o atendente",
      "Relatórios essenciais",
    ],
  },
  {
    slug: "impulso",
    tag: "Acelera",
    descricao: "Para equipes que querem automatizar vendas e atendimento.",
    destaque: true,
    rotuloDaLista: "Tudo do Essencial, mais:",
    principais: [
      "4 números de WhatsApp",
      "2 agentes de IA",
      "2 chatbots",
      "CRM com 4 funis",
    ],
    recursos: [
      "Chatbot avançado",
      "Follow-up automático",
      "Agente que organiza o CRM sozinho",
      "Comandas e propostas",
      "Distribuição automática de leads",
      "Skills e processos para agentes de IA",
      "API e Webhooks",
      "Relatórios completos",
    ],
  },
  {
    slug: "escala",
    tag: "Automatiza e integra",
    descricao:
      "Para operações que precisam de implantação, controle e automação avançada.",
    rotuloDaLista: "Tudo do Impulso, mais:",
    principais: [
      "Implantação feita pela nossa equipe",
      "Agentes e chatbots configurados com você",
      "Opção de API oficial do WhatsApp",
      "Atendimento prioritário",
    ],
    recursos: [
      "A partir de 6 números de WhatsApp",
      "A partir de 3 agentes de IA e 3 chatbots",
      "A partir de 6 funis",
      "Distribuição por número e por time",
      "Permissões avançadas",
      "Logs e auditoria",
      "Marca própria",
    ],
  },
];

export const SO_NO_CHATAI: { titulo: string; texto: string }[] = [
  {
    titulo: "Agendamento automático",
    texto: "a IA marca o horário sem o cliente sair do WhatsApp",
  },
  { titulo: "Memória do agente", texto: "lembra do cliente da última conversa" },
  {
    titulo: "Radar de conversas",
    texto: "mostra quem está esperando e quem esfriou",
  },
  {
    titulo: "Importação de planilha",
    texto: "sobe sua lista de contatos de uma vez",
  },
  {
    titulo: "Catálogo de produtos",
    texto: "a IA responde preço e disponibilidade",
  },
  {
    titulo: "Agente que organiza o CRM",
    texto: "move no funil, etiqueta e cria tarefa (Impulso+)",
  },
];

/**
 * A frase que define o produto. É a resposta de "o que é o ChatAI Online?" —
 * a primeira coisa que uma IA deveria citar — e aparece igual na página (primeira
 * pergunta frequente), no JSON-LD e no `llms.txt`.
 */
export const DEFINICAO =
  "O ChatAI Online é um CRM com agentes de inteligência artificial e chatbot para o WhatsApp: atende os clientes 24 horas por dia, qualifica os contatos, agenda horários e organiza as vendas num funil, junto com a equipe humana.";

const brl = (centavos: number) =>
  (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** "Quanto custa?", tirado da mesma tabela que o checkout cobra. */
const RESPOSTA_DO_PRECO =
  `Há três planos: Essencial por ${brl(PLANOS.essencial.price_monthly)} por mês, ` +
  `Impulso por ${brl(PLANOS.impulso.price_monthly)} por mês e Escala a partir de ` +
  `${brl(PLANOS.escala.price_monthly)} por mês, com proposta sob medida. No trimestral há 10% ` +
  "de desconto e no anual, 20%. O Essencial e o Impulso começam com 7 dias grátis.";

/** As perguntas frequentes da página — a mesma lista vira o FAQPage do JSON-LD. */
export const PERGUNTAS_FREQUENTES: { q: string; a: string }[] = [
{
   q: "O que é o ChatAI Online?",
   a: DEFINICAO
},
{
   q: "Quanto custa o ChatAI Online?",
   a: RESPOSTA_DO_PRECO
},
{
   q: "A IA substitui minha equipe de vendas?",
   a: "Embora seja possível, recomendamos usar a IA para otimizar o atendimento, sem substituir o toque humano. O equilíbrio entre a inteligência artificial e sua equipe geralmente traz os melhores resultados."
},
{
   q: "É complicado treinar a Inteligência Artificial?",
   a: "Treine sua IA em minutos. O processo é feito de forma simples e natural, como se você estivesse ensinando um colega de trabalho, sem precisar de configurações manuais complexas."
},
{
   q: "Vocês ajudam na configuração da plataforma?",
   a: "Sim! Oferecemos suporte para ajudar na implementação, desde o treinamento da IA até a estruturação dos seus fluxos de atendimento e integração com suas ferramentas atuais."
},
{
   q: "Preciso ter conhecimento técnico ou saber programar?",
   a: "Definitivamente não. Nossa plataforma é totalmente visual e intuitiva. Além disso, nossa equipe está sempre disponível para te ajudar em qualquer etapa da configuração."
},
{
   q: "A IA funciona para processos de vendas mais complexos?",
   a: "Sim, a IA aprende com seus materiais (site, PDFs, FAQs) e se adapta ao seu negócio. Para vendas muito complexas, ela pode atuar qualificando o lead e agendando para um humano finalizar."
},
{
   q: "O Agente consegue atender em outros idiomas?",
   a: "Com certeza. Nossos agentes de IA conseguem se comunicar e vender em mais de 50 idiomas nativamente."
}
];
