'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthProvider'
import { formatCurrency, formatDate } from '@/lib/utils'
import { CreditCard, ShoppingBag, CheckCircle, XCircle, Clock, ArrowRight, Ban } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Subscription {
  id: string
  plan: string
  status: string
  currentPeriodStart: string | null
  currentPeriodEnd: string | null
  cancelAt: string | null
  mpId: string | null
}

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  method: string | null
  mpPaymentId: string | null
  paidAt: string | null
  createdAt: string
}

export default function AssinaturaPage() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [tenantId, setTenantId] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    async function load() {
      if (!user?.id) return
      try {
        const profileRes = await fetch('/api/auth/profile')
        const profile = await profileRes.json()
        const tid = profile.tenant?.id
        if (!tid) return
        setTenantId(tid)
        const [subRes, payRes] = await Promise.all([
          fetch('/api/subscriptions?tenantId=' + tid),
          fetch('/api/payments?tenantId=' + tid),
        ])
        if (subRes.ok) {
          const data = await subRes.json()
          setSubscription(data.subscription)
        }
        if (payRes.ok) {
          const data = await payRes.json()
          setPayments(data.payments || [])
        }
      } catch (err) {
        console.error('Load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  async function handleCancel() {
    if (!tenantId) return
    if (!confirm('Tem certeza que deseja cancelar sua assinatura?')) return
    setCancelling(true)
    try {
      const res = await fetch('/api/subscriptions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId }),
      })
      if (res.ok) {
        toast.success('Assinatura cancelada')
        setSubscription(prev => prev ? { ...prev, status: 'CANCELLED' } : null)
      } else {
        toast.error('Erro ao cancelar assinatura')
      }
    } catch (err) {
      console.error('Cancel error:', err)
      toast.error('Erro ao cancelar')
    } finally {
      setCancelling(false)
    }
  }

  const planLabels: Record<string, string> = {
    BASICO: 'Basico',
    PROFISSIONAL: 'Profissional',
    PREMIUM: 'Premium',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Assinatura</h1>
        <p className="text-sm text-zinc-500 mt-1">Gerencie sua assinatura e veja seu historico</p>
      </div>

      {subscription ? (
        <>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-zinc-100">Plano {planLabels[subscription.plan] || subscription.plan}</h2>
                  {subscription.currentPeriodStart && (
                    <p className="text-sm text-zinc-500 mt-1">
                      {subscription.status === 'ACTIVE' ? 'Proximo ciclo: ' : 'Periodo: '}
                      {subscription.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : '--'}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {subscription.status === 'ACTIVE' && (
                  <button onClick={handleCancel} disabled={cancelling} className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50">
                    <Ban className="w-4 h-4" />
                    Cancelar
                  </button>
                )}
                <span className={"flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm " + (subscription.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400')}>
                  {subscription.status === 'ACTIVE' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {subscription.status === 'ACTIVE' ? 'Ativa' : subscription.status === 'CANCELLED' ? 'Cancelada' : subscription.status === 'EXPIRED' ? 'Expirada' : subscription.status}
                </span>
              </div>
            </div>
          </div>

          {subscription.status !== 'CANCELLED' && subscription.status !== 'EXPIRED' && (
            <Link href="/dashboard/planos" className="flex items-center justify-between bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 hover:from-emerald-500/20 transition-all group">
              <div className="flex items-center gap-3">
                <ArrowRight className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-sm font-medium text-zinc-200">Alterar plano</p>
                  <p className="text-xs text-zinc-500">Upgrade ou downgrade a qualquer momento</p>
                </div>
              </div>
              <span className="text-sm text-emerald-400 group-hover:translate-x-1 transition-transform">Ver planos →</span>
            </Link>
          )}
        </>
      ) : (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 text-center">
          <CreditCard className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-400">Voce ainda nao possui uma assinatura</p>
          <p className="text-sm text-zinc-600 mt-1">Escolha um plano para comecar</p>
          <Link href="/dashboard/planos" className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-all">
            Ver Planos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">Historico de Pagamentos</h2>
        {payments.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
            <p className="text-sm text-zinc-500">Nenhum pagamento encontrado</p>
          </div>
        ) : (
          <div className="space-y-2">
            {payments.map(payment => (
              <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
                <div className="flex items-center gap-3">
                  <div className={"w-8 h-8 rounded-lg flex items-center justify-center " + (payment.status === 'APPROVED' ? 'bg-emerald-500/10' : 'bg-zinc-700')}>
                    {payment.status === 'APPROVED' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : payment.status === 'PENDING' ? <Clock className="w-4 h-4 text-amber-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{payment.method === 'PIX' ? 'Pagamento via PIX' : 'Pagamento'}</p>
                    <p className="text-xs text-zinc-500">{formatDate(payment.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-zinc-200">{formatCurrency(payment.amount)}</p>
                  <span className={"text-xs px-2 py-0.5 rounded-full " + (payment.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' : payment.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400')}>
                    {payment.status === 'APPROVED' ? 'Aprovado' : payment.status === 'PENDING' ? 'Pendente' : payment.status === 'REFUNDED' ? 'Reembolsado' : 'Cancelado'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
