'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Smartphone, QrCode, Wifi, WifiOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-theme rounded-xl p-4 sm:p-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={isConnected ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`p-2 rounded-lg ${isConnected ? 'bg-emerald-500/10' : 'bg-surface-hover'}`}
          >
            <Smartphone className={`w-5 h-5 ${isConnected ? 'text-emerald-400' : 'text-secondary'}`} />
          </motion.div>
          <div>
            <h3 className="text-sm font-semibold text-primary">WhatsApp</h3>
            <p className="text-xs text-muted">Conecte seu WhatsApp para começar a atender</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            animate={isConnected ? { scale: [1, 1.2, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-zinc-600'}`}
          />
          <span className={`text-xs font-medium ${isConnected ? 'text-emerald-400' : 'text-secondary'}`}>
            {isConnected ? 'Online' : status === 'WAITING_QR' ? 'Aguardando QR' : 'Desconectado'}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {status === 'WAITING_QR' && qrCode && (
          <motion.div
            key="qr"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="p-4 bg-white rounded-xl flex items-center justify-center">
              {qrCode.startsWith('data:') ? (
                <motion.img
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  src={qrCode}
                  alt="QR Code"
                  className="w-40 h-40 sm:w-48 sm:h-48"
                />
              ) : (
                <div className="text-center">
                  <QrCode className="w-10 h-10 text-zinc-400 mx-auto mb-2" />
                  <p className="text-sm text-secondary mb-1">QR Code gerado</p>
                  <pre className="text-xs text-muted max-w-xs overflow-hidden">{qrCode.slice(0, 100)}...</pre>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {!isConnected && status !== 'WAITING_QR' && (
          <motion.div
            key="disconnected"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-6"
          >
            <WifiOff className="w-8 h-8 text-surface-hover mx-auto mb-2" />
            <p className="text-sm text-secondary mb-4">Abra o WhatsApp no seu celular e escaneie o QR Code</p>
          </motion.div>
        )}

        {isConnected && (
          <motion.div
            key="connected"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-3"
          >
            <Wifi className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm text-emerald-400 font-medium">WhatsApp conectado e operacional</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3 mt-2">
        {!isConnected ? (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleConnect}
            disabled={loading}
            className="flex-1 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 disabled:opacity-50 text-sm"
          >
            {loading ? 'Conectando...' : 'Conectar WhatsApp'}
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleDisconnect}
            className="px-5 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 font-medium rounded-xl hover:bg-red-500/20 transition-all text-sm"
          >
            Desconectar
          </motion.button>
        )}
        {isConnected && (
          <div className="flex-1 px-4 py-2.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-center">
            <span className="text-emerald-400 font-medium text-sm">Conectado</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
