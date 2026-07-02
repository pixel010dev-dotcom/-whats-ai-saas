'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const plan = {
  name: 'WhatsAI',
  monthlyPrice: 29.90,
  description: 'Tudo que você precisa para vender no WhatsApp',
  features: [
    'Conversas ilimitadas',
    '1 número WhatsApp',
    'IA com conhecimento da sua empresa',
    'Respostas automáticas inteligentes',
    'Catálogo de produtos',
    'Dashboard completo com métricas',
    'Suporte prioritário'
  ],
  cta: 'Começar grátis'
}

export default function Pricing() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-gradient-to-b from-green-500/5 to-transparent blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-emerald-400 uppercase tracking-widest">Planos</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-zinc-100">
            Preços que cabem no seu <span className="gradient-text">bolso</span>
          </h2>
          <p className="mt-6 text-xl text-zinc-400">
            Invista menos que um estagiário e tenha um time de vendas completo.
          </p>
        </motion.div>

        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="relative p-8 rounded-2xl border-2 border-green-500 bg-zinc-900 shadow-xl shadow-green-500/10"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold rounded-full whitespace-nowrap">
              30 dias · Renova automaticamente
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-zinc-100 mb-2">{plan.name}</h3>
              <p className="text-zinc-500 text-sm">{plan.description}</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-zinc-100">
                  R$ {plan.monthlyPrice.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-zinc-500">/mês</span>
              </div>
              <p className="text-xs text-zinc-600 mt-1">Menos que um estagiário · Cancele quando quiser</p>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                  <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href="/register"
              className="block w-full py-3 rounded-xl text-center font-semibold transition-all duration-300 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:-translate-y-0.5"
            >
              {plan.cta}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
