import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Prisma, ConversationStatus } from '@prisma/client'

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const tenantId = searchParams.get('tenantId')
    const secret = searchParams.get('secret')
    if (!tenantId || secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    await prisma.message.deleteMany({ where: { conversation: { tenantId } } })
    await prisma.conversation.deleteMany({ where: { tenantId } })
    await prisma.customer.deleteMany({ where: { tenantId } })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Conversations DELETE error:', err)
    return NextResponse.json({ error: 'Erro ao limpar conversas' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const tenantId = searchParams.get('tenantId')
    if (!tenantId) {
      return NextResponse.json({ error: 'tenantId é obrigatório' }, { status: 400 })
    }

    const rawStatus = searchParams.get('status')
    const status = rawStatus && ['ACTIVE', 'WAITING', 'CLOSED', 'TRANSFERRED'].includes(rawStatus)
      ? rawStatus as ConversationStatus
      : undefined
    const where: Prisma.ConversationWhereInput = { tenantId }
    if (status) where.status = status

    const conversations = await prisma.conversation.findMany({
      where,
      include: {
        customer: true,
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { lastMessageAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({
      conversations: conversations.map(c => ({
        id: c.id,
        customerName: c.customer?.name || 'Cliente',
        customerPhone: c.customer?.phone || '',
        lastMessage: c.messages[0]?.content || '',
        status: c.status,
        createdAt: c.createdAt.toISOString(),
        lastMessageAt: c.lastMessageAt.toISOString(),
      })),
    })
  } catch (err) {
    console.error('Conversations error:', err)
    return NextResponse.json({ error: 'Erro ao carregar conversas' }, { status: 500 })
  }
}
