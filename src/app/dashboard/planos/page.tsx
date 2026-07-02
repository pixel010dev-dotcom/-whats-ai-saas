'use client'

import { useState } from 'react'
import { Check, Copy, CheckCheck, QrCode, ArrowRight, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'

const plan = {
  name: 'WhatsAI',
  slug: 'UNICO',
  description: 'Tudo que voce precisa para vender no WhatsApp',
  monthly: 29.90,
  features: [
    'Conversas ilimitadas',
    '1 numero WhatsApp',
    'IA com conhecimento da sua empresa',
    'Respostas automaticas inteligentes',
    'Catalogo de produtos',
    'Dashboard completo',
    'Suporte prioritario',
  ],
  icon: Zap,
  color: 'from-emerald-400 to-emerald-600',
}

export default function PlanosPage() {
  const [loading, setLoading] = useState(false)
  const [paymentData, setPaymentData] = useState<{
    qrCode: string
    qrCodeBase64: string
    copyPaste: string
    ticketUrl: string
    amount: number
  } | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleSelectPlan() {
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
        body: JSON.stringify({ tenantId, plan: 'UNICO' }),
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
        <h1 className="text-3xl font-bold text-zinc-100">Assinar Plano</h1>
        <p className="text-zinc-500 mt-2">Desbloqueie todas as funcionalidades do WhatsAI</p>
      </div>
      <div className="max-w-md mx-auto">
        <div className="relative bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 transition-all hover:border-zinc-700">
          <div className="mb-4">
            <div className={'w-10 h-10 rounded-lg bg-gradient-to-br ' + plan.color + ' flex items-center justify-center mb-3'}>
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-100">{plan.name}</h3>
            <p className="text-sm text-zinc-500 mt-1">{plan.description}</p>
          </div>
          <div className="mb-6">
            <span className="text-3xl font-bold text-zinc-100">{formatCurrency(plan.monthly)}</span>
            <span className="text-zinc-500 text-sm">/mes</span>
            <p className="text-xs text-zinc-600 mt-1">Renovacao a cada 30 dias</p>
          </div>
          <ul className="space-y-2.5 mb-6">
            {plan.features.map((feat, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                {feat}
              </li>
            ))}
          </ul>
          <button onClick={handleSelectPlan} disabled={loading} className="w-full py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-500 hover:bg-emerald-600 text-white">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Gerando...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Pagar com PIX
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </div>
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
