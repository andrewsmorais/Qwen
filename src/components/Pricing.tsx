"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { CheckoutModal } from "./checkout/CheckoutModal";
import { PLANOS, selecionarPlano, type Plano, type Ciclo } from "@/lib/planos";

type Period = "mensal" | "trimestral" | "anual";
const periodos: Record<Period, { ciclo: Ciclo; meses: number; nome: string }> =
  {
    mensal: { ciclo: "monthly", meses: 1, nome: "mês" },
    trimestral: { ciclo: "quarterly", meses: 3, nome: "trimestre" },
    anual: { ciclo: "yearly", meses: 12, nome: "ano" },
  };
const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function Pricing() {
  const [period, setPeriod] = useState<Period>("mensal");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plano>("impulso");
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  const plans: {
    slug: Plano;
    subtitle: string;
    highlight?: boolean;
    featuresHeadline?: string;
    features: string[];
  }[] = [
    {
      slug: "essencial",
      subtitle: "Organiza",
      features: [
        "2 Números de WhatsApp",
        "Caixa de entrada compartilhada",
        "CRM Kanban",
        "Fluxos de atendimento IA",
        "Agentes IA",
        "Base de conhecimento",

        "Relatórios essenciais",
      ],
    },
    {
      slug: "impulso",
      subtitle: "Acelera",
      highlight: true,
      featuresHeadline: "Tudo do Essencial, mais:",
      features: [
        "Até 3 Números de WhatsApp",
        "5 pipelines de vendas",
        "Fluxos avançados e Agendamento",
        "Campanhas em massa",
        "Distribuição automática de leads",
        "Agentes IA com processos",
        "Skills para IA",
        "API e Webhooks",
        "Relatórios completos",
      ],
    },
    {
      slug: "escala",
      subtitle: "Automatiza e Integra",
      featuresHeadline: "Tudo do Impulso, mais:",
      features: [
        "WhatsApps ilimitados",
        "Pipelines ilimitados",

        "Distribuição avançada",
        "Permissões avançadas",
        "Logs e auditoria",
        "Integrações avançadas para IA",
        "Multiunidade e multimarca",
        "API aberta para chat customizado",
        "Atendimento Prime (VIP)",
      ],
    },
  ];

  return (
    <section
      className="bg-gradient-to-br from-[#1e1b4b] via-[#272370] to-[#312e81] py-24 relative"
      id="precos"
    >
      {/* subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight">
            Planos para transformar
            <br />
            conversas em crescimento
          </h2>

          {/* Toggle */}
          <div className="inline-flex items-center justify-center p-1.5 bg-slate-800/80 backdrop-blur-sm rounded-full border border-slate-700/50 shadow-inner gap-1">
            <button
              onClick={() => setPeriod("mensal")}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${period === "mensal" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
            >
              Mensal
            </button>
            <button
              onClick={() => setPeriod("trimestral")}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-1 sm:gap-2 ${period === "trimestral" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
            >
              Trimestral
            </button>
            <button
              onClick={() => setPeriod("anual")}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-1 sm:gap-2 ${period === "anual" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
            >
              Anual{" "}
              <span className="bg-emerald-500/20 text-emerald-400 text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                -20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
          {plans.map((plan) => {
            const periodo = periodos[period];
            const selecao = selecionarPlano(
              plan.slug,
              periodo.ciclo,
              undefined,
            );
            const currentPrice = selecao.cycleCents / 100 / periodo.meses;
            const monthlyPrice = PLANOS[plan.slug].price_monthly / 100;
            const savings =
              monthlyPrice * periodo.meses * selecao.seats - selecao.value;
            const totalBilled = selecao.value;

            return (
              <div
                key={plan.slug}
                className={`flex flex-col items-center text-center relative transition-all duration-500 rounded-2xl p-8 shadow-xl ${
                  plan.highlight
                    ? "bg-[#1e293b] border-2 border-white/30 z-10 lg:scale-105 shadow-[0_0_30px_rgba(99,102,241,0.2)]"
                    : "bg-[#1e293b] border border-white/10 mt-4 lg:mt-6"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg whitespace-nowrap border border-indigo-500/50">
                    ⭐ Mais Escolhido
                  </div>
                )}

                <div className="mb-6 flex flex-col items-center">
                  <h3 className="text-2xl font-bold text-white">
                    {selecao.plano.name}
                  </h3>
                  <p className="text-[10px] font-bold tracking-widest uppercase mt-1 text-slate-400">
                    {plan.subtitle}
                  </p>
                </div>

                <div className="mb-3 flex items-start justify-center gap-1 h-[60px] w-full">
                  <span className="text-xl font-medium text-slate-400 mt-2">
                    R$
                  </span>
                  <div className="relative overflow-hidden h-[60px] min-w-[90px]">
                    <span className="text-6xl font-bold text-white tracking-tighter block transition-transform duration-500">
                      {currentPrice}
                    </span>
                  </div>
                  <div className="flex flex-col justify-end pb-2 ml-1 text-slate-400 text-xs text-left">
                    <span>por</span>
                    <span>atendente/mês</span>
                  </div>
                </div>

                <div className="h-12 mb-4 flex flex-col items-center w-full">
                  {period !== "mensal" ? (
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-xs text-slate-400">
                        Cobrado {moeda.format(totalBilled)} por {periodo.nome}
                      </span>
                      <span className="inline-block w-fit bg-emerald-900/50 text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                        Economize {moeda.format(savings)} por {periodo.nome}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 block pt-1">
                      Cobrado {moeda.format(totalBilled)} por mês
                    </span>
                  )}
                </div>

                <div className="border-b border-white/10 pb-6 mb-8 w-full">
                  <p className="text-xs text-slate-400 mb-6">
                    Contratação mínima de {selecao.plano.min_attendants}{" "}
                    atendentes
                  </p>

                  <button
                    onClick={() => {
                      const orgParam = new URLSearchParams(
                        window.location.search,
                      ).get("org_id");
                      // A URL indica o destino; o servidor ainda exige sessão e vínculo.
                      setOrganizationId(
                        orgParam &&
                          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
                            orgParam,
                          )
                          ? orgParam
                          : null,
                      );
                      setSelectedPlan(plan.slug);
                      setIsModalOpen(true);
                    }}
                    className={`w-full py-3.5 rounded-full text-center font-bold transition-all duration-300 text-sm shadow-lg block
                        ${
                          plan.highlight
                            ? "bg-white text-slate-900 hover:bg-slate-100 hover:shadow-white/20"
                            : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:opacity-90 hover:shadow-indigo-500/30"
                        }`}
                  >
                    Começar teste grátis
                  </button>
                </div>

                <p
                  className={`text-[10px] font-bold tracking-widest uppercase mb-4 ${plan.highlight ? "text-indigo-300" : "text-slate-400"}`}
                >
                  {plan.featuresHeadline || "Recursos Incluídos:"}
                </p>

                <ul className="space-y-3.5 text-[13px] text-slate-300 flex-1">
                  {plan.features.map((feat, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 group cursor-default"
                    >
                      <CheckCircle2
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlight ? "text-indigo-400" : "text-slate-400 group-hover:text-indigo-400 transition-colors"}`}
                        strokeWidth={2.5}
                      />
                      <span className="leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center max-w-2xl mx-auto">
          <p className="text-slate-400 text-sm">
            Todos os planos incluem{" "}
            <strong className="text-white">7 dias de teste grátis</strong>.
            Cancele quando quiser. Sem taxa de setup.
          </p>
        </div>
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
