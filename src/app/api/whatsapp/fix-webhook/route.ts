import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { setWebhook } from '@/lib/whatsapp/evolution'

export async function POST() {
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
