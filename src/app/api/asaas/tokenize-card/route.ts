import { NextRequest, NextResponse } from "next/server";
import { tokenizeCreditCard } from "@/lib/asaas/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { customer_id, holder_name, card_number, expiry_month, expiry_year, ccv, holder_info } = body;

    // Validações básicas
    if (!customer_id || !holder_name || !card_number || !expiry_month || !expiry_year || !ccv) {
      return NextResponse.json({ error: "Dados do cartão incompletos" }, { status: 400 });
    }

    if (!holder_info?.cpfCnpj || !holder_info?.postalCode || !holder_info?.addressNumber || !holder_info?.phone) {
      return NextResponse.json({ error: "Dados do titular incompletos" }, { status: 400 });
    }

    // Limpar número do cartão
    const cleanedNumber = card_number.replace(/\D/g, "");
    if (cleanedNumber.length < 13 || cleanedNumber.length > 19) {
      return NextResponse.json({ error: "Número do cartão inválido" }, { status: 400 });
    }

    if (ccv.length < 3 || ccv.length > 4) {
      return NextResponse.json({ error: "CVV inválido" }, { status: 400 });
    }

    // Tokenizar via Asaas
    const result = await tokenizeCreditCard({
      customer: customer_id,
      creditCard: {
        holderName: holder_name,
        number: cleanedNumber,
        expiryMonth: expiry_month,
        expiryYear: expiry_year,
        ccv: ccv,
      },
      creditCardHolderInfo: {
        name: holder_name,
        email: holder_info.email,
        cpfCnpj: holder_info.cpfCnpj.replace(/\D/g, ""),
        postalCode: holder_info.postalCode.replace(/\D/g, ""),
        addressNumber: holder_info.addressNumber,
        phone: holder_info.phone.replace(/\D/g, ""),
      },
    });

    return NextResponse.json({
      success: true,
      creditCardToken: result.creditCardToken,
      creditCardBrand: result.creditCardBrand,
      creditCardNumber: result.creditCardNumber, // últimos 4 dígitos mascarados
    });

  } catch (error) {
    console.error("[tokenize-card] Error:", error);
    return NextResponse.json({ error: "Erro ao processar dados do cartão" }, { status: 500 });
  }
}
