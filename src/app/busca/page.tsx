import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Search } from "lucide-react";

import { Header } from "@/components/Header";
import { TETO_DA_BUSCA, buscar } from "@/lib/seo/busca";

/**
 * Página de resultados da busca interna. Fica FORA do índice do Google (cada
 * busca seria uma página quase igual às outras), mas os links dela são seguidos.
 */
export const metadata: Metadata = {
  title: "Buscar no site",
  description: "Procure planos, recursos e respostas sobre o ChatAI Online.",
  alternates: { canonical: "/busca" },
  robots: { index: false, follow: true },
};

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: Promise<{ [chave: string]: string | string[] | undefined }>;
}) {
  const bruto = (await searchParams).q;
  const q = (Array.isArray(bruto) ? bruto[0] : bruto ?? "").slice(0, TETO_DA_BUSCA).trim();
  const resultados = q ? buscar(q) : [];

  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 bg-white text-slate-700 py-16 px-6 font-sans">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para a página inicial
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Buscar no site</h1>

          <form action="/busca" method="get" role="search" className="flex gap-2 mb-10">
            <label htmlFor="busca-q" className="sr-only">
              O que você procura?
            </label>
            <input
              id="busca-q"
              name="q"
              type="search"
              defaultValue={q}
              maxLength={TETO_DA_BUSCA}
              placeholder="Ex.: agendamento, preço, chatbot"
              className="flex-1 rounded-full border border-slate-300 px-5 py-3 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              <Search className="w-4 h-4" aria-hidden />
              Buscar
            </button>
          </form>

          {q && (
            <p className="text-sm text-slate-500 mb-6" aria-live="polite">
              {resultados.length === 0
                ? `Nada encontrado para "${q}".`
                : `${resultados.length} ${resultados.length === 1 ? "resultado" : "resultados"} para "${q}".`}
            </p>
          )}

          {q && resultados.length === 0 && (
            <p className="text-slate-600">
              Tente outra palavra ou{" "}
              <Link href="/contato" className="text-indigo-600 hover:text-indigo-700 underline">
                fale com a nossa equipe
              </Link>
              .
            </p>
          )}

          <ul className="space-y-4">
            {resultados.map((r, i) => (
              <li key={i} className="rounded-2xl border border-slate-200 p-5 hover:border-indigo-300 transition-colors">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">{r.tipo}</p>
                <h2 className="text-lg font-semibold text-slate-900 mb-1">
                  <Link href={r.url} className="hover:text-indigo-700">
                    {r.titulo}
                  </Link>
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed">{r.trecho}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
