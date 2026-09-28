import Link from 'next/link';
import { ArrowLeft, MessageCircle, Mail, MapPin, Clock } from 'lucide-react';

export const metadata = {
  title: 'Contato | ChatAI Online',
  description: 'Fale com a equipe da ChatAI Online',
};

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 py-16 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para a página inicial
        </Link>
        
        <header className="mb-12 border-b border-gray-800 pb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Fale Conosco</h1>
          <p className="text-gray-400 text-lg max-w-3xl">
            Estamos prontos para atender a sua empresa, tirar dúvidas sobre o CRM com IA, ouvir as suas sugestões de melhoria ou desenvolver uma solução personalizada sob medida para a sua operação.
          </p>
        </header>
        
        <div className="grid md:grid-cols-5 gap-12 lg:gap-16">
          {/* Informações de Contato */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Canais Diretos de Atendimento</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="bg-indigo-900/30 p-3 rounded-lg text-indigo-400 shrink-0">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">WhatsApp Direto</h3>
                    <p className="text-sm text-gray-400 mb-2">Clique no link abaixo para iniciar uma conversa imediata.</p>
                    <a 
                      href="https://wa.me/5512991842793?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20a%20equipe%20da%20ChatAI%20Online"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-green-400 hover:text-green-300 transition-colors"
                    >
                      +55 12 99184-2793
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-indigo-900/30 p-3 rounded-lg text-indigo-400 shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">E-mail de Suporte e Contato</h3>
                    <p className="text-sm text-gray-400 mb-2">Para suporte técnico, dúvidas sobre assinaturas ou propostas comerciais.</p>
                    <a 
                      href="mailto:suporte@chataionline.io?subject=Contato%20ChatAI%20Online"
                      className="inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      suporte@chataionline.io
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-indigo-900/30 p-3 rounded-lg text-indigo-400 shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Sede Operacional</h3>
                    <p className="text-sm text-gray-400">
                      Avenida Marginal, 761, CEP 11687-147<br/>
                      Ubatuba, São Paulo, Brasil
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-indigo-900/30 p-3 rounded-lg text-indigo-400 shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Horário de Atendimento</h3>
                    <p className="text-sm text-gray-400">
                      Segunda a sexta-feira, das 09h00 às 18h00 (horário de Brasília).
                    </p>
                    <p className="text-xs text-indigo-400 mt-1 italic">
                      Agentes de IA ativos 24 horas por dia.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div className="md:col-span-3">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-6">Envie sua mensagem</h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="nome" className="text-sm font-medium text-gray-300">Nome Completo</label>
                    <input 
                      type="text" 
                      id="nome"
                      name="nome"
                      required
                      className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-300">Seu Melhor E-mail</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      required
                      className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="email@empresa.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="telefone" className="text-sm font-medium text-gray-300">WhatsApp / Telefone</label>
                    <input 
                      type="text" 
                      id="telefone"
                      name="telefone"
                      className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="empresa" className="text-sm font-medium text-gray-300">Nome da Sua Empresa / Ramo <span className="text-gray-500 text-xs font-normal">(Opcional)</span></label>
                    <input 
                      type="text" 
                      id="empresa"
                      name="empresa"
                      className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Sua Empresa"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Assunto Principal</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      "Solicitar Serviço / Projeto",
                      "Sugestão de Funcionalidade",
                      "Ideia de Melhoria no Sistema",
                      "Reclamação ou Problema",
                      "Dúvidas sobre Planos"
                    ].map((option, idx) => (
                      <label key={idx} className="flex items-start gap-3 p-3 border border-gray-800 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-colors">
                        <input type="radio" name="assunto" value={option} className="mt-1 shrink-0 text-indigo-500 bg-gray-950 border-gray-700 focus:ring-indigo-500" />
                        <span className="text-sm text-gray-300">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="mensagem" className="text-sm font-medium text-gray-300">Sua Mensagem</label>
                  <textarea 
                    id="mensagem"
                    name="mensagem"
                    required
                    rows={5}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-y"
                    placeholder="Descreva detalhadamente como podemos te ajudar..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4"
                >
                  Enviar Mensagem
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
