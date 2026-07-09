import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateChatResponse } from '@/lib/ai/client'
import { sendMessage } from '@/lib/whatsapp/evolution'

export async function POST(req: Request) {
  try {
    const { message, slug, customerName, customerPhone } = await req.json()
    
    if (!message || !slug) {
      return NextResponse.json({ error: 'message and slug required' }, { status: 400 })
    }

    const tenant = await prisma.tenant.findUnique({ where: { slug } })
    if (!tenant) {
      return NextResponse.json({ error: 'tenant not found' }, { status: 404 })
    }

    const tenantId = tenant.id

    let customer = null
    if (customerPhone) {
      customer = await prisma.customer.upsert({
        where: { phone_tenantId: { phone: customerPhone, tenantId } },
        update: { name: customerName || undefined },
        create: { tenantId, phone: customerPhone, name: customerName || 'Visitante' }
      })
    }

    let conversation = await prisma.conversation.findFirst({
      where: { tenantId, customerId: customer?.id, status: { not: 'CLOSED' } },
      include: { messages: { orderBy: { createdAt: 'asc' }, take: 50 } }
    })

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { tenantId, customerId: customer?.id, status: 'ACTIVE', channel: 'whatsapp' },
        include: { messages: { orderBy: { createdAt: 'asc' }, take: 50 } }
      })
    }

    await prisma.message.create({
      data: { conversationId: conversation.id, role: 'user', content: message }
    })

    const [settings, knowledgeEntries] = await Promise.all([
      prisma.tenantSettings.findUnique({ where: { tenantId } }),
      prisma.knowledge.findMany({ where: { tenantId }, take: 10 })
    ])

    if (!settings?.supportActive) {
      return NextResponse.json({ error: 'Support not available' }, { status: 503 })
    }

    const knowledgeStr = knowledgeEntries?.length
      ? knowledgeEntries.map(k => '- ' + k.title + ': ' + k.content).join('\n')
      : 'Nenhum conhecimento cadastrado'

    const systemPrompt = `VOCE E UM CONSULTOR DE SUPORTE ESPECIALISTA do WhatsAI.

## SUA MISSAO
Resolver problemas do cliente com excelencia e transformar cada contato em oportunidade de negocio. Voce e a ponte entre o suporte e as vendas.

## REGRAS DE OURO
1. Seja caloroso e paciente — o cliente pode estar frustrado
2. RESOLVA o problema de forma rapida e completa
3. Aproveite para oferecer solucoes que gerem valor (upgrade, plano superior)
4. Se nao souber resolver, inicie com [TRANSFER]
5. Deixe o cliente satisfeito e aberto a futuras ofertas

## PERSONALIDADE
${settings?.supportPersonality || settings?.aiPersonality || 'Prestativo, paciente e consultivo. Resolve problemas com maestria e identifica oportunidades de negocio.'}

## CONHECIMENTO DA EMPRESA
${knowledgeStr}

## REGRAS DE RESPOSTA
- Responda no idioma do cliente
- Seja direto e pratico
- NUNCA deixe o cliente sem resposta — se nao souber, [TRANSFER]`

    const history = conversation.messages.map(m => ({
      role: m.role === 'assistant' ? 'assistant' as const : 'user' as const,
      content: m.content
    }))

    let aiResponse: { content: string; model: string; provider: string }
    try {
      aiResponse = await generateChatResponse(history, systemPrompt, undefined)
    } catch {
      console.warn('[Support] Todos provedores falharam')
      return NextResponse.json({
        success: false,
        response: 'Desculpe, estou com instabilidade no momento. Tente novamente em instantes.',
        conversationId: conversation.id
      })
    }

    const supportPhone = settings?.supportPhone
    const needsTransfer = aiResponse.content.startsWith('[TRANSFER]') && supportPhone && settings?.supportActive

    const responseContent = needsTransfer
      ? 'Transferindo para um atendente humano...'
      : aiResponse.content

    await prisma.message.create({
      data: { conversationId: conversation.id, role: 'assistant', content: responseContent }
    })

    if (needsTransfer) {
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: new Date(), status: 'WAITING' }
      })

      const wa = await prisma.whatsApp.findFirst({ where: { tenantId } })
      if (wa?.instanceName) {
        const customerInfo = customer ? 'Cliente: ' + (customer.name || '') + ' (' + (customer.phone || '') + ')' : ''
        const msg = '*Novo atendimento - Suporte*\n\n' +
          customerInfo + '\n' +
          '*Mensagem:* ' + message + '\n' +
          '*Contexto:* ' + knowledgeStr.slice(0, 200)
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
      response: responseContent,
      model: aiResponse.model,
      provider: aiResponse.provider,
      conversationId: conversation.id
    })
  } catch (err) {
    console.error('Support error:', err)
    return NextResponse.json({ error: 'Erro ao processar mensagem' }, { status: 500 })
  }
}
