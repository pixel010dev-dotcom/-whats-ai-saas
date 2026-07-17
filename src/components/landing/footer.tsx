'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="relative bg-zinc-950 text-gray-400">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="font-bold text-xl text-white">WhatsAI</span>
            </div>
            <p className="text-sm leading-relaxed">
              Seu funcionário digital para WhatsApp. Venda, negocie e atenda automaticamente 24 horas por dia.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-white mb-4">Produto</h3>
            <ul className="space-y-3">
              <li><Link href="#features" className="text-sm hover:text-emerald-400 transition-colors">Funcionalidades</Link></li>
              <li><Link href="/pricing" className="text-sm hover:text-emerald-400 transition-colors">Preços</Link></li>
              <li><Link href="/register" className="text-sm hover:text-emerald-400 transition-colors">Começar agora</Link></li>
              <li><Link href="/login" className="text-sm hover:text-emerald-400 transition-colors">Entrar</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Empresa</h3>
            <ul className="space-y-3">
              <li><Link href="/pricing" className="text-sm hover:text-emerald-400 transition-colors">Planos</Link></li>
              <li><Link href="/afiliados" className="text-sm hover:text-emerald-400 transition-colors">Programa de Afiliados</Link></li>
              <li><Link href="/blog" className="text-sm hover:text-emerald-400 transition-colors">Blog</Link></li>
              <li><a href="mailto:pixel010dev@gmail.com" className="text-sm hover:text-emerald-400 transition-colors">Contato</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/terms" className="text-sm hover:text-emerald-400 transition-colors">Termos de uso</Link></li>
              <li><Link href="/privacy" className="text-sm hover:text-emerald-400 transition-colors">Política de privacidade</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} WhatsAI. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-sm text-zinc-500">Feito com ❤️ pela equipe WhatsAI</span>
              <div className="flex gap-4">
                <span className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center text-xs cursor-pointer hover:bg-emerald-600 hover:text-white transition-colors">in</span>
                <span className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center text-xs cursor-pointer hover:bg-emerald-600 hover:text-white transition-colors">ig</span>
                <span className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center text-xs cursor-pointer hover:bg-emerald-600 hover:text-white transition-colors">yt</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
