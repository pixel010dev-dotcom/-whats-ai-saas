import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateChatResponse } from '@/lib/ai/client'
import { sendMessage } from '@/lib/whatsapp/evolution'

function isValidResponse(content: string): boolean {
  const trimmed = content.trim()
  if (!trimmed || trimmed.length < 3) return false
  return true
}

async function processMessage(instanceName: string, remoteJid: string, text: string, tenantId: string) {
  const phone = remoteJid.replace('@s.whatsapp.net', '').replace(/\D/g, '')

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
    include: { messages: { orderBy: { createdAt: 'asc' }, take: 30 } }
  })

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { tenantId, customerId: customer.id, status: 'ACTIVE', channel: 'whatsapp' },
      include: { messages: { orderBy: { createdAt: 'asc' }, take: 30 } }
    })
  }

  await prisma.message.create({
    data: { conversationId: conversation.id, role: 'user', content: text }
  })

  const [settings, knowledgeEntries] = await Promise.all([
    prisma.tenantSettings.findUnique({ where: { tenantId } }),
    prisma.knowledge.findMany({ where: { tenantId }, take: 10 })
  ])

  if (settings && !settings.autoReply) return

  const knowledgeStr = knowledgeEntries.length > 0
    ? knowledgeEntries.map(k => `- ${k.title}: ${k.content}`).join('\n')
    : 'Nenhum conhecimento cadastrado'

  const systemPrompt = `Você é UM SER HUMANO que trabalha no atendimento da empresa — nunca diga que é IA, robô ou assistente virtual.

Personalidade: ${settings?.aiPersonality || 'Educado, profissional e amigável'}

REGRAS:
1. CONHECIMENTO é sua única fonte de verdade. SEMPRE responda usando o CONHECIMENTO abaixo.
2. Se o cliente perguntar algo (preço, como funciona, plano, etc.), RESPONDA DIRETO com a informação do conhecimento. NÃO pergunte "como posso ajudar", NÃO enrole.
3. Apenas cumprimente se a MENSAGEM FOR SÓ UMA SAUDAÇÃO (oi, olá, bom dia). Se veio pergunta junto, responda a pergunta primeiro.
4. Máximo de 3 frases curtas. Linguagem natural de WhatsApp.
5. Se não tiver a informação no conhecimento: "Vou verificar com o responsável e já te respondo"
6. NUNCA repita informação já dita. NUNCA invente.

CONHECIMENTO DA EMPRESA (use isso pra responder TUDO):
${knowledgeStr}`

  const history = conversation.messages.map(m => ({
    role: m.role === 'assistant' ? 'assistant' as const : 'user' as const,
    content: m.content
  }))

  const aiResponse = await generateChatResponse(history, systemPrompt, 400)
  const responseText = isValidResponse(aiResponse.content) ? aiResponse.content : 'Olá! Como posso ajudar?'

  await prisma.message.create({
    data: { conversationId: conversation.id, role: 'assistant', content: responseText }
  })

  await sendMessage(instanceName, remoteJid, responseText)

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { lastMessageAt: new Date() }
  })

  await prisma.customer.update({
    where: { id: customer.id },
    data: { lastContact: new Date() }
  })

  return responseText
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const event = body.event || ''
    const instanceName = body.instanceName || body.instance
    const data = body.data
    if (!instanceName || event !== 'messages.upsert' || data?.key?.fromMe) {
      return NextResponse.json({ success: true, ignored: true })
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
    const text = data.message?.conversation || data.message?.extendedTextMessage?.text || ''

    if (!text) {
      return NextResponse.json({ success: true })
    }

    const responseText = await processMessage(instanceName, remoteJid, text, tenantId)
    return NextResponse.json({ success: true, response: responseText })
  } catch (err) {
    const msg = err instanceof Error ? err.stack || err.message : String(err)
    console.error('WhatsApp webhook error:', msg)
    return NextResponse.json({ error: 'internal error', detail: msg }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const cronSecret = searchParams.get('secret')
    if (cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const instanceName = searchParams.get('instanceName')
    if (!instanceName) {
      return NextResponse.json({ error: 'instanceName required' }, { status: 400 })
    }

    const wa = await prisma.whatsApp.findFirst({ where: { instanceName } })
    if (!wa) {
      return NextResponse.json({ error: 'instance not found' }, { status: 404 })
    }

    const tenantId = wa.tenantId

    const conversations = await prisma.conversation.findMany({
      where: { tenantId, status: 'ACTIVE' },
      include: {
        customer: true,
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    })

    const pending: string[] = []
    for (const conv of conversations) {
      const lastMsg = conv.messages[0]
      if (!lastMsg || lastMsg.role !== 'user') continue

      const phone = conv.customer?.phone
      if (!phone) continue
      const remoteJid = phone.includes('@') ? phone : `${phone}@s.whatsapp.net`

      try {
        const text = lastMsg.content
        await processMessage(instanceName, remoteJid, text, tenantId)
        pending.push(phone)
      } catch (err) {
        console.error(`Reply-pending error for ${phone}:`, err)
      }
    }

    return NextResponse.json({ success: true, replied: pending.length, phones: pending })
  } catch (err) {
    console.error('Reply-pending error:', err)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}

