import type { Metadata } from 'next'
import Pricing from '@/components/landing/pricing'

export const metadata: Metadata = {
  title: 'Planos e Preços',
  description: 'Conheça os planos do WhatsAI. Do básico ao premium, temos a solução ideal para automatizar seu atendimento no WhatsApp.',
  openGraph: { title: 'Planos e Preços | WhatsAI', description: 'Automatize seu atendimento no WhatsApp com IA a partir de R$ 97/mês.' },
}

export default function PricingPage() {
  return <Pricing />
}
