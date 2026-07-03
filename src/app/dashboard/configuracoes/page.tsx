'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthProvider'
import { toast } from 'sonner'
import type { SettingsData } from '@/types'

export default function ConfiguracoesPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tenantId, setTenantId] = useState('')
  const [settings, setSettings] = useState<SettingsData>({
    aiPersonality: '',
    welcomeMessage: '',
    businessHours: '',
    autoReply: true,
    supportPhone: '',
    supportActive: false,
    supportPersonality: '',
    supportWelcomeMessage: '',
  })

  useEffect(() => {
    async function load() {
      if (!user?.id) return
      try {
        const profileRes = await fetch('/api/auth/profile')
        const profile = await profileRes.json()
        const tid = profile.tenant?.id
        if (!tid) return
        setTenantId(tid)

        const res = await fetch(`/api/settings?tenantId=${tid}`)
        if (res.ok) {
          const data = await res.json()
          setSettings({
            aiPersonality: data.aiPersonality || '',
            welcomeMessage: data.welcomeMessage || '',
            businessHours: data.businessHours || '',
            autoReply: data.autoReply ?? true,
            supportPhone: data.supportPhone || '',
            supportActive: data.supportActive ?? false,
            supportPersonality: data.supportPersonality || '',
            supportWelcomeMessage: data.supportWelcomeMessage || '',
          })
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, ...settings }),
      })
      if (res.ok) {
        toast.success('Configurações salvas com sucesso!')
      } else {
        toast.error('Erro ao salvar configurações')
      }
    } catch {
      toast.error('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-zinc-900 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Configurações</h1>
        <p className="text-sm text-zinc-500 mt-1">Personalize o comportamento do seu assistente IA</p>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-5">
        <div>
          <div className="bg-zinc-800/30 border border-zinc-700/30 rounded-lg p-2.5 mb-3"><p className="text-xs text-zinc-500"><span className="text-emerald-400 font-medium">Dica:</span> Descreva como a IA deve se comportar. Ex: "Voce e um vendedor consultivo, educado e focado em fechar vendas"</p></div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Personalidade da IA</label>
          <textarea
            value={settings.aiPersonality}
            onChange={e => setSettings({ ...settings, aiPersonality: e.target.value })}
            placeholder="Ex: Você é um atendente simpático e profissional da empresa X..."
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px] resize-y"
            maxLength={500}
          />
          <p className="text-xs text-zinc-600 mt-1">{settings.aiPersonality.length}/500 caracteres</p>
        </div>

        <div>
          <div className="bg-zinc-800/30 border border-zinc-700/30 rounded-lg p-2.5 mb-3"><p className="text-xs text-zinc-500"><span className="text-emerald-400 font-medium">Dica:</span> Primeira mensagem que o cliente ve. Ex: "Ola! Eu sou o assistente da Loja X. Como posso ajudar?"</p></div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Mensagem de boas-vindas</label>
          <textarea
            value={settings.welcomeMessage}
            onChange={e => setSettings({ ...settings, welcomeMessage: e.target.value })}
            placeholder="Olá! Como posso ajudar você hoje?"
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[80px] resize-y"
            maxLength={200}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Horário de funcionamento</label>
          <input
            value={settings.businessHours}
            onChange={e => setSettings({ ...settings, businessHours: e.target.value })}
            placeholder="Seg-Sex 8h às 18h, Sáb 8h às 12h"
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            maxLength={100}
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.autoReply}
            onChange={e => setSettings({ ...settings, autoReply: e.target.checked })}
            className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
          />
          <div>
            <span className="text-sm font-medium text-zinc-200">Respostas automáticas</span>
            <p className="text-xs text-zinc-500">Responder automaticamente mensagens dos clientes</p>
          </div>
        </label>
      </div>
      {user?.email === 'diogopfeifer0@gmail.com' && (
        <>
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-5">

        <h2 className="text-lg font-semibold text-zinc-200">Suporte & Atendimento Humano</h2>
        <p className="text-sm text-zinc-500">Configure o chat de suporte do site e o encaminhamento para seu WhatsApp</p>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">WhatsApp para receber atendimentos</label>
          <input
            value={settings.supportPhone}
            onChange={e => setSettings({ ...settings, supportPhone: e.target.value.replace(/\D/g, '') })}
            placeholder="554598566730"
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <p className="text-xs text-zinc-500 mt-1">Número com DDI e DDD, apenas números. Ex: 5511999999999</p>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.supportActive}
            onChange={e => setSettings({ ...settings, supportActive: e.target.checked })}
            className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
          />
          <div>
            <span className="text-sm font-medium text-zinc-200">Ativar encaminhamento para WhatsApp</span>
            <p className="text-xs text-zinc-500">Quando a IA não souber responder, encaminha pro seu WhatsApp</p>
          </div>
        </label>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-zinc-200">Personalidade da IA do Suporte</h2>
        <p className="text-sm text-zinc-500">Configurações específicas para o chat de suporte do site (widget flutuante)</p>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Personalidade</label>
          <textarea
            value={settings.supportPersonality}
            onChange={e => setSettings({ ...settings, supportPersonality: e.target.value })}
            placeholder="Ex: Você é um atendente de suporte simpático e prestativo..."
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px] resize-y"
            maxLength={500}
          />
          <p className="text-xs text-zinc-600 mt-1">{settings.supportPersonality?.length || 0}/500 caracteres</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Mensagem de boas-vindas do suporte</label>
          <textarea
            value={settings.supportWelcomeMessage}
            onChange={e => setSettings({ ...settings, supportWelcomeMessage: e.target.value })}
            placeholder="Olá! Precisa de ajuda? Estou aqui para ajudar!"
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[80px] resize-y"
            maxLength={200}
          />
        </div>
      </div>
        </>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-emerald-500/25"
      >
        {saving ? 'Salvando...' : 'Salvar configurações'}
      </button>
    </div>
  )
}


