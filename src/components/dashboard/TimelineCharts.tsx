'use client'

import { useState, useEffect } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { formatCurrency, formatDateShort } from '@/lib/utils'
import { MessageCircle, Wallet, BarChart3 } from 'lucide-react'

interface DataPoint {
  date: string
  count: number
  amount: number
}

function CustomTooltip({ active, payload, label, type }: { active?: boolean; payload?: { value: number }[]; label?: string; type: 'area' | 'bar' }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-zinc-500 mb-1">{formatDateShort(label || '')}</p>
      {type === 'area' ? (
        <p className="text-sm font-medium text-emerald-400">{payload[0].value} conversas</p>
      ) : (
        <p className="text-sm font-medium text-violet-400">{formatCurrency(payload[0].value)}</p>
      )}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[1, 2].map(i => (
        <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-5 h-5 bg-zinc-800 rounded animate-pulse" />
            <div className="h-5 w-32 bg-zinc-800 rounded animate-pulse" />
          </div>
          <div className="h-48 bg-zinc-800/50 rounded animate-pulse" />
        </div>
      ))}
    </div>
  )
}

function EmptyState({ icon: Icon, title, desc }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-5 h-5 text-zinc-600" />
        <h3 className="text-sm font-medium text-zinc-400">{title}</h3>
      </div>
      <div className="h-48 flex flex-col items-center justify-center text-center">
        <Icon className="w-10 h-10 text-zinc-700 mb-2" />
        <p className="text-sm text-zinc-500">{desc}</p>
      </div>
    </div>
  )
}

export default function TimelineCharts({ tenantId }: { tenantId: string }) {
  const [data, setData] = useState<DataPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTimeline() {
      try {
        const res = await fetch(`/api/dashboard/timeline?tenantId=${tenantId}`)
        if (!res.ok) return
        const json = await res.json()
        const merged: DataPoint[] = json.conversations.map((c: { date: string; count: number }, i: number) => ({
          date: c.date,
          count: c.count,
          amount: json.revenue[i]?.amount || 0,
        }))
        setData(merged)
      } catch (err) {
        console.error('Timeline fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTimeline()
  }, [tenantId])

  if (loading) return <LoadingSkeleton />

  const hasConversations = data.some(d => d.count > 0)
  const hasRevenue = data.some(d => d.amount > 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {hasConversations ? (
        <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-medium text-zinc-300">Conversas (30 dias)</h3>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="convGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#71717a' }} tickFormatter={(v: string) => v.slice(5)} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#71717a' }} allowDecimals={false} axisLine={false} tickLine={false} width={24} />
                <Tooltip content={<CustomTooltip type="area" />} />
                <Area type="monotone" dataKey="count" stroke="#34d399" strokeWidth={2} fill="url(#convGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <EmptyState icon={MessageCircle} title="Conversas (30 dias)" desc="Nenhuma conversa nos últimos 30 dias" />
      )}

      {hasRevenue ? (
        <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="w-5 h-5 text-violet-400" />
            <h3 className="text-sm font-medium text-zinc-300">Receita (30 dias)</h3>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#71717a' }} tickFormatter={(v: string) => v.slice(5)} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#71717a' }} tickFormatter={(v: number) => `R$${v}`} axisLine={false} tickLine={false} width={40} />
                <Tooltip content={<CustomTooltip type="bar" />} />
                <Bar dataKey="amount" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <EmptyState icon={BarChart3} title="Receita (30 dias)" desc="Nenhuma receita nos últimos 30 dias" />
      )}
    </div>
  )
}
