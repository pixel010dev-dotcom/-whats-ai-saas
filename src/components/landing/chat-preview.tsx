'use client'

import { useState, useEffect } from 'react'

export default function ChatPreview() {
  const [messages, setMessages] = useState<{ role: string; text: string; delay: number }[]>([])
  const [showCursor, setShowCursor] = useState(true)

  const allMessages = [
    { role: 'user', text: 'Bom dia! Quanto fica um bolo de chocolate m\u00e9dio?', delay: 500 },
    { role: 'ai', text: 'Bom dia! \ud83d\ude0a O bolo de chocolate m\u00e9dio \u00e9 R$ 89,90. Posso deixar separado pra voc\u00ea!', delay: 2500 },
    { role: 'user', text: 'Fica pronto pra s\u00e1bado? Tem cobertura?', delay: 4500 },
    { role: 'ai', text: 'Claro! Fica pronto s\u00e1bado pela manh\u00e3 \u2705 Posso adicionar cobertura de brigadeiro sem custo extra. Confirma o pedido? \ud83c\udf82', delay: 6500 },
    { role: 'user', text: 'Fechou! Vou buscar s\u00e1bado as 10h', delay: 8500 },
    { role: 'ai', text: 'Pedido confirmado! \u2705\n\n\ud83c\udf82 1x Bolo de chocolate m\u00e9dio c/ brigadeiro\n\ud83d\udcc5 Retirada: S\u00e1bado \u00e0s 10h\n\ud83d\udcb0 Total: R$ 89,90\n\nAceita PIX? Envio o QR code! \ud83d\udcb3', delay: 10500 }
  ]

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    allMessages.forEach((msg, i) => {
      const timer = setTimeout(() => {
        setMessages(prev => [...prev, msg])
      }, msg.delay)
      timers.push(timer)
    })

    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    return () => {
      timers.forEach(clearTimeout)
      clearInterval(cursorTimer)
    }
  }, [])

  return (
    <div className="bg-[#E5DDD5] rounded-2xl p-4 shadow-2xl max-w-sm mx-auto border border-gray-200">
      {/* Header */}
      <div className="bg-[#075E54] rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center text-white font-bold text-sm">
          W
        </div>
        <div>
          <p className="text-white font-semibold text-sm">WhatsAI Padaria</p>
          <p className="text-[#DCF8C6] text-xs">online</p>
        </div>
        <div className="ml-auto flex gap-2">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-2 min-h-[280px]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-message-pop`}>
            <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
              <p className="text-sm text-gray-800 whitespace-pre-line">{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-gray-500 text-right' : 'text-gray-400'}`}>
                {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {messages.length < allMessages.length && messages.length > 0 && (
          <div className="flex justify-start">
            <div className="chat-bubble-ai bg-white">
              <div className="flex gap-1.5 items-center h-6">
                <div className={`w-2 h-2 bg-gray-400 rounded-full ${showCursor ? 'opacity-100' : 'opacity-30'} transition-opacity`} />
                <div className={`w-2 h-2 bg-gray-400 rounded-full ${showCursor ? 'opacity-60' : 'opacity-30'} transition-opacity`} />
                <div className={`w-2 h-2 bg-gray-400 rounded-full ${showCursor ? 'opacity-30' : 'opacity-100'} transition-opacity`} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
