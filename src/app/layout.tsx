import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { IMAGEM_DE_COMPARTILHAMENTO, SITE, jsonLdOrganizacao, jsonLdSeguro, jsonLdSite } from "@/lib/seo/site";

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
  description: SITE.descricao,
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
    url: "/",
    siteName: "ChatAI Online",
    title: "ChatAI Online | CRM com IA para WhatsApp que vende por você",
    description:
      "Atenda centenas de clientes no WhatsApp com IA treinada no DNA do seu negócio. Qualifique leads, envie Pix e feche vendas 24h por dia.",
    // 1200×630, o tamanho que WhatsApp, Google e redes sociais pedem.
    images: [IMAGEM_DE_COMPARTILHAMENTO],
  },
  twitter: {
    card: "summary_large_image",
    images: [IMAGEM_DE_COMPARTILHAMENTO],
    title: "ChatAI Online | CRM com IA para WhatsApp que vende por você",
    description:
      "Atenda centenas de clientes no WhatsApp com IA treinada no DNA do seu negócio. Qualifique leads, envie Pix e feche vendas 24h por dia.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  // Verificação de dono no Google Search Console e no Bing Webmaster Tools,
  // quando feita pela etiqueta HTML (o código vem do próprio painel). Sem as
  // variáveis, nada é impresso — a verificação pelo DNS dispensa as duas.
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } }
      : {}),
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        {[jsonLdOrganizacao(), jsonLdSite()].map((dado, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdSeguro(dado) }} />
        ))}
      </body>
    </html>
  );
}
