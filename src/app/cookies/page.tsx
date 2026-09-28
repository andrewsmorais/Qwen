import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Política de Cookies | ChatAI Online',
  description: 'Política de Cookies do ChatAI Online',
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 py-16 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para a página inicial
        </Link>
        
        <header className="mb-12 border-b border-gray-800 pb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Política de Cookies</h1>
          <p className="text-gray-400 text-sm">Última atualização: 25 de setembro de 2026</p>
        </header>
        
        <article className="space-y-6 text-lg leading-relaxed">
          <p>
            O ChatAI Online, operado por Andrews Rocha De Morais, inscrito sob o CPF n.º 423.495.698-88, com sede na Avenida Marginal, 761, CEP 11687-147, Ubatuba - São Paulo, Brasil, utiliza cookies e tecnologias de rastreio semelhantes no website <em className="text-gray-400">chataionline.io</em> e nos seus subdomínios.
          </p>
          <p>
            Esta Política de Cookies explica o que são cookies, como os utilizamos para melhorar a sua experiência na plataforma e como pode geri-los ou desativá-los no seu navegador.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-6">1. O que são Cookies?</h2>
          <p><strong className="text-white font-semibold">1.1.</strong> Cookies são pequenos ficheiros de texto guardados no seu computador, telemóvel ou tablet quando visita um website ou utiliza uma aplicação online.</p>
          <p><strong className="text-white font-semibold">1.2.</strong> Estes ficheiros armazenam informações pontuais de navegação que permitem reconhecer o seu dispositivo, manter a sua sessão ativa no CRM, memorizar preferências e recolher métricas para otimização de desempenho.</p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-6">2. Categorias de Cookies Utilizados</h2>
          <p>O ChatAI Online utiliza cookies classificados nas seguintes categorias:</p>
          <ul className="list-disc pl-6 space-y-4 mt-4 text-gray-300">
            <li>
              <strong className="text-white font-semibold block mb-1">Cookies Estritamente Necessários (Essenciais):</strong>
              Fundamentais para o funcionamento da plataforma e navegação segura. Permitem a autenticação do utilizador, a permanência na sessão do CRM e a proteção contra acessos fraudulentos. Não podem ser desativados sem comprometer o acesso aos serviços do sistema.
            </li>
            <li>
              <strong className="text-white font-semibold block mb-1">Cookies de Desempenho e Análise:</strong>
              Recolhem dados estatísticos e anónimos sobre como os visitantes interagem com a landing page (páginas mais vistas, tempo de permanência e possíveis mensagens de erro). Ajudam-nos a identificar falhas de usabilidade e a melhorar a velocidade de carregamento da aplicação.
            </li>
            <li>
              <strong className="text-white font-semibold block mb-1">Cookies de Funcionalidade:</strong>
              Gravam escolhas e preferências do utilizador (tais como preferências de idioma, estado de menus e filtros aplicados no funil de vendas do CRM). Evitam que precise de reconfigurar o painel a cada novo acesso.
            </li>
            <li>
              <strong className="text-white font-semibold block mb-1">Cookies de Conversão e Marketing (Opcionais):</strong>
              Utilizados para medir a eficiência de campanhas de anúncios em canais como Meta Ads e Google Ads. Permitem identificar a origem do tráfego que chega aos planos de assinatura, sem armazenar dados financeiros sensíveis.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-6">3. Cookies de Terceiros</h2>
          <p><strong className="text-white font-semibold">3.1.</strong> Algumas ferramentas integradas no nosso website podem instalar cookies próprios através do seu navegador, tais como fornecedores de análise de tráfego, pixels de anúncios e plataformas de alojamento/CDN.</p>
          <p><strong className="text-white font-semibold">3.2.</strong> Esses terceiros processam os dados de acordo com as suas próprias políticas de privacidade, cabendo ao ChatAI Online garantir que apenas parceiros em conformidade com as diretrizes de proteção de dados sejam utilizados na infraestrutura.</p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-6">4. Como Gerir ou Desativar Cookies</h2>
          <p><strong className="text-white font-semibold">4.1.</strong> Pode alterar as permissões de cookies a qualquer momento diretamente nas definições do seu navegador web. A maioria dos browsers permite bloquear todos os cookies, rejeitar cookies de terceiros ou alertar quando um cookie é enviado.</p>
          <p><strong className="text-white font-semibold">4.2.</strong> Consulte as instruções do seu navegador:</p>
          <ul className="list-disc pl-6 space-y-3 mt-4 text-gray-300">
            <li><strong className="text-white font-semibold">Google Chrome:</strong> Definições &gt; Privacidade e segurança &gt; Cookies e outros dados do site.</li>
            <li><strong className="text-white font-semibold">Mozilla Firefox:</strong> Opções &gt; Privacidade e Segurança &gt; Cookies e dados de sites.</li>
            <li><strong className="text-white font-semibold">Safari:</strong> Preferências &gt; Privacidade &gt; Gerir dados do site.</li>
            <li><strong className="text-white font-semibold">Microsoft Edge:</strong> Definições &gt; Permissões do site &gt; Cookies e dados do site.</li>
          </ul>
          <p className="mt-4 italic text-gray-400 text-sm">
            Nota: Ao bloquear ou eliminar cookies estritamente necessários, determinadas funcionalidades do painel do CRM ou o acesso com login podem deixar de funcionar corretamente.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-6">5. Alterações nesta Política de Cookies</h2>
          <p>
            Podemos atualizar esta política periodicamente para refletir alterações nos cookies utilizados ou por exigências legais e regulatórias. Recomendamos a consulta regular desta página para se manter informado sobre o uso destas tecnologias.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-12 mb-6">6. Contacto e Dúvidas</h2>
          <p>Para quaisquer questões sobre o tratamento de cookies ou sobre os nossos termos legais, envie uma mensagem para os nossos canais de suporte:</p>
          <ul className="list-disc pl-6 space-y-3 mt-4 text-gray-300">
            <li><strong className="text-white font-semibold">Titular do Serviço:</strong> Andrews Rocha De Morais</li>
            <li><strong className="text-white font-semibold">E-mail de Contacto:</strong> <a href="mailto:suporte@chataionline.io" className="text-indigo-400 hover:text-indigo-300 transition-colors">suporte@chataionline.io</a></li>
            <li><strong className="text-white font-semibold">Localização:</strong> Avenida Marginal, 761, Ubatuba - São Paulo, Brasil</li>
          </ul>
        </article>
      </div>
    </div>
  );
}
