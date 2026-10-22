"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CreditCard,
  QrCode,
  FileText,
  Smartphone,
  Check,
  Loader2,
  X,
} from "lucide-react";
import { CRM_URL } from "@/lib/urls";
import { createSupabaseClient } from "@/lib/supabase";
import { PLANOS, selecionarPlano, type Plano, type Ciclo } from "@/lib/planos";

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const nomeDoCiclo: Record<Ciclo, string> = {
  monthly: "mês",
  quarterly: "trimestre",
  yearly: "ano",
};

export type PaymentMethod = "PIX" | "BOLETO" | "CREDIT_CARD" | "DEBIT_CARD";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId?: string | null;
  planType: Plano;
  billingCycle: Ciclo;
  attendants?: number;
}

export function CheckoutModal({
  isOpen,
  onClose,
  organizationId,
  planType,
  billingCycle,
  attendants,
}: CheckoutModalProps) {
  const [method, setMethod] = useState<PaymentMethod>("CREDIT_CARD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attendantCount, setAttendantCount] = useState(
    String(attendants ?? PLANOS[planType].min_attendants),
  );
  const [paymentSessionToken, setPaymentSessionToken] = useState<string | null>(
    null,
  );
  let selecao: ReturnType<typeof selecionarPlano> | null = null;
  try {
    selecao = selecionarPlano(planType, billingCycle, Number(attendantCount));
  } catch {
    /* O formulário mostra a quantidade inválida antes de enviar. */
  }

  // Sucesso
  const [isSuccess, setIsSuccess] = useState(false);

  // User Info Form (Preenchido na tela principal)
  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    cpfCnpj: "",
    phone: "",
    postalCode: "",
    addressNumber: "",
    password: "",
    confirmPassword: "",
  });

  // PIX States
  const [pixData, setPixData] = useState<{ paymentId: string | null } | null>(
    null,
  );

  // Card States
  const [cardForm, setCardForm] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
    installments: 1,
  });

  const handleSuccess = useCallback(() => {
    setIsSuccess(true);
    setTimeout(() => {
      const destino = new URL("/login?next=%2Fonboarding", CRM_URL);
      window.location.assign(destino.href);
    }, 3000);
  }, []);

  useEffect(() => {
    // Consultas de pagamento exigem uma sessão e uma cobrança real.
    const paymentId = pixData?.paymentId;
    if (!isOpen || !paymentId?.startsWith("pay_") || !paymentSessionToken)
      return;
    const controller = new AbortController();
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/asaas/check-payment/${encodeURIComponent(paymentId)}`,
          {
            headers: { Authorization: `Bearer ${paymentSessionToken}` },
            signal: controller.signal,
          },
        );
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) clearInterval(interval);
          return;
        }
        const data = await res.json();
        if (
          data.asaas_status === "RECEIVED" ||
          data.asaas_status === "CONFIRMED"
        ) {
          clearInterval(interval);
          handleSuccess();
        }
      } catch {
        /* A falha de consulta não repete o checkout. */
      }
    }, 5000);
    return () => {
      clearInterval(interval);
      controller.abort();
    };
  }, [isOpen, pixData?.paymentId, paymentSessionToken, handleSuccess]);

  if (!isOpen) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Conferir plano e quantidade antes de qualquer tokenização ou cobrança.
      const selecaoDoPedido = selecionarPlano(
        planType,
        billingCycle,
        Number(attendantCount),
      );
      if (method === "DEBIT_CARD")
        throw new Error(
          "Débito indisponível para assinaturas. Selecione outra forma de pagamento.",
        );
      let creditCardToken = undefined;

      // Validações básicas de usuário
      const phoneDigits = customerForm.phone.replace(/\D/g, "");
      if (
        !customerForm.name ||
        !customerForm.email ||
        !customerForm.cpfCnpj ||
        !customerForm.phone
      ) {
        throw new Error(
          "Por favor, preencha seus dados pessoais (Nome, Email, CPF/CNPJ e Celular)",
        );
      }
      if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        throw new Error(
          "Por favor, informe um número de celular válido com DDD.",
        );
      }

      // Quem já tem conta (veio do CRM com a organização) entra com a senha dela.
      if (organizationId && !customerForm.password) {
        throw new Error("Digite a senha da sua conta para continuar.");
      }

      // Validação de senha para novos cadastros (onboarding self-service)
      if (!organizationId) {
        if (!customerForm.password || customerForm.password.length < 8) {
          throw new Error(
            "Por favor, defina uma senha de acesso com no mínimo 8 caracteres.",
          );
        }
        if (customerForm.password !== customerForm.confirmPassword) {
          throw new Error(
            "As senhas informadas não coincidem. Verifique a digitação.",
          );
        }
      }

      // Se for cartão, tokeniza antes
      if (method === "CREDIT_CARD") {
        if (
          !cardForm.number ||
          !cardForm.name ||
          !cardForm.expiry ||
          !cardForm.cvv
        ) {
          throw new Error(
            "Por favor, preencha todos os dados do cartão de crédito.",
          );
        }
        const cepDigits = customerForm.postalCode.replace(/\D/g, "");
        if (cepDigits.length !== 8 || !customerForm.addressNumber) {
          throw new Error(
            "Para pagamentos com cartão, o CEP e Número do endereço são obrigatórios.",
          );
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
              phone: phoneDigits,
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
              phone: phoneDigits,
            },
          }),
        });

        const tokenData = await tokenRes.json();
        if (!tokenData.success) throw new Error(tokenData.error);
        creditCardToken = tokenData.creditCardToken;
      }

      // Headers com autorização de sessão (caso usuário já esteja autenticado no Supabase)
      const reqHeaders: Record<string, string> = {
        "Content-Type": "application/json",
      };
      const supabase = createSupabaseClient();
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.access_token) {
          reqHeaders["Authorization"] = `Bearer ${session.access_token}`;
        }
      } catch {
        // Sem sessão ativa no momento da requisição
      }

      /**
       * Entra com a conta que já existe. A sessão do CRM mora no endereço do CRM
       * e esta página não a enxerga: sem isto, quem chegava do CRM para escolher
       * o plano recebia 401, e quem tinha a conta criada sem plano recebia
       * "e-mail já cadastrado" sem caminho de volta para o pagamento.
       */
      const entrarComAConta = async (): Promise<boolean> => {
        const { data, error: erroDeEntrada } =
          await supabase.auth.signInWithPassword({
            email: customerForm.email.trim(),
            password: customerForm.password,
          });
        if (erroDeEntrada || !data.session?.access_token) return false;
        reqHeaders["Authorization"] = `Bearer ${data.session.access_token}`;
        return true;
      };
      if (
        organizationId &&
        !reqHeaders.Authorization &&
        !(await entrarComAConta())
      ) {
        throw new Error(
          "E-mail ou senha não conferem com a sua conta. Use os mesmos dados com que você entra no CRM.",
        );
      }

      const pedir = () =>
        fetch("/api/asaas/create-payment", {
          method: "POST",
          headers: reqHeaders,
          body: JSON.stringify({
            organization_id: organizationId || undefined,
            plan_slug: planType,
            billing_cycle: billingCycle,
            attendants: selecaoDoPedido.seats,
            customer: {
              name: customerForm.name,
              email: customerForm.email,
              cpfCnpj: customerForm.cpfCnpj.replace(/\D/g, ""),
              phone: phoneDigits,
              postalCode:
                (customerForm.postalCode || "").replace(/\D/g, "") || undefined,
              addressNumber: customerForm.addressNumber || undefined,
            },
            // Com sessão, a senha não viaja: a conta já existe.
            password: reqHeaders.Authorization
              ? undefined
              : customerForm.password || undefined,
            billing_type: method,
            credit_card_token: creditCardToken,
            installment_count: cardForm.installments,
          }),
        });

      // Cria a cobrança com status Trial ou Pending
      let payRes = await pedir();
      if (
        payRes.status === 409 &&
        !organizationId &&
        !reqHeaders.Authorization
      ) {
        // A conta já existe (foi criada numa tentativa que não terminou). Com a
        // mesma senha, entra nela e termina a compra; o servidor acha a
        // organização pela sessão.
        const conflito = await payRes
          .clone()
          .json()
          .catch(() => null);
        if (conflito?.code === "conta_existente") {
          if (!(await entrarComAConta()))
            throw new Error(
              'Este e-mail já tem conta. Digite a senha dela para continuar a compra, ou entre no CRM e use "Esqueci minha senha".',
            );
          payRes = await pedir();
        }
      }
      setPaymentSessionToken(
        reqHeaders.Authorization?.replace(/^Bearer\s+/i, "") ?? null,
      );

      const payData = await payRes.json();
      if (!payRes.ok || (!payData.success && !payData.ok)) {
        throw new Error(payData.error || "Erro ao processar assinatura");
      }

      if (method === "PIX") {
        setPixData({
          paymentId:
            typeof payData.payment_id === "string" &&
            payData.payment_id.startsWith("pay_")
              ? payData.payment_id
              : null,
        });
        handleSuccess(); // PIX e BOLETO também são liberados imediatamente no modo Trial
      } else if (method === "BOLETO") {
        handleSuccess(); // PIX e BOLETO também são liberados imediatamente no modo Trial
      } else {
        // Cartão aprovado e agendado
        handleSuccess();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao processar. Verifique os dados inseridos.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative scrollbar-hide">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-6 h-6" />
        </button>

        {isSuccess ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
              <Check className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Teste grátis de 7 dias ativado!
            </h2>
            <p className="text-slate-600 mb-8 text-lg">
              Seu plano foi registrado. Entre no CRM com o e-mail e a senha da
              sua conta para configurar seu agente.
            </p>
            <div className="flex items-center justify-center gap-2 text-indigo-600 font-medium">
              <Loader2 className="w-5 h-5 animate-spin" />
              Redirecionando para o CRM...
            </div>
          </div>
        ) : (
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Comece seu Teste Grátis
              </h2>
              <div className="flex items-center justify-between">
                <p className="text-slate-500">Plano {PLANOS[planType].name}</p>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                  7 Dias Grátis
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                {error}
              </div>
            )}

            {/* FORMULÁRIO COMPLETO */}
            <form onSubmit={handleCheckout}>
              <div className="mb-8">
                <label
                  htmlFor="checkout-attendants"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Quantidade de atendentes humanos
                </label>
                <input
                  id="checkout-attendants"
                  type="number"
                  required
                  min={PLANOS[planType].min_attendants}
                  max={1000}
                  step={1}
                  value={attendantCount}
                  disabled={loading}
                  onChange={(e) => setAttendantCount(e.target.value)}
                  aria-describedby="checkout-plan-summary"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-all"
                />
                <p
                  id="checkout-plan-summary"
                  className="text-sm text-slate-500 mt-2"
                  aria-live="polite"
                >
                  Mínimo de {PLANOS[planType].min_attendants}{" "}
                  {PLANOS[planType].min_attendants === 1
                    ? "atendente"
                    : "atendentes"}
                  .{" "}
                  {selecao
                    ? `Total para ${selecao.seats} ${selecao.seats === 1 ? "atendente" : "atendentes"}: ${moeda.format(selecao.value)} por ${nomeDoCiclo[billingCycle]}, após os 7 dias grátis.`
                    : "Informe uma quantidade inteira válida para conferir o total."}
                </p>
              </div>

              {/* DADOS PESSOAIS */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                  Seus Dados
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={customerForm.name}
                      onChange={(e) =>
                        setCustomerForm({
                          ...customerForm,
                          name: e.target.value,
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={customerForm.email}
                        onChange={(e) =>
                          setCustomerForm({
                            ...customerForm,
                            email: e.target.value,
                          })
                        }
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        CPF/CNPJ
                      </label>
                      <input
                        type="text"
                        required
                        value={customerForm.cpfCnpj}
                        onChange={(e) =>
                          setCustomerForm({
                            ...customerForm,
                            cpfCnpj: e.target.value,
                          })
                        }
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Celular
                      </label>
                      <input
                        type="text"
                        placeholder="(12) 99999-9999"
                        required
                        value={customerForm.phone}
                        onChange={(e) =>
                          setCustomerForm({
                            ...customerForm,
                            phone: e.target.value,
                          })
                        }
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                  {method === "CREDIT_CARD" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          CEP
                        </label>
                        <input
                          type="text"
                          required
                          value={customerForm.postalCode}
                          onChange={(e) =>
                            setCustomerForm({
                              ...customerForm,
                              postalCode: e.target.value,
                            })
                          }
                          className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Número do endereço
                        </label>
                        <input
                          type="text"
                          required
                          value={customerForm.addressNumber}
                          onChange={(e) =>
                            setCustomerForm({
                              ...customerForm,
                              addressNumber: e.target.value,
                            })
                          }
                          className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>
                  )}
                  {organizationId && (
                    <div className="pt-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Senha da sua conta
                      </label>
                      <input
                        type="password"
                        required
                        autoComplete="current-password"
                        placeholder="A mesma com que você entra no CRM"
                        value={customerForm.password}
                        onChange={(e) =>
                          setCustomerForm({
                            ...customerForm,
                            password: e.target.value,
                          })
                        }
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-all text-sm"
                      />
                    </div>
                  )}
                  {!organizationId && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Crie sua Senha de Acesso
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="Mínimo 8 caracteres"
                          value={customerForm.password}
                          onChange={(e) =>
                            setCustomerForm({
                              ...customerForm,
                              password: e.target.value,
                            })
                          }
                          className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Confirme sua Senha
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="Repita a senha"
                          value={customerForm.confirmPassword}
                          onChange={(e) =>
                            setCustomerForm({
                              ...customerForm,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-all text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* MÉTODOS DE PAGAMENTO */}
              <div className="mb-8 border-t border-slate-100 pt-8">
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                  Forma de Pagamento
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {[
                    { id: "CREDIT_CARD", icon: CreditCard, label: "Crédito" },
                    { id: "PIX", icon: QrCode, label: "PIX" },
                    { id: "BOLETO", icon: FileText, label: "Boleto" },
                    { id: "DEBIT_CARD", icon: Smartphone, label: "Débito" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={opt.id === "DEBIT_CARD" || loading}
                      onClick={() => setMethod(opt.id as PaymentMethod)}
                      className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                        method === opt.id
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                          : "border-slate-200 hover:border-indigo-300 text-slate-600"
                      }`}
                    >
                      <opt.icon className="w-6 h-6 mb-2" />
                      <span className="text-sm font-semibold">{opt.label}</span>
                      {opt.id === "DEBIT_CARD" && (
                        <span className="text-xs mt-1">
                          Indisponível para assinaturas
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* INFO DE AGENDAMENTO (IMPORTANTE PARA O TRIAL) */}
                {method === "CREDIT_CARD" && selecao && (
                  <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm p-4 rounded-xl mb-6">
                    <strong>Aviso importante:</strong> Seu cartão{" "}
                    <strong>NÃO</strong> será cobrado hoje. A cobrança de{" "}
                    {moeda.format(selecao.value)} por{" "}
                    {nomeDoCiclo[billingCycle]}, para {selecao.seats}{" "}
                    atendentes, ocorrerá apenas após o fim do seu período de
                    teste grátis (7 dias). Você pode cancelar a qualquer momento
                    antes disso.
                  </div>
                )}
                {(method === "PIX" || method === "BOLETO") && selecao && (
                  <div className="bg-amber-50 border border-amber-100 text-amber-700 text-sm p-4 rounded-xl mb-6">
                    <strong>Aviso importante:</strong> Será gerada uma fatura de{" "}
                    {moeda.format(selecao.value)} por{" "}
                    {nomeDoCiclo[billingCycle]}, para {selecao.seats}{" "}
                    atendentes, com vencimento após os 7 dias de teste grátis.
                    Seu{" "}
                    <strong>
                      acesso de teste será liberado após a confirmação do
                      cadastro
                    </strong>
                    . Pague até o vencimento para continuar usando seu plano.
                  </div>
                )}

                {/* DADOS DO CARTÃO */}
                {method === "CREDIT_CARD" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Número do Cartão
                      </label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={cardForm.number}
                        onChange={(e) =>
                          setCardForm({ ...cardForm, number: e.target.value })
                        }
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Nome impresso no cartão
                      </label>
                      <input
                        type="text"
                        value={cardForm.name}
                        onChange={(e) =>
                          setCardForm({ ...cardForm, name: e.target.value })
                        }
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Validade (MM/AA)
                        </label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          value={cardForm.expiry}
                          onChange={(e) =>
                            setCardForm({ ...cardForm, expiry: e.target.value })
                          }
                          className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          maxLength={4}
                          value={cardForm.cvv}
                          onChange={(e) =>
                            setCardForm({ ...cardForm, cvv: e.target.value })
                          }
                          className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-all"
                        />
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
                {loading
                  ? "Processando e validando..."
                  : "Começar 7 dias grátis"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
