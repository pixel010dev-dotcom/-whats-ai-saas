import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold bg-gradient-to-br from-emerald-500 to-emerald-600 bg-clip-text text-transparent mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">Página não encontrada</h1>
        <p className="text-zinc-400 mb-8">
          A página que você procura não existe, foi movida ou está temporariamente indisponível.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 shadow-lg shadow-green-500/20"
          >
            <Home className="w-4 h-4" />
            Página inicial
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 text-zinc-300 font-medium rounded-xl border border-zinc-700 hover:bg-zinc-700 hover:text-zinc-100 transition-all duration-300"
          >
            Ir para o Dashboard
          </Link>
        </div>
        <p className="mt-8 text-sm text-zinc-600">
          Precisa de ajuda? Entre em contato com nosso suporte.
        </p>
      </div>
    </div>
  )
}
