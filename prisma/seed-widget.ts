// Quick seed script - run: npx tsx prisma/seed-widget.ts
// It reads DATABASE_URL from environment
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding...')

  // 1. Create whatsai tenant if not exists
  const existing = await prisma.tenant.findUnique({ where: { slug: 'whatsai' } })
  if (!existing) {
    await prisma.tenant.create({
      data: {
        name: 'WhatsAI',
        slug: 'whatsai',
        status: 'ACTIVE',
        plan: 'UNICO',
        settings: {
          create: {
            welcomeMessage: 'Ola! 👋 Bem-vindo ao WhatsAI! Como posso ajudar voce hoje?',
            aiPersonality: 'Voce e um atendente virtual da equipe WhatsAI. Explique o produto, precos e beneficios. Seja direto e convincente.',
            supportActive: true,
            autoReply: true,
          }
        },
        subscriptions: { create: { plan: 'UNICO', status: 'ACTIVE' } }
      }
    })
    console.log('✅ Tenant whatsai created')
  } else {
    console.log('✅ Tenant whatsai already exists')
  }

  // 2. Knowledge items about WhatsAI
  const knowledgeItems = [
    { title: 'O que e o WhatsAI?', content: 'WhatsAI e um funcionario digital para WhatsApp que usa IA para atender clientes 24h. Vende, negocia e tira duvidas automaticamente.', tags: 'whatsai,sobre' },
    { title: 'Preco do WhatsAI', content: 'Custa apenas R$ 29,90 por mes (30 dias). Pagamento via PIX. Nao precisa de cartao de credito. Ativacao instantanea.', tags: 'preco,valor,plano' },
    { title: 'Como conectar o WhatsApp?', content: 'No dashboard va em WhatsApp. Escolha QR Code (escaneie com o celular) ou Codigo de Pareamento (digite seu numero com DDD).', tags: 'conectar,whatsapp' },
    { title: 'Como cadastrar conhecimento?', content: 'Va em "Conhecimento" no dashboard e clique em "Adicionar". Cadastre perguntas e respostas sobre seu negocio.', tags: 'conhecimento,treinar' },
    { title: 'Funciona em feriados?', content: 'Sim! O WhatsAI funciona 24h por dia, 7 dias por semana, incluindo feriados e finais de semana.', tags: 'horario,funcionamento' },
    { title: 'Como cancelar?', content: 'Va em "Assinatura" no dashboard e clique em "Cancelar". Sem multa ou fidelidade.', tags: 'cancelar' },
    { title: 'O que esta incluso?', content: 'IA ilimitada, WhatsApp conectado, base de conhecimento, catalogo de produtos, dashboard com metricas e suporte prioritario. R$29,90/mes.', tags: 'recursos,funcionalidades' },
  ]

  const tenants = await prisma.tenant.findMany({
    where: { slug: { in: ['whatsai', 'diogo-pfeifer'] } }
  })

  for (const t of tenants) {
    await prisma.knowledge.deleteMany({ where: { tenantId: t.id } })
    for (const item of knowledgeItems) {
      await prisma.knowledge.create({ data: { ...item, tenantId: t.id } })
    }
    console.log(`✅ ${knowledgeItems.length} items -> ${t.slug}`)
  }

  console.log('🎉 Done!')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
