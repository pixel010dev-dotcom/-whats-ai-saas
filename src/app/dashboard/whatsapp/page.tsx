'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthProvider'
import { Smartphone, QrCode, Link2, Link2Off, RefreshCw, Loader2, CheckCircle2, XCircle, AlertCircle, KeyRound } from 'lucide-react'
import { toast } from 'sonner'

type WhatsAppStatus = 'DISCONNECTED' | 'CREATING' | 'WAITING_QR' | 'PAIRING' | 'CONNECTED' | 'ERROR'

interface WhatsAppData {
  id: string
  phone?: string
  instanceName?: string
  qrCode?: string
  pairingCode?: string
  status: WhatsAppStatus
}

const STATUS_CONFIG = {
  CONNECTED: { label: 'Conectado', icon: 'CheckCircle2', color: 'text-emerald-400' },
  WAITING_QR: { label: 'Aguardando QR Code', icon: 'QrCode', color: 'text-yellow-400' },
  PAIRING: { label: 'Código de pareamento', icon: 'KeyRound', color: 'text-yellow-400' },
  CREATING: { label: 'Criando instancia...', icon: 'Loader2', color: 'text-blue-400' },
  DISCONNECTED: { label: 'Desconectado', icon: 'XCircle', color: 'text-zinc-400' },
  ERROR: { label: 'Erro', icon: 'AlertCircle', color: 'text-red-400' },
}

export default function WhatsAppPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [tenantId, setTenantId] = useState<string | null>(null)
  const [whatsApp, setWhatsApp] = useState<WhatsAppData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [connectMode, setConnectMode] = useState<'qr' | 'pairing'>('qr')

  useEffect(() => {
    if (!user?.id) return
    fetch('/api/auth/profile')
      .then(r => r.json())
      .then(d => setTenantId(d.tenant?.id))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  useEffect(() => {
    if (!tenantId) return
    const check = async () => {
      try {
        const r = await fetch('/api/whatsapp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tenantId, action: 'status' }),
        })
        if (!r.ok) return
        const d = await r.json()
        if (d.qrCode) {
          setWhatsApp(p => p ? { ...p, qrCode: d.qrCode, status: 'WAITING_QR', instanceName: d.instanceName } : { id: '', qrCode: d.qrCode, status: 'WAITING_QR', instanceName: d.instanceName })
        }
        if (d.status === 'CONNECTED') {
          setWhatsApp(p => p ? { ...p, status: 'CONNECTED' } : { id: '', status: 'CONNECTED' })
        }
      } catch {}
    }
    check()
    const interval = setInterval(check, 5000)
    return () => clearInterval(interval)
  }, [tenantId])

  async function handleConnect() {
    if (!tenantId) return
    setConnecting(true)
    setError(null)
    try {
      const r = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, action: 'connect' }),
      })
      if (!r.ok) { const e = await r.json(); throw new Error(e.error || 'Falha ao conectar') }
      const d = await r.json()
      setWhatsApp({ id: d.id || '', instanceName: d.instanceName, qrCode: d.qrcode, status: 'WAITING_QR' })
      toast.success('Instancia WhatsApp criada! Escaneie o QR Code.')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao conectar'
      setError(msg)
      toast.error(msg)
    } finally {
      setConnecting(false)
    }
  }

  async function handleConnectPairing() {
    if (!tenantId || !phoneNumber) return
    setConnecting(true)
    setError(null)
    try {
      const r = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, action: 'connect-pairing', number: phoneNumber.replace(/\D/g, '') }),
      })
      if (!r.ok) { const e = await r.json(); throw new Error(e.error || 'Falha ao gerar código') }
      const d = await r.json()
      setWhatsApp({ id: d.id || '', instanceName: d.instanceName, pairingCode: d.pairingCode, status: 'PAIRING' })
      toast.success('Código de pareamento gerado!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao conectar'
      setError(msg)
      toast.error(msg)
    } finally {
      setConnecting(false)
    }
  }

  async function handleDisconnect() {
    if (!tenantId) return
    setConnecting(true)
    try {
      const r = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, action: 'disconnect' }),
      })
      if (!r.ok) throw new Error('Falha ao desconectar')
      setWhatsApp(null)
      toast.success('WhatsApp desconectado.')
    } catch (err: unknown) {
      toast.error(err?.message || 'Erro ao desconectar')
    } finally {
      setConnecting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const currentStatus = whatsApp?.status || 'DISCONNECTED'
  const statusLabel = STATUS_CONFIG[currentStatus]?.label || 'Desconectado'

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">WhatsApp</h1>
        <p className="text-zinc-400 mt-1">Conecte seu WhatsApp para comecar a atender clientes automaticamente.</p>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-8 h-8 text-emerald-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-100">{currentStatus === 'CONNECTED' ? 'WhatsApp Conectado' : 'WhatsApp Desconectado'}</h2>
                <p className="text-sm text-zinc-400 mt-0.5">
                  {currentStatus === 'CONNECTED'
                    ? 'Seu WhatsApp esta conectado e pronto para atender.'
                    : currentStatus === 'WAITING_QR'
                      ? 'Escaneie o QR Code abaixo com o WhatsApp do seu celular.'
                      : currentStatus === 'CREATING'
                        ? 'Criando instancia...'
                        : 'Conecte seu WhatsApp para comecar a usar o WhatsAI.'}
                </p>
              </div>
              <div className={'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ' + (currentStatus === 'CONNECTED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-400')}>
                <span>{statusLabel}</span>
              </div>
            </div>
          </div>
        </div>

        {whatsApp?.qrCode && currentStatus === 'WAITING_QR' && (
          <div className="mt-8 flex flex-col items-center gap-4 p-6 bg-zinc-950 rounded-xl border border-zinc-800">
            <p className="text-sm text-zinc-400">Escaneie o QR Code com seu WhatsApp</p>
            <div className="bg-white p-4 rounded-xl">
              <img src={whatsApp.qrCode} alt="QR Code WhatsApp" className="w-64 h-64" />
            </div>
            <p className="text-xs text-zinc-500">Abra o WhatsApp no seu celular &gt; Menu &gt; WhatsApp Web &gt; Escanear codigo</p>
          </div>
        )}

        {whatsApp?.pairingCode && currentStatus === 'PAIRING' && (
          <div className="mt-8 flex flex-col items-center gap-4 p-6 bg-zinc-950 rounded-xl border border-zinc-800">
            <p className="text-sm text-zinc-400">Digite o código abaixo no seu WhatsApp</p>
            <div className="bg-zinc-900 px-8 py-4 rounded-xl border border-zinc-700">
              <span className="text-3xl font-bold text-emerald-400 tracking-widest">{whatsApp.pairingCode}</span>
            </div>
            <div className="text-xs text-zinc-500 space-y-1 text-center">
              <p>WhatsApp &gt; Aparelhos conectados &gt; Conectar dispositivo</p>
              <p>Escolha &quot;Conectar com número de telefone&quot; e digite o código acima</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          {currentStatus === 'DISCONNECTED' && (
            <div className="flex gap-2">
              <button
                onClick={() => setConnectMode('qr')}
                className={'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ' + (connectMode === 'qr' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700')}
              >
                <QrCode className="w-4 h-4" />
                QR Code
              </button>
              <button
                onClick={() => setConnectMode('pairing')}
                className={'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ' + (connectMode === 'pairing' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700')}
              >
                <KeyRound className="w-4 h-4" />
                Código de pareamento
              </button>
            </div>
          )}

          {currentStatus === 'DISCONNECTED' && connectMode === 'pairing' && (
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Número do WhatsApp (com DDD, ex: 5511999999999)"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                className="flex-1 px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleConnectPairing}
                disabled={connecting || !phoneNumber}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
              >
                {connecting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <KeyRound className="w-4 h-4" />}
                {connecting ? 'Gerando...' : 'Gerar código'}
              </button>
            </div>
          )}

          <div className="flex gap-3">
            {currentStatus !== 'CONNECTED' && currentStatus !== 'PAIRING' ? (
              connectMode === 'qr' && (
                <button
                  onClick={handleConnect}
                  disabled={connecting || currentStatus === 'CREATING'}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
                >
                  {connecting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <QrCode className="w-4 h-4" />}
                  {connecting ? 'Conectando...' : 'Gerar QR Code'}
                </button>
              )
            ) : (
              <button
                onClick={handleDisconnect}
                disabled={connecting}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors text-sm"
              >
                <Link2Off className="w-4 h-4" />
                Desconectar
              </button>
            )}
            {whatsApp?.instanceName && currentStatus === 'WAITING_QR' && (
              <button
                onClick={handleConnect}
                disabled={connecting}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors text-sm"
              >
                <RefreshCw className={'w-4 h-4 ' + (connecting ? 'animate-spin' : '')} />
                Novo QR Code
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
