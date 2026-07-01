import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const tenantId = searchParams.get('tenantId')
    if (!tenantId) {
      return NextResponse.json({ error: 'tenantId é obrigatório' }, { status: 400 })
    }

    const days = 30
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    startDate.setHours(0, 0, 0, 0)

    const [convs, payments] = await Promise.all([
      prisma.conversation.findMany({
        where: { tenantId, createdAt: { gte: startDate } },
        select: { createdAt: true },
      }),
      prisma.payment.findMany({
        where: { tenantId, status: 'APPROVED', createdAt: { gte: startDate } },
        select: { amount: true, createdAt: true },
      }),
    ])

    const conversations: { date: string; count: number }[] = []
    const revenue: { date: string; amount: number }[] = []

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      const convCount = convs.filter(c => c.createdAt.toISOString().split('T')[0] === dateStr).length
      const revAmount = payments
        .filter(p => p.createdAt.toISOString().split('T')[0] === dateStr)
        .reduce((sum, p) => sum + p.amount, 0)
      conversations.push({ date: dateStr, count: convCount })
      revenue.push({ date: dateStr, amount: revAmount })
    }

    return NextResponse.json({ conversations, revenue })
  } catch (err) {
    console.error('Timeline error:', err)
    return NextResponse.json({ error: 'Erro ao carregar timeline' }, { status: 500 })
  }
}
