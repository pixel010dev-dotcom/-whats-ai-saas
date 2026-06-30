'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const features = [
  {
    icon: '\u{1F4AC}',
    title: 'Vende 24h por dia',
    description: 'Seu WhatsApp funciona enquanto voc\ê dorme. A IA atende, negocia e fecha vendas automaticamente.',
    gradient: 'from-green-400 to-emerald-600',
    stats: 'Aumento de 40% nas vendas'
  },
  {
    icon: '\u{1F9E0}',
    title: 'Intelig\ência de verdade',
    description: 'N\ão \é um rob\ô burro. Usa GPT e outros modelos avan\çados para entender contexto.',
    gradient: 'from-blue-400 to-indigo-600',
    stats: '98% de acerto nas respostas'
  },
  {
    icon: '\u{1F4CA}',
    title: 'Dashboard completo',
    description: 'Veja vendas, leads, conversas e desempenho em tempo real. Decis\ões baseadas em dados.',
    gradient: 'from-purple-400 to-pink-600',
    stats: 'M\étricas em tempo real'
  },
  {
    icon: '\u{1F4E6}',
    title: 'Cat\álogo inteligente',
    description: 'Cadastre seus produtos e a IA recomenda, mostra pre\ços e detalhes certos para cada cliente.',
    gradient: 'from-orange-400 to-red-600',
    stats: 'Cat\álogo autom\ático'
  },
  {
    icon: '\u{1F464}',
    title: 'Mem\ória de cliente',
    description: 'A IA lembra de cada cliente: hist\órico, prefer\ências, \última compra. Atendimento personalizado.',
    gradient: 'from-teal-400 to-cyan-600',
    stats: 'CRM autom\ático'
  },
  {
    icon: '\u{1F501}',
    title: 'P\ós-venda autom\ático',
    description: 'Acompanhamento de pedidos, pesquisas de satisfa\ç\ão e recupera\ç\ão de clientes inativos.',
    gradient: 'from-rose-400 to-pink-600',
    stats: 'Reten\ç\ão de 60%'
  }
]

export default function Features() {
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
    <section id="features" ref={ref} className="relative py-32 bg-gradient-to-b from-white via-gray-50/50 to-white overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-green-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Tudo que voc\ê precisa para <span className="gradient-text">vender mais no WhatsApp</span>
          </h2>
          <p className="mt-6 text-xl text-gray-600">
            Uma plataforma completa com intelig\ência artificial para automatizar seu atendimento e aumentar suas vendas.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-8 rounded-2xl bg-white border border-gray-100 hover-card"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl mb-5 shadow-lg`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
              <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {feature.stats}
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
