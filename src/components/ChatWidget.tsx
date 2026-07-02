'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  slug: string
  title?: string
}

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatWidget({ slug, title = 'Precisa de ajuda?' }: Props) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [customerId, setCustomerId] = useState('')
  const [conversationId, setConversationId] = useState('')
  const [showForm, setShowForm] = useState(true)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [welcomeMsg, setWelcomeMsg] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  async function sendMessage(text: string) {
    setLoading(true)
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setInput('')

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          slug,
          customerName: name,
          customerPhone: phone || undefined
        })
      })
      const data = await res.json()
      if (data.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
        setConversationId(data.conversationId || '')
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Desculpe, ocorreu um erro. Tente novamente.' }])
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return
    sendMessage(input.trim())
  }

  function handleStart(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setShowForm(false)
    setMessages([{ role: 'assistant', content: 'Ola ' + name + '! Como posso ajudar voce hoje?' }])
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-xl hover:shadow-green-500/30 hover:scale-110 transition-all duration-300 flex items-center justify-center"
      >
        {open ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4">
              <h3 className="text-white font-semibold">{title}</h3>
              <p className="text-green-100 text-xs mt-1">Respondemos em alguns minutos</p>
            </div>

            <div className="h-[400px] overflow-y-auto p-4 space-y-3">
              {showForm ? (
                <form onSubmit={handleStart} className="space-y-3 pt-4">
                  <p className="text-sm text-zinc-400 text-center mb-4">Deixe seu contato para começarmos</p>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    required
                  />
                  <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Seu WhatsApp (opcional)"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all text-sm"
                  >
                    Iniciar conversa
                  </button>
                </form>
              ) : (
                <>
                  {messages.map((msg, i) => (
                    <div key={i} className={'flex ' + (msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                      <div className={'max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ' + (
                        msg.role === 'user'
                          ? 'bg-green-600 text-white rounded-br-sm'
                          : 'bg-zinc-800 text-zinc-200 rounded-bl-sm'
                      )}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-zinc-800 px-4 py-2.5 rounded-2xl rounded-bl-sm">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {!showForm && (
              <form onSubmit={handleSubmit} className="border-t border-zinc-800 p-3 flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
