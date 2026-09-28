"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Chat AI Online Logo" className="w-10 h-10 object-cover rounded-xl shadow-sm" />
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Chat<span className="text-indigo-600 font-black">AI</span> <span className="font-medium text-slate-500 text-lg">Online</span>
            </span>
          </div>
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-500">
            <Link href="#produto" className="hover:text-indigo-600 transition-colors">Produto</Link>
            <Link href="#solucoes" className="hover:text-indigo-600 transition-colors">Soluções</Link>
            <Link href="#precos" className="hover:text-indigo-600 transition-colors">Preços</Link>
            <Link href="#ajuda" className="hover:text-indigo-600 transition-colors">Ajuda</Link>
          </nav>
        </div>
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors px-4 py-2 rounded-full border border-slate-200 hover:border-indigo-300">
            Login
          </Link>
          <Link 
            href="/app" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md shadow-indigo-600/20"
          >
            Acessar CRM
          </Link>
        </div>
        <button 
          className="lg:hidden text-indigo-600 p-1.5 hover:bg-indigo-50 rounded-lg transition-colors ml-auto"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-8 h-8" strokeWidth={2.5} /> : <Menu className="w-8 h-8" strokeWidth={2.5} />}
        </button>
      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg">
          <nav className="flex flex-col px-6 py-4 gap-1">
            <Link 
              href="#produto" 
              onClick={() => setMenuOpen(false)}
              className="py-3 px-4 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
            >
              Produto
            </Link>
            <Link 
              href="#solucoes" 
              onClick={() => setMenuOpen(false)}
              className="py-3 px-4 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
            >
              Soluções
            </Link>
            <Link 
              href="#precos" 
              onClick={() => setMenuOpen(false)}
              className="py-3 px-4 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
            >
              Preços
            </Link>
            <Link 
              href="#ajuda" 
              onClick={() => setMenuOpen(false)}
              className="py-3 px-4 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
            >
              Ajuda
            </Link>
          </nav>
          <div className="flex flex-col gap-3 px-6 pb-6">
            <Link 
              href="/login" 
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-slate-600 text-center py-3 rounded-full border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
            >
              Login
            </Link>
            <Link 
              href="/app" 
              onClick={() => setMenuOpen(false)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-center py-3 rounded-full text-sm font-semibold transition-all shadow-md shadow-indigo-600/20"
            >
              Acessar CRM
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
