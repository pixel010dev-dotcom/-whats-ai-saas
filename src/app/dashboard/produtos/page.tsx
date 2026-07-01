'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthProvider'
import { formatCurrency } from '@/lib/utils'
import { Plus, Package, Pencil, Trash2, Search, X } from 'lucide-react'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image: string | null
  active: boolean
  categoryId: string | null
  category: { id: string; name: string } | null
}

interface Category {
  id: string
  name: string
}

export default function ProdutosPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [tenantId, setTenantId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [formName, setFormName] = useState('')
  const [formPrice, setFormPrice] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formCategoryId, setFormCategoryId] = useState('')
  const [formActive, setFormActive] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      if (!user?.id) return
      try {
        const profileRes = await fetch('/api/auth/profile')
        const profile = await profileRes.json()
        const tid = profile.tenant?.id
        if (!tid) return
        setTenantId(tid)
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products?tenantId=' + tid),
          fetch('/api/categories?tenantId=' + tid),
        ])
        if (prodRes.ok) {
          const data = await prodRes.json()
          setProducts(data.products || [])
        }
        if (catRes.ok) {
          const data = await catRes.json()
          setCategories(data.categories || [])
        }
      } catch (err) {
        console.error('Load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  function openNewProduct() {
    setEditingProduct(null)
    setFormName('')
    setFormPrice('')
    setFormDescription('')
    setFormCategoryId('')
    setFormActive(true)
    setShowModal(true)
  }

  function openEditProduct(product: Product) {
    setEditingProduct(product)
    setFormName(product.name)
    setFormPrice(String(product.price))
    setFormDescription(product.description || '')
    setFormCategoryId(product.categoryId || '')
    setFormActive(product.active)
    setShowModal(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!tenantId || !formName.trim() || !formPrice) return
    setSaving(true)
    try {
      const body = { tenantId, name: formName.trim(), price: parseFloat(formPrice), description: formDescription.trim() || undefined, categoryId: formCategoryId || undefined, active: formActive }
      let res
      if (editingProduct) {
        res = await fetch('/api/products/' + editingProduct.id, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        })
      } else {
        res = await fetch('/api/products', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        })
      }
      if (res.ok) {
        toast.success(editingProduct ? 'Produto atualizado!' : 'Produto criado!')
        setShowModal(false)
        const prodRes = await fetch('/api/products?tenantId=' + tenantId)
        if (prodRes.ok) {
          const data = await prodRes.json()
          setProducts(data.products || [])
        }
      } else {
        toast.error('Erro ao salvar produto')
      }
    } catch (err) {
      console.error('Save error:', err)
      toast.error('Erro ao salvar produto')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return
    try {
      const res = await fetch('/api/products/' + id, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Produto excluido!')
        setProducts(prev => prev.filter(p => p.id !== id))
      }
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  async function handleCreateCategory() {
    if (!tenantId || !newCategory.trim()) return
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, name: newCategory.trim() }),
      })
      if (res.ok) {
        const data = await res.json()
        setCategories(prev => [...prev, data.category])
        setNewCategory('')
        setShowCategoryModal(false)
        toast.success('Categoria criada!')
      }
    } catch (err) {
      console.error('Category error:', err)
    }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
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
          <h1 className="text-2xl font-bold text-zinc-100">Produtos</h1>
          <p className="text-sm text-zinc-500 mt-1">Gerencie seu catalogo de produtos</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowCategoryModal(true)} className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors">+ Categoria</button>
          <button onClick={openNewProduct} className="flex items-center gap-2 px-4 py-2 text-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            Novo Produto
          </button>
        </div>
      </div>
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar produtos..." className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder-zinc-500" />
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/30 border border-zinc-800 rounded-xl">
          <Package className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-400">Nenhum produto encontrado</p>
          <p className="text-sm text-zinc-600 mt-1">Clique em Novo Produto para adicionar</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map(product => (
            <div key={product.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                <Package className="w-6 h-6 text-zinc-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-zinc-200 truncate">{product.name}</p>
                  {!product.active && <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-400">Inativo</span>}
                </div>
                <p className="text-sm text-zinc-500 truncate">{product.description || 'Sem descricao'}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-semibold text-emerald-400">{formatCurrency(product.price)}</span>
                  {product.category && <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500">{product.category.name}</span>}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEditProduct(product)} className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-all">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(product.id)} className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-zinc-100">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-zinc-300"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Nome *</label>
                <input type="text" value={formName} onChange={e => setFormName(e.target.value)} required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-500/50" />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Preco *</label>
                <input type="number" step="0.01" value={formPrice} onChange={e => setFormPrice(e.target.value)} required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-500/50" />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Descricao</label>
                <textarea value={formDescription} onChange={e => setFormDescription(e.target.value)} rows={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none" />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Categoria</label>
                <select value={formCategoryId} onChange={e => setFormCategoryId(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-500/50">
                  <option value="">Sem categoria</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={formActive} onChange={e => setFormActive(e.target.checked)} id="active" className="rounded bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-emerald-500" />
                <label htmlFor="active" className="text-sm text-zinc-400">Produto ativo</label>
              </div>
              <button type="submit" disabled={saving || !formName.trim() || !formPrice} className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition-all">
                {saving ? 'Salvando...' : editingProduct ? 'Atualizar Produto' : 'Criar Produto'}
              </button>
            </form>
          </div>
        </div>
      )}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowCategoryModal(false)}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-zinc-100 mb-4">Nova Categoria</h2>
            <div className="flex gap-2">
              <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Nome da categoria" className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-emerald-500/50" onKeyDown={e => e.key === 'Enter' && handleCreateCategory()} />
              <button onClick={handleCreateCategory} disabled={!newCategory.trim()} className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg text-sm transition-all">Criar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
