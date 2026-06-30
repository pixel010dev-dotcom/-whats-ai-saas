import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <span className="text-6xl block mb-4">404</span>
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">Página não encontrada</h1>
        <p className="text-zinc-400 mb-8">A página que você procura não existe ou foi movida.</p>
        <Link
          href="/dashboard"
          className="inline-flex px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300"
        >
          Voltar ao dashboard
        </Link>
      </div>
    </div>
  )
}
