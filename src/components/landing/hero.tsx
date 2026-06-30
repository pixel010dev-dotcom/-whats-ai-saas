'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import ChatPreview from './chat-preview'

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
                <span className="text-sm font-medium text-emerald-400">Nova ferramenta revolucionária</span>
              </div>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="text-zinc-100">Seu funcionário</span>
              <br />
              <span className="gradient-text">digital para WhatsApp</span>
            </h1>

            <p className="mt-6 text-xl text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Venda, negocie, atenda e feche pedidos automaticamente 24 horas por dia. 
              Sua inteligência artificial que aprende sobre seu negócio e funciona como um atendente nota 10.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/register"
                className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl text-lg shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
              >
                <span className="relative z-10">Começar grátis →</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <Link
                href="#features"
                className="px-8 py-4 bg-zinc-900/50 border-zinc-800 text-zinc-300 font-semibold rounded-xl text-lg hover:border-zinc-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                Ver funcionalidades
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-8 justify-center lg:justify-start text-sm text-zinc-500">
              <div className="flex -space-x-2">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-zinc-500 border-2 border-white">
                  +1k
                </div>
              </div>
              <span className="font-medium">Mais de <strong className="text-zinc-100">1.000 empresas</strong> já usam</span>
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
