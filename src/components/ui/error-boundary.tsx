'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught:', error)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="flex items-center justify-center min-h-[400px] p-8">
          <div className="text-center max-w-md">
            <span className="text-5xl block mb-4">⚠️</span>
            <h2 className="text-xl font-bold text-zinc-100 mb-2">Algo deu errado</h2>
            <p className="text-zinc-400 mb-6">Ocorreu um erro inesperado. Tente novamente.</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-6 py-2.5 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-400 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
