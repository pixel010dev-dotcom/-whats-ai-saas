'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

const faqs = [
  {
    q: 'Como funciona a conexão com o WhatsApp?',
    a: 'Você escaneia um QR Code pelo aplicativo do WhatsApp (WhatsApp Web). A conexão é criptografada e segura. Em menos de 1 minuto seu WhatsApp já está conectado à nossa IA.'
  },
  {
    q: 'Preciso deixar o WhatsApp Web aberto?',
    a: 'Não! Diferente do WhatsApp Web tradicional, nossa tecnologia Evolution API mantém seu número conectado 24/7 sem precisar de celular ligado ou browser aberto.'
  },
  {
    q: 'A IA entende do meu negócio?',
    a: 'Sim! Você cadastra seus produtos, preços e regras. A IA aprende com o tempo e se adapta ao seu jeito de vender. Quanto mais usa, mais inteligente fica.'
  },
  {
    q: 'Posso acompanhar as conversas em tempo real?',
    a: 'Sim! Pelo dashboard você vê todas as conversas acontecendo em tempo real. Pode intervir quando quiser e analisar métricas de desempenho.'
  },
  {
    q: 'E se a IA não souber responder algo?',
    a: 'A IA é treinada para identificar quando não sabe algo e pode transferir a conversa para você automaticamente. Você define as regras de transferência no dashboard.'
  },
  {
    q: 'Como funciona o pagamento?',
    a: 'Aceitamos PIX, cartão de crédito e boleto via Mercado Pago. Os primeiros 7 dias são grátis sem compromisso.'
  },
  {
    q: 'Posso cancelar quando quiser?',
    a: 'Sim! Sem multa, sem burocracia. Você cancela pelo dashboard e o plano continua até o final do período já pago.'
  },
  {
    q: 'Contratei o plano. Quantas pessoas podem usar ao mesmo tempo?',
    a: 'O plano Único dá acesso completo para você e até 2 colaboradores acompanharem as conversas pelo dashboard.'
  }
]

export default function FAQ() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="faq" ref={ref} className="relative py-32 bg-zinc-950 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-emerald-400 uppercase tracking-widest">FAQ</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-zinc-100">
            Perguntas <span className="gradient-text">frequentes</span>
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-zinc-900 rounded-xl border border-zinc-700 bg-zinc-900 overflow-hidden transition-all duration-300 hover:border-zinc-600"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-zinc-100 pr-4">{faq.q}</span>
                <svg
                  className={`w-5 h-5 text-green-500 shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? 'auto' : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-6 text-zinc-400 leading-relaxed">{faq.a}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
