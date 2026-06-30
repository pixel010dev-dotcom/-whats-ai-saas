'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthProvider'
import { formatDate, truncate } from '@/lib/utils'
import type { ConversationSummary } from '@/types'
import { MessageCircle } from 'lucide-react'

type FilterType = 'all' | 'ACTIVE' | 'CLOSED'

export default function AtendimentosPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')

  useEffect(() => {
    async function fetchConversations() {
      if (!user?.id) return
      try {
        const profileRes = await fetch('/api/auth/profile')
        const profile = await profileRes.json()
        const tid = profile.tenant?.id
        if (!tid) return

        const statusParam = filter !== 'all' ? `&status=${filter}` : ''
        const res = await fetch(`/api/conversations?tenantId=${tid}${statusParam}`)
        if (res.ok) {
          const data = await res.json()
          setConversations(data.conversations || [])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchConversations()
  }, [user, filter])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Atendimentos</h1>
        <p className="text-sm text-zinc-500 mt-1">Histórico de conversas com clientes</p>
      </div>

      <div className="flex gap-2">
        {(['all', 'ACTIVE', 'CLOSED'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
            }`}
          >
            {f === 'all' ? 'Todos' : f === 'ACTIVE' ? 'Ativos' : 'Fechados'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-20 bg-zinc-900 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <MessageCircle className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-400 font-medium">Nenhum atendimento encontrado</p>
          <p className="text-sm text-zinc-600 mt-1">As conversas aparecerão aqui quando clientes entrarem em contato</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map(conv => (
            <div key={conv.id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-900 transition-colors">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-zinc-200">{conv.customerName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    conv.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-700 text-zinc-400'
                  }`}>
                    {conv.status === 'ACTIVE' ? 'Ativo' : 'Fechado'}
                  </span>
                </div>
                <p className="text-sm text-zinc-500 truncate">{truncate(conv.lastMessage, 80)}</p>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="text-xs text-zinc-600">{formatDate(conv.lastMessageAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
