'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthProvider'
import { Smartphone, QrCode, Link2, Link2Off, RefreshCw, Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

type WhatsAppStatus = 'DISCONNECTED' | 'CREATING' | 'WAITING_QR' | 'CONNECTED' | 'ERROR'

interface WhatsAppData {
  id: string
  phone?: string
  instanceName?: string
  qrCode?: string
  status: WhatsAppStatus
}

export default function WhatsAppPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [tenantId, setTenantId] = useState<string | null>(null)
  const [whatsApp, setWhatsApp] = useState<WhatsAppData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [connectedStatus, setConnectedStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')

  useEffect(() => {
    if (!user?.id) return
    async function fetchTenant() {
      try {
        const res = await fetch('/api/auth/profile')
        if (!res.ok) throw new Error('Falha ao carregar perfil')
        const data = await res.json()
        setTenantId(data.tenant.id)
      } catch (err) {
        console.error('Erro ao buscar tenant:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTenant()
  }, [user])

  useEffect(() => {
    if (!tenantId) return
    async function checkStatus() {
      try {
        const res = await fetch('/api/whatsapp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tenantId, action: 'status' }),
        })
        if (!res.ok) throw new Error('Falha ao verificar status')
        const data = await res.json()
        setConnectedStatus(data.state === 'CONNECTED' ? 'connected' : 'disconnected')
        if (data.state === 'CONNECTED') {
          setWhatsApp(prev => prev ? { ...prev, status: 'CONNECTED' } : { id: '', status: 'CONNECTED' })
        }
      } catch (err) {
        console.error('Erro ao verificar status:', err)
      }
    }
    checkStatus()
    const interval = setInterval(checkStatus, 5000)
    return () => clearInterval(interval)
  }, [tenantId])

  async function handleConnect() {
    if (!tenantId) return
    setConnecting(true)
    setError(null)
    try {
      const res = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, action: 'connect' }),
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Falha ao conectar')
      }
      const data = await res.json()
      setWhatsApp({
        id: data.id || '',
        instanceName: data.instanceName,
        qrCode: data.qrCode,
        status: 'WAITING_QR',
      })
      setConnectedStatus('checking')
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar WhatsApp')
    } finally {
      setConnecting(false)
    }
  }

  async function handleDisconnect() {
    if (!tenantId) return
    setConnecting(true)
    try {
      const res = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, action: 'disconnect' }),
      })
      if (!res.ok) throw new Error('Falha ao desconectar')
      setWhatsApp(null)
      setConnectedStatus('disconnected')
    } catch (err: any) {
      setError(err.message || 'Erro ao desconectar')
    } finally {
      setConnecting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    )
  }

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
                <h2 className="text-lg font-semibold text-zinc-100">{connectedStatus === 'connected' ? 'WhatsApp Conectado' : 'WhatsApp Desconectado'}</h2>
                <p className="text-sm text-zinc-400 mt-0.5">{connectedStatus === 'connected' ? 'Seu WhatsApp esta conectado e pronto para atender.' : connectedStatus === 'checking' ? 'Verificando status da conexao...' : 'Conecte seu WhatsApp para comecar a usar o WhatsAII.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
