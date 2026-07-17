import type { Metadata } from 'next'
import Link from 'next/link'
import { blogPosts } from '@/lib/blog-data'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Artigos sobre chatbot WhatsApp, automação de vendas, atendimento com IA e dicas para empresas brasileiras crescerem com o WhatsAI.',
  keywords: ['chatbot whatsapp', 'blog', 'automação', 'ia', 'vendas', 'atendimento', 'whatsapp business'],
  openGraph: {
    title: 'Blog | WhatsAI',
    description: 'Aprenda como automatizar vendas e atendimento no WhatsApp com IA. Artigos, guias e tutoriais para sua empresa vender mais.',
  },
}

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 mt-4 px-6 rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 shadow-lg shadow-black/5">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="font-bold text-xl text-zinc-100">WhatsAI</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-zinc-100 transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                Começar agora
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-100 mb-6">
            Blog{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              WhatsAI
            </span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Aprenda como automatizar vendas e atendimento no WhatsApp com inteligência artificial.
            Artigos práticos para sua empresa vender mais e gastar menos.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-2xl bg-zinc-900/50 border border-zinc-800 overflow-hidden hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300"
            >
              <div className="h-48 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-zinc-500">{post.readTime} leitura</span>
                </div>
                <h2 className="text-lg font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors mb-3 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-sm text-zinc-400 line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">{post.date}</span>
                  <span className="text-sm font-medium text-emerald-400 group-hover:translate-x-1 transition-transform">
                    Ler artigo →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Pronto para automatizar seu atendimento?
          </h2>
          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
            Em 5 minutos sua IA já está vendendo por você. R$ 29,90/mês — PIX. Ativação instantânea.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white text-emerald-400 font-bold rounded-xl text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Quero vender 24h por dia
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-zinc-800 pt-8">
            <p className="text-sm">&copy; {new Date().getFullYear()} WhatsAI. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <Link href="/" className="text-sm hover:text-emerald-400 transition-colors">Home</Link>
              <Link href="/pricing" className="text-sm hover:text-emerald-400 transition-colors">Preços</Link>
              <Link href="/blog" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">Blog</Link>
              <a href="mailto:pixel010dev@gmail.com" className="text-sm hover:text-emerald-400 transition-colors">Contato</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
