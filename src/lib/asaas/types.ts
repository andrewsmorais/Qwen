// Tipos para integração com Asaas
export type BillingType = "PIX" | "BOLETO" | "CREDIT_CARD" | "DEBIT_CARD";
export type PlanType = "essencial" | "impulso" | "escala";
export type SubscriptionStatus = "pending" | "confirmed" | "overdue" | "cancelled" | "refunded" | "trial";

export interface CreatePaymentRequest {
  organization_id: string;
  customer_name: string;
  customer_email: string;
  customer_cpf_cnpj: string;
  customer_phone?: string;
  customer_address?: {
    postalCode: string;
    address: string;
    addressNumber: string;
    complement?: string;
    province: string;
  };
  value: number;
  plan_type: PlanType;
  billing_type: BillingType;
  credit_card_token?: string;
  installment_count?: number;
}

export interface AsaasCustomer {
  id: string;
  name: string;
  email: string;
  cpfCnpj: string;
}

export interface AsaasPayment {
  id: string;
  status: string;
  billingType: BillingType;
  value: number;
  netValue: number;
  description: string;
  externalReference: string;
  invoiceUrl?: string;
  bankSlipUrl?: string;
  pixTransaction?: {
    qrCode: string;
    payload: string;
    expirationDate: string;
  };
  pixQrCodeId?: string;
}

export interface AsaasPixQrCode {
  id: string;
  encodedImage: string;
  payload: string;
  expirationDate: string;
}

export interface TokenizeCardRequest {
  customer: string; // Asaas customer ID
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
}

export interface PaymentResponse {
  success: boolean;
  payment_id?: string;
  // PIX
  pixQrCode?: string;
  pixPayload?: string;
  // Boleto
  boletoUrl?: string;
  bankSlipUrl?: string;
  // Card
  status?: string;
  // Error
  error?: string;
}

export interface AsaasWebhookEvent {
  event: string;
  payment: {
    id: string;
    customer: string;
    billingType: string;
    value: number;
    status: string;
    externalReference: string;
    description: string;
    confirmedDate?: string;
    paymentDate?: string;
  };
}

export interface Subscription {
  id: string;
  organization_id: string;
  asaas_customer_id: string;
  asaas_payment_id: string;
  status: SubscriptionStatus;
  plan_type: PlanType;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}
