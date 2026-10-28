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
          <p className="text-slate-500 text-sm">Última atualização: 22 de outubro de 2026</p>
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

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">2. Cadastro e Período de Teste</h2>
          <p>
            <strong className="text-slate-900">2.1.</strong> Para usar o ChatAI Online é preciso fazer um cadastro com informações verdadeiras e completas. O USUÁRIO declara ter capacidade legal para contratar (ou representar a empresa que contrata) e é responsável por manter sua senha em sigilo e por tudo o que for feito com a sua conta.
          </p>
          <p>
            <strong className="text-slate-900">2.2.</strong> Os planos Essencial e Impulso incluem <strong className="text-slate-900">7 (sete) dias de teste grátis</strong>, com os recursos do plano escolhido. Ao iniciar o teste, o USUÁRIO escolhe a forma de pagamento. No cartão de crédito, não há cobrança durante o teste e a primeira cobrança ocorre ao fim dos 7 dias. Em Pix ou boleto, a fatura é gerada na contratação e o acesso é liberado imediatamente, com pagamento em até 7 dias.
          </p>
          <p>
            <strong className="text-slate-900">2.3.</strong> Se o pagamento não for confirmado ao fim do teste, o acesso é suspenso. O USUÁRIO pode cancelar antes do fim do teste para não ser cobrado.
          </p>
          <p>
            <strong className="text-slate-900">2.4.</strong> O teste grátis é concedido uma vez por pessoa ou empresa. A CONTRATADA pode recusá-lo ou encerrá-lo quando houver indício de uso abusivo, como cadastros repetidos para obter novos períodos gratuitos.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">3. Estrutura de Preços, Planos e Faturamento</h2>
          <p><strong className="text-slate-900">3.1.</strong> O serviço é disponibilizado mediante os seguintes níveis de planos comerciais divulgados na página oficial:</p>
          <ul className="list-disc pl-6 space-y-3 mt-4 text-slate-700">
            <li><strong className="text-slate-900 font-semibold">Plano Essencial:</strong> 2 conexões de WhatsApp por QR code, 1 Agente de IA, 1 chatbot ligado, 2 funis e até 2 usuários, com agendamento pela IA e pelo chatbot.</li>
            <li><strong className="text-slate-900 font-semibold">Plano Impulso:</strong> 4 conexões de WhatsApp por QR code, 2 Agentes de IA, 2 chatbots ligados, 4 funis e até 4 usuários, com chatbot avançado, follow-up automático, distribuição automática de leads, API e webhooks.</li>
            <li><strong className="text-slate-900 font-semibold">Plano Escala:</strong> Sob consulta, a partir de 6 conexões de WhatsApp, 3 Agentes de IA, 3 chatbots, 6 funis e 6 usuários, com implantação feita pela CONTRATADA e opção de conexão pela API oficial do WhatsApp (Meta). As quantidades e o valor final constam da proposta. As mensagens cobradas pela Meta são pagas pelo USUÁRIO diretamente à Meta.</li>
          </ul>
          <p>
            <strong className="text-slate-900">3.2. Periodicidade e Faturamento:</strong> As contratações operam no modelo pré-pago (mensal, trimestral ou anual), com preço fixo por plano, que já inclui os usuários indicados em cada plano. O uso de IA não tem limite contratado e está sujeito a uso justo: consumo muito acima do normal de uma operação do porte do plano pode ser tratado com o USUÁRIO. O acesso é liberado mediante confirmação do meio de pagamento (Pix, Cartão de Crédito ou Boleto Bancário).
          </p>
          <p>
            <strong className="text-slate-900">3.3. Renovação Automática:</strong> As assinaturas são renovadas de forma automática ao término de cada ciclo (30 dias para planos mensais, 90 dias para trimestrais ou 365 dias para anuais), sendo o valor debitado no método de pagamento cadastrado, salvo manifestação expressa de cancelamento antes da data de renovação.
          </p>
          <p>
            <strong className="text-slate-900">3.4. Consumo de Recursos Computacionais e Tokens de IA:</strong> Os planos incluem uso de IA dentro de uma franquia de uso justo, com cotas mensais. Caso o USUÁRIO atinja o teto estipulado para o ciclo, o serviço de IA poderá ter a velocidade limitada ou solicitar upgrade de plano.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">4. Inadimplência, Suspensão e Rescisão pela CONTRATADA</h2>
          <p>
            <strong className="text-slate-900">4.1.</strong> Em caso de atraso no pagamento, o acesso poderá ser suspenso após 5 (cinco) dias do vencimento, com aviso por e-mail ou pelo painel. Sobre o valor em atraso incidem multa de 2% (dois por cento) e juros de 1% (um por cento) ao mês. A suspensão não afasta a obrigação de pagar os valores devidos.
          </p>
          <p>
            <strong className="text-slate-900">4.2.</strong> Os dados da conta suspensa por falta de pagamento são mantidos por até 30 (trinta) dias. Quitado o débito nesse prazo, o acesso é restabelecido. Passado o prazo, aplica-se o item 8.3.
          </p>
          <p>
            <strong className="text-slate-900">4.3.</strong> A CONTRATADA pode suspender ou encerrar a conta, com aviso prévio sempre que possível, quando houver descumprimento destes Termos, uso proibido, fraude, ou risco à segurança e à estabilidade da plataforma. Nos casos graves, a suspensão pode ocorrer sem aviso prévio.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">5. Conexões de WhatsApp e Responsabilidade de Terceiros</h2>
          <p>
            <strong className="text-slate-900">5.1.</strong> O USUÁRIO conecta seus próprios números telefônicos à plataforma através do leitor de QR Code ou APIs de mensageria. Nos planos Essencial e Impulso a conexão é feita por QR Code, no mesmo modelo do WhatsApp Web, e <strong className="text-slate-900">não é uma integração oficial da Meta</strong>. O USUÁRIO declara estar ciente de que esse tipo de conexão pode ser desconectado, restringido ou banido pelo WhatsApp a qualquer tempo, inclusive sem aviso. Para reduzir esse risco, a plataforma não oferece disparo de mensagens em massa nesses planos. A conexão pela API oficial está disponível no plano Escala.
          </p>
          <p>
            <strong className="text-slate-900">5.2. Isenção de Responsabilidade sobre Bloqueios:</strong> O ChatAI Online atua exclusivamente como intermediador tecnológico de automação. A CONTRATADA não possui qualquer vínculo corporativo com a Meta Platforms Inc. (WhatsApp). O USUÁRIO reconhece expressamente que práticas como o envio de spam, disparo em massa não solicitado, violação dos termos de serviço do WhatsApp ou aquisição de listas de contatos frias podem acarretar o banimento do número telefônico pela operadora da rede social, isentando o ChatAI Online de qualquer ônus, indenização ou ressarcimento decorrente de sanções aplicadas por terceiros.
          </p>
          <p>
            <strong className="text-slate-900">5.3. Estabilidade de Conexão:</strong> A estabilidade da conexão de mensageria depende da manutenção do aparelho conectado, da conexão de internet do usuário e da disponibilidade dos servidores de terceiros.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">6. Responsabilidade sobre os Agentes de IA e Conteúdos</h2>
          <p>
            <strong className="text-slate-900">6.1. Base de Conhecimento e Prompts:</strong> O USUÁRIO é o único e exclusivo responsável pelos dados, arquivos, preços, produtos e instruções carregados para alimentar o modelo de Inteligência Artificial. A CONTRATADA não audita previamente o conteúdo das respostas automáticas configuradas pelo cliente.
          </p>
          <p>
            <strong className="text-slate-900">6.2. Uso Proibido:</strong> É expressamente vedado utilizar o ChatAI Online para:
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

          <p>
            <strong className="text-slate-900">6.3.</strong> <strong className="text-slate-900">Respostas automáticas podem errar.</strong> As respostas dos agentes de IA são geradas automaticamente e podem conter erros, imprecisões ou informações desatualizadas. O USUÁRIO deve revisar a configuração do agente, acompanhar as conversas e usar a passagem para atendente humano nos casos em que isso for necessário. A IA não substitui aconselhamento profissional médico, jurídico, financeiro ou de qualquer outra natureza regulamentada.
          </p>
          <p>
            <strong className="text-slate-900">6.4.</strong> <strong className="text-slate-900">Provedores de IA.</strong> Para gerar as respostas, as mensagens e o conteúdo da base de conhecimento são enviados a provedores de inteligência artificial contratados pela CONTRATADA, conforme descrito na Política de Privacidade.
          </p>
          <p>
            <strong className="text-slate-900">6.5.</strong> <strong className="text-slate-900">Transparência com os contatos.</strong> Cabe ao USUÁRIO informar aos seus contatos, quando a lei exigir, que o atendimento conta com apoio de inteligência artificial.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">7. Disponibilidade do Sistema (SLA) e Manutenções</h2>
          <p>
            <strong className="text-slate-900">7.1.</strong> A CONTRATADA emprega esforços técnicos comerciais razoáveis para manter a infraestrutura disponível 24 horas por dia, 7 dias por semana, com meta de disponibilidade de 99% (noventa e nove por cento).
          </p>
          <p>
            <strong className="text-slate-900">7.2. Não serão consideradas violações de disponibilidade:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-3 mt-4 text-slate-700">
            <li>Manutenções programadas comunicadas previamente com antecedência mínima de 12 horas;</li>
            <li>Falhas de infraestrutura externa (provedores de hospedagem em nuvem, falhas de rota de internet ou instabilidades globais das APIs de IA);</li>
            <li>Indisponibilidades decorrentes de ações ou omissões do próprio USUÁRIO.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">8. Cancelamento, Arrependimento e Reembolso</h2>
          <p>
            <strong className="text-slate-900">8.1. Direito de Arrependimento (Art. 49 do CDC):</strong> Para novas assinaturas, o USUÁRIO que atuar como consumidor final tem o prazo improrrogável de até 7 (sete) dias corridos, contados da data de contratação, para requerer o cancelamento com reembolso total do valor pago, bastando solicitar através do e-mail <a href="mailto:suporte@chataionline.io" className="text-indigo-600 hover:text-indigo-700 transition-colors">suporte@chataionline.io</a>.
          </p>
          <p>
            <strong className="text-slate-900">8.2. Cancelamento Regular:</strong> O cancelamento pode ser efetuado a qualquer momento através do painel da conta ou mediante solicitação formal ao suporte. Ao cancelar, a renovação futura é suspensa, e o USUÁRIO manterá acesso até o último dia do período faturado, não havendo reembolso proporcional referente aos dias não utilizados dentro do ciclo vigente.
          </p>
          <p>
            <strong className="text-slate-900">8.3.</strong> <strong className="text-slate-900">Dados após o cancelamento.</strong> Encerrada a conta, o USUÁRIO pode exportar seus dados por até 30 (trinta) dias. Depois desse prazo, os dados poderão ser excluídos definitivamente, ressalvada a guarda exigida por lei. Cabe ao USUÁRIO manter cópia dos dados que considere importantes.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">9. Confidencialidade e Proteção de Dados (LGPD)</h2>
          <p>
            <strong className="text-slate-900">9.1.</strong> As partes comprometem-se a agir em total conformidade com a Lei Geral de Proteção de Dados (Lei n.º 13.709/2018 - LGPD).
          </p>
          <p>
            <strong className="text-slate-900">9.2.</strong> O USUÁRIO figura na condição de Controlador dos dados pessoais de seus clientes/leads que trafegam pelo CRM, cabendo a ele possuir as devidas bases legais para captura e tratamento desses contatos.
          </p>
          <p>
            <strong className="text-slate-900">9.3.</strong> O ChatAI Online atua estritamente na condição de Operador, implementando criptografia e medidas técnicas de segurança para salvaguardar a base de dados de acessos não autorizados.
          </p>
          <p>
            <strong className="text-slate-900">9.4.</strong> Como Operador, o ChatAI Online trata os dados pessoais dos contatos do USUÁRIO conforme as instruções do USUÁRIO e para as finalidades do serviço contratado.
          </p>
          <p>
            <strong className="text-slate-900">9.5.</strong> Em caso de incidente de segurança que possa acarretar risco ou dano relevante aos titulares, a CONTRATADA comunicará o USUÁRIO em prazo razoável, para que ele cumpra suas obrigações como Controlador, e adotará as medidas cabíveis. A comunicação à ANPD e aos titulares segue a regulamentação aplicável.
          </p>
          <p>
            <strong className="text-slate-900">9.6.</strong> A CONTRATADA pode contratar terceiros para operar a infraestrutura (banco de dados, hospedagem, inteligência artificial, pagamentos e e-mail). Eles estão descritos na Política de Privacidade, e a CONTRATADA responde por sua escolha e pelas medidas de segurança que exige deles.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">10. Limitação de Responsabilidade</h2>
          <p>
            <strong className="text-slate-900">10.1.</strong> O ChatAI Online é oferecido no estado em que se encontra. A CONTRATADA não garante resultado de vendas, conversão, número de atendimentos ou qualquer outro resultado comercial, que dependem do uso feito pelo USUÁRIO.
          </p>
          <p>
            <strong className="text-slate-900">10.2.</strong> Na máxima extensão permitida pela lei, a CONTRATADA não responde por danos indiretos, lucros cessantes ou perda de oportunidades de negócio. Quando houver responsabilidade, ela fica limitada ao valor efetivamente pago pelo USUÁRIO nos 12 (doze) meses anteriores ao fato.
          </p>
          <p>
            <strong className="text-slate-900">10.3.</strong> A CONTRATADA não responde por falhas, bloqueios ou mudanças de regras de terceiros, como WhatsApp/Meta, provedores de inteligência artificial, operadoras e provedores de internet.
          </p>
          <p>
            <strong className="text-slate-900">10.4.</strong> Nada nesta cláusula limita os direitos que a lei assegura ao USUÁRIO que seja consumidor.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">11. Propriedade Intelectual</h2>
          <p>
            <strong className="text-slate-900">11.1.</strong> A marca, os logotipos, o design da interface, os módulos de software, as bases de dados e o código-fonte proprietário do ChatAI Online pertencem exclusivamente a Andrews Rocha De Morais e são protegidos pelas leis de direitos autorais e propriedade industrial.
          </p>
          <p>
            <strong className="text-slate-900">11.2.</strong> A contratação do plano concede ao USUÁRIO uma licença temporária, revogável, não exclusiva e intransferível de uso do software, sendo vedada a engenharia reversa, sublicenciamento ou comercialização não autorizada da plataforma no formato as-a-service.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">12. Alterações destes Termos e dos Preços</h2>
          <p>
            <strong className="text-slate-900">12.1.</strong> A CONTRATADA pode alterar estes Termos. Mudanças relevantes são comunicadas por e-mail ou pelo painel com, no mínimo, 30 (trinta) dias de antecedência. O uso da plataforma após esse prazo significa aceitação. Quem não concordar pode cancelar antes de a mudança valer.
          </p>
          <p>
            <strong className="text-slate-900">12.2.</strong> Reajustes de preço valem apenas a partir da próxima renovação e são avisados com, no mínimo, 30 (trinta) dias de antecedência. O ciclo já pago mantém o valor contratado.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">13. Canais de Atendimento e Suporte</h2>
          <p>
            <strong className="text-slate-900">13.1.</strong> O suporte técnico aos usuários é fornecido conforme as características do plano contratado, exclusivamente pelos canais oficiais:
          </p>
          <ul className="list-disc pl-6 space-y-3 mt-4 text-slate-700">
            <li><strong className="text-slate-900 font-semibold">E-mail de Suporte e Jurídico:</strong> <a href="mailto:suporte@chataionline.io" className="text-indigo-600 hover:text-indigo-700 transition-colors">suporte@chataionline.io</a></li>
            <li><strong className="text-slate-900 font-semibold">Telefone/WhatsApp de Suporte:</strong> (12) 98166-7389</li>
            <li><strong className="text-slate-900 font-semibold">Horário de Atendimento Humano:</strong> De segunda a sexta-feira, das 09h00 às 18h00 (horário de Brasília).</li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">14. Legislação Aplicável e Foro</h2>
          <p>
            <strong className="text-slate-900">14.1.</strong> Estes Termos de Uso são regidos e interpretados de acordo com a legislação da República Federativa do Brasil.
          </p>
          <p>
            <strong className="text-slate-900">14.2.</strong> Para dirimir quaisquer litígios, conflitos ou controvérsias decorrentes deste contrato, as partes elegem expressamente o Foro da Comarca de Ubatuba, Estado de São Paulo, com renúncia a qualquer outro, ressalvado o direito do USUÁRIO que seja consumidor de propor ação no foro do seu domicílio.
          </p>
          <p>
            <strong className="text-slate-900">14.3.</strong> As comunicações da CONTRATADA ao USUÁRIO são feitas pelo e-mail cadastrado ou pelo painel da plataforma.
          </p>
          <p>
            <strong className="text-slate-900">14.4.</strong> Se alguma cláusula destes Termos for considerada inválida, as demais continuam em vigor.
          </p>
        </article>
      </div>
    </div>
    </>
  );
}



