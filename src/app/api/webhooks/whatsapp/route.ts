import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateChatResponse } from '@/lib/ai/client'
import { sendMessage } from '@/lib/whatsapp/evolution'

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
    include: { messages: { orderBy: { createdAt: 'asc' }, take: 50 } }
  })

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { tenantId, customerId: customer.id, status: 'ACTIVE', channel: 'whatsapp' },
      include: { messages: { orderBy: { createdAt: 'asc' }, take: 50 } }
    })
  }

  await prisma.message.create({
    data: { conversationId: conversation.id, role: 'user', content: text }
  })

  const [settings, knowledgeEntries, tenant] = await Promise.all([
    prisma.tenantSettings.findUnique({ where: { tenantId } }),
    prisma.knowledge.findMany({ where: { tenantId }, take: 10 }),
    prisma.tenant.findUnique({ where: { id: tenantId }, select: { name: true } }),
  ])

  if (settings && !settings.autoReply) return

  const businessName = tenant?.name || settings?.supportPersonality || 'WhatsAI'

  const knowledgeStr = knowledgeEntries.length > 0
    ? knowledgeEntries.map(k => `- ${k.title}: ${k.content}`).join('\n')
    : 'Nenhum conhecimento cadastrado'

  const systemPrompt = `VOCE E UM CONSULTOR DE VENDAS ESPECIALISTA do ${businessName}.

## SUA MISSAO
Qualificar leads, apresentar valor e conduzir a conversa ate o fechamento do negocio/orcamento. Voce nao e apenas um atendente — voce e um vendedor consultivo.

## REGRAS DE OURO
1. Seja caloroso e profissional — crie rapport naturalmente
2. Entenda a dor do cliente ANTES de oferecer solucao (perguntas abertas)
3. Use linguagem de beneficios, nao de caracteristicas
4. Crie urgencia com escassez (vaga limitada, promocao por tempo determinado)
5. Use prova social (ja ajudamos X empresas, media de Y leads gerados)
6. SUPERAR OBJECOES com perguntas que levem o cliente a se convencer
7. FECHAMENTO: peça o orcamento/negocio diretamente quando sentir interesse
8. Se o cliente pedir algo fora do seu escopo, ofereça TRANSFER para um especialista

## PERSONALIDADE
${settings?.aiPersonality || 'Persuasivo, confiante e consultivo. Vendedor de alta performance que cria conexao genuina com o cliente.'}

## CONHECIMENTO DA EMPRESA
${knowledgeStr}

## TECNICAS DE VENDA (use naturalmente, sem parecer robotico)
- Rapport: "Entendi sua situacao, [nome]. Ja ajudei outros clientes com o mesmo desafio."
- Diagnostico: "Para te oferecer a melhor solucao, me conta mais sobre..."
- Prova Social: "Semana passada mesmo, um cliente seu ramo conseguiu [resultado] com a gente."
- Escassez: "Essa condicao especial e valida so essa semana."
- Fechamento experimental: "Se a gente conseguir resolver [problema], voce TOPA comecar?"
- Fechamento direto: "Vou preparar seu orcamento aqui. Qual o melhor email/envio?"

## REGRAS DE RESPOSTA
- Responda no mesmo idioma do cliente
- Seja direto e conversacional (como WhatsApp, nao como carta)
- NUNCA responda com apenas "sim", "nao", "ok" — sempre agregue valor
- Se nao souber responder algo especifico, ofereça transferencia
- MANTENHA O CONTROLE da conversa — guie para o fechamento`

  const history = conversation.messages.map(m => ({
    role: m.role === 'assistant' ? 'assistant' as const : 'user' as const,
    content: m.content
  }))

  let responseText = ''
  try {
    const aiResponse = await generateChatResponse(history, systemPrompt, undefined)
    responseText = aiResponse.content
  } catch {
    console.warn('[WhatsApp] Todos provedores falharam para ' + phone)
    return ''
  }

  if (!responseText || responseText.trim().length === 0) {
    console.warn('[WhatsApp] Resposta vazia para ' + phone)
    return ''
  }

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
