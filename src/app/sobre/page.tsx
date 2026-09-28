import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Sobre o ChatAI Online | ChatAI Online',
  description: 'Conheça mais sobre o ChatAI Online e nossa missão',
};

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 py-16 px-6 font-sans">
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
            <li>
              <strong className="text-white font-semibold block mb-1">Barbearias, Salões de Beleza e Estética:</strong>
              Atendimento instantâneo com envio de catálogo de serviços e valores. Agendamento automático com horários disponíveis da equipe sem conflito de agenda. Lembretes preventivos de horário para zerar faltas e desistências.
            </li>
            <li>
              <strong className="text-white font-semibold block mb-1">Comércio, Lojas e Varejo Local:</strong>
              Envio ágil de fotos de produtos, variações, tamanhos e valores. Resposta imediata para conferência de estoque, formas de pagamento e frete/entrega. Organização de pedidos com dados prontos para faturamento e envio.
            </li>
            <li>
              <strong className="text-white font-semibold block mb-1">Clínicas, Consultórios e Especialistas:</strong>
              Triagem inicial de pacientes e direcionamento por tipo de consulta ou procedimento. Informações precisas sobre preparo de exames, localização e convênios aceitos. Organização de listas de espera para encaixes rápidos.
            </li>
            <li>
              <strong className="text-white font-semibold block mb-1">Prestadores de Serviços e Manutenção:</strong>
              Coleta automática de fotos, vídeos e detalhes do serviço antes de passar o orçamento. Qualificação imediata do lead com agendamento de visita técnica no calendário. Histórico centralizado de negociações para acompanhamento de propostas pendentes.
            </li>
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
