'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check auth state here
    setLoading(false)
  }, [])

  const menu = [
    { href: '/dashboard', label: 'Vis\u00e3o Geral', icon: '\u{1F4CA}' },
    { href: '/dashboard/atendimentos', label: 'Atendimentos', icon: '\u{1F4AC}' },
    { href: '/dashboard/clientes', label: 'Clientes', icon: '\u{1F465}' },
    { href: '/dashboard/produtos', label: 'Produtos', icon: '\u{1F4E6}' },
    { href: '/dashboard/configuracoes', label: 'Configura\u00e7\u00f5es', icon: '\u2699\uFE0F' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-green-500 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">W</span>
              </div>
              <span className="font-bold">WhatsAI</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Diogo</span>
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">Sair</Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-200 h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto">
          <nav className="p-3 space-y-1">
            {menu.map(item => {
              const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
