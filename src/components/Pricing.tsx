"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { CheckoutModal } from "./checkout/CheckoutModal";

type Period = 'mensal' | 'trimestral' | 'anual';

export function Pricing() {
  const [period, setPeriod] = useState<Period>('mensal');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ type: "essencial" | "impulso" | "escala"; value: number }>({ type: "impulso", value: 159 });
  const [organizationId, setOrganizationId] = useState("org_loading");

  useEffect(() => {
    let id = sessionStorage.getItem("chatai_org_id");
    if (!id) {
      id = `org_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem("chatai_org_id", id);
    }
    setOrganizationId(id);
  }, []);

  const plans = [
    {
      name: "Essencial",
      subtitle: "Organiza",
      minAgents: 2,
      prices: {
        mensal: 107,
        trimestral: 97,
        anual: 86
      },
      features: [
        "2 Números de WhatsApp",
        "Caixa de entrada compartilhada",
        "CRM Kanban",
        "Chatbot visual",
        "Agentes IA",
        "Base de conhecimento",
        "Webchat",
        "Relatórios essenciais"
      ]
    },
    {
      name: "Impulso",
      subtitle: "Acelera",
      highlight: true,
      minAgents: 3,
      prices: {
        mensal: 159,
        trimestral: 143,
        anual: 127
      },
      featuresHeadline: "Tudo do Essencial, mais:",
      features: [
        "Até 3 Números de WhatsApp",
        "5 pipelines de vendas",
        "Chatbot avançado e Agendamento",
        "Campanhas em massa",
        "Distribuição automática de leads",
        "Agentes IA com processos",
        "Skills para IA",
        "API e Webhooks",
        "Relatórios completos",
        "Até 3 setores"
      ]
    },
    {
      name: "Escala",
      subtitle: "Automatiza e Integra",
      minAgents: 3,
      prices: {
        mensal: 234,
        trimestral: 211,
        anual: 187
      },
      featuresHeadline: "Tudo do Impulso, mais:",
      features: [
        "WhatsApps ilimitados",
        "Pipelines ilimitados",
        "Setores ilimitados",
        "Distribuição avançada",
        "Permissões avançadas",
        "Logs e auditoria",
        "Integrações avançadas para IA",
        "Multiunidade e multimarca",
        "Webchat avançado",
        "Atendimento Prime (VIP)"
      ]
    }
  ];

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
            const currentPrice = plan.prices[period];
            const monthlyPrice = plan.prices.mensal;
            const isAnnual = period === 'anual';
            const isQuarterly = period === 'trimestral';
            
            let savings = 0;
            let periodText = "";
            let totalBilled = 0;

            if (isAnnual) {
              savings = (monthlyPrice - currentPrice) * 12;
              totalBilled = currentPrice * 12;
              periodText = "ano";
            } else if (isQuarterly) {
              savings = (monthlyPrice - currentPrice) * 3;
              totalBilled = currentPrice * 3;
              periodText = "trimestre";
            }

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

                <div className="mb-3 flex items-start justify-center gap-1 h-[60px] w-full">
                  <span className="text-xl font-medium text-slate-400 mt-2">R$</span>
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
                   {period !== 'mensal' ? (
                     <div className="flex flex-col items-center gap-1.5">
                        <span className="text-xs text-slate-400">Cobrado R$ {totalBilled.toLocaleString('pt-BR')} por {periodText}</span>
                        <span className="inline-block w-fit bg-emerald-900/50 text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                           Economize R$ {savings.toLocaleString('pt-BR')}
                        </span>
                     </div>
                   ) : (
                      <span className="text-xs text-slate-400 block pt-1">Cobrado mensalmente</span>
                   )}
                </div>

                <div className="border-b border-white/10 pb-6 mb-8 w-full">
                   <p className="text-xs text-slate-400 mb-6">
                     Contratação mínima de {plan.minAgents} atendentes
                   </p>
                   
                   <button
                     onClick={() => {
                        setSelectedPlan({ type: plan.name.toLowerCase() as any, value: currentPrice });
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
            Todos os planos incluem <strong className="text-white">7 dias de teste grátis</strong>. Cancele quando quiser. Sem taxa de setup.
          </p>
        </div>
      </div>

      <CheckoutModal
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         organizationId={organizationId}
         planType={selectedPlan.type}
         planValue={selectedPlan.value}
      />
    </section>
  );
}
