import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateChatResponse } from '@/lib/ai/client'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { instanceName, data } = body
    if (!instanceName || !data?.message?.fromMe === false) {
      return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
    }

    const wa = await prisma.whatsApp.findFirst({ where: { instanceName } })
    if (!wa) {
      return NextResponse.json({ error: 'instance not found' }, { status: 404 })
    }

    const tenantId = wa.tenantId

    const sub = await prisma.subscription.findUnique({ where: { tenantId } })
    if (!sub || sub.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'subscription inactive' }, { status: 402 })
    }
    const remoteJid = data.key?.remoteJid || ''
    const phone = remoteJid.replace('@s.whatsapp.net', '').replace(/\D/g, '')
    const text = data.message?.conversation || data.message?.extendedTextMessage?.text || ''

    if (!text) {
      return NextResponse.json({ success: true })
    }

    let customer = await prisma.customer.findFirst({
      where: { tenantId, phone }
    })

    if (!customer) {
      customer = await prisma.customer.create({
        data: { tenantId, phone, name: 'Cliente WhatsApp' }
      })
    }

    let conversation = await prisma.conversation.findFirst({
      where: { tenantId, customerId: customer.id, status: { not: 'CLOSED' } },
      include: { messages: { orderBy: { createdAt: 'asc' }, take: 10 } }
    })

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { tenantId, customerId: customer.id, status: 'ACTIVE', channel: 'whatsapp' },
        include: { messages: { orderBy: { createdAt: 'asc' }, take: 10 } }
      })
    }

    await prisma.message.create({
      data: { conversationId: conversation.id, role: 'user', content: text }
    })

    const [settings, knowledgeEntries] = await Promise.all([
      prisma.tenantSettings.findUnique({ where: { tenantId } }),
      prisma.knowledge.findMany({ where: { tenantId }, take: 5 })
    ])

    const knowledgeStr = knowledgeEntries.length > 0
      ? knowledgeEntries.map(k => `- ${k.title}: ${k.content}`).join('\n')
      : 'Nenhum conhecimento cadastrado'

    const systemPrompt = `Você é um atendente digital da empresa.\nPersonalidade: ${settings?.aiPersonality || 'Educado, profissional e amigável'}\n\nRegras:\n- Seja educado e profissional\n- Ajude o cliente com suas dúvidas\n- Se não souber responder, peça desculpas e diga que vai transferir\n- Responda em português do Brasil\n- Não invente informações\n\nConhecimento da empresa:\n${knowledgeStr}`

    const history = conversation.messages.map(m => ({
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

    await prisma.customer.update({
      where: { id: customer.id },
      data: { lastContact: new Date() }
    })

    return NextResponse.json({ success: true, response: aiResponse.content })
  } catch (err) {
    console.error('WhatsApp webhook error:', err)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
