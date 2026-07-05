'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/app/context/AuthProvider'
import { useTheme } from '@/components/theme/ThemeProvider'
import { Toaster } from 'sonner'
import { useState } from 'react'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import {
  LayoutDashboard, MessageSquare, Users, ShoppingBag, Package,
  BrainCircuit, CreditCard, Smartphone, Settings, Sun, Moon, LogOut,
  Menu, X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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

const menuItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1, x: 0, transition: { delay: i * 0.05, type: 'spring' as const, stiffness: 300, damping: 25 },
  }),
} satisfies import('framer-motion').Variants

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, loading, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/login'
    }
  }, [loading, user])

  if (loading) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-page text-primary">
      <Toaster richColors position="top-right" />
      <header className="bg-page-secondary/80 border-b border-theme sticky top-0 z-50 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-secondary hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.05, rotate: -5 }}
                className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-md flex items-center justify-center"
              >
                <span className="text-white font-bold text-xs">W</span>
              </motion.div>
              <span className="font-bold text-primary">WhatsAI</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-hover transition-colors"
              aria-label={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>
            <span className="text-sm text-secondary hidden sm:block">{user?.name || 'Usuário'}</span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={signOut}
              className="p-2 rounded-lg text-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors"
              aria-label="Sair"
            >
              <LogOut className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </header>

      <div className="flex">
        <AnimatePresence mode="wait">
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-60 bg-page-secondary border-r border-theme h-[calc(100vh-3.5rem)] top-14 overflow-y-auto transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <nav className="p-3 space-y-1 pt-4">
            {menu.map((item, i) => {
              const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
              return (
                <motion.div
                  key={item.href}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={menuItemVariants}
                >
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                      active
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'text-secondary hover:text-primary hover:bg-surface-hover'
                    }`}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {active && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                      />
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </nav>
          <div className="p-3 border-t border-theme mt-2">
            <p className="text-xs text-muted px-3">WhatsAI v1.0</p>
          </div>
        </aside>

        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-3 sm:p-6 min-h-[calc(100vh-3.5rem)] w-full max-w-full overflow-x-hidden"
        >
          <ErrorBoundary>{children}</ErrorBoundary>
        </motion.main>
      </div>
    </div>
  )
}
