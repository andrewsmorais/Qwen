export const CRM_URL =
  process.env.NEXT_PUBLIC_CRM_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:3000"
    : "https://crm.chataionline.io");
