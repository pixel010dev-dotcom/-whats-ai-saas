'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthProvider'
import type { ConversationSummary } from '@/types'
import { formatDate } from '@/lib/utils'
import { MessageSquare, MessageCircle, Filter } from 'lucide-react'
import Link from 'next/link'

export default function AtendimentosPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    async function load() {
      if (!user?.id) return
      try {
        const profileRes = await fetch('/api/auth/profile')
        const profile = await profileRes.json()
        const tid = profile.tenant?.id
        if (!tid) return

        const statusParam = filter ? `&status=${filter}` : ''
        const res = await fetch(`/api/conversations?tenantId=${tid}${statusParam}`)
        if (res.ok) {
          const data = await res.json()
          setConversations(data.conversations || [])
        }
      } catch (err) {
        console.error('Load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user, filter])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Atendimentos</h1>
          <p className="text-sm text-zinc-500 mt-1">Acompanhe as conversas com seus clientes</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-zinc-500" />
        {['', 'ACTIVE', 'CLOSED'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              filter === status
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 border border-transparent'
            }`}
          >
            {status === '' ? 'Todos' : status === 'ACTIVE' ? 'Ativos' : 'Fechados'}
          </button>
        ))}
      </div>

      {/* Conversation List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-20 bg-zinc-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/30 border border-zinc-800 rounded-xl">
          <MessageCircle className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-400">Nenhum atendimento encontrado</p>
          <p className="text-sm text-zinc-600 mt-1">
            {filter ? 'Tente alterar o filtro' : 'Conecte seu WhatsApp para começar a atender'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map(conv => (
            <Link
              key={conv.id}
              href={`/dashboard/atendimentos/${conv.id}`}
              className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:bg-zinc-800/50 hover:border-zinc-700 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {conv.customerName?.charAt(0) || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-zinc-200 truncate group-hover:text-emerald-400 transition-colors">
                    {conv.customerName || 'Cliente'}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    conv.status === 'ACTIVE'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : conv.status === 'WAITING'
                      ? 'bg-amber-500/10 text-amber-400'
                      : conv.status === 'TRANSFERRED'
                      ? 'bg-blue-500/10 text-blue-400'
                      : 'bg-zinc-700 text-zinc-400'
                  }`}>
                    {conv.status === 'ACTIVE' ? 'Ativo' : conv.status === 'WAITING' ? 'Aguardando' : conv.status === 'TRANSFERRED' ? 'Transferido' : 'Fechado'}
                  </span>
                </div>
                <p className="text-sm text-zinc-500 truncate mt-0.5">{conv.lastMessage}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-zinc-600">{formatDate(conv.lastMessageAt)}</p>
                <MessageSquare className="w-4 h-4 text-zinc-600 ml-auto mt-1 group-hover:text-emerald-400 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
