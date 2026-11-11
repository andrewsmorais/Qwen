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
 */
export type HistoricoDoDocumento = {
  /** A organização que está contratando já teve assinatura (recontratação). */
  recontratacao: boolean;
  /** Outras organizações com este CPF/CNPJ que já tiveram assinatura no Asaas. */
  outrasComAssinatura: number;
};

export function temDireitoAoTeste(h: HistoricoDoDocumento): boolean {
  return !h.recontratacao && h.outrasComAssinatura === 0;
}

export const DIAS_DE_TESTE = 7;

/** A data (aaaa-mm-dd) da primeira cobrança no Asaas. */
export function primeiraCobranca(comTeste: boolean, agora = new Date()): string {
  const dias = comTeste ? DIAS_DE_TESTE : 0;
  return new Date(agora.getTime() + dias * 24 * 60 * 60 * 1000).toISOString().split("T")[0]!;
}
