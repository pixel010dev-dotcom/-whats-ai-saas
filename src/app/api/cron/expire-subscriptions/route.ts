import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const result = await prisma.subscription.updateMany({
      where: {
        status: 'ACTIVE',
        currentPeriodEnd: { lte: new Date() },
      },
      data: { status: 'EXPIRED' },
    })

    if (result.count > 0) {
      const expired = await prisma.subscription.findMany({
        where: { status: 'EXPIRED', currentPeriodEnd: { lte: new Date() } },
        select: { tenantId: true },
      })
      await prisma.tenant.updateMany({
        where: { id: { in: expired.map(s => s.tenantId) } },
        data: { status: 'BLOCKED' },
      })
    }

    return NextResponse.json({ expired: result.count })
  } catch (err) {
    console.error('Cron expire error:', err)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
