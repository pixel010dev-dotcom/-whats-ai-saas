'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

const faqs = [
  {
    q: 'Como funciona a conex\ão com o WhatsApp?',
    a: 'Voc\ê escaneia um QR Code pelo aplicativo do WhatsApp (WhatsApp Web). A conex\ão \é criptografada e segura. Em menos de 1 minuto seu WhatsApp j\á est\á conectado \à nossa IA.'
  },
  {
    q: 'Preciso deixar o WhatsApp Web aberto?',
    a: 'N\ão! Diferente do WhatsApp Web tradicional, nossa tecnologia Evolution API mant\ém seu n\úmero conectado 24/7 sem precisar de celular ligado ou browser aberto.'
  },
  {
    q: 'A IA entende do meu neg\ócio?',
    a: 'Sim! Voc\ê cadastra seus produtos, pre\ços e regras. A IA aprende com o tempo e se adapta ao seu jeito de vender. Quanto mais usa, mais inteligente fica.'
  },
  {
    q: 'Posso acompanhar as conversas em tempo real?',
    a: 'Sim! Pelo dashboard voc\ê v\ê todas as conversas acontecendo em tempo real. Pode intervir quando quiser e analisar m\étricas de desempenho.'
  },
  {
    q: 'E se a IA n\ão souber responder algo?',
    a: 'A IA \é treinada para identificar quando n\ão sabe algo e pode transferir a conversa para voc\ê automaticamente. Voc\ê define as regras de transfer\ência no dashboard.'
  },
  {
    q: 'Como funciona o pagamento?',
    a: 'Aceitamos PIX, cart\ão de cr\édito e boleto via Mercado Pago. Os primeiros 7 dias s\ão gr\átis sem compromisso.'
  },
  {
    q: 'Posso cancelar quando quiser?',
    a: 'Sim! Sem multa, sem burocracia. Voc\ê cancela pelo dashboard e o plano continua at\é o final do per\íodo j\á pago.'
  },
  {
    q: 'Quantas pessoas podem usar ao mesmo tempo?',
    a: 'Depende do seu plano. No B\ásico \é 1 usu\ário, no Profissional at\é 3, e no Premium ilimitado.'
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
    <section id="faq" ref={ref} className="relative py-32 bg-gray-50 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-green-600 uppercase tracking-widest">FAQ</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-gray-900">
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
              className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:border-gray-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
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
                <p className="px-6 pb-6 text-gray-600 leading-relaxed">{faq.a}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
