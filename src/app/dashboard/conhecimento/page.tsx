'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthProvider'
import { Plus, BrainCircuit, Pencil, Trash2, Search, X, BookMarked } from 'lucide-react'
import { toast } from 'sonner'

interface Knowledge {
  id: string
  title: string
  content: string
  tags: string | null
}

export default function ConhecimentoPage() {
  const { user } = useAuth()
  const [knowledge, setKnowledge] = useState<Knowledge[]>([])
  const [loading, setLoading] = useState(true)
  const [tenantId, setTenantId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Knowledge | null>(null)
  const [saving, setSaving] = useState(false)
  const [formTitle, setFormTitle] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formTags, setFormTags] = useState('')

  useEffect(() => {
    async function load() {
      if (!user?.id) return
      try {
        const profileRes = await fetch('/api/auth/profile')
        const profile = await profileRes.json()
        const tid = profile.tenant?.id
        if (!tid) return
        setTenantId(tid)
        const res = await fetch('/api/knowledge?tenantId=' + tid)
        if (res.ok) {
          const data = await res.json()
          setKnowledge(data.knowledge || [])
        }
      } catch (err) {
        console.error('Load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  function openNew() {
    setEditing(null)
    setFormTitle('')
    setFormContent('')
    setFormTags('')
    setShowModal(true)
  }

  function openEdit(item: Knowledge) {
    setEditing(item)
    setFormTitle(item.title)
    setFormContent(item.content)
    setFormTags(item.tags || '')
    setShowModal(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!tenantId || !formTitle.trim() || !formContent.trim()) return
    setSaving(true)
    try {
      const body = { tenantId, title: formTitle.trim(), content: formContent.trim(), tags: formTags.trim() || undefined }
      let res
      if (editing) {
        res = await fetch('/api/knowledge/' + editing.id, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        })
      } else {
        res = await fetch('/api/knowledge', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        })
      }
      if (res.ok) {
        toast.success(editing ? 'Conhecimento atualizado!' : 'Conhecimento criado!')
        setShowModal(false)
        const reloadRes = await fetch('/api/knowledge?tenantId=' + tenantId)
        if (reloadRes.ok) {
          const data = await reloadRes.json()
          setKnowledge(data.knowledge || [])
        }
      } else {
        toast.error('Erro ao salvar')
      }
    } catch (err) {
      console.error('Save error:', err)
      toast.error('Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este item?')) return
    try {
      const res = await fetch('/api/knowledge/' + id, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Item excluido!')
        setKnowledge(prev => prev.filter(k => k.id !== id))
      }
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const filtered = knowledge.filter(k =>
    k.title.toLowerCase().includes(search.toLowerCase()) ||
    k.content.toLowerCase().includes(search.toLowerCase()) ||
    k.tags?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Base de Conhecimento</h1>
          <p className="text-sm text-zinc-500 mt-1">Treine a IA com informacoes do seu negocio</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 text-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Novo Item
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar na base de conhecimento..." className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder-zinc-500" />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/30 border border-zinc-800 rounded-xl">
          <BookMarked className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-400">Nenhum item encontrado</p>
          <p className="text-sm text-zinc-600 mt-1">Adicione informacoes sobre seu negocio para a IA aprender</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map(item => (
            <div key={item.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-emerald-400 shrink-0" />
                    <p className="font-medium text-zinc-200 truncate">{item.title}</p>
                  </div>
                  <p className="text-sm text-zinc-500 mt-2 line-clamp-3">{item.content}</p>
                  {item.tags && (
                    <div className="flex gap-1 mt-2">
                      {item.tags.split(',').map((tag, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500">{tag.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(item)} className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-all">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-zinc-100">{editing ? 'Editar Item' : 'Novo Item'}</h2>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-zinc-300"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Titulo *</label>
                <input type="text" value={formTitle} onChange={e => setFormTitle(e.target.value)} required placeholder="Ex: Politica de troca, Horario de funcionamento..." className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder-zinc-600" />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Conteudo *</label>
                <textarea value={formContent} onChange={e => setFormContent(e.target.value)} required rows={6} placeholder="Descreva as informacoes que a IA deve saber..." className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none placeholder-zinc-600" />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Tags (separadas por virgula)</label>
                <input type="text" value={formTags} onChange={e => setFormTags(e.target.value)} placeholder="Ex: vendas, politica, horario" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder-zinc-600" />
              </div>
              <button type="submit" disabled={saving || !formTitle.trim() || !formContent.trim()} className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition-all">
                {saving ? 'Salvando...' : editing ? 'Atualizar Item' : 'Criar Item'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
