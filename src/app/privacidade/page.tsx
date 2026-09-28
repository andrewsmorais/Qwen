import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Política de Privacidade | ChatAI Online',
  description: 'Política de Privacidade do ChatAI Online',
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 py-16 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para a página inicial
        </Link>
        
        <header className="mb-12 border-b border-gray-800 pb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Política de Privacidade</h1>
          <p className="text-gray-400 text-sm">Última atualização: 25 de setembro de 2026</p>
        </header>
        
        <article className="space-y-6 text-lg leading-relaxed">
          <p>
            O ChatAI Online, operado por Andrews Rocha De Morais, titular do CPF n.º 423.495.698-88, com sede na Avenida Marginal, 761, CEP 11687-147, Ubatuba - São Paulo, Brasil (doravante denominado <strong className="text-white font-semibold">ChatAI Online</strong> ou <strong className="text-white font-semibold">Nós</strong>), valoriza a privacidade e a segurança das informações dos seus utilizadores.
          </p>
          <p>
            Esta Política de Privacidade descreve como recolhemos, utilizamos, armazenamos, partilhamos e protegemos os seus dados pessoais e os dados dos seus clientes ao utilizar o site <em className="text-gray-400">chataionline.io</em>, a plataforma de CRM e as soluções de Inteligência Artificial disponibilizadas em <em className="text-gray-400">crm.chataionline.io</em>.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-6">1. Papéis na LGPD (Controlador vs. Operador)</h2>
          <p>Para efeitos da Lei Geral de Proteção de Dados (Lei n.º 13.709/2018 - LGPD):</p>
          <ul className="list-disc pl-6 space-y-3 mt-4 text-gray-300">
            <li><strong className="text-white font-semibold">O ChatAI Online atua como Controlador:</strong> Em relação aos dados cadastrais e de faturação dos seus próprios clientes (como nome, e-mail de acesso, telefone e dados de pagamento) recolhidos para a contratação dos planos.</li>
            <li><strong className="text-white font-semibold">O ChatAI Online atua como Operador:</strong> Em relação a todos os dados de terceiros (leads, clientes e contactos finais) inseridos, importados ou sincronizados pelo CONTRATANTE dentro do sistema CRM e nas instâncias de atendimento por WhatsApp e IA. A definição da base legal e o consentimento para tratamento desses dados cabem exclusivamente ao CONTRATANTE.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-6">2. Dados Recolhidos pela Plataforma</h2>
          <p>Recolhemos os seguintes tipos de informações:</p>
          <ul className="list-disc pl-6 space-y-3 mt-4 text-gray-300">
            <li><strong className="text-white font-semibold">Dados de Registo e Conta:</strong> Nome completo, endereço de correio eletrónico profissional, número de telefone/WhatsApp, palavra-passe encriptada e dados cadastrais da empresa/faturação.</li>
            <li><strong className="text-white font-semibold">Dados de Pagamento:</strong> Os dados de transação financeira (Pix, cartões de crédito e faturas) são processados diretamente por gateways de pagamento certificados (PCI-DSS), não ficando os números de cartões armazenados nos nossos servidores.</li>
            <li><strong className="text-white font-semibold">Dados Operacionais do CRM e Atendimento:</strong> Mensagens trocadas, históricos de conversas, etiquetas (tags), etapas de funil, ficheiros e anexos enviados voluntariamente pelos utilizadores e leads durante as conversações.</li>
            <li><strong className="text-white font-semibold">Base de Conhecimento para IA:</strong> Textos, respostas-padrão, tabelas de preços e catálogos fornecidos pelo utilizador para configurar o treino do seu agente de vendas e atendimento.</li>
            <li><strong className="text-white font-semibold">Dados Técnicos de Navegação:</strong> Endereço IP, tipo de navegador, sistema operativo, páginas acedidas, carimbos de data/hora e identificadores de sessão.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-6">3. Finalidade do Tratamento de Dados</h2>
          <p>Os dados recolhidos destinam-se às seguintes finalidades:</p>
          <ul className="list-disc pl-6 space-y-3 mt-4 text-gray-300">
            <li><strong className="text-white font-semibold">Execução dos Serviços Contratados:</strong> Disponibilizar o painel do CRM, organizar funis de vendas, sincronizar instâncias de WhatsApp e executar os fluxos dos agentes de IA de suporte e vendas.</li>
            <li><strong className="text-white font-semibold">Comunicação Operacional:</strong> Enviar alertas de suporte, notificações de renovação de plano, atualizações técnicas do sistema e avisos de segurança.</li>
            <li><strong className="text-white font-semibold">Segurança e Prevenção contra Fraudes:</strong> Monitorizar acessos anómalos, tentativas de ataque, abuso de infraestrutura ou atividades ilícitas na plataforma.</li>
            <li><strong className="text-white font-semibold">Cumprimento de Obrigações Legais:</strong> Emissão de notas fiscais, cumprimento de decisões judiciais e manutenção de registos de conexão conforme o Marco Civil da Internet (Lei n.º 12.965/2014).</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-6">4. Partilha de Dados com Terceiros</h2>
          <p>
            O ChatAI Online não comercializa dados pessoais sob qualquer pretexto. A partilha de informações ocorre estritamente com os fornecedores e prestadores de infraestrutura necessários para a operação do sistema:
          </p>
          <ul className="list-disc pl-6 space-y-3 mt-4 text-gray-300">
            <li><strong className="text-white font-semibold">Infraestrutura Cloud e Bases de Dados:</strong> Servidores VPS, instâncias de computação e bases de dados encriptadas (como serviços de nuvem e Redis de alta disponibilidade).</li>
            <li><strong className="text-white font-semibold">Serviços de Inteligência Artificial:</strong> Dados de conversação e comandos enviados via API para modelos de IA estritamente para o processamento de respostas em tempo real.</li>
            <li><strong className="text-white font-semibold">Gateways de Pagamento:</strong> Processadoras de pagamento responsáveis por validar assinaturas e cobranças dos planos.</li>
            <li><strong className="text-white font-semibold">Autoridades Governamentais:</strong> Quando exigido por lei, decisão judicial ou ordem de autoridade competente.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-6">5. Armazenamento e Segurança das Informações</h2>
          <p>
            <strong className="text-white font-semibold">5.1.</strong> Implementamos medidas técnicas e organizacionais adequadas para proteger os dados contra perda, extravio, alteração, divulgação ou acesso não autorizado, incluindo:
          </p>
          <ul className="list-disc pl-6 space-y-3 mt-4 text-gray-300">
            <li>Encriptação de comunicações de ponta a ponta via certificados SSL/TLS;</li>
            <li>Encriptação de palavras-passe e credenciais de acesso;</li>
            <li>Barreiras de proteção por firewall e controlo de acessos restrito à infraestrutura de servidores.</li>
          </ul>
          <p>
            <strong className="text-white font-semibold">5.2.</strong> As informações são mantidas ativas enquanto a assinatura do utilizador estiver vigente. Após o encerramento da conta, os dados operacionais poderão ser eliminados de forma definitiva, ressalvadas as hipóteses de guarda obrigatória por lei.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-6">6. Direitos dos Titulares de Dados</h2>
          <p>Em conformidade com o Artigo 18 da LGPD, o titular dos dados possui o direito de solicitar a qualquer momento:</p>
          <ul className="list-disc pl-6 space-y-3 mt-4 text-gray-300">
            <li>A confirmação da existência de tratamento dos seus dados;</li>
            <li>O acesso facilitado às suas informações registadas;</li>
            <li>A correção de dados incompletos, inexatos ou desatualizados;</li>
            <li>A anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade com a legislação;</li>
            <li>A revogação do consentimento concedido previamente.</li>
          </ul>
          <p>
            Para exercer qualquer um destes direitos, o pedido deve ser enviado para o e-mail: <a href="mailto:suporte@chataionline.io" className="text-indigo-400 hover:text-indigo-300 transition-colors">suporte@chataionline.io</a>.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-6">7. Atualizações desta Política</h2>
          <p>
            O ChatAI Online reserva-se o direito de atualizar esta Política de Privacidade a qualquer momento para refletir melhorias no sistema ou adequações a novas normas legais. Notificações sobre alterações substanciais serão comunicadas diretamente no painel do sistema ou por e-mail.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-6">8. Encarregado pelo Tratamento de Dados (DPO) e Contacto</h2>
          <p>Para dúvidas sobre esta política, pedidos de esclarecimento sobre privacidade ou contacto com o responsável pelo tratamento de dados, utilize o canal oficial:</p>
          <ul className="list-disc pl-6 space-y-3 mt-4 text-gray-300">
            <li><strong className="text-white font-semibold">Responsável:</strong> Andrews Rocha De Morais</li>
            <li><strong className="text-white font-semibold">E-mail de Privacidade e Suporte:</strong> <a href="mailto:suporte@chataionline.io" className="text-indigo-400 hover:text-indigo-300 transition-colors">suporte@chataionline.io</a></li>
            <li><strong className="text-white font-semibold">Endereço Comercial:</strong> Avenida Marginal, 761, CEP 11687-147, Ubatuba - São Paulo, Brasil</li>
          </ul>
        </article>
      </div>
    </div>
  );
}
