import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/app/context/AuthProvider'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import ChatWidget from '@/components/ChatWidget'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | WhatsAI',
    default: 'WhatsAI - Funcionário Digital para WhatsApp',
  },
  description: 'Seu atendente virtual inteligente para WhatsApp. Venda, negocie, atenda e feche pedidos automaticamente com IA. Economize R$ 2.500/mês com nosso plano de R$ 29,90.',
  keywords: ['whatsapp', 'ia', 'atendimento', 'chatbot', 'vendas', 'saas', 'inteligencia artificial', 'automatizacao', 'whatsapp business', 'chatbot whatsapp'],
  authors: [{ name: 'WhatsAI' }],
  creator: 'WhatsAI',
  publisher: 'WhatsAI',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'WhatsAI',
    title: 'WhatsAI - Funcionário Digital para WhatsApp',
    description: 'Seu atendente virtual inteligente para WhatsApp. Venda, negocie, atenda e feche pedidos automaticamente com IA.',
    url: 'https://whatsai-app-production.up.railway.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WhatsAI - Funcionário Digital para WhatsApp',
    description: 'Seu atendente virtual inteligente para WhatsApp.',
  },
  verification: {
    google: 'Hp8q0blbMExSdzZSqYjSS-cjEEUoxSEKCrKIVnqBb7M',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
          <ChatWidget slug="whatsai" />
        </ThemeProvider>
      </body>
    </html>
  )
}
