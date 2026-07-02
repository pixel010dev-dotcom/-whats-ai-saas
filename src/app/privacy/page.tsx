import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de privacidade do WhatsAI - Como tratamos seus dados pessoais em conformidade com a LGPD.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-3xl mx-auto px-4 py-20">
        <Link href="/" className="text-emerald-400 hover:text-emerald-300 mb-8 inline-block">&larr; Voltar</Link>
        <h1 className="text-3xl font-bold mb-8">Política de Privacidade</h1>
        <div className="space-y-6 text-zinc-400 leading-relaxed">
          <p><strong className="text-zinc-200">1. Dados Coletados</strong><br />Coletamos nome, email, telefone e dados de uso para fornecer o serviço. Não coletamos conteúdo de mensagens dos clientes dos nossos usuários.</p>
          <p><strong className="text-zinc-200">2. Uso dos Dados</strong><br />Seus dados são usados para operar o serviço, processar pagamentos, enviar notificações e melhorar a plataforma.</p>
          <p><strong className="text-zinc-200">3. Compartilhamento</strong><br />Compartilhamos dados apenas com processadores essenciais (Supabase, Railway, Mercado Pago). Nunca vendemos dados.</p>
          <p><strong className="text-zinc-200">4. LGPD</strong><br />Você tem direito a acessar, corrigir, excluir e portar seus dados. Solicitações podem ser feitas pelo email pixel010dev@gmail.com.</p>
          <p><strong className="text-zinc-200">5. Cookies</strong><br />Usamos cookies essenciais para autenticação. Não usamos cookies de rastreamento de terceiros.</p>
          <p><strong className="text-zinc-200">6. Segurança</strong><br />Utilizamos criptografia em trânsito (TLS) e em repouso, além de práticas de segurança como RLS no banco de dados.</p>
          <p><strong className="text-zinc-200">7. Retenção</strong><br />Mantemos seus dados enquanto sua conta estiver ativa. Após exclusão, os dados são removidos em até 90 dias.</p>
          <p className="text-zinc-500 text-sm mt-12">Última atualização: Julho 2026</p>
        </div>
      </div>
    </div>
  )
}
