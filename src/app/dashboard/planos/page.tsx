'use client'

import { useState } from 'react'
import { useAuth } from '@/app/context/AuthProvider'
import { Check, CreditCard, Copy, CheckCheck, QrCode, ArrowRight, Zap, Star, Crown } from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'

const plans = [
  {
    name: 'Basico',
    slug: 'BASICO',
    description: 'Perfeito para quem esta comecando',
    monthly: 97,
    yearly: Math.round(97 * 12 * 0.8),
    features: [
      'Ate 500 conversas/mes',
      '1 numero WhatsApp',
      'IA com conhecimento basico',
      'Dashboard completo',
      'Catalogo de produtos',
      'Suporte por email',
    ],
    icon: Zap,
    popular: false,
    color: 'from-zinc-400 to-zinc-600',
  },
  {
    name: 'Profissional',
    slug: 'PROFISSIONAL',
    description: 'Para negocios em crescimento',
    monthly: 197,
    yearly: Math.round(197 * 12 * 0.8),
    features: [
      'Ate 2.000 conversas/mes',
      '2 numeros WhatsApp',
      'IA com conhecimento avancado',
      'Dashboard + Relatorios',
      'Catalogo ilimitado',
      'Integracao com Mercado Pago',
      'Suporte prioritario',
    ],
    icon: Star,
    popular: true,
    color: 'from-emerald-400 to-emerald-600',
  },
  {
    name: 'Premium',
    slug: 'PREMIUM',
    description: 'Solucao completa para empresas',
    monthly: 297,
    yearly: Math.round(297 * 12 * 0.8),
    features: [
      'Conversas ilimitadas',
      '5 numeros WhatsApp',
      'IA treinada sob medida',
      'Dashboard + Relatorios avancados',
      'API e Webhooks',
      'Integracoes personalizadas',
      'Gerente de conta dedicado',
      'Suporte 24h',
    ],
    icon: Crown,
    popular: false,
    color: 'from-amber-400 to-amber-600',
  },
]

export default function PlanosPage() {
  const { user } = useAuth()
  const [annual, setAnnual] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [paymentData, setPaymentData] = useState<{
    qrCode: string
    qrCodeBase64: string
    copyPaste: string
    ticketUrl: string
    amount: number
  } | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleSelectPlan(planSlug: string) {
    setSelectedPlan(planSlug)
    setPaymentData(null)
    setLoading(true)
    try {
      const profileRes = await fetch('/api/auth/profile')
      const profile = await profileRes.json()
      const tenantId = profile.tenant?.id
      if (!tenantId) {
        toast.error('Erro ao carregar perfil')
        setLoading(false)
        return
      }
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, plan: planSlug, period: annual ? 'yearly' : 'monthly' }),
      })
      if (res.ok) {
        const data = await res.json()
        setPaymentData(data.payment)
        toast.success('Pagamento PIX gerado!')
      } else {
        const err = await res.json()
        toast.error(err.error || 'Erro ao gerar pagamento')
      }
    } catch (err) {
      console.error('Payment error:', err)
      toast.error('Erro ao processar pagamento')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopyPix(code: string) {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success('Codigo PIX copiado!')
      setTimeout(() => setCopied(false), 3000)
    } catch {
      toast.error('Erro ao copiar')
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-zinc-100">Planos</h1>
        <p className="text-zinc-500 mt-2">Escolha o plano ideal para seu negocio</p>
      </div>
      <div className="flex items-center justify-center gap-3">
        <span className={'text-sm ' + (!annual ? 'text-zinc-200' : 'text-zinc-500')}>Mensal</span>
        <button onClick={() => setAnnual(!annual)} className={'w-14 h-7 rounded-full transition-colors relative ' + (annual ? 'bg-emerald-500' : 'bg-zinc-700')}>
          <div className={'w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ' + (annual ? 'translate-x-8' : 'translate-x-1')} />
        </button>
        <span className={'text-sm ' + (annual ? 'text-zinc-200' : 'text-zinc-500')}>Anual</span>
        {annual && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">Economize 20%</span>}
      </div>
      <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {plans.map(plan => {
          const Icon = plan.icon
          const price = annual ? plan.yearly : plan.monthly
          return (
            <div key={plan.slug} className={'relative bg-zinc-900/50 border rounded-xl p-6 transition-all ' + (plan.popular ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' : 'border-zinc-800 hover:border-zinc-700') + (selectedPlan === plan.slug ? ' ring-2 ring-emerald-500' : '')}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-500 text-white font-medium">Mais popular</span>
                </div>
              )}
              <div className="mb-4">
                <div className={'w-10 h-10 rounded-lg bg-gradient-to-br ' + plan.color + ' flex items-center justify-center mb-3'}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-100">{plan.name}</h3>
                <p className="text-sm text-zinc-500 mt-1">{plan.description}</p>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-bold text-zinc-100">{formatCurrency(price)}</span>
                <span className="text-zinc-500 text-sm">/{annual ? 'ano' : 'mes'}</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    {feat}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleSelectPlan(plan.slug)} disabled={loading} className={'w-full py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ' + (plan.popular ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200')}>
                {loading && selectedPlan === plan.slug ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Gerando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {selectedPlan === plan.slug ? 'Selecionado' : 'Assinar'}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </div>
          )
        })}
      </div>
      {paymentData && (
        <div className="max-w-md mx-auto mt-8 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-7 h-7 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-100 mb-1">Pagamento PIX</h3>
          <p className="text-sm text-zinc-500 mb-4">Escaneie o QR Code ou copie o codigo</p>
          {paymentData.qrCodeBase64 ? (
            <div className="bg-white p-4 rounded-xl inline-block mb-4">
              <img src={'data:image/png;base64,' + paymentData.qrCodeBase64} alt="QR Code PIX" className="w-48 h-48 mx-auto" />
            </div>
          ) : (
            <div className="bg-zinc-800 rounded-xl p-8 mb-4">
              <QrCode className="w-32 h-32 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-600 mt-2">QR Code nao disponivel</p>
            </div>
          )}
          <div className="bg-zinc-800 rounded-lg p-3 mb-4">
            <p className="text-xs text-zinc-500 mb-2">Codigo PIX Copia e Cola</p>
            <p className="text-xs text-zinc-300 break-all mb-2">{paymentData.copyPaste || paymentData.qrCode}</p>
            <button onClick={() => handleCopyPix(paymentData.copyPaste || paymentData.qrCode)} className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
              {copied ? <><CheckCheck className="w-4 h-4" />Copiado!</> : <><Copy className="w-4 h-4" />Copiar codigo</>}
            </button>
          </div>
          <p className="text-sm text-zinc-500">Valor: <span className="font-semibold text-zinc-200">{formatCurrency(paymentData.amount)}</span></p>
          <p className="text-xs text-zinc-600 mt-2">Apos o pagamento, sua assinatura sera ativada automaticamente</p>
        </div>
      )}
    </div>
  )
}
