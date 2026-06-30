import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const tenantId = searchParams.get('tenantId')
    if (!tenantId) {
      return NextResponse.json({ error: 'tenantId é obrigatório' }, { status: 400 })
    }

    const search = searchParams.get('search') || ''

    const where: { tenantId: string; OR?: { name?: object; phone?: object; email?: object }[] } = { tenantId }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    const customers = await prisma.customer.findMany({
      where,
      orderBy: { lastContact: 'desc' },
      take: 100,
    })

    return NextResponse.json({
      customers: customers.map(c => ({
        id: c.id,
        name: c.name || 'Sem nome',
        phone: c.phone || '',
        email: c.email || '',
        totalSpent: c.totalSpent,
        totalOrders: c.totalOrders,
        lastContact: c.lastContact?.toISOString() || '',
      })),
    })
  } catch (err) {
    console.error('Customers error:', err)
    return NextResponse.json({ error: 'Erro ao carregar clientes' }, { status: 500 })
  }
}
