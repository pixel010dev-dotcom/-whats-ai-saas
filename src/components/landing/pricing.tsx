'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Check, Zap, ShieldCheck, CreditCard, X, TrendingDown, Users, DollarSign, Gift, HelpCircle, ChevronDown, Sparkles, ArrowRight, Clock } from 'lucide-react'

const plan = {
  name: 'Único',
  slug: 'UNICO',
  price: 29.90,
  description: 'Tudo que você precisa para vender no WhatsApp',
  features: [
    'Conversas ilimitadas',
    '1 número WhatsApp',
    'IA com conhecimento da sua empresa',
    'Respostas automáticas inteligentes',
    'Catálogo de produtos',
    'Dashboard completo',
    'Suporte prioritário',
  ],
}

const comparisonRows = [
  { label: 'Custo mensal', whatsai: 'R$ 29,90', employee: 'R$ 2.500+' },
  { label: 'Trabalha 24h/dia', whatsai: 'Sim', employee: 'Não' },
  { label: 'Responde em segundos', whatsai: 'Sim', employee: 'Depende' },
  { label: 'Não tira férias', whatsai: 'Sim', employee: 'Não' },
  { label: 'Não precisa de treinamento', whatsai: 'Sim', employee: 'Precisa' },
  { label: 'Não erra preço', whatsai: 'Não erra', employee: 'Pode errar' },
  { label: 'Escala automaticamente', whatsai: 'Sim', employee: 'Precisa contratar' },
  { label: 'Suporte 24h', whatsai: 'Incluso', employee: 'Não se aplica' },
]

const pricingFaqs = [
  {
    q: 'Posso cancelar quando quiser?',
    a: 'Sim! Sem multa, sem burocracia. Você cancela pelo dashboard e continua usando até o fim do período já pago. Sem fidelidade.'
  },
  {
    q: 'Como funciona o período de garantia?',
    a: 'São 7 dias de garantia incondicional. Se não gostar, devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia.'
  },
  {
    q: 'Aceita PIX mesmo?',
    a: 'Sim! Aceitamos PIX (ativo na hora), cartão de crédito (parcelado em até 6x) e boleto bancário (pode levar 1 dia útil pra compensar).'
  },
  {
    q: 'Tem algum custo oculto?',
    a: 'Zero. O plano é R$ 29,90/mês e ponto final. Sem taxa de setup, sem taxa de cancelamento, sem surpresas. O que está escrito é o que você paga.'
  },
  {
    q: 'Posso usar em mais de um WhatsApp?',
    a: 'O plano Único inclui 1 número. Para mais números, entre em contato com nosso suporte que fazemos um plano customizado pra você.'
  },
  {
    q: 'E se eu quiser testar antes?',
    a: 'São 7 dias grátis sem compromisso. Você cadastra seus produtos, conecta o WhatsApp e testa tudo. Só paga se quiser continuar.'
  },
]

export default function Pricing() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="pricing" ref={ref} className="relative py-32 bg-zinc-900 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-[800px] h-[800px] bg-gradient-to-b from-emerald-500/5 to-transparent blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-t from-emerald-500/5 to-transparent blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-emerald-400 uppercase tracking-widest">Preços</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-zinc-100">
            Invista menos que um <span className="gradient-text">estagiário</span>
          </h2>
          <p className="mt-6 text-xl text-zinc-400">
            Plano único. Sem letras miúdas. Cancele quando quiser.
          </p>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto mb-20"
        >
          <div className="relative p-8 rounded-2xl border border-emerald-500/20 bg-zinc-900 shadow-xl shadow-emerald-500/5 transition-all duration-300 hover:border-emerald-500/40">
            {/* Top badges */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-2">
              <div className="px-4 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-semibold rounded-full whitespace-nowrap shadow-lg shadow-emerald-500/30">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  7 dias grátis
                </span>
              </div>
              <div className="px-4 py-1 bg-gradient-to-r from-green-600 to-emerald-700 text-white/90 text-xs font-semibold rounded-full whitespace-nowrap shadow-lg">
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3" />
                  PIX
                </span>
              </div>
            </div>

            {/* Card content */}
            <div className="text-center mb-8 pt-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-100">{plan.name}</h3>
              <p className="text-sm text-zinc-500 mt-2 max-w-xs mx-auto">{plan.description}</p>
            </div>

            {/* Price */}
            <div className="text-center mb-6">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold text-zinc-100">R$ {plan.price.toFixed(2).replace('.', ',')}</span>
                <span className="text-zinc-500">/mês</span>
              </div>
              <div className="flex items-center justify-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                  <ShieldCheck className="w-3 h-3" />
                  7 dias de garantia
                </span>
                <span className="text-zinc-600">|</span>
                <span className="flex items-center gap-1 text-xs text-zinc-500">
                  <CreditCard className="w-3 h-3" />
                  Aceita PIX
                </span>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8 max-w-xs mx-auto">
              {plan.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-zinc-400">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>

            {/* Urgent CTA */}
            <Link
              href="/register"
              className="group block w-full py-4 rounded-xl text-center text-base font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Começar grátis por 7 dias
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            {/* Urgency micro-text */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <Clock className="w-3 h-3 text-emerald-500" />
              <p className="text-xs text-emerald-500/80 font-medium animate-pulse">
                Oferta por tempo limitado
              </p>
            </div>

            <p className="text-xs text-zinc-600 text-center mt-2">
              PIX · Ativação instantânea · Cancele quando quiser
            </p>
          </div>
        </motion.div>

        {/* WhatsAppAI vs Funcionário Tradicional - Cost Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-4">
              <span className="gradient-text">WhatsAI</span> vs Funcionário Tradicional
            </h3>
            <p className="text-lg text-zinc-400">
              Veja a diferença de custo e eficiência. O WhatsAI custa menos que <strong className="text-zinc-300">1 hora</strong> de um funcionário.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-950/50">
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-0 border-b border-zinc-800">
              <div className="p-4 sm:p-5 bg-zinc-900/80">
                <span className="text-sm font-semibold text-zinc-400">Comparativo</span>
              </div>
              <div className="p-4 sm:p-5 bg-emerald-950/30 border-x border-zinc-800">
                <div className="flex items-center gap-2 justify-center">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-400">WhatsAI</span>
                </div>
              </div>
              <div className="p-4 sm:p-5 bg-zinc-900/80">
                <div className="flex items-center gap-2 justify-center">
                  <Users className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm font-bold text-zinc-500">Funcionário</span>
                </div>
              </div>
            </div>

            {/* Table Rows */}
            {comparisonRows.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-3 gap-0 border-b border-zinc-800/50 transition-colors hover:bg-zinc-900/50 ${
                  i % 2 === 0 ? 'bg-transparent' : 'bg-zinc-900/20'
                }`}
              >
                <div className="p-4 sm:p-5 flex items-center">
                  <span className="text-sm text-zinc-300">{row.label}</span>
                </div>
                <div className="p-4 sm:p-5 border-x border-zinc-800/50 flex items-center justify-center">
                  {row.whatsai === 'Sim' ? (
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
                      <Check className="w-4 h-4" />
                      Sim
                    </span>
                  ) : row.whatsai === 'Não' ? (
                    <span className="flex items-center gap-1.5 text-sm text-red-400">
                      <X className="w-4 h-4" />
                      Não
                    </span>
                  ) : (
                    <span className="text-sm font-semibold text-emerald-400">{row.whatsai}</span>
                  )}
                </div>
                <div className="p-4 sm:p-5 flex items-center justify-center">
                  {row.employee === 'Não' ? (
                    <span className="flex items-center gap-1.5 text-sm text-red-400">
                      <X className="w-4 h-4" />
                      Não
                    </span>
                  ) : (
                    <span className="text-sm text-zinc-500">{row.employee}</span>
                  )}
                </div>
              </div>
            ))}

            {/* Savings Highlight */}
            <div className="p-6 bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border-t border-emerald-500/20">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingDown className="w-5 h-5 text-emerald-400" />
                  <span className="text-xl font-bold text-emerald-400">Economia de até 98%</span>
                </div>
                <p className="text-sm text-zinc-400">
                  R$ 29,90/mês vs média de R$ 2.500/mês de um funcionário. Fora encargos, férias, 13º e benefícios.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pricing FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-emerald-400 uppercase tracking-widest">FAQ - Preços</span>
            <h3 className="mt-4 text-3xl sm:text-4xl font-bold text-zinc-100">
              Dúvidas sobre <span className="gradient-text">planos e pagamento</span>
            </h3>
            <p className="mt-4 text-lg text-zinc-400">
              Tire suas dúvidas sobre preços, pagamento e cancelamento.
            </p>
          </div>

          <div className="space-y-3">
            {pricingFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                className="bg-zinc-900/80 rounded-xl border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left gap-4"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-medium text-zinc-100">{faq.q}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-300 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaq === index ? 'auto' : 0,
                    opacity: openFaq === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-zinc-400 leading-relaxed text-sm pl-12">{faq.a}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
