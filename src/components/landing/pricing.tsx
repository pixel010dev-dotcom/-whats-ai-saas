'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const plans = [
  {
    name: 'B\u00e1sico',
    monthlyPrice: 97,
    yearlyPrice: 77,
    description: 'Perfeito para quem est\u00e1 come\u00e7ando',
    features: [
      '500 conversas por m\u00eas',
      '1 n\u00famero WhatsApp',
      'Cat\u00e1logo de at\u00e9 50 produtos',
      'Respostas autom\u00e1ticas',
      'Dashboard b\u00e1sico',
      'Suporte por email'
    ],
    cta: 'Come\u00e7ar gr\u00e1tis',
    popular: false
  },
  {
    name: 'Profissional',
    monthlyPrice: 197,
    yearlyPrice: 157,
    description: 'Mais popular - ideal para crescer',
    features: [
      'Conversas ilimitadas',
      '2 n\u00fameros WhatsApp',
      'Cat\u00e1logo ilimitado',
      'IA avan\u00e7ada com contexto',
      'Vendas automatizadas',
      'Dashboard completo com m\u00e9tricas',
      'Recupera\u00e7\u00e3o de carrinho',
      'Suporte priorit\u00e1rio'
    ],
    cta: 'Come\u00e7ar gr\u00e1tis',
    popular: true
  },
  {
    name: 'Premium',
    monthlyPrice: 297,
    yearlyPrice: 237,
    description: 'Para quem quer tudo ao m\u00e1ximo',
    features: [
      'Conversas ilimitadas',
      '5 n\u00fameros WhatsApp',
      'Cat\u00e1logo ilimitado',
      'IA premium com GPT-4',
      'Relat\u00f3rios avan\u00e7ados',
      'Integra\u00e7\u00f5es API',
      'M\u00faltiplos atendentes',
      'Gerente de conta dedicado',
      'SLA 99.9%'
    ],
    cta: 'Falar com vendas',
    popular: false
  }
]

export default function Pricing() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [annual, setAnnual] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="pricing" ref={ref} className="relative py-32 bg-white overflow-hidden">
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
          <span className="text-sm font-semibold text-green-600 uppercase tracking-widest">Planos</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-gray-900">
            Pre\u00e7os que cabem no seu <span className="gradient-text">bolso</span>
          </h2>
          <p className="mt-6 text-xl text-gray-600">
            Invista menos que um estagi\u00e1rio e tenha um time de vendas completo.
          </p>
        </motion.div>

        <div className="flex items-center justify-center gap-4 mb-16">
          <span className={`text-sm font-medium ${!annual ? 'text-gray-900' : 'text-gray-500'}`}>Mensal</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${annual ? 'bg-green-500' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${annual ? 'left-8' : 'left-1'}`} />
          </button>
          <span className={`text-sm font-medium ${annual ? 'text-gray-900' : 'text-gray-500'}`}>
            Anual
            <span className="ml-1.5 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full font-semibold">2 meses gr\u00e1tis</span>
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`relative p-8 rounded-2xl border-2 transition-all duration-300 hover-card ${
                plan.popular
                  ? 'border-green-500 bg-white shadow-xl shadow-green-500/10'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold rounded-full">
                  Mais popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-500 text-sm">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">
                    R$ {annual ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-gray-500">/m\u00eas</span>
                </div>
                {annual && (
                  <p className="text-sm text-green-600 font-medium mt-1">
                    Economia de R$ {(plan.monthlyPrice - plan.yearlyPrice) * 12}/ano
                  </p>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.name === 'Premium' ? '/contact' : '/register'}
                className={`block w-full py-3 rounded-xl text-center font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:-translate-y-0.5'
                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 hover:-translate-y-0.5'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
