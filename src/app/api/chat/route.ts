import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateChatResponse } from '@/lib/ai/client'
import type { Knowledge, Message } from '@prisma/client'

export async function POST(req: Request) {
  try {
    const { message, tenantId, customerPhone, customerName } = await req.json()
    if (!message || !tenantId) {
      return NextResponse.json({ error: 'Campos obrigat\órios' }, { status: 400 })
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
      include: { messages: { orderBy: { createdAt: 'asc' }, take: 10 } }
    })
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { tenantId, customerId: customer?.id, status: 'ACTIVE' },
        include: { messages: { orderBy: { createdAt: 'asc' }, take: 10 } }
      })
    }

    await prisma.message.create({
      data: { conversationId: conversation.id, role: 'user', content: message }
    })

    const [settings, knowledgeEntries] = await Promise.all([
      prisma.tenantSettings.findUnique({ where: { tenantId } }),
      prisma.knowledge.findMany({ where: { tenantId }, take: 5 })
    ])

    const knowledgeStr = knowledgeEntries && knowledgeEntries.length > 0
      ? knowledgeEntries.map((k: Knowledge) => `- ${k.title}: ${k.content}`).join('\n')
      : 'Nenhum conhecimento cadastrado'

    const systemPrompt = `Voc\ê \é um atendente digital da empresa.\nPersonalidade: ${settings?.aiPersonality || 'Educado, profissional e amig\ável'}\n\nRegras:\n- Seja educado e profissional\n- Ajude o cliente com suas d\úvidas\n- Se n\ão souber responder, pe\ça desculpas e diga que vai transferir\n- Responda em portugu\ês do Brasil\n- N\ão invente informa\ç\ões\n\nConhecimento da empresa:\n${knowledgeStr}`

    const history = conversation.messages.map((m: Message) => ({
      role: m.role === 'assistant' ? 'assistant' as const : 'user' as const,
      content: m.content
    }))

    const aiResponse = await generateChatResponse(history, systemPrompt)

    await prisma.message.create({
      data: { conversationId: conversation.id, role: 'assistant', content: aiResponse.content }
    })
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() }
    })
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
