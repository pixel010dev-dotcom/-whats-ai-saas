import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { tenantId, autoReply } = await req.json()
    if (!tenantId || typeof autoReply !== 'boolean') {
      return NextResponse.json({ error: 'tenantId e autoReply sao obrigatorios' }, { status: 400 })
    }

    await prisma.tenantSettings.upsert({
      where: { tenantId },
      update: { autoReply },
      create: { tenantId, autoReply },
    })

    return NextResponse.json({ success: true, autoReply })
  } catch (err) {
    console.error('Toggle AI error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
