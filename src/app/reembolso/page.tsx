import { Header } from '@/components/Header';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Política de Reembolso | ChatAI Online',
  description: 'Política de Cancelamento e Reembolso do ChatAI Online',
};

export default function ReembolsoPage() {
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
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Política de Cancelamento e Reembolso</h1>
          <p className="text-slate-500 text-sm">Última atualização: 28 de setembro de 2026</p>
        </header>
        
        <article className="space-y-6 text-lg leading-relaxed">
          <p>
            O ChatAI Online, operado por Andrews Rocha De Morais, inscrito sob o CPF n.º 423.495.698-88, com sede na Avenida Marginal, 761, CEP 11687-147, Ubatuba - São Paulo, Brasil, estabelece por meio deste documento as diretrizes, prazos e condições para cancelamentos de assinaturas e solicitações de reembolso referentes aos planos contratados em <em className="text-slate-500">chataionline.io</em> e suas plataformas associadas.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">1. Direito de Arrependimento (Garantia Legal de 7 Dias)</h2>
          <p>
            <strong className="text-slate-900 font-semibold">1.1.</strong> Em estrita conformidade com o Artigo 49 do Código de Defesa do Consumidor (Lei n.º 8.078/1990), o cliente que contratar qualquer plano do ChatAI Online tem o prazo improrrogável de até 7 (sete) dias corridos, contados a partir da data de confirmação do primeiro pagamento, para desistir da compra e solicitar o reembolso integral dos valores pagos.
          </p>
          <p>
            <strong className="text-slate-900 font-semibold">1.2.</strong> O exercício do direito de arrependimento não exige justificativa operacional e contempla 100% (cem por cento) da quantia despendida na transação inicial.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">2. Procedimento para Solicitar o Reembolso</h2>
          <p>
            <strong className="text-slate-900 font-semibold">2.1.</strong> A solicitação de estorno dentro do prazo de 7 dias deve ser formalizada através de um dos seguintes canais:
          </p>
          <ul className="list-disc pl-6 space-y-3 mt-4 text-slate-700">
            <li><strong className="text-slate-900 font-semibold">E-mail de Suporte:</strong> <a href="mailto:suporte@chataionline.io" className="text-indigo-600 hover:text-indigo-700 transition-colors">suporte@chataionline.io</a> com o assunto &quot;Solicitação de Reembolso - [Seu E-mail de Cadastro]&quot;.</li>
            <li><strong className="text-slate-900 font-semibold">Abertura de Chamado:</strong> Diretamente no painel de suporte ao cliente do CRM.</li>
          </ul>
          <p>
            <strong className="text-slate-900 font-semibold">2.2.</strong> A mensagem deverá conter o nome completo, CPF/CNPJ, e-mail utilizado no cadastro e o comprovante ou identificador da transação de pagamento.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">3. Prazos e Formas de Devolução dos Valores</h2>
          <p>Assim que o pedido for validado pela nossa equipe financeira, a restituição ocorrerá conforme a modalidade de pagamento utilizada na contratação:</p>
          <ul className="list-disc pl-6 space-y-3 mt-4 text-slate-700">
            <li><strong className="text-slate-900 font-semibold">Pix:</strong> O estorno será efetuado diretamente na mesma conta bancária de origem em até 2 (dois) dias úteis.</li>
            <li><strong className="text-slate-900 font-semibold">Cartão de Crédito:</strong> O cancelamento e pedido de estorno serão emitidos junto ao gateway de pagamento em até 3 (três) dias úteis. O crédito na fatura dependerá exclusivamente da administradora do cartão, podendo ocorrer na fatura atual ou na subsequente (em média de 30 a 60 dias).</li>
            <li><strong className="text-slate-900 font-semibold">Boleto Bancário:</strong> O reembolso será realizado via transferência bancária ou Pix para conta de mesma titularidade do comprador em até 5 (cinco) dias úteis após o fornecimento dos dados bancários válidos.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">4. Cancelamento de Assinaturas e Renovação Automática</h2>
          <p>
            <strong className="text-slate-900 font-semibold">4.1. Ciclos Recorrentes:</strong> Os planos do ChatAI Online operam por assinatura pré-paga com renovação automática periódica (mensal ou anual).
          </p>
          <p>
            <strong className="text-slate-900 font-semibold">4.2. Cancelamento a Qualquer Momento:</strong> O cliente pode solicitar o cancelamento da renovação automática a qualquer momento antes do próximo ciclo de cobrança, diretamente no painel do usuário ou pelo e-mail <a href="mailto:suporte@chataionline.io" className="text-indigo-600 hover:text-indigo-700 transition-colors">suporte@chataionline.io</a>.
          </p>
          <p>
            <strong className="text-slate-900 font-semibold">4.3. Efeito do Cancelamento:</strong> Ao cancelar a assinatura após o período de 7 dias da compra inicial, a cobrança do ciclo seguinte é imediatamente interrompida. O cliente continuará com acesso total aos recursos contratados até o término do ciclo já pago, não havendo reembolso proporcional referente aos dias restantes do período corrente.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">5. Planos Anuais</h2>
          <p>
            <strong className="text-slate-900 font-semibold">5.1.</strong> Para planos com faturamento anual que se encontrem fora do prazo de garantia de 7 dias, o cancelamento interrompe a cobrança do próximo ano.
          </p>
          <p>
            <strong className="text-slate-900 font-semibold">5.2.</strong> O cancelamento antecipado de contratos anuais não confere direito à devolução de valores proporcionais aos meses não usufruídos, mantendo-se a disponibilização da plataforma até o fim dos 12 meses faturados.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">6. Bloqueios de Instâncias e Serviços Terceiros</h2>
          <p>
            <strong className="text-slate-900 font-semibold">6.1.</strong> O ChatAI Online não realiza reembolsos ou estornos motivados por eventuais bloqueios, banimentos ou sanções aplicadas por plataformas terceiras (como o WhatsApp/Meta) aos números de telefone do contratante decorrentes de disparos massivos, spam ou violação das políticas de mensageria da referida rede social.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-6">7. Canais de Atendimento</h2>
          <p>Para dúvidas relacionadas a pagamentos, notas fiscais, renovações ou reembolsos:</p>
          <ul className="list-disc pl-6 space-y-3 mt-4 text-slate-700">
            <li><strong className="text-slate-900 font-semibold">E-mail:</strong> <a href="mailto:suporte@chataionline.io" className="text-indigo-600 hover:text-indigo-700 transition-colors">suporte@chataionline.io</a></li>
            <li><strong className="text-slate-900 font-semibold">Horário de Atendimento:</strong> Segunda a sexta-feira, das 09h00 às 18h00 (horário de Brasília).</li>
          </ul>
        </article>
      </div>
    </div>
    </>
  );
}



