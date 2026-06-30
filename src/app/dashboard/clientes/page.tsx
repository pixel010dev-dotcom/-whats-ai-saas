'use client'

import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '@/app/context/AuthProvider'
import { formatCurrency, formatDate, maskPhone } from '@/lib/utils'
import type { CustomerSummary } from '@/types'
import { Users } from 'lucide-react'

export default function ClientesPage() {
  const { user } = useAuth()
  const [customers, setCustomers] = useState<CustomerSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchCustomers() {
      if (!user?.id) return
      try {
        const profileRes = await fetch('/api/auth/profile')
        const profile = await profileRes.json()
        const tid = profile.tenant?.id
        if (!tid) return

        const res = await fetch(`/api/customers?tenantId=${tid}`)
        if (res.ok) {
          const data = await res.json()
          setCustomers(data.customers || [])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCustomers()
  }, [user])

  const filtered = useMemo(() => {
    if (!search) return customers
    const s = search.toLowerCase()
    return customers.filter(c =>
      c.name.toLowerCase().includes(s) ||
      c.phone.includes(s) ||
      c.email.toLowerCase().includes(s)
    )
  }, [customers, search])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Clientes</h1>
          <p className="text-sm text-zinc-500 mt-1">{customers.length} cliente{customers.length !== 1 ? 's' : ''}</p>
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar cliente..."
          className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-64"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-zinc-900 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <Users className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-400 font-medium">
            {search ? 'Nenhum cliente encontrado para esta busca' : 'Nenhum cliente cadastrado'}
          </p>
          <p className="text-sm text-zinc-600 mt-1">
            {search ? 'Tente outro termo de busca' : 'Os clientes aparecerão aqui após interagirem com seu WhatsApp'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left text-sm font-medium text-zinc-400 pb-3 px-3">Nome</th>
                <th className="text-left text-sm font-medium text-zinc-400 pb-3 px-3">Telefone</th>
                <th className="text-left text-sm font-medium text-zinc-400 pb-3 px-3 hidden sm:table-cell">Email</th>
                <th className="text-right text-sm font-medium text-zinc-400 pb-3 px-3 hidden md:table-cell">Total gasto</th>
                <th className="text-right text-sm font-medium text-zinc-400 pb-3 px-3 hidden md:table-cell">Último contato</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-medium text-zinc-200">{c.name}</span>
                  </td>
                  <td className="py-3 px-3 text-zinc-400 text-sm">{maskPhone(c.phone)}</td>
                  <td className="py-3 px-3 text-zinc-400 text-sm hidden sm:table-cell">{c.email || '—'}</td>
                  <td className="py-3 px-3 text-zinc-300 text-sm text-right hidden md:table-cell">{formatCurrency(c.totalSpent)}</td>
                  <td className="py-3 px-3 text-zinc-500 text-sm text-right hidden md:table-cell">{c.lastContact ? formatDate(c.lastContact) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
