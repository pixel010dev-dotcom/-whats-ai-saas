import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const tenantId = searchParams.get('tenantId')
    if (!tenantId) {
      return NextResponse.json({ error: 'tenantId é obrigatório' }, { status: 400 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [
      totalConversations,
      conversationsToday,
      activeConversations,
      customers,
      messagesToday,
      payments,
    ] = await Promise.all([
      prisma.conversation.count({ where: { tenantId } }),
      prisma.conversation.count({ where: { tenantId, createdAt: { gte: today } } }),
      prisma.conversation.count({ where: { tenantId, status: 'ACTIVE' } }),
      prisma.customer.count({ where: { tenantId } }),
      prisma.message.count({
        where: {
          conversation: { tenantId },
          createdAt: { gte: today },
        },
      }),
      prisma.payment.aggregate({
        where: { tenantId, status: 'APPROVED' },
        _sum: { amount: true },
      }),
    ])

    return NextResponse.json({
      conversationsToday,
      totalConversations,
      activeConversations,
      customers,
      messagesToday,
      revenue: payments._sum.amount || 0,
    })
  } catch (err) {
    console.error('Metrics error:', err)
    return NextResponse.json({ error: 'Erro ao carregar métricas' }, { status: 500 })
  }
}
