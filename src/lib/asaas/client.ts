// SDK wrapper para a API do Asaas
// Todas as chamadas passam por aqui para centralizar headers e error handling

const ASAAS_BASE_URL = process.env.ASAAS_BASE_URL || "https://api.asaas.com";

function getHeaders() {
  const key = process.env.ASAAS_API_KEY;
  if (!key) throw new Error("ASAAS_API_KEY não configurada");
  return {
    "Content-Type": "application/json",
    access_token: key,
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data?.errors?.[0]?.description || data?.message || "Erro na API do Asaas";
    console.error("[Asaas API Error]", res.status, JSON.stringify(data));
    throw new Error(errorMsg);
  }
  return data as T;
}

// ───── Customers ─────

export async function findCustomerByCpfCnpj(cpfCnpj: string) {
  const res = await fetch(`${ASAAS_BASE_URL}/v3/customers?cpfCnpj=${cpfCnpj}`, {
    headers: getHeaders(),
  });
  const data = await handleResponse<{ data: Array<{ id: string; name: string; email: string; cpfCnpj: string }> }>(res);
  return data.data?.[0] ?? null;
}

export async function createCustomer(params: {
  name: string;
  email: string;
  cpfCnpj: string;
  phone?: string;
  postalCode?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
}) {
  const res = await fetch(`${ASAAS_BASE_URL}/v3/customers`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(params),
  });
  return handleResponse<{ id: string; name: string; email: string; cpfCnpj: string }>(res);
}

export async function findOrCreateCustomer(params: {
  name: string;
  email: string;
  cpfCnpj: string;
  phone?: string;
}) {
  const existing = await findCustomerByCpfCnpj(params.cpfCnpj);
  if (existing) return existing;
  return createCustomer(params);
}

// ───── Payments ─────

export async function createPayment(params: Record<string, unknown>) {
  const res = await fetch(`${ASAAS_BASE_URL}/v3/payments`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(params),
  });
  return handleResponse<{
    id: string;
    status: string;
    billingType: string;
    value: number;
    invoiceUrl?: string;
    bankSlipUrl?: string;
  }>(res);
}

export async function getPayment(paymentId: string) {
  const res = await fetch(`${ASAAS_BASE_URL}/v3/payments/${paymentId}`, {
    headers: getHeaders(),
  });
  return handleResponse<{
    id: string;
    status: string;
    billingType: string;
    value: number;
    invoiceUrl?: string;
    bankSlipUrl?: string;
    confirmedDate?: string;
  }>(res);
}

// ───── PIX QR Code ─────

export async function getPixQrCode(paymentId: string) {
  const res = await fetch(`${ASAAS_BASE_URL}/v3/payments/${paymentId}/pixQrCode`, {
    headers: getHeaders(),
  });
  return handleResponse<{
    encodedImage: string;
    payload: string;
    expirationDate: string;
  }>(res);
}

// ───── Card Tokenization ─────

export async function tokenizeCreditCard(params: {
  customer: string;
  creditCard: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  creditCardHolderInfo: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    phone: string;
  };
}) {
  const res = await fetch(`${ASAAS_BASE_URL}/v3/creditCard/tokenize`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(params),
  });
  return handleResponse<{ creditCardNumber: string; creditCardBrand: string; creditCardToken: string }>(res);
}
