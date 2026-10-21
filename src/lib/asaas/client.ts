// SDK wrapper para a API do Asaas
// Todas as chamadas passam por aqui para centralizar headers e error handling

// Desenvolvimento usa Sandbox por padrão. A seleção explícita do ambiente
// evita usar uma credencial de teste contra o serviço financeiro de produção.
const ASAAS_BASE_URL =
  process.env.ASAAS_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://api.asaas.com"
    : "https://api-sandbox.asaas.com");

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
    const errorMsg =
      data?.errors?.[0]?.description || data?.message || "Erro na API do Asaas";
    throw new Error(errorMsg);
  }
  return data as T;
}

// ───── Customers ─────

export async function findCustomerByCpfCnpj(cpfCnpj: string) {
  const res = await fetch(`${ASAAS_BASE_URL}/v3/customers?cpfCnpj=${cpfCnpj}`, {
    headers: getHeaders(),
  });
  const data = await handleResponse<{
    data: Array<{ id: string; name: string; email: string; cpfCnpj: string }>;
  }>(res);
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
  externalReference?: string;
}) {
  const res = await fetch(`${ASAAS_BASE_URL}/v3/customers`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(params),
  });
  return handleResponse<{
    id: string;
    name: string;
    email: string;
    cpfCnpj: string;
  }>(res);
}

export async function findOrCreateCustomer(params: {
  name: string;
  email: string;
  cpfCnpj: string;
  phone?: string;
  postalCode?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  externalReference?: string;
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
    subscription?: string | null;
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
  const res = await fetch(
    `${ASAAS_BASE_URL}/v3/payments/${paymentId}/pixQrCode`,
    {
      headers: getHeaders(),
    },
  );
  return handleResponse<{
    encodedImage: string;
    payload: string;
    expirationDate: string;
  }>(res);
}

// ───── Card Tokenization ─────

export async function tokenizeCreditCard(params: {
  customer: string;
  remoteIp: string;
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
  const res = await fetch(
    `${ASAAS_BASE_URL}/v3/creditCard/tokenizeCreditCard`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(params),
    },
  );
  return handleResponse<{
    creditCardNumber: string;
    creditCardBrand: string;
    creditCardToken: string;
  }>(res);
}

// ————— Subscriptions —————

export async function createSubscription(params: {
  customer: string;
  billingType: string;
  value: number;
  nextDueDate: string;
  cycle: "MONTHLY" | "QUARTERLY" | "YEARLY";
  description?: string;
  externalReference?: string;
  creditCardToken?: string;
  remoteIp?: string;
  creditCard?: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  creditCardHolderInfo?: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    phone: string;
  };
}) {
  const res = await fetch(`${ASAAS_BASE_URL}/v3/subscriptions`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(params),
  });
  return handleResponse<{
    id: string;
    status: string;
    billingType: string;
    value: number;
    cycle: string;
  }>(res);
}

export async function deleteSubscription(id: string) {
  const res = await fetch(`${ASAAS_BASE_URL}/v3/subscriptions/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return handleResponse<{ deleted: boolean; id: string }>(res);
}

export async function getSubscriptionPayments(id: string) {
  const res = await fetch(`${ASAAS_BASE_URL}/v3/subscriptions/${id}/payments`, {
    headers: getHeaders(),
  });
  return handleResponse<{
    data: Array<{
      id: string;
      status: string;
      value: number;
      billingType: string;
      invoiceUrl?: string;
      bankSlipUrl?: string;
    }>;
  }>(res);
}
