import { NextRequest, NextResponse } from "next/server";
import { tokenizeCreditCard, findOrCreateCustomer } from "@/lib/asaas/client";
import { origemDoCartao } from "@/lib/asaas/origem-cartao";

const texto = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";
const objeto = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
const emailValido = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;

export async function POST(req: NextRequest) {
  try {
    const body = objeto(await req.json().catch(() => null));
    const customer = objeto(body.customer);
    const holder = objeto(body.holder_info);
    let customerId = texto(body.customer_id);
    const customerName = texto(customer.name);
    const customerEmail = texto(customer.email);
    const customerCpf = texto(customer.cpfCnpj).replace(/\D/g, "");
    const holderName = texto(body.holder_name);
    const rawNumber = texto(body.card_number);
    const number = rawNumber.replace(/[\s-]/g, "");
    const month = texto(body.expiry_month).padStart(2, "0");
    const rawYear = texto(body.expiry_year);
    const year = /^\d{2}$/.test(rawYear) ? `20${rawYear}` : rawYear;
    const ccv = texto(body.ccv);
    const holderCpf = texto(holder.cpfCnpj).replace(/\D/g, "");
    const postalCode = texto(holder.postalCode).replace(/\D/g, "");
    const addressNumber = texto(holder.addressNumber);
    const phone = texto(holder.phone).replace(/\D/g, "");
    const holderEmail = texto(holder.email) || customerEmail;

    // Validar o pedido inteiro antes de cadastrar cliente no serviço externo.
    if (customerId && !/^cus_[A-Za-z0-9]+$/.test(customerId))
      return NextResponse.json(
        { error: "Cadastro de cobrança inválido." },
        { status: 400 },
      );
    if (
      !customerId &&
      (!customerName ||
        !emailValido(customerEmail) ||
        !/^(?:\d{11}|\d{14})$/.test(customerCpf))
    )
      return NextResponse.json(
        { error: "Dados do cliente incompletos." },
        { status: 400 },
      );
    if (!holderName || !/^\d{13,19}$/.test(number) || !/^\d{3,4}$/.test(ccv))
      return NextResponse.json(
        {
          error: "Confira o nome, o número e o código de segurança do cartão.",
        },
        { status: 400 },
      );
    const now = new Date();
    if (
      !/^(?:0[1-9]|1[0-2])$/.test(month) ||
      !/^\d{4}$/.test(year) ||
      Number(year) < now.getUTCFullYear() ||
      Number(year) > now.getUTCFullYear() + 30 ||
      (Number(year) === now.getUTCFullYear() &&
        Number(month) < now.getUTCMonth() + 1)
    )
      return NextResponse.json(
        { error: "Validade do cartão inválida." },
        { status: 400 },
      );
    if (
      !/^(?:\d{11}|\d{14})$/.test(holderCpf) ||
      !/^\d{8}$/.test(postalCode) ||
      !addressNumber ||
      !/^\d{10,11}$/.test(phone) ||
      !emailValido(holderEmail)
    )
      return NextResponse.json(
        { error: "Dados do titular incompletos." },
        { status: 400 },
      );

    const remoteIp = origemDoCartao(req);
    if (!remoteIp)
      return NextResponse.json(
        {
          error:
            "Pagamento com cartão indisponível até configurar a origem segura da compra. Selecione PIX ou boleto.",
        },
        { status: 503 },
      );
    if (!customerId) {
      const asaasCustomer = await findOrCreateCustomer({
        name: customerName,
        email: customerEmail,
        cpfCnpj: customerCpf,
        phone: texto(customer.phone).replace(/\D/g, "") || undefined,
      });
      customerId = asaasCustomer.id;
    }
    const result = await tokenizeCreditCard({
      customer: customerId,
      remoteIp,
      creditCard: {
        holderName,
        number,
        expiryMonth: month,
        expiryYear: year,
        ccv,
      },
      creditCardHolderInfo: {
        name: texto(holder.name) || holderName,
        email: holderEmail,
        cpfCnpj: holderCpf,
        postalCode,
        addressNumber,
        phone,
      },
    });
    return NextResponse.json(
      {
        success: true,
        creditCardToken: result.creditCardToken,
        creditCardBrand: result.creditCardBrand,
        creditCardNumber: result.creditCardNumber,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    // Não registrar erros com dados do cartão ou identificadores do titular.
    return NextResponse.json(
      {
        error:
          "Não foi possível validar o cartão. Confira os dados antes de tentar novamente.",
      },
      { status: 503 },
    );
  }
}
