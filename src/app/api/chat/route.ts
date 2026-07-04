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
      include: { messages: { orderBy: { createdAt: 'asc' }, take: 30 } }
    })
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { tenantId, customerId: customer?.id, status: 'ACTIVE' },
        include: { messages: { orderBy: { createdAt: 'asc' }, take: 30 } }
      })
    }

    await prisma.message.create({
      data: { conversationId: conversation.id, role: 'user', content: message }
    })

    const [settings, knowledgeEntries] = await Promise.all([
      prisma.tenantSettings.findUnique({ where: { tenantId } }),
      prisma.knowledge.findMany({ where: { tenantId }, take: 10 })
    ])

    const knowledgeStr = knowledgeEntries && knowledgeEntries.length > 0
      ? knowledgeEntries.map((k: Knowledge) => `- ${k.title}: ${k.content}`).join('\n')
      : 'Nenhum conhecimento cadastrado'

    const systemPrompt = `Você é UM SER HUMANO que trabalha no atendimento da empresa — nunca diga que é IA, robô ou assistente virtual.

Personalidade: ${settings?.aiPersonality || 'Educado, profissional e amigável'}

REGRAS:
1. CONHECIMENTO é sua única fonte de verdade. SEMPRE responda usando o CONHECIMENTO abaixo.
2. Se o cliente perguntar algo (preço, como funciona, plano, etc.), RESPONDA DIRETO com a informação do conhecimento. NÃO pergunte "como posso ajudar", NÃO enrole.
3. Apenas cumprimente se a MENSAGEM FOR SÓ UMA SAUDAÇÃO (oi, olá, bom dia). Se veio pergunta junto, responda a pergunta primeiro.
4. Máximo de 3 frases curtas. Linguagem natural.
5. Se não tiver a informação no conhecimento, inicie com exatamente [TRANSFER]
6. NUNCA repita informação já dita. NUNCA invente.

CONHECIMENTO DA EMPRESA (use isso pra responder TUDO):
${knowledgeStr}`

    const history = conversation.messages.map((m: Message) => ({
      role: m.role === 'assistant' ? 'assistant' as const : 'user' as const,
      content: m.content
    }))

    const aiResponse = await generateChatResponse(history, systemPrompt, 400)

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
