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
      "Agendamento pela IA e pelo chatbot",
      "Agenda com Google Meet e aviso no seu WhatsApp",
      "Chatbot completo com modelos prontos",
      "Recuperação de carrinho e Pix das lojas (Shopify, Yampi, Kiwify…)",
      "Respostas rápidas com foto e áudio",
      "Caixa de entrada compartilhada e chat da equipe",
      "Radar de conversas e painel ao vivo",
      "Base de conhecimento para a IA",
      "IA que entende áudio e foto",
      "IA passa a conversa para o atendente",
      "Chat no site e aplicativo no celular",
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
      "IA que responde em grupos",
      "Automações com e-mail, foto e aviso à equipe",
      "Comandas e propostas",
      "Distribuição automática de leads",
      "Skills e processos para agentes de IA",
      "API e Webhooks",
      "Relatórios completos e metas",
    ],
  },
  {
    slug: "escala",
    tag: "Automatiza e integra",
    descricao: "Para operações com muitos contatos, equipe maior e controle avançado.",
    rotuloDaLista: "Tudo do Impulso, mais:",
    principais: [
      "6 números de WhatsApp",
      "3 agentes de IA",
      "3 chatbots",
      "CRM com 6 funis",
    ],
    recursos: [
      "Distribuição por número e por time",
      "Permissões avançadas e telefone oculto",
      "Logs e auditoria",
      "IA ligada ao banco de dados do seu sistema",
      "Marca própria",
      "Atendimento prioritário",
    ],
  },
];

/**
 * O que NENHUM plano inclui: cada uso gasta dinheiro de fora (busca paga,
 * minuto de telefone, voz sintetizada). É contratado à parte, com o suporte, e
 * o CRM só libera na conta em que o dono da plataforma ligou o extra.
 */
export const EXTRAS_A_PARTE: string[] = [
  "Prospecção automática de empresas",
  "Ligações por IA",
  "Respostas da IA em áudio",
  "API oficial do WhatsApp",
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
  `Impulso por ${brl(PLANOS.impulso.price_monthly)} por mês e Escala por ` +
  `${brl(PLANOS.escala.price_monthly)} por mês. No trimestral há 10% ` +
  "de desconto e no anual, 20%. Os três começam com 7 dias grátis no cartão de crédito (sem cobrança " +
  "durante o teste) e se contratam direto na página; no Pix ou boleto, a primeira cobrança é na hora.";

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
   q: "O ChatAI Online se integra com Shopify, Yampi, CartPanda, WooCommerce ou Wix?",
   a: "Sim, em todos os planos. Você cola o endereço do ChatAI na tela de webhooks da sua loja, e cada carrinho abandonado, Pix ou boleto gerado e pedido pago entra sozinho no CRM, com o produto, o valor e o link do checkout. Um follow-up chama o cliente no WhatsApp para recuperar a venda: no Essencial, com mensagem pronta; a partir do Impulso, também com a mensagem escrita pela IA. Kiwify, Hotmart e Cakto, que são plataformas de pagamento e de afiliados, se conectam do mesmo jeito, pelo webhook. A Nuvemshop está em breve."
 },
 {
   q: "Dá para saber qual campanha do Facebook, Google, TikTok, Pinterest ou Taboola trouxe a venda?",
   a: "Sim. Quem chega por um anúncio de clique para o WhatsApp, ou pelo link rastreável do ChatAI, fica com a campanha guardada no contato, e a tela Vendas por campanha mostra, para cada campanha, quantas pessoas chegaram, quantas avançaram no funil, quantas compraram e quanto faturou. Na Meta e no Google Ads, a venda ganha também volta para o anúncio como conversão, e ele passa a otimizar para quem compra."
},
{
   q: "O Agente consegue atender em outros idiomas?",
   a: "Com certeza. Nossos agentes de IA conseguem se comunicar e vender em mais de 50 idiomas nativamente."
}
];

/** Para quem o ChatAI Online foi feito — a página Sobre mostra, o `llms-full.txt` repete. */
export const SEGMENTOS: { titulo: string; texto: string }[] = [
  {
    titulo: "Barbearias, Salões de Beleza e Estética",
    texto:
      "Atendimento instantâneo com envio de catálogo de serviços e valores. Agendamento automático com horários disponíveis da equipe sem conflito de agenda. Lembretes preventivos de horário para zerar faltas e desistências.",
  },
  {
    titulo: "Comércio, Lojas e Varejo Local",
    texto:
      "Envio ágil de fotos de produtos, variações, tamanhos e valores. Resposta imediata para conferência de estoque, formas de pagamento e frete/entrega. Organização de pedidos com dados prontos para faturamento e envio.",
  },
  {
    titulo: "Clínicas, Consultórios e Especialistas",
    texto:
      "Triagem inicial de pacientes e direcionamento por tipo de consulta ou procedimento. Informações precisas sobre preparo de exames, localização e convênios aceitos. Organização de listas de espera para encaixes rápidos.",
  },
  {
    titulo: "Prestadores de Serviços e Manutenção",
    texto:
      "Coleta automática de fotos, vídeos e detalhes do serviço antes de passar o orçamento. Qualificação imediata do lead com agendamento de visita técnica no calendário. Histórico centralizado de negociações para acompanhamento de propostas pendentes.",
  },
];
