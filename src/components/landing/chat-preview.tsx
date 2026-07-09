'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'

interface Message {
  role: 'user' | 'ai'
  text: string
  delay: number
}

const allMessages: Message[] = [
  { role: 'user', text: 'Bom dia! Quanto fica um bolo de chocolate médio?', delay: 500 },
  { role: 'ai', text: 'Bom dia! 😊 O bolo de chocolate médio (1,5kg) é R$ 89,90. Recheio de brigadeiro ou doce de leite?', delay: 2500 },
  { role: 'user', text: 'Brigadeiro! Fica pronto pra sábado?', delay: 4500 },
  { role: 'ai', text: 'Fica pronto sábado às 10h ✅ Já vou separar aqui!\n\nQuer aproveitar e ver nossos combos? 🎂\n1️⃣ Bolo + 30 docinhos: R$ 149,90\n2️⃣ Bolo + 50 salgados: R$ 179,90\n3️⃣ Kit festa completo: R$ 249,90', delay: 6500 },
  { role: 'user', text: 'Fechou o kit festa! Qual o prazo?', delay: 8500 },
  { role: 'ai', text: 'Pedido confirmado! ✅\n\n📋 Kit Festa Completo:\n🎂 1x Bolo chocolate (1,5kg) c/ brigadeiro\n🍬 30 docinhos sortidos\n🥟 50 salgadinhos\n📅 Retirada: Sábado às 10h\n💰 Total: R$ 249,90\n\nAceita PIX? Envio o QR Code agora! 💳', delay: 10500 },
  { role: 'user', text: 'PIX é mais fácil! Manda o QR', delay: 12500 },
  { role: 'ai', text: 'QR Code enviado! 📱\n\nAguardando confirmação... Pagamento confirmado! ✅\n\nSeu pedido já está sendo preparado. Sábado às 10h é só retirar!\nAgradecemos a preferência! 🎉', delay: 14500 },
]

export default function ChatPreview() {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([])
  const [showCursor, setShowCursor] = useState(true)
  const [isComplete, setIsComplete] = useState(false)
  const [restartTimer, setRestartTimer] = useState(false)

  useEffect(() => {
    setVisibleMessages([])
    setIsComplete(false)

    const timers: NodeJS.Timeout[] = []

    allMessages.forEach((msg) => {
      const timer = setTimeout(() => {
        setVisibleMessages((prev) => {
          if (prev.length === allMessages.length - 1) {
            setTimeout(() => setIsComplete(true), 2000)
          }
          return [...prev, msg]
        })
      }, msg.delay)
      timers.push(timer)
    })

    // Restart cycle when complete
    const totalDuration = allMessages[allMessages.length - 1].delay + 5000
    const restart = setTimeout(() => {
      setRestartTimer((prev) => !prev)
      // Force restart via state change
    }, totalDuration)

    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(restart)
      clearInterval(cursorTimer)
    }
  }, [restartTimer])

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
      <div className="space-y-2 min-h-[320px]">
        {visibleMessages.map((msg, i) => (
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
        {!isComplete && visibleMessages.length > 0 && visibleMessages.length < allMessages.length && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1.5 items-center h-4">
                <div className={`w-2 h-2 bg-gray-400 rounded-full ${showCursor ? 'opacity-100' : 'opacity-30'} transition-opacity duration-300`} />
                <div className={`w-2 h-2 bg-gray-400 rounded-full ${showCursor ? 'opacity-60' : 'opacity-30'} transition-opacity duration-300`} />
                <div className={`w-2 h-2 bg-gray-400 rounded-full ${showCursor ? 'opacity-30' : 'opacity-100'} transition-opacity duration-300`} />
              </div>
            </div>
          </div>
        )}

        {/* Replay indicator */}
        {isComplete && (
          <div className="flex justify-center pt-2">
            <span className="text-[10px] text-gray-400 animate-pulse">🔄 Nova conversa em instantes...</span>
          </div>
        )}

        {/* Initial state cursor */}
        {visibleMessages.length === 0 && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1.5 items-center h-4">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
