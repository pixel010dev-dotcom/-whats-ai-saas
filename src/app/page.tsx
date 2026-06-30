'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Hero from '@/components/landing/hero'
import Features from '@/components/landing/features'
import HowItWorks from '@/components/landing/how-it-works'
import Pricing from '@/components/landing/pricing'
import Testimonials from '@/components/landing/testimonials'
import FAQ from '@/components/landing/faq'
import Footer from '@/components/landing/footer'
import Particles from '@/components/landing/particles'

export default function Home() {
  useEffect(() => {
    // Intersection Observer for reveal animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <main className="relative min-h-screen">
      {/* Particles Background */}
      <Particles />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 mt-4 px-6 rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 shadow-lg shadow-black/5">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="font-bold text-xl text-zinc-100">WhatsAI</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Funcionalidades</a>
              <a href="#how-it-works" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Como funciona</a>
              <a href="#pricing" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Preços</a>
              <a href="#faq" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">FAQ</a>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-zinc-100 transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                Começar grátis
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Pricing Section */}
      <Pricing />

      {/* Testimonials Section */}
      <Testimonials />

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <section className="relative py-32 bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Pronto para transformar seu atendimento?
          </h2>
          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
            Junte-se a mais de 1.000 empresas que já automatizaram suas vendas no WhatsApp.
            Comece grátis, sem cartão de crédito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-emerald-400 font-bold rounded-xl text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Começar grátis agora
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl text-lg hover:bg-white/20 transition-all duration-300"
            >
              Ver funcionalidades
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}
