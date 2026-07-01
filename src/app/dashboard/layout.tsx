'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/app/context/AuthProvider'
import { Toaster } from 'sonner'
import { useState } from 'react'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { LayoutDashboard, MessageSquare, Users, ShoppingBag, Package, BrainCircuit, CreditCard, Smartphone, Settings } from 'lucide-react'

const menu = [
  { href: '/dashboard', label: 'Visão Geral', icon: LayoutDashboard },
  { href: '/dashboard/atendimentos', label: 'Atendimentos', icon: MessageSquare },
  { href: '/dashboard/clientes', label: 'Clientes', icon: Users },
  { href: '/dashboard/whatsapp', label: 'WhatsApp', icon: Smartphone },
  { href: '/dashboard/produtos', label: 'Produtos', icon: Package },
  { href: '/dashboard/conhecimento', label: 'Conhecimento', icon: BrainCircuit },
  { href: '/dashboard/planos', label: 'Planos', icon: CreditCard },
  { href: '/dashboard/assinatura', label: 'Assinatura', icon: ShoppingBag },
  { href: '/dashboard/configuracoes', label: 'Configurações', icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, loading, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Toaster richColors position="top-right" />
      <header className="bg-zinc-900/80 border-b border-zinc-800 sticky top-0 z-50 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-zinc-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">W</span>
              </div>
              <span className="font-bold text-zinc-100">WhatsAI</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-400">{user?.name || 'Usuário'}</span>
            <button onClick={signOut} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-56 bg-zinc-900 border-r border-zinc-800 h-[calc(100vh-3.5rem)] top-14 overflow-y-auto transition-transform duration-200`}>
          <nav className="p-3 space-y-1 pt-4">
            {menu.map(item => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>
        {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
        <main className="flex-1 p-4 sm:p-6 min-h-[calc(100vh-3.5rem)]"><ErrorBoundary>{children}</ErrorBoundary></main>
      </div>
    </div>
  )
}
