'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Check, Zap } from 'lucide-react'

const plan = {
  name: 'Unico',
  slug: 'UNICO',
  price: 29.90,
  description: 'Tudo que voce precisa para vender no WhatsApp',
  features: [
    'Conversas ilimitadas',
    '1 numero WhatsApp',
    'IA com conhecimento da sua empresa',
    'Respostas automaticas inteligentes',
    'Catalogo de produtos',
    'Dashboard completo',
    'Suporte prioritario',
  ],

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
        <div className="absolute top-1/2 left-1/4 w-[800px] h-[800px] bg-gradient-to-b from-emerald-500/5 to-transparent blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-emerald-400 uppercase tracking-widest">Precos</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-zinc-100">
            Invista menos que um <span className="gradient-text">estagiario</span>
          </h2>
          <p className="mt-6 text-xl text-zinc-400">
            Unico plano. Sem letras miudas. Cancele quando quiser.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <div className="relative p-8 rounded-2xl border border-emerald-500/20 bg-zinc-900 shadow-xl shadow-emerald-500/5 transition-all duration-300 hover:border-emerald-500/40">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-semibold rounded-full whitespace-nowrap">
              Plano unico
            </div>

            <div className="text-center mb-8 pt-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-100">{plan.name}</h3>
              <p className="text-sm text-zinc-500 mt-2 max-w-xs mx-auto">{plan.description}</p>
            </div>

            <div className="text-center mb-8">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold text-zinc-100">R$ {plan.price.toFixed(2).replace('.', ',')}</span>
                <span className="text-zinc-500">/mes</span>
              </div>
              <p className="text-sm text-zinc-600 mt-2">Pagamento via PIX &middot; Ativacao instantanea</p>
            </div>

            <ul className="space-y-3 mb-8 max-w-xs mx-auto">
              {plan.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-zinc-400">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>

            <Link
              href="/register"
              className="block w-full py-3.5 rounded-xl text-center text-base font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Comecar agora &rarr;
            </Link>

            <p className="text-xs text-zinc-600 text-center mt-4">
              PIX &middot; Ativacao instantanea
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
