export const CRM_URL =
  process.env.NEXT_PUBLIC_CRM_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:3000"
    : "https://crm.chataionline.io");

/**
 * O WhatsApp comercial — o MESMO número do botão verde flutuante e do quadro
 * "Teste o nosso agente". Quem responde nele é o agente de IA do ChatAI.
 * Trocar o número aqui troca nos dois lugares.
 */
export const WHATSAPP_COMERCIAL = "5512991842793";

/** Link do WhatsApp com a primeira mensagem já escrita. */
export function linkDoWhatsapp(mensagem: string): string {
  return `https://wa.me/${WHATSAPP_COMERCIAL}?text=${encodeURIComponent(mensagem)}`;
}

/**
 * O rosto do agente no quadro "Teste o nosso agente". Por enquanto é o logo;
 * para trocar, ponha a imagem em `public/` e mude o caminho aqui.
 */
export const AVATAR_DO_AGENTE = "/logo.png";
