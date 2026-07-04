'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthProvider'
import { formatCurrency, timeAgo } from '@/lib/utils'
import WhatsAppConnect from '@/components/dashboard/WhatsAppConnect'
import TimelineCharts from '@/components/dashboard/TimelineCharts'
import type { DashboardMetrics, ConversationSummary } from '@/types'
import {
  MessageSquare, Users, SendHorizonal, DollarSign, MessageCircle,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
} satisfies import('framer-motion').Variants

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 200, damping: 20 } },
} satisfies import('framer-motion').Variants

function MetricCard({ label, value, icon: Icon, loading, trend }: {
  label: string; value: string; icon: React.ComponentType<{ className?: string }>;
  loading?: boolean; trend?: { up: boolean; text: string }
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="group bg-surface border border-theme p-4 sm:p-5 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
    >
      {loading ? (
        <div className="space-y-3">
          <div className="h-8 w-8 bg-surface-hover rounded-lg animate-pulse" />
          <div className="h-7 w-20 bg-surface-hover rounded animate-pulse" />
          <div className="h-4 w-24 bg-surface-hover rounded animate-pulse" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
              <Icon className="w-4 h-4 text-emerald-400" />
            </div>
            {trend && (
              <span className={`flex items-center gap-1 text-xs font-medium ${trend.up ? 'text-emerald-400' : 'text-red-400'}`}>
                <TrendingUp className={`w-3 h-3 ${!trend.up && 'rotate-180'}`} />
                {trend.text}
              </span>
            )}
          </div>
          <p className="text-xl sm:text-2xl font-bold text-primary">{value}</p>
          <p className="text-xs sm:text-sm text-muted mt-0.5">{label}</p>
        </>
      )}
    </motion.div>
  )
}

function AIStatusWidget({ metrics }: { metrics: DashboardMetrics | null }) {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-surface border border-theme p-4 sm:p-5 rounded-xl"
    >
      <h3 className="text-sm font-semibold text-primary mb-4">Status da IA</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2 p-3 rounded-lg bg-emerald-500/5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-secondary">Sistema</span>
          </div>
          <p className="text-sm font-semibold text-primary">Operacional</p>
        </div>
        <div className="space-y-2 p-3 rounded-lg bg-violet-500/5">
          <span className="text-xs text-secondary">Conversas ativas</span>
          <p className="text-sm font-semibold text-primary">{metrics?.activeConversations ?? '—'}</p>
        </div>
        <div className="space-y-2 p-3 rounded-lg bg-blue-500/5">
          <span className="text-xs text-secondary">Msgs hoje</span>
          <p className="text-sm font-semibold text-primary">{metrics?.messagesToday ?? '—'}</p>
        </div>
        <div className="space-y-2 p-3 rounded-lg bg-amber-500/5">
          <span className="text-xs text-secondary">Clientes</span>
          <p className="text-sm font-semibold text-primary">{metrics?.customers ?? '—'}</p>
        </div>
      </div>
    </motion.div>
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 sm:space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-xl sm:text-2xl font-bold text-primary">Visão Geral</h1>
        <p className="text-xs sm:text-sm text-secondary mt-0.5">Acompanhe o desempenho do seu negócio</p>
      </motion.div>

      {tenantId && (
        <motion.div variants={itemVariants}>
          <WhatsAppConnect tenantId={tenantId} />
        </motion.div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          label="Atendimentos hoje"
          value={metrics ? String(metrics.conversationsToday) : '0'}
          icon={MessageSquare}
          loading={loading}
          trend={metrics && metrics.conversationsToday > 0 ? { up: true, text: '+hoje' } : undefined}
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

      <AIStatusWidget metrics={metrics} />

      {tenantId && (
        <motion.div variants={itemVariants}>
          <TimelineCharts tenantId={tenantId} />
        </motion.div>
      )}

      <motion.div
        variants={itemVariants}
        className="bg-surface border border-theme p-4 sm:p-5 rounded-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm sm:text-base font-semibold text-primary">Últimas conversas</h2>
          {conversations.length > 0 && (
            <Link
              href="/dashboard/atendimentos"
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              Ver todas
            </Link>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-14 sm:h-16 bg-surface-hover rounded-lg animate-pulse" />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-surface-hover mx-auto mb-3" />
            </motion.div>
            <p className="text-secondary text-sm">Nenhuma conversa ainda</p>
            <p className="text-xs text-muted mt-1">Conecte seu WhatsApp para começar a atender</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.slice(0, 5).map((conv, i) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/dashboard/atendimentos/${conv.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-hover/50 hover:bg-surface-hover transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-primary truncate group-hover:text-emerald-400 transition-colors">
                      {conv.customerName || 'Cliente'}
                    </p>
                    <p className="text-xs text-secondary truncate mt-0.5">{conv.lastMessage || 'Sem mensagens'}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      conv.status === 'ACTIVE' || conv.status === 'WAITING'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-surface-hover text-muted'
                    }`}>
                      {conv.status === 'ACTIVE' ? 'Ativo' : conv.status === 'WAITING' ? 'Aguardando' : 'Fechado'}
                    </span>
                    <p className="text-xs text-muted mt-1">{timeAgo(conv.lastMessageAt)}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
