'use client'

import { useEffect, useState, useRef } from 'react'
import { toast } from 'sonner'
import { Smartphone, QrCode, Wifi, WifiOff, KeyRound } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  tenantId: string
}

type WAStatus = 'DISCONNECTED' | 'CREATING' | 'WAITING_QR' | 'PAIRING' | 'CONNECTED' | 'open' | 'close'

export default function WhatsAppConnect({ tenantId }: Props) {
  const [status, setStatus] = useState<WAStatus>('DISCONNECTED')
  const [qrCode, setQrCode] = useState('')
  const [pairingCode, setPairingCode] = useState('')
  const [pairingNumber, setPairingNumber] = useState('')
  const [mode, setMode] = useState<'qr' | 'pairing'>('qr')
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

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
    intervalRef.current = setInterval(check, 5000)
    return () => clearInterval(intervalRef.current)
  }, [tenantId])

  useEffect(() => {
    if (status === 'CONNECTED' || status === 'open' || status === 'close') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = undefined
      }
    }
  }, [status])

  useEffect(() => {
    if (status === 'WAITING_QR' || status === 'PAIRING') {
      setTimer(180)
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            if (status === 'WAITING_QR') handleRefreshQR()
            else handlePairingRefresh()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [status])

  async function handlePairingRefresh() {
    if (!tenantId || !pairingNumber.replace(/\D/g, '')) return
    setLoading(true)
    try {
      const res = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'connect-pairing', tenantId, number: pairingNumber.replace(/\D/g, '') }),
      })
      const data = await res.json()
      if (res.ok) {
        setPairingCode(data.pairingCode)
        toast.success('Novo codigo gerado')
      }
    } catch {
      toast.error('Erro ao renovar pareamento')
    } finally {
      setLoading(false)
    }
  }

  function formatTime(sec: number) {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

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

  async function handlePairing() {
    if (!pairingNumber.replace(/\D/g, '')) {
      toast.error('Digite um numero de telefone valido')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'connect-pairing', tenantId, number: pairingNumber.replace(/\D/g, '') }),
      })
      const data = await res.json()
      if (res.ok) {
        setPairingCode(data.pairingCode)
        setStatus('PAIRING')
        toast.success('Codigo de pareamento gerado')
      } else {
        toast.error(data.error || 'Erro no pareamento')
      }
    } catch {
      toast.error('Erro ao conectar via pareamento')
    } finally {
      setLoading(false)
    }
  }

  async function handleRefreshQR() {
    if (!tenantId) return
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
        toast.success('Novo QR Code gerado')
      }
    } catch {
      toast.error('Erro ao gerar novo QR')
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
      setPairingCode('')
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
            <p className="text-xs text-muted">Conecte seu WhatsApp para comecar a atender</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            animate={isConnected ? { scale: [1, 1.2, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-zinc-600'}`}
          />
          <span className={`text-xs font-medium ${isConnected ? 'text-emerald-400' : 'text-secondary'}`}>
            {isConnected ? 'Online' : status === 'WAITING_QR' ? 'Aguardando QR' : status === 'PAIRING' ? 'Aguardando pareamento' : 'Desconectado'}
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
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-sm text-muted">Expira em</span>
              <span className="text-lg font-mono font-bold text-zinc-300 bg-zinc-800 px-3 py-1 rounded-lg border border-zinc-700">{formatTime(timer)}</span>
            </div>
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

        {status === 'PAIRING' && pairingCode && (
          <motion.div
            key="pairing"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-sm text-muted">Expira em</span>
              <span className="text-lg font-mono font-bold text-zinc-300 bg-zinc-800 px-3 py-1 rounded-lg border border-zinc-700">{formatTime(timer)}</span>
            </div>
            <div className="p-4 bg-zinc-800/50 rounded-xl text-center">
              <KeyRound className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm text-secondary mb-1">Codigo de pareamento</p>
              <p className="text-2xl font-mono font-bold text-emerald-400 tracking-widest">{pairingCode}</p>
              <p className="text-xs text-muted mt-2">Abra o WhatsApp &gt; Aparelhos conectados &gt; Conectar</p>
            </div>
          </motion.div>
        )}

        {!isConnected && status !== 'WAITING_QR' && status !== 'PAIRING' && (
          <motion.div
            key="disconnected"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-6"
          >
            {mode === 'qr' ? (
              <>
                <WifiOff className="w-8 h-8 text-surface-hover mx-auto mb-2" />
                <p className="text-sm text-secondary mb-4">Abra o WhatsApp no celular e escaneie o QR Code</p>
              </>
            ) : (
              <>
                <KeyRound className="w-8 h-8 text-surface-hover mx-auto mb-2" />
                <p className="text-sm text-secondary mb-4">Digite o numero de telefone para parear</p>
              </>
            )}
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

      {/* Mode toggle + pairing input */}
      {!isConnected && status !== 'WAITING_QR' && status !== 'PAIRING' && (
        <div className="mb-3">
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setMode('qr')}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${mode === 'qr' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-surface-hover text-secondary border border-transparent'}`}
            >
              <QrCode className="w-3.5 h-3.5 inline mr-1" /> QR Code
            </button>
            <button
              onClick={() => setMode('pairing')}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${mode === 'pairing' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-surface-hover text-secondary border border-transparent'}`}
            >
              <KeyRound className="w-3.5 h-3.5 inline mr-1" /> Pareamento
            </button>
          </div>
          {mode === 'pairing' && (
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="55DDNUMERO (so numeros)"
                value={pairingNumber}
                onChange={e => setPairingNumber(e.target.value.replace(/\D/g, ''))}
                className="flex-1 px-3 py-2 bg-surface-hover border border-theme rounded-lg text-sm text-primary placeholder:text-muted focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3 mt-2">
        {!isConnected ? (
          mode === 'qr' ? (
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
              onClick={handlePairing}
              disabled={loading || !pairingNumber.replace(/\D/g, '')}
              className="flex-1 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 disabled:opacity-50 text-sm"
            >
              {loading ? 'Pareando...' : 'Parear'}
            </motion.button>
          )
        ) : (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleDisconnect}
            className="px-5 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 font-medium rounded-xl hover:bg-red-500/20 transition-all text-sm"
          >
            Desconectar
          </motion.button>
        )}
        {status === 'WAITING_QR' && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleRefreshQR}
            disabled={loading}
            className="px-4 py-2.5 bg-zinc-700/50 text-secondary border border-theme font-medium rounded-xl hover:bg-zinc-700 transition-all text-sm"
          >
            Novo QR
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
