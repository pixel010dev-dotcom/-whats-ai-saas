'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthProvider'
import { formatCurrency, formatDate } from '@/lib/utils'
import WhatsAppConnect from '@/components/dashboard/WhatsAppConnect'
import type { DashboardMetrics, ConversationSummary } from '@/types'
import { MessageSquare, Users, SendHorizonal, DollarSign, MessageCircle } from 'lucide-react'

function MetricCard({ label, value, icon: Icon, loading }: { label: string; value: string; icon: React.ComponentType<{ className?: string }>; loading?: boolean }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl">
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-5 h-5 text-emerald-400" />
      </div>
      {loading ? (
        <div className="space-y-2">
          <div className="h-7 w-20 bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
        </div>
      ) : (
        <>
          <p className="text-2xl font-bold text-zinc-100">{value}</p>
          <p className="text-sm text-zinc-500">{label}</p>
        </>
      )}
    </div>
  )
}

export default function DashboardHome() {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [tenantId, setTenantId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return
      try {
        const profileRes = await fetch('/api/auth/profile')
        const profile = await profileRes.json()
        const tid = profile.tenant?.id
        if (!tid) return
        setTenantId(tid)

        const [metricsRes, convRes] = await Promise.all([
          fetch(`/api/dashboard/metrics?tenantId=${tid}`),
          fetch(`/api/conversations?tenantId=${tid}`),
        ])
        if (metricsRes.ok) {
          const m = await metricsRes.json()
          setMetrics(m)
        }
        if (convRes.ok) {
          const c = await convRes.json()
          setConversations(c.conversations || [])
        }
      } catch (err) {
        console.error('Dashboard error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Visão Geral</h1>
        <p className="text-sm text-zinc-500 mt-1">Acompanhe o desempenho do seu negócio</p>
      </div>

      {tenantId && <WhatsAppConnect tenantId={tenantId} />}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Atendimentos hoje"
          value={metrics ? String(metrics.conversationsToday) : '0'}
          icon={MessageSquare}
          loading={loading}
        />
        <MetricCard
          label="Clientes"
          value={metrics ? String(metrics.customers) : '0'}
          icon={Users}
          loading={loading}
        />
        <MetricCard
          label="Mensagens hoje"
          value={metrics ? String(metrics.messagesToday) : '0'}
          icon={SendHorizonal}
          loading={loading}
        />
        <MetricCard
          label="Receita do mês"
          value={metrics ? formatCurrency(metrics.revenue) : 'R$ 0'}
          icon={DollarSign}
          loading={loading}
        />
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">Últimas conversas</h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-zinc-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-400">Nenhuma conversa ainda</p>
            <p className="text-sm text-zinc-600 mt-1">Conecte seu WhatsApp para começar a atender</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map(conv => (
              <div key={conv.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-zinc-200 truncate">{conv.customerName || 'Cliente'}</p>
                  <p className="text-sm text-zinc-500 truncate">{conv.lastMessage}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    conv.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-700 text-zinc-400'
                  }`}>
                    {conv.status === 'ACTIVE' ? 'Ativo' : 'Fechado'}
                  </span>
                  <p className="text-xs text-zinc-600 mt-1">{formatDate(conv.lastMessageAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
