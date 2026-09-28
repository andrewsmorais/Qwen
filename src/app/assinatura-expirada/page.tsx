import Link from "next/link";
import { AlertCircle, CreditCard } from "lucide-react";

export default function AssinaturaExpiradaPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center border border-slate-100">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
          <AlertCircle className="w-8 h-8" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          Assinatura Inativa
        </h1>
        
        <p className="text-slate-600 mb-8 leading-relaxed">
          Seu acesso foi suspenso pois não identificamos um pagamento ativo para sua organização. Renove agora para reativar seu agente de vendas.
        </p>

        <div className="space-y-4">
          <Link 
            href="/#precos"
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/30"
          >
            <CreditCard className="w-5 h-5" />
            Renovar Assinatura
          </Link>
          
          <Link 
            href="/login"
            className="block text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
}
