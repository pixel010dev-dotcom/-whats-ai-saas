'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const testimonials = [
  {
    name: 'Carlos Silva',
    role: 'Padaria do Carlos',
    content: 'Minhas vendas pelo WhatsApp aumentaram 340% em 2 meses. A IA não deixa nenhum cliente sem resposta, mesmo quando estou dormindo. Melhor investimento que já fiz.',
    rating: 5,
    initials: 'CS',
    color: 'from-green-400 to-emerald-600'
  },
  {
    name: 'Ana Oliveira',
    role: 'Moda Feminina LOOK',
    content: '\u201CAtendo 3x mais clientes com metade do esforço. A inteligência artificial é tão boa que os clientes acham que sou eu respondendo. Simplesmente incrível!\u201D',
    rating: 5,
    initials: 'AO',
    color: 'from-purple-400 to-pink-600'
  },
  {
    name: 'Roberto Mendes',
    role: 'Auto Peças FM',
    content: '\u201CJá testei vários chatbots. Esse é o único que realmente entende do que o cliente precisa e consegue fechar vendas sozinho. Recomendo de olhos fechados.\u201D',
    rating: 5,
    initials: 'RM',
    color: 'from-blue-400 to-indigo-600'
  },
  {
    name: 'Juliana Costa',
    role: 'Doces e Delícias',
    content: '\u201CO pós-venda automático recuperou 15 clientes que não compravam há meses. Minha receita subiu 50% sem eu fazer nada.\u201D',
    rating: 5,
    initials: 'JC',
    color: 'from-orange-400 to-red-600'
  }
]

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section ref={ref} className="relative py-32 bg-gradient-to-b from-white via-gray-50/30 to-white overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-green-600 uppercase tracking-widest">Depoimentos</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-gray-900">
            Quem usa, <span className="gradient-text">aprova</span>
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative min-h-[300px]">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{
                  opacity: activeIndex === index ? 1 : 0,
                  x: activeIndex === index ? 0 : activeIndex < index ? -50 : 50,
                  scale: activeIndex === index ? 1 : 0.95,
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`p-8 rounded-2xl bg-white border border-gray-100 shadow-xl ${
                  activeIndex !== index ? 'hidden' : ''
                }`}
              >
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-lg text-gray-700 leading-relaxed mb-8 italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-sm`}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                  activeIndex === index
                    ? 'bg-green-500 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
