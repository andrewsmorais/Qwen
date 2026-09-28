import Link from "next/link";
import { Pricing } from "@/components/Pricing";
import { Header } from "@/components/Header";
import { 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  Zap, 
  Bot, 
  Clock, 
  Database, 
  TrendingUp,
  Check,
  X,
  Play,
  ChevronDown,
  Menu,
  Sparkles,
  BadgeCheck,
  BellOff,
  Package,
  LayoutDashboard,
  Building2
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-500/30">
      {/* HEADER */}
      <Header />

      <main>
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#1e1b4b]">
          {/* Background Gradients */}
          <div className="absolute top-0 left-0 w-[800px] h-[600px] bg-indigo-500/20 rounded-full blur-[150px] -z-10 pointer-events-none" />
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-purple-500/15 rounded-full blur-[150px] -z-10 pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-8 items-center">
              {/* Left Column - Text */}
              <div className="lg:col-span-7 relative z-10 max-w-none lg:max-w-[110%]">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-6 md:mb-8 backdrop-blur-sm">
                  CRM + Agente de Vendas
                </div>
                
                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-[4rem] font-bold tracking-tight mb-4 md:mb-6 leading-[1.15] text-white">
                  Transforme conversas no WhatsApp em <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">faturamento todos os dias.</span>
                </h1>
                
                <p className="text-sm sm:text-base md:text-lg text-indigo-100/70 mb-6 md:mb-8 leading-relaxed max-w-2xl">
                  Atenda centenas de clientes simultaneamente sem fila de espera. Nossa IA negocia com a voz da sua marca e conduz o cliente direto até o fechamento da compra.
                </p>
                
                {/* Botão desktop */}
                <div className="hidden lg:flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Link 
                    href="#precos" 
                    className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 px-8 py-4 rounded-full text-base font-bold transition-all shadow-xl shadow-black/20 w-full sm:w-auto"
                  >
                    Ver Planos e Começar
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>


              {/* Right Column - Smartphone Mockup */}
              <div className="lg:col-span-5 relative mx-auto w-full max-w-[300px] sm:max-w-[340px] lg:max-w-[480px] z-10">
                <img src="/hero-phone.png" alt="ChatAI Online WhatsApp" className="w-full h-auto drop-shadow-2xl" />
              </div>
            </div>

            {/* Botão mobile - aparece abaixo do celular */}
            <div className="flex lg:hidden justify-center mt-8">
              <Link 
                href="#precos" 
                className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 px-8 py-4 rounded-full text-base font-bold transition-all shadow-xl shadow-black/20 w-full sm:w-auto"
              >
                Ver Planos e Começar
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 2: Features (Umbler Style) */}
        <section id="produto" className="bg-[#f8fafc] text-slate-900 py-28 md:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-24 max-w-4xl mx-auto tracking-tight text-slate-900">
              Transforme seu atendimento em uma máquina de vendas
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 lg:p-8 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                <h3 className="text-lg lg:text-xl font-bold mb-2 tracking-tight text-slate-900">
                  Atendimento que nunca dorme
                </h3>
                <p className="text-slate-500 leading-relaxed text-sm mb-6">
                  Sua IA responde clientes às 3h da manhã, no feriado e no fim de semana. Nunca mais perca uma venda por demora no atendimento.
                </p>
                <div className="h-40 bg-slate-50/50 rounded-xl border border-slate-100 flex flex-col justify-center p-5 relative overflow-hidden mt-auto">
                   <div className="absolute top-3 right-3 bg-emerald-100/80 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                     Online 24h
                   </div>
                   <div className="bg-[#d9fdd3] p-3 rounded-2xl rounded-tr-sm shadow-sm w-[85%] ml-auto relative mt-6 border border-[#c8f0c2]">
                      <p className="text-sm text-slate-800 font-medium">Olá! Como posso ajudar você agora?</p>
                      <div className="text-[10px] text-emerald-700/70 text-right mt-1.5 font-medium">03:14 AM ✓✓</div>
                   </div>
                </div>
              </div>
              
              {/* Card 2 */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 lg:p-8 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                <h3 className="text-lg lg:text-xl font-bold mb-2 tracking-tight text-slate-900">
                  IA treinada com o DNA do seu negócio
                </h3>
                <p className="text-slate-500 leading-relaxed text-sm mb-6">
                  Faça upload de PDFs, site e documentos. Em minutos, sua IA sabe tudo sobre seus produtos, preços e políticas como seu melhor vendedor.
                </p>
                <div className="h-40 bg-slate-50/50 rounded-xl border border-slate-100 flex flex-col items-center justify-center p-5 relative overflow-hidden space-y-4 mt-auto">
                   <div className="flex gap-3">
                      <div className="bg-white border border-slate-200 text-slate-600 shadow-sm text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-2">
                         <div className="w-4 h-4 rounded bg-red-100 flex items-center justify-center text-[8px] font-bold text-red-600">PDF</div>
                         catalogo.pdf
                      </div>
                      <div className="bg-white border border-slate-200 text-slate-600 shadow-sm text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-2">
                         <div className="w-4 h-4 rounded bg-green-100 flex items-center justify-center text-[8px] font-bold text-green-600">XLS</div>
                         precos.xlsx
                      </div>
                   </div>
                   <div className="flex items-center gap-2 text-indigo-700 bg-indigo-50 px-4 py-2 rounded-full shadow-sm border border-indigo-100 text-xs font-bold mt-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                      Treinamento concluído
                   </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 lg:p-8 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                <h3 className="text-lg lg:text-xl font-bold mb-2 tracking-tight text-slate-900">
                  Do primeiro &apos;oi&apos; ao fechamento
                </h3>
                <p className="text-slate-500 leading-relaxed text-sm mb-6">
                  Sua IA não apenas tira dúvidas. Ela qualifica leads, apresenta produtos, envia links de pagamento e conduz o cliente até a compra.
                </p>
                <div className="h-40 bg-slate-50/50 rounded-xl border border-slate-100 flex flex-col items-center justify-center p-5 relative overflow-hidden w-full mt-auto">
                   <div className="flex flex-col w-full max-w-[220px]">
                      <div className="bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-2.5 rounded-lg text-center shadow-sm relative z-10">
                         Novo Lead
                      </div>
                      <div className="flex justify-center -my-1 relative z-0">
                         <div className="w-0.5 h-4 bg-indigo-200"></div>
                      </div>
                      <div className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold px-3 py-2.5 rounded-lg text-center shadow-sm relative z-10">
                         Qualificado por IA
                      </div>
                      <div className="flex justify-center -my-1 relative z-0">
                         <div className="w-0.5 h-4 bg-emerald-200"></div>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-2.5 rounded-lg text-center shadow-sm relative z-10">
                         Pix Gerado / Venda Fechada
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Como funciona */}
        <section className="bg-slate-50 text-slate-900 py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 tracking-tight">
                  Mais que um atendimento: uma operação de vendas no seu WhatsApp.
                </h2>
                <p className="text-base md:text-lg text-slate-500 mb-6 md:mb-8 leading-relaxed">
                  Elimine a perda de vendas por demora na resposta. A nossa IA assume a linha de frente do seu negócio em qualquer segmento.
                </p>
                
                <ul className="space-y-4">
                  {[
                    { title: "Vendas Diretas & E-commerce:", text: "Envia fotos de produtos, calcula fretes, recomenda itens e entrega links de pagamento Pix ou cartão na hora." },
                    { title: "Suporte & Dúvidas Rápidas:", text: "Responde sobre horários, políticas de troca, endereços e informações técnicas sem deixar o cliente em espera." },
                    { title: "Agendamento Automático:", text: "Bloqueia horários e organiza a rotina de barbearias, salões, clínicas de estética e consultórios." },
                    { title: "Qualificação de Orçamentos:", text: "Filtra leads para prestadores de serviços, oficinas, corretores e advogados antes do atendimento humano." }
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span className="font-medium text-slate-600 text-sm md:text-base">
                        <strong className="text-slate-800">{item.title}</strong> {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-10">
                  <Link href="/app" className="text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-2 transition-colors">
                    Conheça todas as funcionalidades <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              
              {/* Phone Mockup */}
              <div className="relative mx-auto w-full max-w-[350px]">
                <div className="absolute inset-0 bg-indigo-200/50 rounded-full blur-[100px] -z-10"></div>
                <div className="rounded-[2.5rem] border-[8px] border-slate-200 shadow-2xl bg-white overflow-hidden aspect-[9/19] flex flex-col relative">
                   <div className="bg-slate-100 p-4 border-b border-slate-200 text-center font-semibold text-sm">
                      WhatsApp CRM
                   </div>
                   <div className="flex-1 bg-[#efeae2] p-4 flex flex-col gap-3 justify-end pb-10">
                      <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm text-sm self-start max-w-[80%]">
                        Quais as formas de pagamento?
                      </div>
                      <div className="bg-[#d9fdd3] p-3 rounded-2xl rounded-tr-sm shadow-sm text-sm self-end max-w-[80%] relative">
                        <div className="font-semibold text-indigo-600 text-xs mb-1">IA Assistente</div>
                        Aceitamos Pix, Cartão de Crédito em até 12x e Boleto. Posso gerar o link de pagamento do plano Pro para você?
                      </div>
                      <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm text-sm self-start max-w-[80%]">
                        Pode sim!
                      </div>
                      <div className="bg-[#d9fdd3] p-3 rounded-2xl rounded-tr-sm shadow-sm text-sm self-end max-w-[80%] relative">
                        <div className="font-semibold text-indigo-600 text-xs mb-1">IA Assistente</div>
                        Perfeito! Aqui está: pay.link/123 🚀
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Inteligência Artificial na prática */}
        <section id="solucoes" className="bg-white text-slate-900 py-24 overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 tracking-tight">Inteligência Artificial na prática do seu negócio</h2>
            <p className="text-base md:text-lg text-slate-500">Veja como é simples configurar seu clone virtual em poucos minutos.</p>
          </div>
          
          <div className="max-w-5xl mx-auto px-6 space-y-24">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-12">
               <div className="flex-1 order-2 md:order-1 relative">
                  <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm relative">
                     <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-4 w-fit border border-slate-100">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold">PDF</div>
                        <div>
                           <p className="font-semibold text-sm">catalogo_2026.pdf</p>
                           <p className="text-xs text-slate-500">Processado com sucesso</p>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-4" />
                     </div>
                  </div>
                  <div className="absolute -top-6 -left-6 text-[8rem] font-bold text-slate-100 -z-10 leading-none">01</div>
               </div>
               <div className="flex-1 order-1 md:order-2">
                  <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 tracking-tight">Conhecimento</h3>
                  <p className="text-sm md:text-base text-slate-500 leading-relaxed">
                    Alimente a IA com o conhecimento da sua empresa. Basta arrastar arquivos PDF, documentos de texto ou colar o link do seu site. Em poucos segundos a IA já sabe tudo sobre você.
                  </p>
               </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center gap-12">
               <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 tracking-tight">Comportamento</h3>
                  <p className="text-sm md:text-base text-slate-500 leading-relaxed">
                    Defina o tom de voz e as diretrizes do seu agente. Você pode instruí-lo a ser formal, descontraído, usar emojis, e qual o objetivo principal (vender, agendar, dar suporte).
                  </p>
               </div>
               <div className="flex-1 relative">
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm relative">
                     <div className="bg-white rounded-xl shadow-md p-4 space-y-3 border border-slate-100">
                        <div className="h-2 w-20 bg-slate-200 rounded"></div>
                        <div className="h-20 w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs text-slate-500 font-mono">
                          &quot;Você é um vendedor persuasivo. Seu objetivo é qualificar o lead e enviar o link de checkout. Seja educado e use emojis moderadamente.&quot;
                        </div>
                     </div>
                  </div>
                  <div className="absolute -top-6 -right-6 text-[8rem] font-bold text-slate-100 -z-10 leading-none">02</div>
               </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-12">
               <div className="flex-1 order-2 md:order-1 relative">
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
                     <div className="bg-white rounded-xl shadow-md p-4 space-y-4 border border-slate-100">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="font-semibold text-sm">Funil de Vendas</span>
                          <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-medium">Ativo</span>
                        </div>
                        <div className="flex gap-2">
                           <div className="w-1/3 h-16 bg-indigo-50 rounded-lg border border-indigo-100 flex flex-col items-center justify-center text-xs text-indigo-700 font-medium"><span className="text-lg font-bold">142</span> Leads</div>
                           <div className="w-1/3 h-16 bg-purple-50 rounded-lg border border-purple-100 flex flex-col items-center justify-center text-xs text-purple-700 font-medium"><span className="text-lg font-bold">85</span> Em Aten.</div>
                           <div className="w-1/3 h-16 bg-emerald-50 rounded-lg border border-emerald-100 flex flex-col items-center justify-center text-xs text-emerald-700 font-medium"><span className="text-lg font-bold">32</span> Vendas</div>
                        </div>
                     </div>
                  </div>
                  <div className="absolute -top-6 -left-6 text-[8rem] font-bold text-slate-100 -z-10 leading-none">03</div>
               </div>
               <div className="flex-1 order-1 md:order-2">
                  <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 tracking-tight">Ação</h3>
                  <p className="text-sm md:text-base text-slate-500 leading-relaxed mb-6">
                    Pronto! Conecte seu número de WhatsApp e veja a mágica acontecer. Acompanhe todas as conversas em tempo real pelo painel CRM.
                  </p>
                  <Link href="/app" className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-semibold transition-all shadow-lg shadow-indigo-600/20">
                     Criar meu Agente
                  </Link>
               </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: A única solução */}
        <section className="bg-slate-50 text-slate-900 py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
               <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 tracking-tight">
                    A única solução de WhatsApp que você vai precisar
                  </h2>
                  <p className="text-base md:text-lg text-slate-500 mb-6 md:mb-8 leading-relaxed">
                    Chega de pagar várias ferramentas separadas. O ChatAI Online centraliza atendimento, IA e vendas para sua operação decolar.
                  </p>
                  <Link href="#precos" className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full text-base font-semibold transition-all shadow-lg shadow-indigo-600/20">
                    Ver Planos
                  </Link>
               </div>
               
               <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <ul className="space-y-6">
                     {[
                        "Disparos inteligentes e notificações segmentadas para sua base",
                        "Múltiplos atendentes humanos no mesmo número com agente AI",
                        "Relatórios avançados e métricas de conversão (Em breve: integração com Meta e Google Ads)",
                        "Tags, etiquetas e organização visual em Kanban (Funil)",
                        "Integração facilitada via API e Webhooks para e-commerce"
                     ].map((item, i) => (
                        <li key={i} className="flex items-center gap-4">
                           <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                              <CheckCircle2 className="w-4 h-4 text-indigo-600" strokeWidth={2.5} />
                           </div>
                           <span className="font-medium text-slate-600 text-sm md:text-lg">{item}</span>
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: Comparação Agente IA vs Equipe */}
        <section className="bg-white text-slate-900 py-24 relative">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-20">
               <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 tracking-tight">O equilíbrio perfeito entre escala e proximidade</h2>
               <p className="text-base md:text-lg text-slate-500">Veja como a Inteligência Artificial executa o atendimento completo enquanto você foca na gestão e no crescimento do negócio.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
               {/* Left Column - Agente de IA (Highlighted) */}
               <div className="bg-[#1e1b4b] p-10 md:p-12 flex flex-col h-full rounded-2xl border border-indigo-400/20 shadow-[0_8px_40px_-12px_rgba(99,102,241,0.25)] relative overflow-hidden">
                  {/* Subtle glow effect */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-400/10 rounded-full blur-[60px] -z-0 pointer-events-none" />
                  
                  <div className="flex flex-col items-center mb-10 relative z-10">
                     <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/30 p-1">
                        <img src="/logo.png" alt="ChatAI Online" className="w-full h-full object-cover rounded-xl" />
                     </div>
                     <div className="w-8 h-1 bg-indigo-400 rounded-full mb-4"></div>
                     <h3 className="text-2xl font-bold tracking-tight text-white">Agente de IA</h3>
                  </div>
                  
                  <ul className="space-y-6 flex-1 relative z-10">
                     {[
                        { icon: <Zap className="w-5 h-5" />, title: "Disponibilidade total:", text: "Atendimento instantâneo 24h por dia, sem fila de espera, inclusive madrugadas e feriados." },
                        { icon: <Sparkles className="w-5 h-5" />, title: "Empatia e negociação ativa:", text: "Treinado no prompt para entender gírias, contornar objeções com calma e conversar de forma humanizada." },
                        { icon: <BadgeCheck className="w-5 h-5" />, title: "Fechamento de ponta a ponta:", text: "Envia catálogos, responde dúvidas complexas, gera links de pagamento e confirma pedidos no WhatsApp." },
                        { icon: <TrendingUp className="w-5 h-5" />, title: "Papel principal:", text: "Ser o vendedor de elite da sua empresa, qualificando e fechando vendas no piloto automático." }
                     ].map((item, i) => (
                        <li key={i} className="flex items-start gap-4">
                           <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0 text-indigo-300 shadow-sm backdrop-blur-sm">
                              {item.icon}
                           </div>
                           <span className="text-indigo-100 font-medium text-sm md:text-base leading-relaxed pt-2">
                              <strong className="text-white">{item.title}</strong> {item.text}
                           </span>
                        </li>
                     ))}
                  </ul>
               </div>

               {/* Right Column - Sua Equipe e Operação */}
               <div className="bg-[#1e1b4b] p-10 md:p-12 flex flex-col h-full rounded-2xl border border-indigo-400/10 shadow-lg relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-[60px] -z-0 pointer-events-none" />
                  
                  <div className="flex flex-col items-center mb-10 relative z-10">
                     <div className="flex mb-5">
                        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&q=80" alt="Equipe 1" className="w-14 h-14 rounded-full border-[3px] border-[#2d2a5e] object-cover shadow-md z-30" />
                        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&q=80" alt="Equipe 2" className="w-14 h-14 rounded-full border-[3px] border-[#2d2a5e] object-cover shadow-md -ml-4 z-20" />
                        <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&q=80" alt="Equipe 3" className="w-14 h-14 rounded-full border-[3px] border-[#2d2a5e] object-cover shadow-md -ml-4 z-10" />
                     </div>
                     <div className="w-8 h-1 bg-slate-400/40 rounded-full mb-4"></div>
                     <h3 className="text-2xl font-bold text-indigo-100 tracking-tight">Sua Equipe e Operação</h3>
                  </div>
                  
                  <ul className="space-y-6 flex-1 relative z-10">
                     {[
                        { icon: <BellOff className="w-5 h-5" />, title: "Fim das interrupções:", text: "Zero tempo perdido digitando as mesmas respostas o dia inteiro no celular." },
                        { icon: <Package className="w-5 h-5" />, title: "Foco na entrega:", text: "Total liberdade para cuidar do atendimento presencial, prestação do serviço e gestão do estoque." },
                        { icon: <LayoutDashboard className="w-5 h-5" />, title: "Acompanhamento no Kanban:", text: "Visão clara de todos os clientes no funil de vendas e confirmação das negociações fechadas pela IA." },
                        { icon: <Building2 className="w-5 h-5" />, title: "Papel principal:", text: "Escalar a qualidade do produto e o faturamento do negócio sem precisar inchar custos operacionais." }
                     ].map((item, i) => (
                        <li key={i} className="flex items-start gap-4">
                           <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-slate-400">
                              {item.icon}
                           </div>
                           <span className="text-indigo-100/90 font-medium text-sm md:text-base leading-relaxed pt-2">
                              <strong className="text-white">{item.title}</strong> {item.text}
                           </span>
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: Integrações */}
        <section id="integracoes" className="bg-gradient-to-br from-[#1e1b4b] via-[#272370] to-[#312e81] py-24 relative overflow-hidden">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
           
           <div className="max-w-5xl mx-auto px-6 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                 Se integra com as principais ferramentas do mercado
              </h2>
              <p className="text-base md:text-lg text-slate-400 mb-14">
                 Conecte seu CRM às plataformas que você já usa
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-10">
                 {[
                    { name: 'Shopify', domain: 'shopify.com' },
                    { name: 'Nuvemshop', domain: 'nuvemshop.com.br', badge: 'Nativo' },
                    { name: 'CartPanda', domain: 'cartpanda.com' },
                    { name: 'WooCommerce', domain: 'woocommerce.com' },
                    { name: 'Yampi', domain: 'yampi.com.br' },
                    { name: 'Meta', domain: 'meta.com' },
                    { name: 'Google Ads', domain: 'ads.google.com' },
                    { name: 'Hotmart', domain: 'hotmart.com' },
                    { name: 'Kiwify', domain: 'kiwify.com.br' },
                    { name: 'RD Station', domain: 'rdstation.com' },
                    { name: 'Mercado Pago', domain: 'mercadopago.com.br' },
                    { name: 'Zapier', domain: 'zapier.com' },
                 ].map(tool => (
                    <div key={tool.name} className="relative flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-xl p-5 w-full hover:border-indigo-500 hover:-translate-y-1 transform transition-all duration-300 cursor-pointer group shadow-lg">
                       {tool.badge && (
                          <span className="absolute -top-2.5 right-2 bg-indigo-600 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border border-indigo-500/50 shadow-sm shadow-indigo-600/30 z-10">
                             {tool.badge}
                          </span>
                       )}
                       <img src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=128`} alt={tool.name} className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform rounded-md bg-white p-1 object-contain" />
                       <span className="text-slate-300 text-sm font-medium">{tool.name}</span>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* SECTION 8: Pricing */}
        <Pricing />

        {/* SECTION 9: FAQ */}
        <section className="bg-white py-24 text-slate-900" id="ajuda">
           <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 tracking-tight">Dúvidas frequentes</h2>
              
              <div className="space-y-0 border border-slate-200 rounded-2xl overflow-hidden">
                 {[
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
                 ].map((item, i) => (
                    <details key={i} name="faq-accordion" className="group border-b border-slate-200 last:border-0">
                       <summary className="flex items-center justify-between px-6 py-5 font-semibold text-slate-800 cursor-pointer list-none text-base md:text-lg hover:bg-slate-50 transition-colors">
                          {item.q}
                          <ChevronDown className="w-5 h-5 text-slate-400 transition-transform duration-300 group-open:rotate-180 flex-shrink-0 ml-4" />
                       </summary>
                       <div className="grid grid-rows-[0fr] group-open:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out">
                          <div className="overflow-hidden">
                             <p className="text-slate-500 text-sm md:text-base leading-relaxed px-6 pb-5">
                                {item.a}
                             </p>
                          </div>
                       </div>
                    </details>
                 ))}
              </div>
           </div>
        </section>

        {/* SECTION 10: CTA Final */}
        <section className="bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#1e1b4b] py-24 text-center">
           <div className="max-w-3xl mx-auto px-6">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 tracking-tight">
                 A corrida da <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Inteligência Artificial</span> já começou.
              </h2>
              <p className="text-base md:text-xl text-indigo-200/70 mb-8 md:mb-10">Não fique para trás. Escolha o plano ideal e turbine as vendas do seu negócio hoje mesmo.</p>
              <Link href="#precos" className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 px-10 py-4 rounded-full text-lg font-bold transition-all shadow-xl shadow-black/20">
                 Ver Planos <ArrowRight className="w-5 h-5" />
              </Link>
           </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8 text-slate-500">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
               <div className="col-span-2 lg:col-span-2">
                  <div className="flex items-center gap-2 mb-6 text-slate-900">
                     <img src="/logo.png" alt="Chat AI Online Logo" className="w-10 h-10 object-cover rounded-xl shadow-sm" />
                     <span className="font-bold text-xl tracking-tight">
                        Chat<span className="text-indigo-600 font-black">AI</span> <span className="font-medium text-slate-500 text-lg">Online</span>
                     </span>
                  </div>
                  <p className="text-sm text-slate-400 max-w-xs mb-6">
                     Plataforma completa de atendimento e vendas para o WhatsApp da sua empresa, potencializada por IA.
                  </p>
               </div>
               
               <div>
                  <h4 className="font-semibold text-slate-900 mb-4">Produto</h4>
                  <ul className="space-y-3 text-sm">
                     <li><Link href="#produto" className="hover:text-indigo-600 transition-colors">Funcionalidades</Link></li>
                     <li><Link href="#integracoes" className="hover:text-indigo-600 transition-colors">Integrações</Link></li>
                     <li><Link href="#precos" className="hover:text-indigo-600 transition-colors">Preços</Link></li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-semibold text-slate-900 mb-4">Empresa</h4>
                  <ul className="space-y-3 text-sm">
                     <li><Link href="/sobre" className="hover:text-indigo-600 transition-colors">Sobre nós</Link></li>
                     <li><Link href="/contato" className="hover:text-indigo-600 transition-colors">Contato</Link></li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
                  <ul className="space-y-3 text-sm">
                     <li><Link href="/termos" className="hover:text-indigo-600 transition-colors">Termos de Uso</Link></li>
                     <li><Link href="/privacidade" className="hover:text-indigo-600 transition-colors">Política de Privacidade</Link></li>
                     <li><Link href="/cookies" className="hover:text-indigo-600 transition-colors">Política de Cookies</Link></li>
                     <li><Link href="/reembolso" className="hover:text-indigo-600 transition-colors">Política de Reembolso</Link></li>
                  </ul>
               </div>
            </div>
            
            <div className="border-t border-slate-200 pt-8 flex flex-col items-center text-xs text-slate-400">
               <div className="flex flex-col md:flex-row items-center justify-between w-full mb-6">
                  <p>© 2026 Chat AI Online. Todos os direitos reservados.</p>
                  <div className="flex items-center gap-4 mt-4 md:mt-0">
                     <span className="flex items-center gap-1">Feito com <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500"/> no Brasil</span>
                  </div>
               </div>
               <div className="text-center space-y-1">
                  <p>ChatAI Online – Andrews Rocha De Morais | CNPJ: 423.495.698/0001-88</p>
                  <p>Avenida Marginal, 761, CEP 11687-147 – Ubatuba/SP</p>
               </div>
            </div>
         </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
         href="https://wa.me/" 
         target="_blank" 
         rel="noopener noreferrer" 
         className="fixed bottom-6 right-6 z-[999] group flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform"
      >
         <div className="absolute right-[4.5rem] bottom-2 hidden md:block bg-white text-slate-700 px-4 py-2.5 rounded-2xl rounded-br-sm shadow-xl border border-slate-100 text-sm font-medium whitespace-nowrap animate-bounce" style={{animationDuration: '3s'}}>
            Precisa de ajuda? Fale com a gente! 👋
         </div>
         <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
         </svg>
         <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
            2
         </span>
      </a>
    </div>
  );
}
