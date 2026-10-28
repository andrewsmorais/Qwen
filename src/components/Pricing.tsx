"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckoutModal } from "./checkout/CheckoutModal";
import { PLANOS, selecionarPlano, type Plano, type Ciclo } from "@/lib/planos";

/**
 * Cards de planos — a MESMA promessa que o CRM libera
 * (`lib/billing/catalogo.ts` no DeskcommCRM). Os quatro números em destaque
 * de cada card são o limite que o CRM conta e barra: mudar aqui sem mudar lá
 * vende uma coisa e entrega outra.
 */
type Period = "mensal" | "trimestral" | "anual";
const periodos: Record<Period, { ciclo: Ciclo; meses: number; nome: string }> =
  {
    mensal: { ciclo: "monthly", meses: 1, nome: "mês" },
    trimestral: { ciclo: "quarterly", meses: 3, nome: "trimestre" },
    anual: { ciclo: "yearly", meses: 12, nome: "ano" },
  };
const reais = (valor: number) =>
  valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

type CardDoPlano = {
  slug: Plano;
  tag: string;
  descricao: string;
  destaque?: boolean;
  rotuloDaLista: string;
  /** Os números do plano — o que o CRM conta. Vão em negrito. */
  principais: string[];
  recursos: string[];
};

const CARDS: CardDoPlano[] = [
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

const SO_NO_CHATAI: { titulo: string; texto: string }[] = [
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

const UUID_RX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function Pricing() {
  const [period, setPeriod] = useState<Period>("mensal");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plano>("impulso");
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  const botaoDoPeriodo = (p: Period, rotulo: React.ReactNode) => (
    <button
      type="button"
      onClick={() => setPeriod(p)}
      className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 sm:px-6 sm:py-2.5 sm:text-sm ${
        period === p
          ? "bg-[#7c4dff] text-white shadow-md"
          : "text-[#a7a3c7] hover:text-white"
      }`}
    >
      {rotulo}
    </button>
  );

  return (
    <section
      className="relative bg-[#0d0b1f] bg-[radial-gradient(1200px_600px_at_50%_-10%,#2a1f63_0%,#0d0b1f_60%)] py-24 text-[#ecebf7]"
      id="precos"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-14 text-center">
          <h2 className="mb-8 text-3xl font-bold tracking-tight text-white md:text-5xl">
            Planos para transformar
            <br />
            conversas em crescimento
          </h2>

          <div className="inline-flex items-center justify-center gap-1 rounded-full border border-[#2c2752] bg-[#17142e] p-1.5">
            {botaoDoPeriodo("mensal", "Mensal")}
            {botaoDoPeriodo(
              "trimestral",
              <>
                Trimestral
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400 sm:text-[10px]">
                  -10%
                </span>
              </>,
            )}
            {botaoDoPeriodo(
              "anual",
              <>
                Anual
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400 sm:text-[10px]">
                  -20%
                </span>
              </>,
            )}
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl items-start gap-5 lg:grid-cols-3">
          {CARDS.map((card) => {
            const periodo = periodos[period];
            const selecao = selecionarPlano(card.slug, periodo.ciclo);
            const sobConsulta = selecao.plano.sob_consulta;
            // O Escala mostra sempre o "a partir de" mensal: o valor final é
            // da proposta, não do ciclo escolhido aqui.
            const precoDoMes = sobConsulta
              ? PLANOS[card.slug].price_monthly / 100
              : selecao.cycleCents / 100 / periodo.meses;
            const cheioNoCiclo =
              (PLANOS[card.slug].price_monthly / 100) * periodo.meses;
            const economia = cheioNoCiclo - selecao.value;

            return (
              <div
                key={card.slug}
                data-plano={card.slug}
                className={`rounded-[18px] bg-gradient-to-b from-[#1d1940] to-[#17142e] p-7 text-left ${
                  card.destaque
                    ? "border-[1.5px] border-[#a07bff] shadow-[0_0_0_4px_rgba(124,77,255,0.12)] lg:-mt-3.5"
                    : "border border-[#2c2752]"
                }`}
              >
                <h3 className="text-3xl font-medium text-white">
                  {selecao.plano.name}
                </h3>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#a07bff]">
                  {card.tag}
                </p>
                <p className="mb-5 mt-3.5 min-h-[46px] text-[15px] leading-relaxed text-[#a7a3c7]">
                  {card.descricao}
                </p>

                {sobConsulta ? (
                  <p className="text-sm text-[#a7a3c7]">a partir de</p>
                ) : null}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-semibold">R$</span>
                  <span className="text-[46px] font-bold leading-none tracking-tight text-white">
                    {reais(precoDoMes)}
                  </span>
                  <span className="text-sm text-[#a7a3c7]">/mês</span>
                </div>

                <div className="mb-5 mt-2 min-h-[44px] border-b border-[#2c2752] pb-3.5 text-[13px] text-[#a7a3c7]">
                  {sobConsulta ? (
                    "Proposta sob medida para a sua operação"
                  ) : period === "mensal" ? (
                    "7 dias grátis"
                  ) : (
                    <span className="flex flex-col gap-1.5">
                      <span>
                        7 dias grátis · cobrado {moeda.format(selecao.value)}{" "}
                        por {periodo.nome}
                      </span>
                      <span className="w-fit rounded-full border border-emerald-500/30 bg-emerald-900/40 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                        Economize {moeda.format(economia)} por {periodo.nome}
                      </span>
                    </span>
                  )}
                </div>

                {sobConsulta ? (
                  <Link
                    href="/contato"
                    className="block rounded-full bg-gradient-to-r from-[#6a3dff] to-[#8b5cff] py-3.5 text-center text-[17px] font-bold text-white transition-opacity hover:opacity-90"
                  >
                    Falar com especialista
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const orgParam = new URLSearchParams(
                        window.location.search,
                      ).get("org_id");
                      // A URL indica o destino; o servidor ainda exige sessão e vínculo.
                      setOrganizationId(
                        orgParam && UUID_RX.test(orgParam) ? orgParam : null,
                      );
                      setSelectedPlan(card.slug);
                      setIsModalOpen(true);
                    }}
                    className={`block w-full rounded-full py-3.5 text-center text-[17px] font-bold transition-opacity hover:opacity-90 ${
                      card.destaque
                        ? "bg-[#eeeaf9] text-[#1b1638]"
                        : "bg-gradient-to-r from-[#6a3dff] to-[#8b5cff] text-white"
                    }`}
                  >
                    Começar teste grátis
                  </button>
                )}

                <p className="mb-3 mt-6 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[#a7a3c7]">
                  {card.rotuloDaLista}
                </p>
                <ul className="space-y-0">
                  {[...card.principais, ...card.recursos].map((item, i) => (
                    <li
                      key={item}
                      className={`flex gap-2.5 py-1.5 text-[14.5px] leading-snug ${
                        i < card.principais.length
                          ? "font-semibold text-white"
                          : "text-[#dcd9f0]"
                      }`}
                    >
                      <span
                        aria-hidden
                        className="mt-[7px] h-[7px] w-[7px] flex-none rounded-full bg-[#a07bff]"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-7 max-w-6xl rounded-[18px] border border-[#2c2752] bg-[#17142e] p-6 sm:px-7">
          <h3 className="text-xl font-semibold text-white">Só no ChatAI</h3>
          <p className="mb-3.5 mt-1 text-sm text-[#a7a3c7]">
            O que você não encontra nas outras plataformas
          </p>
          <ul className="grid gap-x-7 md:grid-cols-2">
            {SO_NO_CHATAI.map((d) => (
              <li
                key={d.titulo}
                className="flex gap-2.5 py-1.5 text-[14.5px] leading-snug text-[#dcd9f0]"
              >
                <span
                  aria-hidden
                  className="mt-[7px] h-[7px] w-[7px] flex-none rounded-full bg-[#a07bff]"
                />
                <span>
                  <b className="text-white">{d.titulo}</b> — {d.texto}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-[#a7a3c7]">
          Essencial e Impulso incluem{" "}
          <strong className="text-white">7 dias de teste grátis</strong>.
          Uso de IA sem limite. Cancele quando quiser. Sem taxa de setup.
        </p>
      </div>

      <CheckoutModal
        key={`${selectedPlan}:${period}:${isModalOpen}`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        organizationId={organizationId}
        planType={selectedPlan}
        billingCycle={periodos[period].ciclo}
      />
    </section>
  );
}
