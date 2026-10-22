"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { CheckoutModal } from "./checkout/CheckoutModal";

type Period = 'mensal' | 'trimestral' | 'anual';

export function Pricing() {
  const [period, setPeriod] = useState<Period>('mensal');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ type: "essencial" | "impulso" | "escala"; value: number; period: Period }>({ type: "essencial", value: 89.9, period: "mensal" });
  const [organizationId, setOrganizationId] = useState("org_loading");

  useEffect(() => {
    let id = sessionStorage.getItem("chatai_org_id");
    if (!id) {
      id = `org_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem("chatai_org_id", id);
    }
    setOrganizationId(id);
  }, []);

  // Preços em centavos, por atendente por mês, no ciclo escolhido. Trimestral
  // tem 10% de desconto e anual 20% sobre o mensal. Espelha a tabela `plans`
  // do Supabase (atualizada em 22/10/2026), que é a fonte da verdade.
  const plans: Array<{
    slug: "essencial" | "impulso" | "escala";
    name: string;
    subtitle: string;
    highlight?: boolean;
    minAgents: number;
    sobConsulta?: boolean;
    pricesCents: Record<Period, number>;
    featuresHeadline?: string;
    features: string[];
  }> = [
    {
      slug: "essencial",
      name: "Essencial",
      subtitle: "Para quem atende sozinho",
      minAgents: 1,
      pricesCents: { mensal: 8990, trimestral: 8091, anual: 7192 },
      features: [
        "1 número de WhatsApp (QR code)",
        "Caixa de entrada compartilhada",
        "CRM Kanban com 1 funil",
        "Agenda com agendamento feito pelo agente",
        "1 agente de IA com base de conhecimento e memória",
        "Entende texto, áudio e foto",
        "Chatbot de menu",
        "Passagem da IA para atendente humano",
        "Radar de conversas, catálogo de produtos e importação de planilha",
        "Uso de IA incluso, com uso justo",
      ],
    },
    {
      slug: "impulso",
      name: "Impulso",
      subtitle: "Para equipes",
      highlight: true,
      minAgents: 3,
      pricesCents: { mensal: 14990, trimestral: 13491, anual: 11992 },
      featuresHeadline: "Tudo do Essencial, mais:",
      features: [
        "Até 3 números de WhatsApp (QR code)",
        "5 funis de vendas",
        "3 agentes de IA com fluxos visuais e skills",
        "Distribuição automática de leads",
        "Agente que organiza o CRM sozinho",
        "Comandas e índice de atrito",
        "API e webhooks",
        "Mais uso de IA incluso",
      ],
    },
    {
      slug: "escala",
      name: "Escala",
      subtitle: "Para alto volume de contatos",
      minAgents: 5,
      sobConsulta: true,
      pricesCents: { mensal: 21990, trimestral: 19791, anual: 17592 },
      featuresHeadline: "Tudo do Impulso, mais:",
      features: [
        "API oficial da Meta implantada pela nossa equipe",
        "Números, agentes e uso de IA sob medida",
        "Pensado para operações que recebem muitos contatos",
        "Mensagens da Meta cobradas direto no seu cartão",
      ],
    },
  ];

  const reais = (cents: number) =>
    (cents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <section className="bg-gradient-to-br from-[#1e1b4b] via-[#272370] to-[#312e81] py-24 relative" id="precos">
      {/* subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight">Planos para transformar<br />conversas em crescimento</h2>

          {/* Toggle */}
          <div className="inline-flex items-center justify-center p-1.5 bg-slate-800/80 backdrop-blur-sm rounded-full border border-slate-700/50 shadow-inner gap-1">
            <button
              onClick={() => setPeriod('mensal')}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${period === 'mensal' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Mensal
            </button>
            <button
              onClick={() => setPeriod('trimestral')}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-1 sm:gap-2 ${period === 'trimestral' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Trimestral
            </button>
            <button
              onClick={() => setPeriod('anual')}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-1 sm:gap-2 ${period === 'anual' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Anual <span className="bg-emerald-500/20 text-emerald-400 text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, idx) => {
            const currentCents = plan.pricesCents[period];
            const monthlyCents = plan.pricesCents.mensal;
            const months = period === "anual" ? 12 : period === "trimestral" ? 3 : 1;
            const periodText = period === "anual" ? "ano" : period === "trimestral" ? "trimestre" : "mês";
            // O valor do ciclo já conta o mínimo de atendentes do plano.
            const totalBilledCents = currentCents * months * plan.minAgents;
            const savingsCents = (monthlyCents - currentCents) * months * plan.minAgents;

            return (
              <div
                key={plan.name}
                className={`flex flex-col items-center text-center relative transition-all duration-500 rounded-2xl p-8 shadow-xl ${plan.highlight
                  ? 'bg-[#1e293b] border-2 border-white/30 z-10 lg:scale-105 shadow-[0_0_30px_rgba(99,102,241,0.2)]'
                  : 'bg-[#1e293b] border border-white/10 mt-4 lg:mt-6'
                  }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg whitespace-nowrap border border-indigo-500/50">
                    ⭐ Mais Escolhido
                  </div>
                )}

                <div className="mb-6 flex flex-col items-center">
                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                  <p className="text-[10px] font-bold tracking-widest uppercase mt-1 text-slate-400">
                    {plan.subtitle}
                  </p>
                </div>

                {plan.sobConsulta && (
                  <p className="text-xs text-slate-400 -mb-1">a partir de</p>
                )}
                <div className="mb-3 flex items-start justify-center gap-1 h-[60px] w-full">
                  <span className="text-xl font-medium text-slate-400 mt-2">R$</span>
                  <div className="relative overflow-hidden h-[60px] min-w-[90px]">
                     <span className="text-5xl font-bold text-white tracking-tighter block transition-transform duration-500">
                       {reais(currentCents)}
                     </span>
                  </div>
                  <div className="flex flex-col justify-end pb-2 ml-1 text-slate-400 text-xs text-left">
                    <span>por</span>
                    <span>atendente/mês</span>
                  </div>
                </div>

                <div className="h-12 mb-4 flex flex-col items-center w-full">
                   <div className="flex flex-col items-center gap-1.5">
                      <span className="text-xs text-slate-400">
                        {plan.sobConsulta
                          ? "Valor final conforme a sua operação"
                          : `Cobrado R$ ${reais(totalBilledCents)} por ${periodText}`}
                      </span>
                      {!plan.sobConsulta && savingsCents > 0 && (
                        <span className="inline-block w-fit bg-emerald-900/50 text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                           Economize R$ {reais(savingsCents)}
                        </span>
                      )}
                   </div>
                </div>

                <div className="border-b border-white/10 pb-6 mb-8 w-full">
                   <p className="text-xs text-slate-400 mb-6">
                     {plan.minAgents === 1
                       ? "1 atendente incluído"
                       : `Contratação mínima de ${plan.minAgents} atendentes`}
                   </p>

                   {plan.sobConsulta ? (
                     <Link
                       href="/contato"
                       className="w-full py-3.5 rounded-full text-center font-bold transition-all duration-300 text-sm shadow-lg block bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:opacity-90 hover:shadow-indigo-500/30"
                     >
                       Falar com a gente
                     </Link>
                   ) : (
                     <button
                       onClick={() => {
                          setSelectedPlan({ type: plan.slug, value: totalBilledCents / 100, period });
                          setIsModalOpen(true);
                       }}
                       className={`w-full py-3.5 rounded-full text-center font-bold transition-all duration-300 text-sm shadow-lg block
                          ${plan.highlight
                           ? 'bg-white text-slate-900 hover:bg-slate-100 hover:shadow-white/20'
                           : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:opacity-90 hover:shadow-indigo-500/30'
                         }`}
                     >
                       Começar teste grátis
                     </button>
                   )}
                </div>

                <p className={`text-[10px] font-bold tracking-widest uppercase mb-4 ${plan.highlight ? 'text-indigo-300' : 'text-slate-400'}`}>
                  {plan.featuresHeadline || "Recursos Incluídos:"}
                </p>

                <ul className="space-y-3.5 text-[13px] text-slate-300 flex-1">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 group cursor-default">
                      <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-400 transition-colors'}`} strokeWidth={2.5} />
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
            Essencial e Impulso incluem <strong className="text-white">7 dias de teste grátis</strong>. Cancele quando quiser. Sem taxa de setup.
            <br />
            O WhatsApp é conectado por QR code, como no WhatsApp Web. Para proteger o seu número, o sistema não faz disparo em massa: ele responde quem fala com você.
          </p>
        </div>
      </div>

      <CheckoutModal
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         organizationId={organizationId}
         planType={selectedPlan.type}
         planValue={selectedPlan.value}
         billingPeriod={selectedPlan.period}
      />
    </section>
  );
}
