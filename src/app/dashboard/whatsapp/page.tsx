'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthProvider'
import { Smartphone, QrCode, Link2, Link2Off, RefreshCw, Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

type WhatsAppStatus = 'DISCONNECTED' | 'CREATING' | 'WAITING_QR' | 'CONNECTED' | 'ERROR'

interface WhatsAppData {
  id: string
  phone?: string
  instanceName?: string
  qrCode?: string
  status: WhatsAppStatus
}

const STATUS_CONFIG = {
  CONNECTED: { label: 'Conectado', icon: 'CheckCircle2', color: 'text-emerald-400' },
  WAITING_QR: { label: 'Aguardando QR Code', icon: 'QrCode', color: 'text-yellow-400' },
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
    } catch (err: any) {
      const msg = err?.message || err || 'Erro ao conectar'
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
    } catch (err: any) {
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

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          {currentStatus !== 'CONNECTED' ? (
            <button
              onClick={handleConnect}
              disabled={connecting || currentStatus === 'CREATING'}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
            >
              {connecting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Link2 className="w-4 h-4" />}
              {connecting ? 'Conectando...' : 'Conectar WhatsApp'}
            </button>
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
          {whatsApp?.instanceName && (
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
  )
}
