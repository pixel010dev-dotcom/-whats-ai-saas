'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4"
        >
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </motion.div>
        <h1 className="text-xl sm:text-2xl font-bold text-primary mb-2">Algo deu errado</h1>
        <p className="text-sm text-secondary mb-2">
          Ocorreu um erro inesperado ao carregar esta página.
        </p>
        <p className="text-xs text-muted mb-6 sm:mb-8 font-mono bg-surface-hover/50 rounded-lg p-3 break-all">
          {error.message || 'Erro desconhecido'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar novamente
          </motion.button>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-surface text-secondary font-medium rounded-xl border border-theme hover:bg-surface-hover transition-all duration-300"
          >
            <Home className="w-4 h-4" />
            Ir para o início
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
