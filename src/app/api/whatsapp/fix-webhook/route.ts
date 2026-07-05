import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { setWebhook } from '@/lib/whatsapp/evolution'

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const instances = await prisma.whatsApp.findMany({
    where: { instanceName: { not: null }, status: { in: ['CONNECTED', 'open', 'close'] } }
  })

  let fixed = 0
  let errors = 0

  for (const wa of instances) {
    try {
      await setWebhook(wa.instanceName!)
      fixed++
    } catch {
      errors++
    }
  }

  return NextResponse.json({ fixed, errors, total: instances.length })
}
