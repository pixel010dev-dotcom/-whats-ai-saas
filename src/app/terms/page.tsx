import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Termos e condições de uso do WhatsAI - Seu funcionário digital para WhatsApp.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-3xl mx-auto px-4 py-20">
        <Link href="/" className="text-emerald-400 hover:text-emerald-300 mb-8 inline-block">&larr; Voltar</Link>
        <h1 className="text-3xl font-bold mb-8">Termos de Uso</h1>
        <div className="space-y-6 text-zinc-400 leading-relaxed">
          <p><strong className="text-zinc-200">1. Aceitação dos Termos</strong><br />Ao utilizar o WhatsAI, você concorda com estes termos. Se não concordar, não utilize o serviço.</p>
          <p><strong className="text-zinc-200">2. Descrição do Serviço</strong><br />O WhatsAI é um SaaS de atendimento inteligente via WhatsApp com IA. Fornecemos automação de vendas, atendimento e pós-venda.</p>
          <p><strong className="text-zinc-200">3. Planos e Pagamentos</strong><br />Os planos são mensais ou anuais com cobrança via Mercado Pago. O não pagamento pode resultar em suspensão do acesso.</p>
          <p><strong className="text-zinc-200">4. Uso Aceitável</strong><br />Você concorda em não usar o serviço para spam, conteúdo ilegal ou qualquer violação de leis brasileiras.</p>
          <p><strong className="text-zinc-200">5. Limitação de Responsabilidade</strong><br />O WhatsAI não se responsabiliza por danos indiretos decorrentes do uso do serviço.</p>
          <p><strong className="text-zinc-200">6. Cancelamento</strong><br />Você pode cancelar a qualquer momento. O acesso continua até o fim do período pago.</p>
          <p><strong className="text-zinc-200">7. Alterações</strong><br />Estes termos podem ser alterados a qualquer momento. Notificaremos por email em caso de mudanças significativas.</p>
          <p className="text-zinc-500 text-sm mt-12">Última atualização: Julho 2026</p>
        </div>
      </div>
    </div>
  )
}
