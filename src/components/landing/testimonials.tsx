'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const testimonials = [
  {
    name: 'Diogo Pfeifer',
    role: 'Geoleads',
    content: 'Estava perdendo cliente porque demorava pra responder no WhatsApp. A IA responde na hora com preço certo, estoque e até fecha negociação. Tripliquei as vendas sem contratar ninguém.',
    rating: 5,
    initials: 'DP',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  {
    name: 'Maria Santos',
    role: 'Salgados da Maria',
    content: 'Coloquei cardápio, preços e horários. A IA faz orçamento, confirma pedido e até pergunta se o cliente quer adicionar mais coisas. Virou meu melhor vendedor noturno.',
    rating: 5,
    initials: 'MS',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    name: 'Ricardo Oliveira',
    role: 'Auto Peças FM',
    content: 'Meus cliente perguntam 24h por dia: preço de peça, horário, se tem estoque. Agora a IA responde tudo sozinha. Só entro quando é pra fechar a venda. Menos estresse, mais resultado.',
    rating: 5,
    initials: 'RO',
    gradient: 'from-blue-500 to-cyan-600',
  },
  {
    name: 'Juliana Costa',
    role: 'Doces e Delícias',
    content: 'No começo desconfiei se a IA ia entender de encomenda de bolo. Mas ela aprendeu rápido: sabor, tamanho, prazo. Minhas clientes nem percebem que não sou eu respondendo.',
    rating: 4,
    initials: 'JC',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    name: 'Rafael Lima',
    role: 'Barbearia do Rafa',
    content: 'Botava agenda no papel e perdia corte toda hora. Agora a IA agenda direto pelo WhatsApp, manda lembrete e se o cliente cancelar, ja abre vaga. Nunca mais tive furo de agenda.',
    rating: 5,
    initials: 'RL',
    gradient: 'from-rose-500 to-red-600',
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
    <section ref={ref} className="relative py-32 bg-zinc-950 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-emerald-400 uppercase tracking-widest">Depoimentos</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-zinc-100">
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
                className={`p-8 rounded-2xl bg-white border border-zinc-800 shadow-xl ${
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

                <p className="text-lg text-zinc-300 leading-relaxed mb-8 italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-sm`}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="font-bold text-zinc-100">{testimonial.name}</p>
                    <p className="text-sm text-zinc-500">{testimonial.role}</p>
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
                    ? 'bg-emerald-500 w-8'
                    : 'bg-zinc-700 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
