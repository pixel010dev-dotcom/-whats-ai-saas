import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/app/context/AuthProvider'
import { ThemeProvider } from '@/components/theme/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | WhatsAI',
    default: 'WhatsAI - Funcionario Digital para WhatsApp',
  },
  description: 'Seu atendente virtual inteligente para WhatsApp. Venda, negocie, atenda e feche pedidos automaticamente com IA.',
  keywords: ['whatsapp', 'ia', 'atendimento', 'chatbot', 'vendas', 'saas', 'inteligencia artificial', 'automatizacao'],
  authors: [{ name: 'WhatsAI' }],
  creator: 'WhatsAI',
  publisher: 'WhatsAI',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'WhatsAI',
    title: 'WhatsAI - Funcionario Digital para WhatsApp',
    description: 'Seu atendente virtual inteligente para WhatsApp. Venda, negocie, atenda e feche pedidos automaticamente com IA.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WhatsAI - Funcionario Digital para WhatsApp',
    description: 'Seu atendente virtual inteligente para WhatsApp.',
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
        </ThemeProvider>
      </body>
    </html>
  )
}
