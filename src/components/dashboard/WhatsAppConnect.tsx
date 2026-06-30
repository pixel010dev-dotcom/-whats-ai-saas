'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Smartphone } from 'lucide-react'

interface Props {
  tenantId: string
}

type WAStatus = 'DISCONNECTED' | 'CREATING' | 'WAITING_QR' | 'CONNECTED' | 'open' | 'close'

export default function WhatsAppConnect({ tenantId }: Props) {
  const [status, setStatus] = useState<WAStatus>('DISCONNECTED')
  const [qrCode, setQrCode] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch('/api/whatsapp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'status', tenantId }),
        })
        if (res.ok) {
          const data = await res.json()
          setStatus(data.status)
        }
      } catch {}
    }
    check()
    const interval = setInterval(check, 5000)
    return () => clearInterval(interval)
  }, [tenantId])

  async function handleConnect() {
    setLoading(true)
    try {
      const res = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'connect', tenantId }),
      })
      const data = await res.json()
      if (res.ok) {
        setQrCode(data.qrcode)
        setStatus('WAITING_QR')
        toast.success('Escaneie o QR Code com seu WhatsApp')
      } else {
        toast.error(data.error || 'Erro ao conectar')
      }
    } catch {
      toast.error('Erro ao conectar WhatsApp')
    } finally {
      setLoading(false)
    }
  }

  async function handleDisconnect() {
    try {
      await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'disconnect', tenantId }),
      })
      setStatus('DISCONNECTED')
      setQrCode('')
      toast.success('WhatsApp desconectado')
    } catch {
      toast.error('Erro ao desconectar')
    }
  }

  const isConnected = status === 'CONNECTED' || status === 'open'

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-zinc-100">WhatsApp</h3>
          <p className="text-sm text-zinc-500">Conecte seu WhatsApp para começar a atender</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
          <span className={`text-sm font-medium ${isConnected ? 'text-emerald-400' : 'text-zinc-500'}`}>
            {isConnected ? 'Online' : status === 'WAITING_QR' ? 'Aguardando QR' : 'Desconectado'}
          </span>
        </div>
      </div>

      {status === 'WAITING_QR' && qrCode && (
        <div className="mb-4 p-4 bg-white rounded-xl flex items-center justify-center">
          {qrCode.startsWith('data:') ? (
            <img src={qrCode} alt="QR Code" className="w-48 h-48" />
          ) : (
            <div className="text-center">
              <p className="text-sm text-zinc-400 mb-2">QR Code gerado</p>
              <pre className="text-xs text-zinc-500 max-w-xs overflow-hidden">{qrCode.slice(0, 100)}...</pre>
            </div>
          )}
        </div>
      )}

      {!isConnected && status !== 'WAITING_QR' && (
        <div className="text-center py-6">
          <Smartphone className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-400 mb-4">Abra o WhatsApp no seu celular e escaneie o QR Code</p>
        </div>
      )}

      <div className="flex gap-3">
        {!isConnected ? (
          <button
            onClick={handleConnect}
            disabled={loading}
            className="flex-1 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-emerald-500/25"
          >
            {loading ? 'Conectando...' : 'Conectar WhatsApp'}
          </button>
        ) : (
          <button
            onClick={handleDisconnect}
            className="px-5 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 font-medium rounded-xl hover:bg-red-500/20 transition-all"
          >
            Desconectar
          </button>
        )}
        {isConnected && (
          <div className="flex-1 px-4 py-2.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-center">
            <span className="text-emerald-400 font-medium">Conectado</span>
          </div>
        )}
      </div>
    </div>
  )
}
