import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/app/context/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WhatsAI - Funcionario Digital para WhatsApp',
  description: 'Seu atendente virtual inteligente para WhatsApp. Venda, negocie, atenda e feche pedidos automaticamente.',
  keywords: ['whatsapp', 'ia', 'atendimento', 'chatbot', 'vendas', 'saas'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
