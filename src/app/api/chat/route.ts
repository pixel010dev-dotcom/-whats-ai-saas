import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateChatResponse } from '@/lib/ai/client'

export async function POST(req: Request) {
  try {
    const { message, tenantId, customerPhone, customerName } = await req.json()

    if (!message || !tenantId) {
      return NextResponse.json({ error: 'Campos obrigat\u00f3rios' }, { status: 400 })
    }

    // Find or create customer
    let customer = customerPhone ? await prisma.customer.findUnique({ where: { phone: customerPhone } }) : null
    if (!customer && customerPhone) {
      customer = await prisma.customer.create({
        data: { tenantId, phone: customerPhone, name: customerName || 'Cliente' }
      })
    }

    // Find or create active conversation
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

    // Save user message
    await prisma.message.create({
      data: { conversationId: conversation.id, role: 'user', content: message }
    })

    // Get tenant settings and knowledge
    const [settings, knowledge] = await Promise.all([
      prisma.tenantSettings.findUnique({ where: { tenantId } }),
      prisma.knowledge.findMany({ where: { tenantId }, take: 5 })
    ])

    // Build system prompt
    const systemPrompt = `Voc\u00ea \u00e9 um atendente digital da empresa.\n
Personalidade: ${settings?.aiPersonality || 'Educado, profissional e amig\u00e1vel'}\n
Regras:\n- Seja educado e profissional\n- Ajude o cliente com suas d\u00favidas\n- Se n\u00e3o souber responder, pe\u00e7a desculpas e diga que vai transferir\n- Responda em portugu\u00eas do Brasil\n- N\u00e3o invente informa\u00e7\u00f5es\n
Conhecimento da empresa:\n${knowledge.map(k => `- ${k.title}: ${k.content}`).join('\n') || 'Nenhum conhecimento cadastrado'}`

    // Build message history
    const history = conversation.messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    }))

    // Generate AI response
    const aiResponse = await generateChatResponse(history, systemPrompt)

    // Save AI response
    await prisma.message.create({
      data: { conversationId: conversation.id, role: 'assistant', content: aiResponse.content }
    })

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() }
    })

    // Update customer
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
