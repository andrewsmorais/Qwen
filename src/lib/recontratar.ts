/**
 * Quando uma organização que já teve assinatura pode contratar de novo pela
 * página. Sem isto, a página recusava SEMPRE ("já possui uma assinatura"), e
 * duas pessoas ficavam sem saída: quem cancelou e quer voltar, e quem teve a
 * contratação interrompida no meio (reserva `suspended` sem assinatura no
 * Asaas — a "conta presa").
 *
 * Recontrata:
 *   - `canceled` com o período já terminado (ou sem período);
 *   - `suspended` SEM assinatura no Asaas, parada há mais de 10 minutos
 *     (tentativa que falhou; 10 minutos separa de uma aba ainda em andamento).
 * Não recontrata:
 *   - `past_due`: o Asaas segue cobrando — assinatura nova cobraria em dobro;
 *     o caminho é pagar a fatura em aberto (botão no CRM);
 *   - todo o resto (ativa, em teste, cancelada ainda dentro do período pago).
 */
export type AssinaturaAnterior = {
  status: string | null;
  current_period_end: string | null;
  asaas_subscription_id: string | null;
  updated_at: string | null;
};

export type VereditoDeRecontratacao =
  | { pode: true }
  | {
      pode: false;
      motivo: "em_atraso" | "assinatura_vigente" | "tentativa_em_andamento";
    };

export const ESPERA_DE_TENTATIVA_MS = 10 * 60 * 1000;

export function podeRecontratar(
  a: AssinaturaAnterior,
  agora: Date,
): VereditoDeRecontratacao {
  const fim = a.current_period_end ? Date.parse(a.current_period_end) : NaN;
  if (a.status === "past_due") return { pode: false, motivo: "em_atraso" };
  if (a.status === "canceled") {
    return Number.isNaN(fim) || fim <= agora.getTime()
      ? { pode: true }
      : { pode: false, motivo: "assinatura_vigente" };
  }
  if (a.status === "suspended" && !a.asaas_subscription_id) {
    const ultima = a.updated_at ? Date.parse(a.updated_at) : NaN;
    return Number.isNaN(ultima) ||
      agora.getTime() - ultima > ESPERA_DE_TENTATIVA_MS
      ? { pode: true }
      : { pode: false, motivo: "tentativa_em_andamento" };
  }
  return { pode: false, motivo: "assinatura_vigente" };
}
