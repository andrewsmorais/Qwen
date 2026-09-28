"use client";

import { useState, useEffect } from "react";
import { CreditCard, QrCode, FileText, Smartphone, Copy, Check, Loader2, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useRouter } from "next/navigation";
import { CRM_URL } from "@/lib/urls";

export type PaymentMethod = "PIX" | "BOLETO" | "CREDIT_CARD" | "DEBIT_CARD";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string; // Vai ser injetado pelo componente que chama
  planType: "essencial" | "impulso" | "escala";
  planValue: number;
}

export function CheckoutModal({ isOpen, onClose, organizationId, planType, planValue }: CheckoutModalProps) {
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethod>("CREDIT_CARD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Sucesso
  const [isSuccess, setIsSuccess] = useState(false);

  // User Info Form (Preenchido na tela principal)
  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    cpfCnpj: "",
    phone: "",
    postalCode: "",
    addressNumber: ""
  });

  // PIX States
  const [pixData, setPixData] = useState<{ qrCode: string; payload: string; paymentId: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Boleto States
  const [boletoData, setBoletoData] = useState<{ url: string; paymentId: string } | null>(null);

  // Card States
  const [cardForm, setCardForm] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
    installments: 1
  });

  useEffect(() => {
    // Polling para PIX (Caso o usuário pague na hora, mesmo em trial)
    let interval: NodeJS.Timeout;
    if (pixData?.paymentId) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/asaas/check-payment/${pixData.paymentId}`);
          const data = await res.json();
          if (data.asaas_status === "RECEIVED" || data.asaas_status === "CONFIRMED") {
            clearInterval(interval);
            handleSuccess();
          }
        } catch (err) {
          console.error("Polling error", err);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [pixData]);

  const handleSuccess = () => {
    setIsSuccess(true);
    // Redireciona para a área logada após 3 segundos
    setTimeout(() => {
      window.location.href = CRM_URL;
    }, 3000);
  };

  if (!isOpen) return null;

  const handleCopyPix = () => {
    if (pixData?.payload) {
      navigator.clipboard.writeText(pixData.payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let creditCardToken = undefined;

      // Validações básicas de usuário
      const phoneDigits = customerForm.phone.replace(/\D/g, "");
      if (!customerForm.name || !customerForm.email || !customerForm.cpfCnpj || !customerForm.phone) {
        throw new Error("Por favor, preencha seus dados pessoais (Nome, Email, CPF/CNPJ e Celular)");
      }
      if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        throw new Error("Por favor, informe um número de celular válido com DDD.");
      }

      // Se for cartão, tokeniza antes
      if (method === "CREDIT_CARD" || method === "DEBIT_CARD") {
        if (!cardForm.number || !cardForm.name || !cardForm.expiry || !cardForm.cvv) {
          throw new Error("Por favor, preencha todos os dados do cartão de crédito.");
        }
        const cepDigits = customerForm.postalCode.replace(/\D/g, "");
        if (cepDigits.length !== 8 || !customerForm.addressNumber) {
          throw new Error("Para pagamentos com cartão, o CEP e Número do endereço são obrigatórios.");
        }
        
        const [month, year] = cardForm.expiry.split("/");
        
        const tokenRes = await fetch("/api/asaas/tokenize-card", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer: {
              name: customerForm.name,
              email: customerForm.email,
              cpfCnpj: customerForm.cpfCnpj.replace(/\D/g, ""),
              phone: phoneDigits
            },
            holder_name: cardForm.name,
            card_number: cardForm.number,
            expiry_month: month,
            expiry_year: year,
            ccv: cardForm.cvv,
            holder_info: {
              name: customerForm.name,
              email: customerForm.email,
              cpfCnpj: customerForm.cpfCnpj.replace(/\D/g, ""),
              postalCode: cepDigits,
              addressNumber: customerForm.addressNumber,
              phone: phoneDigits
            }
          })
        });
        
        const tokenData = await tokenRes.json();
        if (!tokenData.success) throw new Error(tokenData.error);
        creditCardToken = tokenData.creditCardToken;
      }

      // Cria a cobrança com status Trial
      const payRes = await fetch("/api/asaas/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization_id: organizationId,
          customer_name: customerForm.name,
          customer_email: customerForm.email,
          customer_cpf_cnpj: customerForm.cpfCnpj,
          value: planValue,
          plan_type: planType,
          billing_type: method,
          credit_card_token: creditCardToken,
          installment_count: cardForm.installments
        })
      });

      const payData = await payRes.json();
      if (!payData.success) throw new Error(payData.error);

      if (method === "PIX") {
        setPixData({
          qrCode: payData.pixQrCode,
          payload: payData.pixPayload,
          paymentId: payData.payment_id
        });
        handleSuccess(); // PIX e BOLETO também são liberados imediatamente no modo Trial
      } else if (method === "BOLETO") {
        setBoletoData({
          url: payData.boletoUrl,
          paymentId: payData.payment_id
        });
        handleSuccess(); // PIX e BOLETO também são liberados imediatamente no modo Trial
      } else {
        // Cartão aprovado e agendado
        handleSuccess();
      }

    } catch (err: any) {
      setError(err.message || "Erro ao processar. Verifique os dados inseridos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative scrollbar-hide">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X className="w-6 h-6" />
        </button>

        {isSuccess ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
              <Check className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Teste grátis de 7 dias ativado!</h2>
            <p className="text-slate-600 mb-8 text-lg">Sua conta foi criada e liberada. Você já pode usar a plataforma.</p>
            <div className="flex items-center justify-center gap-2 text-indigo-600 font-medium">
              <Loader2 className="w-5 h-5 animate-spin" />
              Redirecionando para o CRM...
            </div>
          </div>
        ) : (
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Comece seu Teste Grátis</h2>
              <div className="flex items-center justify-between">
                 <p className="text-slate-500">Plano {planType.charAt(0).toUpperCase() + planType.slice(1)}</p>
                 <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">7 Dias Grátis</span>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                {error}
              </div>
            )}

            {/* FORMULÁRIO COMPLETO */}
            <form onSubmit={handleCheckout}>
              
              {/* DADOS PESSOAIS */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Seus Dados</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                    <input type="text" required value={customerForm.name} onChange={e => setCustomerForm({...customerForm, name: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-all"/>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                      <input type="email" required value={customerForm.email} onChange={e => setCustomerForm({...customerForm, email: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-all"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">CPF/CNPJ</label>
                      <input type="text" required value={customerForm.cpfCnpj} onChange={e => setCustomerForm({...customerForm, cpfCnpj: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-all"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Celular</label>
                      <input type="text" placeholder="(12) 99999-9999" required value={customerForm.phone} onChange={e => setCustomerForm({...customerForm, phone: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-all"/>
                    </div>
                  </div>
                  {(method === "CREDIT_CARD" || method === "DEBIT_CARD") && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">CEP</label>
                        <input type="text" required value={customerForm.postalCode} onChange={e => setCustomerForm({...customerForm, postalCode: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-all"/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Número do endereço</label>
                        <input type="text" required value={customerForm.addressNumber} onChange={e => setCustomerForm({...customerForm, addressNumber: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-all"/>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* MÉTODOS DE PAGAMENTO */}
              <div className="mb-8 border-t border-slate-100 pt-8">
                 <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Forma de Pagamento</h3>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                   {[
                     { id: "CREDIT_CARD", icon: CreditCard, label: "Crédito" },
                     { id: "PIX", icon: QrCode, label: "PIX" },
                     { id: "BOLETO", icon: FileText, label: "Boleto" },
                     { id: "DEBIT_CARD", icon: Smartphone, label: "Débito" }
                   ].map(opt => (
                     <button
                       key={opt.id} type="button"
                       onClick={() => setMethod(opt.id as PaymentMethod)}
                       className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                         method === opt.id 
                         ? "border-indigo-600 bg-indigo-50 text-indigo-700" 
                         : "border-slate-200 hover:border-indigo-300 text-slate-600"
                       }`}
                     >
                       <opt.icon className="w-6 h-6 mb-2" />
                       <span className="text-sm font-semibold">{opt.label}</span>
                     </button>
                   ))}
                 </div>

                {/* INFO DE AGENDAMENTO (IMPORTANTE PARA O TRIAL) */}
                {(method === "CREDIT_CARD" || method === "DEBIT_CARD") && (
                   <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm p-4 rounded-xl mb-6">
                      <strong>Aviso importante:</strong> Seu cartão <strong>NÃO</strong> será cobrado hoje. A cobrança de R$ {planValue.toFixed(2)} ocorrerá apenas após o fim do seu período de teste grátis (7 dias). Você pode cancelar a qualquer momento antes disso.
                   </div>
                )}
                {(method === "PIX" || method === "BOLETO") && (
                   <div className="bg-amber-50 border border-amber-100 text-amber-700 text-sm p-4 rounded-xl mb-6">
                      <strong>Aviso importante:</strong> Para validar o cadastro via PIX ou Boleto, será gerada uma fatura agora, mas seu <strong>acesso de teste de 7 dias será liberado imediatamente</strong>. Você pode pagar a fatura em até 7 dias para não ter o acesso interrompido.
                   </div>
                )}

                 {/* DADOS DO CARTÃO */}
                 {(method === "CREDIT_CARD" || method === "DEBIT_CARD") && (
                   <div className="space-y-4">
                     <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">Número do Cartão</label>
                       <input type="text" placeholder="0000 0000 0000 0000" value={cardForm.number} onChange={e => setCardForm({...cardForm, number: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-all"/>
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">Nome impresso no cartão</label>
                       <input type="text" value={cardForm.name} onChange={e => setCardForm({...cardForm, name: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-all"/>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Validade (MM/AA)</label>
                         <input type="text" placeholder="MM/AA" value={cardForm.expiry} onChange={e => setCardForm({...cardForm, expiry: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-all"/>
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">CVV</label>
                         <input type="text" placeholder="123" maxLength={4} value={cardForm.cvv} onChange={e => setCardForm({...cardForm, cvv: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-all"/>
                       </div>
                     </div>
                   </div>
                 )}
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {loading ? "Processando e validando..." : "Começar 7 dias grátis"}
              </button>
            </form>

          </div>
        )}
      </div>
    </div>
  );
}



