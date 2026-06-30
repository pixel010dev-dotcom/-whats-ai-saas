'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const steps = [
  {
    number: '01',
    title: 'Conecte seu WhatsApp',
    description: 'Escaneie o QR Code com seu WhatsApp e pronto. A IA come\u00e7a a aprender sobre seu neg\u00f3cio.',
    icon: '\u{1F4F1}',
    gradient: 'from-green-400 to-emerald-500'
  },
  {
    number: '02',
    title: 'Configure seus produtos',
    description: 'Adicione seu cat\u00e1logo, pre\u00e7os e regras de neg\u00f3cio. A IA se adapta ao seu jeito de vender.',
    icon: '\u2699\uFE0F',
    gradient: 'from-blue-400 to-indigo-500'
  },
  {
    number: '03',
    title: 'Treine a IA',
    description: 'Personalize o tom de voz, respostas autom\u00e1ticas e gatilhos de venda. Fica do seu jeito.',
    icon: '\u{1F9E0}',
    gradient: 'from-purple-400 to-pink-500'
  },
  {
    number: '04',
    title: 'Venda automaticamente',
    description: 'A IA atende, negocia e fecha pedidos 24h. Voc\u00ea s\u00f3 acompanha os resultados.',
    icon: '\u{1F4B0}',
    gradient: 'from-orange-400 to-red-500'
  }
]

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="how-it-works" ref={ref} className="relative py-32 bg-gray-50 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-sm font-semibold text-green-600 uppercase tracking-widest">Como funciona</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-gray-900">
            Come\u00e7a a vender em <span className="gradient-text">5 minutos</span>
          </h2>
          <p className="mt-6 text-xl text-gray-600">
            Mais r\u00e1pido que contratar um funcion\u00e1rio. Mais barato que um estagi\u00e1rio.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative text-center"
            >
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-green-300 to-green-100">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-green-400 rotate-45" />
                </div>
              )}
              <div className={`w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-4xl shadow-lg mb-6 relative`}>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                  {step.number}
                </div>
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
