'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { XCircle, Clock, AlertTriangle, TrendingDown, CheckCircle, Zap, MessageCircle, TrendingUp } from 'lucide-react'

const beforeItems = [
  { icon: Clock, text: 'Demora horas para responder cliente', color: 'text-red-400' },
  { icon: XCircle, text: 'Perde venda enquanto dorme', color: 'text-red-400' },
  { icon: AlertTriangle, text: 'Erra pre\u00e7o, esquece estoque', color: 'text-red-400' },
  { icon: TrendingDown, text: 'Cliente cai na concorr\u00eancia', color: 'text-red-400' },
]

const afterItems = [
  { icon: Zap, text: 'IA responde em 2 segundos', color: 'text-emerald-400' },
  { icon: MessageCircle, text: 'Vende 24 horas por dia', color: 'text-emerald-400' },
  { icon: CheckCircle, text: 'Pre\u00e7o certo, estoque atualizado', color: 'text-emerald-400' },
  { icon: TrendingUp, text: 'Fideliza e recupera clientes', color: 'text-emerald-400' },
]

export default function Comparison() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="comparison" ref={ref} className="relative py-32 bg-zinc-950 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-emerald-400 uppercase tracking-widest">Antes vs Depois</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-zinc-100">
            O antes e depois de usar <span className="gradient-text">WhatsAI</span>
          </h2>
        </motion.div>

        <div className="relative grid md:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* Before Column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="p-8 rounded-2xl bg-red-950/30 border border-red-900/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-300">Antes</h3>
                  <p className="text-sm text-red-400/60">Atendimento manual</p>
                </div>
              </div>
              <ul className="space-y-4">
                {beforeItems.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-3 text-sm text-red-300/70"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                      <item.icon className={"w-4 h-4 " + item.color} />
                    </div>
                    <span>{item.text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Vs Badge */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-14 h-14 rounded-full bg-zinc-900 border-4 border-zinc-950 flex items-center justify-center">
              <span className="text-sm font-bold text-zinc-400">VS</span>
            </div>
          </div>

          {/* After Column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="p-8 rounded-2xl bg-emerald-950/30 border border-emerald-900/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[60px]" />
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-300">Depois</h3>
                  <p className="text-sm text-emerald-400/60">Com WhatsAI</p>
                </div>
              </div>
              <ul className="space-y-4 relative z-10">
                {afterItems.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-3 text-sm text-emerald-300/70"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <item.icon className={"w-4 h-4 " + item.color} />
                    </div>
                    <span>{item.text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
