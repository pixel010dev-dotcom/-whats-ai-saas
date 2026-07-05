import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Quick seed endpoint - call POST /api/seed to populate knowledge
export async function POST() {
  try {
    // 1. Create whatsai tenant if needed
    let whatsai = await prisma.tenant.findUnique({ where: { slug: 'whatsai' } })
    if (!whatsai) {
      whatsai = await prisma.tenant.create({
        data: {
          name: 'WhatsAI',
          slug: 'whatsai',
          status: 'ACTIVE',
          plan: 'UNICO',
          settings: {
            create: {
              welcomeMessage: 'Ola! 👋 Bem-vindo ao WhatsAI! Como posso ajudar?',
              aiPersonality: 'Voce e um atendente virtual da equipe WhatsAI. Explique o produto, precos e beneficios. Seja direto e convincente.',
              supportActive: true,
              autoReply: true,
            }
          },
          subscriptions: { create: { plan: 'UNICO', status: 'ACTIVE' } }
        }
      })
    }

    // 2. Knowledge items
    const knowledgeItems = [
      { title: 'O que e o WhatsAI?', content: 'WhatsAI e um funcionario digital para WhatsApp que usa IA para atender clientes 24h. Vende, negocia e tira duvidas automaticamente.', tags: 'whatsai,sobre' },
      { title: 'Preco do WhatsAI', content: 'Custa apenas R$ 29,90 por mes (30 dias). Pagamento via PIX. Nao precisa de cartao de credito. Ativacao instantanea.', tags: 'preco,valor,plano' },
      { title: 'Como conectar o WhatsApp?', content: 'No dashboard va em WhatsApp. Escolha QR Code (escaneie com o celular) ou Codigo de Pareamento (digite seu numero com DDD).', tags: 'conectar,whatsapp' },
      { title: 'Como cadastrar conhecimento?', content: 'Va em "Conhecimento" no dashboard e clique em "Adicionar". Cadastre perguntas e respostas sobre seu negocio.', tags: 'conhecimento,treinar' },
      { title: 'Funciona em feriados?', content: 'Sim! O WhatsAI funciona 24h por dia, 7 dias por semana, incluindo feriados e finais de semana.', tags: 'horario,funcionamento' },
      { title: 'Como cancelar?', content: 'Va em "Assinatura" no dashboard e clique em "Cancelar". Sem multa ou fidelidade.', tags: 'cancelar' },
      { title: 'O que esta incluso?', content: 'IA ilimitada, WhatsApp conectado, base de conhecimento, catalogo de produtos, dashboard com metricas e suporte prioritario. R$29,90/mes.', tags: 'recursos,funcionalidades' },
    ]

    for (const slug of ['whatsai', 'diogo-pfeifer']) {
      const tenant = await prisma.tenant.findUnique({ where: { slug } })
      if (tenant) {
        await prisma.knowledge.deleteMany({ where: { tenantId: tenant.id } })
        for (const item of knowledgeItems) {
          await prisma.knowledge.create({ data: { ...item, tenantId: tenant.id } })
        }
      }
    }

    return NextResponse.json({ success: true, whatsaiCreated: !!whatsai })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
