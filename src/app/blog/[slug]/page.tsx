import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { blogPosts } from '@/lib/blog-data'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: `${post.title} | WhatsAI`,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | WhatsAI`,
      description: post.excerpt,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) notFound()

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 3)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'WhatsAI',
      logo: {
        '@type': 'ImageObject',
        url: 'https://whatsai-app-production.up.railway.app/favicon.ico',
      },
    },
    datePublished: post.date,
    dateModified: post.date,
    image: `https://whatsai-app-production.up.railway.app${post.coverImage}`,
    keywords: post.tags.join(', '),
    inLanguage: 'pt-BR',
    isAccessibleForFree: true,
  }

  return (
    <main className="min-h-screen bg-zinc-950">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

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
            <div className="flex items-center gap-4">
              <Link href="/blog" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">
                ← Blog
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Article */}
      <article className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
            <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-emerald-400 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-zinc-300">{post.title}</span>
          </nav>

          {/* Header Info */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-sm text-zinc-500">{post.date}</span>
            <span className="text-sm text-zinc-500">{post.readTime} de leitura</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-lg text-zinc-400 mb-10 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Cover Image Placeholder */}
          <div className="h-64 sm:h-80 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 mb-12 flex items-center justify-center border border-zinc-800">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <p className="text-sm text-zinc-600">{post.coverImage}</p>
            </div>
          </div>

          {/* Content */}
          <div
            className="prose prose-invert prose-emerald prose-lg max-w-none
              prose-headings:text-zinc-100 prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-5
              prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:text-emerald-300
              prose-strong:text-zinc-200
              prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
              prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2
              prose-li:text-zinc-300
              prose-em:text-zinc-400"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-zinc-400 bg-zinc-800 px-3 py-1.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <h2 className="text-2xl font-bold text-zinc-100 mb-8">Artigos Relacionados</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="group block rounded-2xl bg-zinc-900/50 border border-zinc-800 overflow-hidden hover:border-emerald-500/50 transition-all duration-300"
              >
                <div className="h-40 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {related.category}
                  </span>
                  <h3 className="text-sm font-semibold text-zinc-100 mt-3 group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-2">{related.readTime} leitura</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative py-24 bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Experimente o WhatsAI grátis
          </h2>
          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
            Em 5 minutos sua IA já está vendendo por você. R$ 29,90/mês — sem fidelidade.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white text-emerald-400 font-bold rounded-xl text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Começar agora
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
              <Link href="/blog" className="text-sm hover:text-emerald-400 transition-colors">Blog</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
