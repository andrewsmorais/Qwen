import { Header } from '@/components/Header';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Termos de Uso | ChatAI Online',
  description: 'Termos de Uso e Condições de Serviço do ChatAI Online',
};

export default function TermosPage() {
  return (
    <>
      <Header />
    <div className="min-h-screen pt-24 bg-white text-slate-700 py-16 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para a página inicial
        </Link>
        
        <header className="mb-12 border-b border-slate-200 pb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Termos de Uso e Condições de Serviço</h1>
          <p className="text-slate-500 text-sm">Última atualização: 28 de setembro de 2026</p>
        </header>
        
        <article className="space-y-6 text-lg leading-relaxed">
          <p>
            Bem-vindo ao ChatAI Online, operado por Andrews Rocha De Morais, pessoa física devidamente inscrita sob o CPF n.º 423.495.698-88, com sede comercial na Avenida Marginal, 761 – CEP 11687-147, Ubatuba - São Paulo, Brasil, doravante denominado <strong className="text-slate-900 font-semibold">CONTRATADA</strong> ou <strong className="text-slate-900 font-semibold">ChatAI Online</strong>.
          </p>
          <p>
            Estes Termos de Uso regulam o fornecimento do software sob o modelo SaaS (Software as a Service) por meio dos domínios <em className="text-slate-500">chataionline.io</em>, <em className="text-slate-500">crm.chataionline.io</em> e suas respectivas APIs e subdomínios. Ao cadastrar-se, contratar um plano ou utilizar a plataforma, a pessoa física ou jurídica identificada no cadastro (CONTRATANTE ou USUÁRIO) adere de forma irrestrita a todas as cláusulas deste instrumento.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">1. Objeto do Software e Serviços Prestados</h2>
          <p>
            <strong className="text-slate-900">1.1.</strong> O ChatAI Online consiste em um sistema de Gestão de Relacionamento com Clientes (CRM) integrado a agentes autônomos de Inteligência Artificial para atendimento, prospecção e fechamento de vendas 24 horas por dia.
          </p>
          <p><strong className="text-slate-900">1.2.</strong> As funcionalidades do sistema incluem, de forma exemplificativa e de acordo com o plano contratado:</p>
          <ul className="list-disc pl-6 space-y-3 mt-4 text-slate-700">
            <li><strong className="text-slate-900 font-semibold">Painel Centralizado de Conversas:</strong> Gestão de múltiplos atendimentos e leads simultâneos em formato Kanban/Funil de Vendas.</li>
            <li><strong className="text-slate-900 font-semibold">Agentes de Inteligência Artificial de Vendas:</strong> Assistentes treinados com a base de conhecimento do cliente para atendimento 24 horas, resposta a dúvidas, qualificação de leads e automação de agendamentos.</li>
            <li><strong className="text-slate-900 font-semibold">Mecanismo de Conexão WhatsApp (WAHA):</strong> Integração e sincronização de instâncias de mensageria para envio e recebimento de mensagens, áudios, imagens e mídias.</li>
            <li><strong className="text-slate-900 font-semibold">Histórico e Relatórios de Atendimento:</strong> Registro de interações, métricas de tempo de resposta e relatórios operacionais.</li>
            <li><strong className="text-slate-900 font-semibold">Integrações e Webhooks:</strong> Capacidade de comunicação com ferramentas de automação, gateways de pagamento e webhooks externos.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">2. Estrutura de Preços, Planos e Faturamento</h2>
          <p><strong className="text-slate-900">2.1.</strong> O serviço é disponibilizado mediante os seguintes níveis de planos comerciais divulgados na página oficial:</p>
          <ul className="list-disc pl-6 space-y-3 mt-4 text-slate-700">
            <li><strong className="text-slate-900 font-semibold">Plano Starter:</strong> Desenvolvido para autônomos e pequenas operações, contendo 1 conexão de WhatsApp, até 1 Agente de IA para atendimento, suporte via comunidade/tickets e limites base de tráfego de mensagens.</li>
            <li><strong className="text-slate-900 font-semibold">Plano Pro (Mais Popular):</strong> Desenvolvido para empresas em expansão, contendo até 3 conexões de WhatsApp, múltiplos Agentes de IA customizados com base de conhecimento expandida, relatórios avançados de conversão e suporte prioritário.</li>
            <li><strong className="text-slate-900 font-semibold">Plano Enterprise / Custom:</strong> Solução para alta volumetria, com múltiplas instâncias simultâneas, agentes ilimitados, maior capacidade computacional dedicada e suporte dedicado.</li>
          </ul>
          <p>
            <strong className="text-slate-900">2.2. Periodicidade e Faturamento:</strong> As contratações operam no modelo pré-pago (mensal ou anual). O acesso é liberado mediante confirmação do meio de pagamento (Pix, Cartão de Crédito ou Boleto Bancário).
          </p>
          <p>
            <strong className="text-slate-900">2.3. Renovação Automática:</strong> As assinaturas são renovadas de forma automática ao término de cada ciclo (30 dias para planos mensais ou 365 dias para anuais), sendo o valor debitado no método de pagamento cadastrado, salvo manifestação expressa de cancelamento antes da data de renovação.
          </p>
          <p>
            <strong className="text-slate-900">2.4. Consumo de Recursos Computacionais e Tokens de IA:</strong> Planos com limites definidos de disparos ou consultas à IA utilizam cotas mensais. Caso o USUÁRIO atinja o teto estipulado para o ciclo, o serviço de IA poderá ter a velocidade limitada ou solicitar upgrade de plano.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">3. Conexões de WhatsApp e Responsabilidade de Terceiros</h2>
          <p>
            <strong className="text-slate-900">3.1.</strong> O USUÁRIO conecta seus próprios números telefônicos à plataforma através do leitor de QR Code ou APIs de mensageria.
          </p>
          <p>
            <strong className="text-slate-900">3.2. Isenção de Responsabilidade sobre Bloqueios:</strong> O ChatAI Online atua exclusivamente como intermediador tecnológico de automação. A CONTRATADA não possui qualquer vínculo corporativo com a Meta Platforms Inc. (WhatsApp). O USUÁRIO reconhece expressamente que práticas como o envio de spam, disparo em massa não solicitado, violação dos termos de serviço do WhatsApp ou aquisição de listas de contatos frias podem acarretar o banimento do número telefônico pela operadora da rede social, isentando o ChatAI Online de qualquer ônus, indenização ou ressarcimento decorrente de sanções aplicadas por terceiros.
          </p>
          <p>
            <strong className="text-slate-900">3.3. Estabilidade de Conexão:</strong> A estabilidade da conexão de mensageria depende da manutenção do aparelho conectado, da conexão de internet do usuário e da disponibilidade dos servidores de terceiros.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">4. Responsabilidade sobre os Agentes de IA e Conteúdos</h2>
          <p>
            <strong className="text-slate-900">4.1. Base de Conhecimento e Prompts:</strong> O USUÁRIO é o único e exclusivo responsável pelos dados, arquivos, preços, produtos e instruções carregados para alimentar o modelo de Inteligência Artificial. A CONTRATADA não audita previamente o conteúdo das respostas automáticas configuradas pelo cliente.
          </p>
          <p>
            <strong className="text-slate-900">4.2. Uso Proibido:</strong> É expressamente vedado utilizar o ChatAI Online para:
          </p>
          <ul className="list-disc pl-6 space-y-3 mt-4 text-slate-700">
            <li>Atividades ilícitas, fraudulentas, pirâmides financeiras ou esquemas de enriquecimento ilícito;</li>
            <li>Venda de substâncias ilegais, armamentos ou serviços sem regulamentação legal;</li>
            <li>Disseminação de discursos de ódio, assédio, pornografia ou violação de privacidade de terceiros;</li>
            <li>Disparo massivo não autorizado (SPAM).</li>
          </ul>
          <p className="mt-4">
            A ocorrência de quaisquer dessas práticas ensejará o cancelamento imediato da conta, sem direito a reembolso, além da devida comunicação às autoridades competentes.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">5. Disponibilidade do Sistema (SLA) e Manutenções</h2>
          <p>
            <strong className="text-slate-900">5.1.</strong> A CONTRATADA emprega esforços técnicos comerciais razoáveis para manter a infraestrutura disponível 24 horas por dia, 7 dias por semana, com meta de disponibilidade de 99% (noventa e nove por cento).
          </p>
          <p>
            <strong className="text-slate-900">5.2. Não serão consideradas violações de disponibilidade:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-3 mt-4 text-slate-700">
            <li>Manutenções programadas comunicadas previamente com antecedência mínima de 12 horas;</li>
            <li>Falhas de infraestrutura externa (provedores de hospedagem em nuvem, falhas de rota de internet ou instabilidades globais das APIs de IA);</li>
            <li>Indisponibilidades decorrentes de ações ou omissões do próprio USUÁRIO.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">6. Cancelamento, Arrependimento e Reembolso</h2>
          <p>
            <strong className="text-slate-900">6.1. Direito de Arrependimento (Art. 49 do CDC):</strong> Para novas assinaturas, o USUÁRIO que atuar como consumidor final tem o prazo improrrogável de até 7 (sete) dias corridos, contados da data de contratação, para requerer o cancelamento com reembolso total do valor pago, bastando solicitar através do e-mail <a href="mailto:suporte@chataionline.io" className="text-indigo-600 hover:text-indigo-700 transition-colors">suporte@chataionline.io</a>.
          </p>
          <p>
            <strong className="text-slate-900">6.2. Cancelamento Regular:</strong> O cancelamento pode ser efetuado a qualquer momento através do painel da conta ou mediante solicitação formal ao suporte. Ao cancelar, a renovação futura é suspensa, e o USUÁRIO manterá acesso até o último dia do período faturado, não havendo reembolso proporcional referente aos dias não utilizados dentro do ciclo vigente.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">7. Confidencialidade e Proteção de Dados (LGPD)</h2>
          <p>
            <strong className="text-slate-900">7.1.</strong> As partes comprometem-se a agir em total conformidade com a Lei Geral de Proteção de Dados (Lei n.º 13.709/2018 - LGPD).
          </p>
          <p>
            <strong className="text-slate-900">7.2.</strong> O USUÁRIO figura na condição de Controlador dos dados pessoais de seus clientes/leads que trafegam pelo CRM, cabendo a ele possuir as devidas bases legais para captura e tratamento desses contatos.
          </p>
          <p>
            <strong className="text-slate-900">7.3.</strong> O ChatAI Online atua estritamente na condição de Operador, implementando criptografia e medidas técnicas de segurança para salvaguardar a base de dados de acessos não autorizados.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">8. Propriedade Intelectual</h2>
          <p>
            <strong className="text-slate-900">8.1.</strong> A marca, os logotipos, o design da interface, os módulos de software, as bases de dados e o código-fonte proprietário do ChatAI Online pertencem exclusivamente a Andrews Rocha De Morais e são protegidos pelas leis de direitos autorais e propriedade industrial.
          </p>
          <p>
            <strong className="text-slate-900">8.2.</strong> A contratação do plano concede ao USUÁRIO uma licença temporária, revogável, não exclusiva e intransferível de uso do software, sendo vedada a engenharia reversa, sublicenciamento ou comercialização não autorizada da plataforma no formato as-a-service.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">9. Canais de Atendimento e Suporte</h2>
          <p>
            <strong className="text-slate-900">9.1.</strong> O suporte técnico aos usuários é fornecido conforme as características do plano contratado, exclusivamente pelos canais oficiais:
          </p>
          <ul className="list-disc pl-6 space-y-3 mt-4 text-slate-700">
            <li><strong className="text-slate-900 font-semibold">E-mail de Suporte e Jurídico:</strong> <a href="mailto:suporte@chataionline.io" className="text-indigo-600 hover:text-indigo-700 transition-colors">suporte@chataionline.io</a></li>
            <li><strong className="text-slate-900 font-semibold">Horário de Atendimento Humano:</strong> De segunda a sexta-feira, das 09h00 às 18h00 (horário de Brasília).</li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">10. Legislação Aplicável e Foro</h2>
          <p>
            <strong className="text-slate-900">10.1.</strong> Estes Termos de Uso são regidos e interpretados de acordo com a legislação da República Federativa do Brasil.
          </p>
          <p>
            <strong className="text-slate-900">10.2.</strong> Para dirimir quaisquer litígios, conflitos ou controvérsias decorrentes deste contrato, as partes elegem expressamente o Foro da Comarca de Ubatuba, Estado de São Paulo, com renúncia a qualquer outro, por mais privilegiado que seja.
          </p>
        </article>
      </div>
    </div>
    </>
  );
}



