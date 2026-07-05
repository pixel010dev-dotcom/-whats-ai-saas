// v3 - PIX + onboarding + status check
'use client'

import { useState, useEffect } from 'react'
import { Check, Copy, CheckCheck, QrCode, ArrowRight, Zap, X, Shield, Clock, Smartphone, Bot, BookOpen, Smartphone as SmartphoneIcon, ArrowUpRight } from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

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

const onboardingSteps = [
  { icon: SmartphoneIcon, label: 'Conectar WhatsApp', desc: 'Escaneie o QR Code para conectar seu WhatsApp', href: '/dashboard/whatsapp' },
  { icon: BookOpen, label: 'Adicionar Conhecimento', desc: 'Ensine a IA sobre seus produtos e servicos', href: '/dashboard/conhecimento' },
  { icon: Bot, label: 'Configurar IA', desc: 'Ajuste a personalidade da sua atendente virtual', href: '/dashboard/configuracoes' },
  { icon: SmartphoneIcon, label: 'Widget do Site', desc: 'Coloque o chat no seu site para começar a vender', href: '#' },
]

export default function PlanosPage() {
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [isActive, setIsActive] = useState(false)
  const [paymentData, setPaymentData] = useState<{
    qrCode: string
    qrCodeBase64: string
    copyPaste: string
    ticketUrl: string
    amount: number
  } | null>(null)
  const [copied, setCopied] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600)
  const [paid, setPaid] = useState(false)

  // Check subscription status on load
  useEffect(() => {
    async function check() {
      try {
        const profile = await (await fetch('/api/auth/profile')).json()
        const tid = profile.tenant?.id
        if (!tid) return
        const res = await fetch(`/api/subscriptions?tenantId=${tid}`)
        const data = await res.json()
        if (data.subscription?.status === 'ACTIVE') {
          setIsActive(true)
        }
      } catch {} finally {
        setChecking(false)
      }
    }
    check()
  }, [])

  // Auto-detect payment completion
  useEffect(() => {
    if (!showModal || paid) return
    const interval = setInterval(async () => {
      try {
        const profile = await (await fetch('/api/auth/profile')).json()
        const tid = profile.tenant?.id
        if (!tid) return
        const res = await fetch(`/api/subscriptions?tenantId=${tid}`)
        const data = await res.json()
        if (data.subscription?.status === 'ACTIVE') {
          setPaid(true)
          setShowModal(false)
          setIsActive(true)
          toast.success('✅ Pagamento confirmado! Seu WhatsAI esta ativo!')
        }
      } catch {}
    }, 3000)
    return () => clearInterval(interval)
  }, [showModal, paid])

  useEffect(() => {
    if (!showModal || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [showModal, timeLeft])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key == "Escape") setShowModal(false) }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return min + ":" + sec.toString().padStart(2, "0")
  }

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
        setShowModal(true)
        setTimeLeft(600)
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

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // #2 + #6: Screen for active subscribers (onboarding)
  if (isActive) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Success banner */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-emerald-500/20 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-100">WhatsAI ativo! 🎉</h1>
          <p className="text-zinc-400 mt-2">Sua assinatura está ativa. Aqui o passo a passo pra começar:</p>
        </div>

        {/* Onboarding steps */}
        <div className="grid sm:grid-cols-2 gap-4">
          {onboardingSteps.map((step, i) => (
            <Link
              key={i}
              href={step.href}
              className="group bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/5"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                  <step.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-100">{i + 1}. {step.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">{step.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Support info */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 text-center">
          <p className="text-sm text-zinc-400">
            Precisando de ajuda? Me chama no WhatsApp:{' '}
            <a href="https://wa.me/554598566730" className="text-emerald-400 hover:text-emerald-300 font-medium">
               (45) 9856-6730
            </a>
          </p>
        </div>
      </div>
    )
  }

  // Payment screen for non-active users
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
      {showModal && paymentData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl shadow-green-500/10 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-500" />
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors z-10">
              <X className="w-4 h-4 text-zinc-400" />
            </button>
            <div className="pt-8 pb-2 px-8 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-100">Pagamento via PIX</h3>
              <p className="text-sm text-zinc-500 mt-1">Escaneie o QR Code abaixo com seu banco</p>
            </div>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className={"flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium " + (timeLeft < 120 ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400")}>
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(timeLeft)}</span>
              </div>
              <span className="text-xs text-zinc-600">tempo para pagar</span>
            </div>
            <div className="px-8 py-6 flex justify-center">
              {paymentData.qrCodeBase64 ? (
                <div className="bg-white p-4 rounded-2xl shadow-lg shadow-black/20">
                  <img src={"data:image/png;base64," + paymentData.qrCodeBase64} alt="QR Code PIX" className="w-56 h-56 mx-auto" />
                </div>
              ) : (
                <div className="bg-zinc-800 rounded-2xl p-10">
                  <QrCode className="w-36 h-36 text-zinc-600 mx-auto" />
                  <p className="text-xs text-zinc-600 mt-2">QR Code nao disponivel</p>
                </div>
              )}
            </div>
            <div className="text-center mb-4">
              <p className="text-sm text-zinc-500">Valor a pagar</p>
              <p className="text-2xl font-bold text-zinc-100">{formatCurrency(paymentData.amount)}</p>
            </div>
            <div className="px-8 pb-4">
              <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-3">
                <p className="text-xs text-zinc-500 mb-2">Codigo PIX Copia e Cola</p>
                <p className="text-xs text-zinc-400 break-all line-clamp-2 mb-2 font-mono">{paymentData.copyPaste || paymentData.qrCode}</p>
                <button onClick={() => handleCopyPix(paymentData.copyPaste || paymentData.qrCode)} className="w-full py-2 rounded-lg text-sm font-medium transition-all bg-zinc-700 hover:bg-zinc-600 text-zinc-200 flex items-center justify-center gap-2">
                  {copied ? (
                    <><CheckCheck className="w-4 h-4 text-emerald-400" />Copiado!</>
                  ) : (
                    <><Copy className="w-4 h-4" />Copiar codigo PIX</>
                  )}
                </button>
              </div>
            </div>
            <div className="px-8 pb-8">
              <div className="flex items-center justify-center gap-4 text-xs text-zinc-600">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Pagamento seguro
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  PIX na hora
                </div>
                <div className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  Qualquer banco
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
