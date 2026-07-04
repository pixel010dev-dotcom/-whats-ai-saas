'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthProvider'
import { timeAgo } from '@/lib/utils'
import { ArrowLeft, Send, CheckCheck, Clock, MessageCircle } from 'lucide-react'

interface Message {
  id: string
  role: string
  content: string
  createdAt: string
}

interface ConversationDetail {
  id: string
  customerName: string
  customerPhone: string
  status: string
  lastMessageAt: string
}

export default function ChatDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [conversation, setConversation] = useState<ConversationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [input, setInput] = useState('')
  const [tenantId, setTenantId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      if (!user?.id || !params.id) return
      try {
        const profileRes = await fetch('/api/auth/profile')
        const profile = await profileRes.json()
        const tid = profile.tenant?.id
        if (!tid) return
        setTenantId(tid)

        const [msgRes, convRes] = await Promise.all([
          fetch('/api/messages?conversationId=' + params.id),
          fetch('/api/conversations?tenantId=' + tid),
        ])

        if (msgRes.ok) {
          const data = await msgRes.json()
          setMessages(data.messages || [])
        }
        if (convRes.ok) {
          const data = await convRes.json()
          const conv = data.conversations?.find((c: ConversationDetail) => c.id === params.id)
          if (conv) setConversation(conv)
        }
      } catch (err) {
        console.error('Chat load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user, params.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Polling para novas mensagens
  useEffect(() => {
    if (!params.id) return
    const interval = setInterval(async () => {
      const res = await fetch('/api/messages?conversationId=' + params.id)
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages || [])
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [params.id])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || sending || !tenantId) return
    setSending(true)
    const msgText = input.trim()
    setInput('')

    // Mostra a mensagem imediatamente (otimista)
    const tempMsg: Message = {
      id: 'temp-' + Date.now(),
      role: 'user',
      content: msgText,
      createdAt: new Date().toISOString(),
    }
    setMessages(prev => [...prev, tempMsg])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msgText,
          tenantId,
          customerPhone: conversation?.customerPhone,
          customerName: conversation?.customerName,
        }),
      })
      if (res.ok) {
        // Recarrega para pegar a resposta da IA
        const msgRes = await fetch('/api/messages?conversationId=' + params.id)
        if (msgRes.ok) {
          const msgData = await msgRes.json()
          setMessages(msgData.messages || [])
        }
      }
    } catch (err) {
      console.error('Send error:', err)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Header */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-t-xl px-4 py-3 flex items-center gap-3 shrink-0">
        <button onClick={() => router.push('/dashboard/atendimentos')} className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
          {conversation?.customerName?.charAt(0) || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-zinc-200 truncate">{conversation?.customerName || 'Cliente'}</p>
          <div className="flex items-center gap-2">
            <span className={'w-2 h-2 rounded-full ' + (conversation?.status === 'ACTIVE' ? 'bg-emerald-400' : conversation?.status === 'WAITING' ? 'bg-amber-400' : 'bg-zinc-500')} />
            <span className="text-xs text-zinc-500">{conversation?.status === 'ACTIVE' ? 'Ativo' : conversation?.status === 'WAITING' ? 'Aguardando' : conversation?.status === 'TRANSFERRED' ? 'Transferido' : 'Fechado'}</span>
            {conversation?.customerPhone && <span className="text-xs text-zinc-600">{conversation.customerPhone}</span>}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-900/30 border-x border-zinc-800">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageCircle className="w-12 h-12 text-zinc-700 mb-3" />
            <p className="text-zinc-400">Nenhuma mensagem ainda</p>
            <p className="text-sm text-zinc-600 mt-1">Envie uma mensagem para iniciar a conversa</p>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={'flex ' + (msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div className={'max-w-[80%] px-4 py-2.5 rounded-2xl ' + (msg.role === 'user' ? 'bg-emerald-500 text-white rounded-br-sm' : 'bg-zinc-800 text-zinc-200 rounded-bl-sm')}>
                <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                <div className={'flex items-center gap-1 mt-1 ' + (msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <span className="text-[10px] opacity-60">{timeAgo(msg.createdAt)}</span>
                  {msg.role === 'user' && (
                    <span>
                      {msg.id.startsWith('temp-') ? (
                        <Clock className="w-3 h-3 opacity-60" />
                      ) : (
                        <CheckCheck className="w-3 h-3 opacity-60" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="bg-zinc-900/80 border border-zinc-800 rounded-b-xl p-3 shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={sending}
            className="flex-1 bg-zinc-800 text-zinc-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder-zinc-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}
