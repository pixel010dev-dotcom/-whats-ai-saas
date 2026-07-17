import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cidades } from '@/lib/cidades'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return cidades.map((cidade) => ({ slug: cidade.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cidade = cidades.find((c) => c.slug === slug)
  if (!cidade) return {}

  const title = `Chatbot WhatsApp em ${cidade.nome} - Funcionário Digital com IA | WhatsAI`
  const description = `Automatize seu atendimento no WhatsApp em ${cidade.nome} com inteligência artificial. Venda, negocie e atenda clientes 24 horas por dia. ${cidade.destaque}. Ativação em 5 minutos.`

  return {
    title,
    description,
    keywords: [
      `chatbot whatsapp ${cidade.nome}`,
      `whatsapp ${cidade.nome}`,
      `atendimento whatsapp ${cidade.nome}`,
      `ia ${cidade.nome}`,
      `automação whatsapp ${cidade.uf}`,
      `chatbot ${cidade.uf}`,
      `vendas whatsapp ${cidade.nome}`,
      `whatsapp business ${cidade.nome}`,
    ],
    openGraph: {
      title: `${title} | WhatsAI`,
      description,
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | WhatsAI`,
      description,
    },
  }
}

export default async function CityPage({ params }: Props) {
  const { slug } = await params
  const cidade = cidades.find((c) => c.slug === slug)
  if (!cidade) notFound()

  const outrasCidades = cidades
    .filter((c) => c.slug !== slug)
    .slice(0, 6)

  const citySchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Chatbot WhatsApp ${cidade.nome} - WhatsAI`,
    description: `Atendimento automático no WhatsApp em ${cidade.nome} com inteligência artificial. Venda 24 horas por dia.`,
    offers: {
      '@type': 'Offer',
      price: '29.90',
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      url: 'https://whatsai-app-production.up.railway.app/register',
    },
    areaServed: {
      '@type': 'City',
      name: cidade.nome,
      containedInPlace: {
        '@type': 'State',
        name: cidade.uf,
      },
    },
  }

  return (
    <main className="min-h-screen bg-zinc-950">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(citySchema) }}
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
              <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">
                Home
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            <span className="text-sm font-medium text-emerald-400">
              Atendimento 24 horas em {cidade.nome}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-100 mb-6 leading-tight">
            Chatbot WhatsApp em{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              {cidade.nome}
            </span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-3xl mx-auto mb-8 leading-relaxed">
            Automatize seu atendimento no WhatsApp com inteligência artificial em {cidade.nome}.
            Venda, negocie, atenda e feche pedidos 24 horas por dia — sem precisar contratar
            mais funcionários. Economia de até <strong className="text-zinc-200">R$ 8.000/mês</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl text-lg shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Começar grátis — R$ 29,90/mês
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 bg-zinc-800 border border-zinc-700 text-zinc-300 font-semibold rounded-xl text-lg hover:bg-zinc-700 transition-all duration-300"
            >
              Ver planos
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Clientes em', value: cidade.nome, color: 'from-emerald-500 to-emerald-600' },
            { label: 'Economia média', value: 'R$ 5.000/mês', color: 'from-blue-500 to-blue-600' },
            { label: 'Tempo de ativação', value: '5 minutos', color: 'from-purple-500 to-purple-600' },
            { label: 'Disponibilidade', value: '24 horas/dia', color: 'from-amber-500 to-amber-600' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6 text-center"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                <span className="text-white font-bold text-lg">{stat.value.charAt(0)}</span>
              </div>
              <div className="text-2xl font-bold text-zinc-100 mb-1">{stat.value}</div>
              <div className="text-sm text-zinc-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-2xl bg-zinc-900/30 border border-zinc-800 p-8 sm:p-12">
          <h2 className="text-2xl font-bold text-zinc-100 mb-8">
            Chatbot WhatsApp em {cidade.nome} — Automatize seu Atendimento
          </h2>
          <div
            className="prose prose-invert prose-emerald prose-lg max-w-none
              prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-5
              prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:text-emerald-300
              prose-strong:text-zinc-200"
            dangerouslySetInnerHTML={{ __html: cidade.conteudo }}
          />

          <div className="mt-10 pt-8 border-t border-zinc-800">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-green-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Ativar WhatsAI em {cidade.nome}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl font-bold text-zinc-100 text-center mb-12">
          Por que empresas em {cidade.nome} escolhem o WhatsAI?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Atendimento 24 horas',
              description: `Seus clientes em ${cidade.nome} são atendidos na hora, mesmo de madrugada, fins de semana e feriados. Nunca mais perca uma venda por falta de resposta.`,
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              ),
            },
            {
              title: 'Economia real',
              description: `Reduza custos com atendentes em até 99%. O WhatsAI custa R$ 29,90/mês — menos que uma equipe de atendimento que custaria R$ 5.000 a R$ 10.000 mensais.`,
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              ),
            },
            {
              title: 'Vendas automáticas',
              description: 'O IA não só atende — ele vende. Consulta estoque, faz orçamentos, sugere produtos e fecha pedidos automaticamente pelo WhatsApp.',
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              ),
            },
            {
              title: 'IA que entende contexto',
              description: `Diferente de chatbots antigos, o WhatsAI entende linguagem natural. O cliente em ${cidade.nome} pode escrever do jeito dele — o sistema interpreta e responde adequadamente.`,
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              ),
            },
            {
              title: 'Ativação em 5 minutos',
              description: 'Sem instalação, sem conhecimento técnico, sem equipamento extra. Conecte seu WhatsApp ao WhatsAI escaneando um QR Code e pronto.',
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
              ),
            },
            {
              title: 'Suporte local',
              description: `Equipe de suporte dedicada para clientes em ${cidade.nome}. Atendimento em português, suporte via WhatsApp e chat online.`,
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
              ),
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6 hover:border-emerald-500/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {feature.icon}
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">{feature.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Other Cities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl font-bold text-zinc-100 text-center mb-8">
          Chatbot WhatsApp também disponível em
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {outrasCidades.map((c) => (
            <Link
              key={c.slug}
              href={`/cidade/${c.slug}`}
              className="block text-center px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900 transition-all duration-300"
            >
              <span className="text-sm font-medium text-zinc-300 hover:text-emerald-400 transition-colors">
                {c.nome} - {c.uf}
              </span>
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
            Transforme seu atendimento em {cidade.nome}
          </h2>
          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
            Em 5 minutos sua IA já está vendendo por você. R$ 29,90/mês — PIX. Ativação instantânea.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white text-emerald-400 font-bold rounded-xl text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Ativar em {cidade.nome} agora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
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
            <div>
              <h3 className="font-semibold text-white mb-4">Cidades</h3>
              <ul className="space-y-2">
                {cidades.slice(0, 5).map((c) => (
                  <li key={c.slug}>
                    <Link href={`/cidade/${c.slug}`} className="text-sm hover:text-emerald-400 transition-colors">
                      {c.nome} - {c.uf}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Produto</h3>
              <ul className="space-y-3">
                <li><Link href="#features" className="text-sm hover:text-emerald-400 transition-colors">Funcionalidades</Link></li>
                <li><Link href="/pricing" className="text-sm hover:text-emerald-400 transition-colors">Preços</Link></li>
                <li><Link href="/blog" className="text-sm hover:text-emerald-400 transition-colors">Blog</Link></li>
                <li><Link href="/register" className="text-sm hover:text-emerald-400 transition-colors">Começar agora</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Empresa</h3>
              <ul className="space-y-3">
                <li><Link href="/pricing" className="text-sm hover:text-emerald-400 transition-colors">Planos</Link></li>
                <li><Link href="/afiliados" className="text-sm hover:text-emerald-400 transition-colors">Programa de Afiliados</Link></li>
                <li><Link href="/blog" className="text-sm hover:text-emerald-400 transition-colors">Blog</Link></li>
                <li><a href="mailto:pixel010dev@gmail.com" className="text-sm hover:text-emerald-400 transition-colors">Contato</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-800 pt-8">
            <p className="text-sm text-center">&copy; {new Date().getFullYear()} WhatsAI. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
