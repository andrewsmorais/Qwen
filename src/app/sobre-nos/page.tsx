import Link from 'next/link';
import { jsonLdDaPagina, jsonLdSeguro, metadadosDaPagina } from '@/lib/seo/site';
import { ArrowLeft } from 'lucide-react';
import { SEGMENTOS } from '@/lib/oferta';

export const metadata = metadadosDaPagina('/sobre-nos');

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 py-16 px-6 font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdSeguro(jsonLdDaPagina('/sobre-nos')) }} />
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para a página inicial
        </Link>
        
        <header className="mb-12 border-b border-gray-800 pb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Sobre o ChatAI Online</h1>
        </header>
        
        <article className="space-y-6 text-lg leading-relaxed">
          <p>
            No ChatAI Online, transformamos a forma como empresas locais e negócios em crescimento se comunicam, atendem e vendem. Combinamos engenharia de software de ponta, CRM centralizado e agentes autônomos de Inteligência Artificial para garantir que nenhuma oportunidade comercial seja perdida no WhatsApp.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-6">O Que Nos Move</h2>
          <p>
            Sabemos que o maior gargalo de um negócio não é a falta de clientes, mas a demora no atendimento. Enquanto um empresário está em atendimento, cortando cabelo, gerenciando estoque ou fora do expediente, mensagens acumulam no WhatsApp e clientes compram do concorrente.
          </p>
          <p>
            Nossa missão é colocar na sua empresa um vendedor e recepcionista inteligente com IA, trabalhando 24 horas por dia, 7 dias por semana, tirando dúvidas, agendando serviços e fechando vendas no piloto automático.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-6">Soluções Sob Medida para o Seu Negócio</h2>
          <p>
            Nossa plataforma não é uma ferramenta genérica. Configuramos a inteligência do sistema para responder exatamente às necessidades da sua rotina diária:
          </p>
          <ul className="list-disc pl-6 space-y-4 mt-4 text-gray-300">
            {SEGMENTOS.map((s) => (
              <li key={s.titulo}>
                <strong className="text-white font-semibold block mb-1">{s.titulo}:</strong>
                {s.texto}
              </li>
            ))}
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-6">Por Que Escolher o ChatAI Online?</h2>
          <ul className="list-disc pl-6 space-y-3 mt-4 text-gray-300">
            <li><strong className="text-white font-semibold">Tecnologia com Alma de Vendas:</strong> Não criamos robôs com respostas mecânicas. Nossos agentes de IA entendem gírias, áudios e linguagem informal, conversando de forma humanizada e focada em conversão.</li>
            <li><strong className="text-white font-semibold">CRM em Formato Funil (Kanban):</strong> Toda conversa vira um card visual no painel. Sua equipe sabe exatamente quem pediu orçamento, quem está pendente de pagamento e quem já comprou.</li>
            <li><strong className="text-white font-semibold">Estrutura Pronta para Crescer:</strong> Múltiplos atendentes no mesmo número, suporte integrado e acompanhamento de métricas para você escalar sem inchar sua folha operacional.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-6">Conecte Sua Operação ao Futuro</h2>
          <p>
            Seja você um comércio de rua, um profissional autônomo ou uma rede de serviços, nós entregamos a infraestrutura que o seu negócio precisa para faturar no automático.
          </p>
          <p className="font-semibold text-white mt-4">
            ChatAI Online – O seu melhor vendedor, ativo 24h por dia.
          </p>

          <p className="mt-8 text-gray-400">
            <strong className="text-white">Contato institucional:</strong> <a href="mailto:suporte@chataionline.io" className="text-indigo-400 hover:text-indigo-300 transition-colors">suporte@chataionline.io</a>
          </p>
        </article>
      </div>
    </div>
  );
}
