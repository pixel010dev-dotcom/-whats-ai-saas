import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateChatResponse } from '@/lib/ai/client'
import { sendMessage } from '@/lib/whatsapp/evolution'
import { chatSchema } from '@/lib/validations'
import type { Knowledge, Message } from '@prisma/client'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = chatSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }
    const { message, tenantId, customerPhone, customerName } = parsed.data

    // #1 Block unpaid users
    const sub = await prisma.subscription.findUnique({ where: { tenantId } })
    if (!sub || sub.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Assinatura inativa. Acesse /dashboard/planos para pagar.', code: 'SUBSCRIPTION_REQUIRED' }, { status: 402 })
    }

    let customer = null
    if (customerPhone) {
      customer = await prisma.customer.findUnique({
        where: { phone_tenantId: { phone: customerPhone, tenantId } }
      })
    }
    if (!customer && customerPhone) {
      customer = await prisma.customer.create({
        data: { tenantId, phone: customerPhone, name: customerName || 'Cliente' }
      })
    }

    let conversation = await prisma.conversation.findFirst({
      where: { tenantId, customerId: customer?.id, status: { not: 'CLOSED' } },
      include: { messages: { orderBy: { createdAt: 'asc' }, take: 50 } }
    })
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { tenantId, customerId: customer?.id, status: 'ACTIVE' },
        include: { messages: { orderBy: { createdAt: 'asc' }, take: 50 } }
      })
    }

    await prisma.message.create({
      data: { conversationId: conversation.id, role: 'user', content: message }
    })

    const [settings, knowledgeEntries, chatTenant] = await Promise.all([
      prisma.tenantSettings.findUnique({ where: { tenantId } }),
      prisma.knowledge.findMany({ where: { tenantId }, take: 10 }),
      prisma.tenant.findUnique({ where: { id: tenantId }, select: { name: true } }),
    ])

    const businessName = chatTenant?.name || settings?.supportPersonality || 'WhatsAI'

    const knowledgeStr = knowledgeEntries && knowledgeEntries.length > 0
      ? knowledgeEntries.map((k: Knowledge) => `- ${k.title}: ${k.content}`).join('\n')
      : 'Nenhum conhecimento cadastrado'

    const systemPrompt = `VOCE E UM CONSULTOR DE VENDAS ESPECIALISTA do ${businessName}.

## SUA MISSAO
Qualificar leads, apresentar valor e conduzir a conversa ate o fechamento do negocio/orcamento. Voce e um vendedor consultivo de alta performance.

## REGRAS DE OURO
1. Crie rapport naturalmente — seja caloroso e profissional
2. Entenda a dor do cliente ANTES de oferecer solucao (perguntas abertas)
3. Use linguagem de beneficios, nao de caracteristicas
4. Crie urgencia com escassez (vaga limitada, promocao por tempo determinado)
5. Use prova social (ja ajudamos X empresas, media de Y leads gerados)
6. SUPERAR OBJECOES com perguntas que levem o cliente a se convencer
7. FECHAMENTO: peca o contato/orcamento diretamente quando sentir interesse
8. Se o cliente pedir algo fora do escopo, ofereca [TRANSFER]

## PERSONALIDADE
${settings?.aiPersonality || 'Persuasivo, confiante e consultivo. Vendedor de alta performance que cria conexao genuina.'}

## CONHECIMENTO DA EMPRESA
${knowledgeStr}

## TECNICAS DE VENDA
- Rapport: "Entendi sua situacao. Ja ajudei outros clientes com o mesmo desafio."
- Diagnostico: "Para te oferecer a melhor solucao, me conta mais sobre..."
- Prova Social: "Semana passada um cliente do seu ramo conseguiu [resultado] com a gente."
- Escassez: "Essa condicao especial e valida so essa semana."
- Fechamento: "Vou preparar seu orcamento. Qual o melhor email?"

## REGRAS DE RESPOSTA
- Responda no idioma do cliente
- Seja direto e conversacional (WhatsApp, nao carta)
- NUNCA responda com apenas "sim", "nao", "ok"
- Guie a conversa para o fechamento`

    const history = conversation.messages.map((m: Message) => ({
      role: m.role === 'assistant' ? 'assistant' as const : 'user' as const,
      content: m.content
    }))

    let aiResponse: { content: string; model: string; provider: string }
    try {
      aiResponse = await generateChatResponse(history, systemPrompt, undefined)
    } catch {
      console.warn('[Chat] Todos provedores falharam')
      await prisma.message.create({
        data: { conversationId: conversation.id, role: 'assistant', content: 'Desculpe, estou com instabilidade no momento. Por favor, tente novamente em alguns instantes.' }
      })
      return NextResponse.json({
        success: false,
        response: 'Desculpe, estou com instabilidade no momento. Por favor, tente novamente em alguns instantes.',
        conversationId: conversation.id
      })
    }

    const supportPhone = settings?.supportPhone;
    const supportActive = settings?.supportActive;
    const needsTransfer = aiResponse.content.trimStart().startsWith('[TRANSFER]') && supportPhone && supportActive;
    const responseContent = needsTransfer
      ? 'Transferindo para um atendente humano...'
      : aiResponse.content;

    await prisma.message.create({
      data: { conversationId: conversation.id, role: 'assistant', content: responseContent }
    })

    if (needsTransfer) {
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: new Date(), status: 'WAITING' }
      })

      const wa = await prisma.whatsApp.findFirst({ where: { tenantId } })
      if (wa?.instanceName && supportPhone) {
        const customerInfo = customer ? 'Cliente: ' + (customer.name || '') + ' (' + (customer.phone || '') + ')' : ''
        const msg = '*Novo atendimento - Suporte*\n\n' + customerInfo + '\n*Mensagem:* ' + message
        try { await sendMessage(wa.instanceName, supportPhone, msg) } catch (e) {
          console.error('Support forward error:', e)
        }
      }
    } else {
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: new Date() }
      })
    }
    if (customer) {
      await prisma.customer.update({
        where: { id: customer.id },
        data: { lastContact: new Date() }
      })
    }

    return NextResponse.json({
      success: true,
      response: aiResponse.content,
      model: aiResponse.model,
      provider: aiResponse.provider,
      conversationId: conversation.id
    })
  } catch (err) {
    console.error('Chat error:', err)
    return NextResponse.json({ error: 'Erro ao processar mensagem' }, { status: 500 })
  }
}
