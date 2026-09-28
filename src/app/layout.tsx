import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chataionline.io"),
  title: {
    default: "ChatAI Online | CRM com IA para WhatsApp que vende por você",
    template: "%s | ChatAI Online",
  },
  description:
    "Atenda centenas de clientes no WhatsApp com IA treinada no DNA do seu negócio. Qualifique leads, envie Pix e feche vendas 24h por dia. Teste grátis por 7 dias.",
  keywords: [
    "CRM WhatsApp",
    "agente de IA para vendas",
    "chatbot WhatsApp",
    "atendimento automatizado WhatsApp",
    "CRM com IA",
  ],
  authors: [{ name: "ChatAI Online" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://chataionline.io",
    siteName: "ChatAI Online",
    title: "ChatAI Online | CRM com IA para WhatsApp que vende por você",
    description:
      "Atenda centenas de clientes no WhatsApp com IA treinada no DNA do seu negócio. Qualifique leads, envie Pix e feche vendas 24h por dia.",
    images: [
      {
        url: "/hero-phone.png",
        width: 480,
        height: 960,
        alt: "ChatAI Online - Agente de IA atendendo no WhatsApp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChatAI Online | CRM com IA para WhatsApp que vende por você",
    description:
      "Atenda centenas de clientes no WhatsApp com IA treinada no DNA do seu negócio. Qualifique leads, envie Pix e feche vendas 24h por dia.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
