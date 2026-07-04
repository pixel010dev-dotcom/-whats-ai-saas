import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateChatResponse } from '@/lib/ai/client'
import { sendMessage } from '@/lib/whatsapp/evolution'

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

    if (settings && !settings.autoReply) {
      return NextResponse.json({ success: true, autoReply: false })
    }

    const knowledgeStr = knowledgeEntries.length > 0
      ? knowledgeEntries.map(k => `- ${k.title}: ${k.content}`).join('\n')
      : 'Nenhum conhecimento cadastrado'

    const systemPrompt = `Você é um atendente da empresa — uma pessoa real que trabalha no atendimento.

Personalidade: ${settings?.aiPersonality || 'Educado, profissional e amigável'}

REGRAS (siga todas):
1. FALE COMO HUMANO — nunca diga que é IA, assistente virtual ou robô. Se perguntarem, diga que é um atendente.
2. SEJA NATURAL — use linguagem coloquial, igual brasileiro conversa no WhatsApp.
3. RESPOSTAS CURTAS — máximo 2 a 3 frases. Cliente não quer textão.
4. SEJA DIRETO — se perguntaram preço, endereço, horário, responda o valor/fato direto.
5. NÃO REPITA — mantenha o contexto da conversa, não pergunte algo que já foi respondido.
6. SE NÃO SOUBER — responda "Vou verificar com o responsável e já te respondo".
7. NÃO INVENTE — use apenas as informações do conhecimento abaixo.

Conhecimento da empresa:
${knowledgeStr}`

    const history = conversation.messages.map(m => ({
      role: m.role === 'assistant' ? 'assistant' as const : 'user' as const,
      content: m.content
    }))

    const aiResponse = await generateChatResponse(history, systemPrompt, 250)

    await prisma.message.create({
      data: { conversationId: conversation.id, role: 'assistant', content: aiResponse.content }
    })

    await sendMessage(instanceName, remoteJid, aiResponse.content)

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
    const msg = err instanceof Error ? err.stack || err.message : String(err)
    console.error('WhatsApp webhook error:', msg)
    return NextResponse.json({ error: 'internal error', detail: msg }, { status: 500 })
  }
}

