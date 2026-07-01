
'use client'

import { motion } from 'framer-motion'
import { Shield, Lock, CreditCard, HeadphonesIcon, Truck, Star } from 'lucide-react'

const badges = [
  { icon: Shield, text: 'Pagamento 100% seguro', sub: 'Dados protegidos' },
  { icon: Lock, text: 'Privacidade garantida', sub: 'LGPD compliance' },
  { icon: CreditCard, text: 'PIX, cartão e boleto', sub: 'Pagamento facilitado' },
  { icon: HeadphonesIcon, text: 'Suporte 24 horas', sub: 'Equipe dedicada' },
  { icon: Truck, text: 'Entrega rápida', sub: 'Todo o Brasil' },
  { icon: Star, text: 'Nota 4.9/5.0', sub: 'Avaliação dos clientes' },
]

export default function TrustBadges() {
  return (
    <section className="relative py-16 bg-zinc-950 border-y border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex flex-col items-center text-center gap-2"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <badge.icon className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-100">{badge.text}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{badge.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
