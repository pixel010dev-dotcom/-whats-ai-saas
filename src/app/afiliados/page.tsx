import type { Metadata } from 'next'
import Link from 'next/link'
import { Gift, Users, DollarSign, BarChart3, Share2, CheckCircle, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Programa de Afiliados',
  description: 'Ganhe até R$ 14,90 por cada venda indicando o WhatsAI. Programa de afiliados com comissões recorrentes, materiais prontos e suporte dedicado.',
  openGraph: {
    title: 'Programa de Afiliados | WhatsAI',
    description: 'Ganhe até R$ 14,90 por cada venda indicando o WhatsAI. Comissões recorrentes e materiais prontos.',
  },
}

const benefits = [
  {
    icon: DollarSign,
    title: 'Comissão de 50%',
    description: 'Ganhe R$ 14,90 por cada venda. Pagamento via PIX todo mês.',
    gradient: 'from-emerald-400 to-emerald-600',
  },
  {
    icon: Users,
    title: 'Comissão Recorrente',
    description: 'Enquanto o cliente continuar pagando, você continua ganhando. Renda passiva todo mês.',
    gradient: 'from-blue-400 to-indigo-600',
  },
  {
    icon: BarChart3,
    title: 'Dashboard em Tempo Real',
    description: 'Acompanhe cliques, leads, vendas e comissões em tempo real pelo seu painel exclusivo.',
    gradient: 'from-purple-400 to-pink-600',
  },
  {
    icon: Share2,
    title: 'Materiais Prontos',
    description: 'Links, banners, imagens e textos prontos para usar. Sem precisar criar nada.',
    gradient: 'from-amber-400 to-orange-600',
  },
]

const steps = [
  { num: '01', title: 'Cadastre-se grátis', desc: 'Preencha seus dados e crie sua conta de afiliado em menos de 2 minutos.' },
  { num: '02', title: 'Compartilhe seu link', desc: 'Use link exclusivo, banners e materiais prontos para divulgar o WhatsAI.' },
  { num: '03', title: 'Ganhe comissões', desc: 'Receba R$ 14,90 por cada venda confirmada. Pagamento mensal via PIX.' },
]

export default function AfiliadosPage() {
  return (
    <main className="min-h-screen bg-zinc-950">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-gradient-to-br from-emerald-400/20 via-green-300/10 to-transparent rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-gradient-to-tl from-emerald-400/20 via-green-300/10 to-transparent rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <Gift className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">Programa de Afiliados</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-zinc-100 mb-6">
            Ganhe <span className="gradient-text">R$ 14,90</span> por cada venda
          </h1>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            Indique o WhatsAI para seus amigos, clientes e seguidores. 
            Você ganha comissão recorrente toda vez que alguém assinar pelo seu link.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl text-lg shadow-lg shadow-green-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Quero ser afiliado
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative py-20 bg-zinc-900">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 text-center mb-16">
            Por que ser um <span className="gradient-text">afiliado WhatsAI</span>?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="p-6 rounded-2xl bg-zinc-950/50 border border-zinc-800 hover-card">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-zinc-100 mb-2">{benefit.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 text-center mb-16">
            Como <span className="gradient-text">funciona</span>
          </h2>
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-emerald-400">{step.num}</span>
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-bold text-zinc-100 mb-1">{step.title}</h3>
                  <p className="text-zinc-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 bg-gradient-to-br from-green-500 via-emerald-600 to-green-700">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Comece a ganhar hoje mesmo
          </h2>
          <p className="text-xl text-green-100 mb-10">
            Cadastro grátis. Materiais prontos. Comissão vitalícia enquanto o cliente estiver ativo.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 font-bold rounded-xl text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Quero ser afiliado
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  )
}
