'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Shield, Zap, Undo2, Users, Sparkles, ArrowRight, CheckCircle } from 'lucide-react'
import ChatPreview from './chat-preview'

// Animated counter component
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 2000
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target])

  return <span className="gradient-text font-bold">{count}{suffix}</span>
}

// Counter that triggers when in view
function SocialCounter() {
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    const el = document.getElementById('social-counter')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div id="social-counter" className="flex flex-wrap items-center gap-3 justify-center lg:justify-start">
      <div className="flex -space-x-3">
        {['D', 'M', 'R', 'L', 'C'].map((letter, i) => (
          <div
            key={i}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold border-2 border-zinc-900"
          >
            {letter}
          </div>
        ))}
        <div className="w-9 h-9 rounded-full bg-emerald-500/20 border-2 border-zinc-900 flex items-center justify-center text-xs font-semibold text-emerald-400">
          <Users className="w-4 h-4" />
        </div>
      </div>
      <span className="text-sm text-zinc-400">
        <span className="font-bold text-zinc-100">
          {hasStarted ? <AnimatedCounter target={487} suffix="+" /> : '487+'}
        </span>{' '}
        empresas já usam o WhatsAI
      </span>
    </div>
  )
}

export default function Hero() {
  return (
    <section id="demo" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-green-400/20 via-green-300/10 to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tl from-emerald-400/20 via-green-300/10 to-transparent rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-blue-400/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium text-emerald-400">Lançamento 2026</span>
              </div>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="text-zinc-100">Seu funcionário</span>
              <br />
              <span className="gradient-text">digital para WhatsApp</span>
            </h1>

            <p className="mt-6 text-xl text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Venda, negocie, atenda e feche pedidos automaticamente 24 horas por dia.{' '}
              <span className="text-emerald-400 font-semibold">Sem contratar ninguém.</span>
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/register"
                className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl text-lg shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Começar grátis
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <Link
                href="#features"
                className="px-8 py-4 bg-zinc-900/50 border border-zinc-700 text-zinc-300 font-semibold rounded-xl text-lg hover:border-zinc-500 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                Ver funcionalidades
              </Link>
            </div>

            {/* Trust badges - directly below CTA */}
            <div className="mt-6 flex flex-wrap gap-2 justify-center lg:justify-start">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
                <Shield className="w-3.5 h-3.5" />
                7 dias de garantia
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-xs text-zinc-400">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                Ativação instantânea
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-xs text-zinc-400">
                <Undo2 className="w-3.5 h-3.5 text-emerald-400" />
                Cancele quando quiser
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-xs text-zinc-400">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Pagamento 100% seguro
              </span>
            </div>

            {/* Social proof counter */}
            <div className="mt-8">
              <SocialCounter />
            </div>
          </motion.div>

          {/* Right side - Chat Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent rounded-3xl blur-3xl" />
            
            {/* Badge flutuante "Vendas 24h" */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute -top-4 -right-4 z-10 bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-emerald-500/30"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Vendas 24h/dia
              </div>
            </motion.div>

            {/* Badge "Responde em 2s" */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="absolute -bottom-4 -left-4 z-10 bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs font-medium px-4 py-2 rounded-full shadow-lg"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Responde em 2 segundos
              </div>
            </motion.div>

            <div className="relative">
              <ChatPreview />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-zinc-600 flex items-start justify-center pt-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
        </motion.div>
      </motion.div>
    </section>
  )
}
