import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ error: 'email is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { tenant: { include: { subscriptions: true } } },
    })

    if (!user?.tenantId) {
      return NextResponse.json({ error: 'user or tenant not found' }, { status: 404 })
    }

    const thirtyDays = 30 * 24 * 60 * 60 * 1000

    await prisma.subscription.upsert({
      where: { tenantId: user.tenantId },
      update: {
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + thirtyDays),
      },
      create: {
        tenantId: user.tenantId,
        plan: 'UNICO',
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + thirtyDays),
      },
    })

    await prisma.tenant.update({
      where: { id: user.tenantId },
      data: { status: 'ACTIVE' },
    })

    return NextResponse.json({
      success: true,
      tenantId: user.tenantId,
      email,
      expiresAt: new Date(Date.now() + thirtyDays).toISOString(),
    })
  } catch (err) {
    console.error('Activate subscription error:', err)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
