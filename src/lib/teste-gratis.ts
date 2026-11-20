/**
 * Teste grátis: UM por empresa (decisão de 11/11/2026).
 *
 * Os termos da Umbler Talk dão 7 dias a quem se cadastra e reservam o direito de
 * recusar recadastro; no CRM o CPF/CNPJ deixou de ser único (uma empresa pode
 * ter mais de uma conta, migration 0507 do CRM), então o documento passa a
 * decidir só o teste: quem já contratou com este documento (ou já teve uma
 * assinatura nesta organização) paga a primeira cobrança no ato, sem novos 7
 * dias. Antes, cada cadastro novo — inclusive em volume, por robô — ganhava 7
 * dias de IA paga pela plataforma.
 *
 * E SÓ NO CARTÃO (decisão de 19/11/2026, auditoria de planos, achado 12). Com
 * Pix ou boleto o teste liberava 7 dias sem nenhum compromisso de pagamento:
 * bastava um e-mail e um CPF novos para ganhar mais uma semana de IA paga pela
 * plataforma — no Escala, 3 agentes e 6 números. O cartão é o que custa caro
 * repetir. Pix e boleto continuam aceitos, mas pagam a primeira cobrança no ato
 * e o CRM abre quando ela é paga.
 */
export type HistoricoDoDocumento = {
  /** A organização que está contratando já teve assinatura (recontratação). */
  recontratacao: boolean;
  /** Outras organizações com este CPF/CNPJ que já tiveram assinatura no Asaas. */
  outrasComAssinatura: number;
  /** A forma de pagamento escolhida no checkout. Só o cartão de crédito dá teste. */
  formaDePagamento: string;
};

export const FORMA_COM_TESTE = "CREDIT_CARD";

export function temDireitoAoTeste(h: HistoricoDoDocumento): boolean {
  return (
    h.formaDePagamento === FORMA_COM_TESTE &&
    !h.recontratacao &&
    h.outrasComAssinatura === 0
  );
}

export const DIAS_DE_TESTE = 7;

/** A data (aaaa-mm-dd) da primeira cobrança no Asaas. */
export function primeiraCobranca(
  comTeste: boolean,
  agora = new Date(),
): string {
  const dias = comTeste ? DIAS_DE_TESTE : 0;
  return new Date(agora.getTime() + dias * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0]!;
}
