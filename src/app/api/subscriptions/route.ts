import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const tenantId = searchParams.get('tenantId')
    if (!tenantId) {
      return NextResponse.json({ error: 'tenantId é obrigatório' }, { status: 400 })
    }

    const subscription = await prisma.subscription.findUnique({
      where: { tenantId },
    })

    if (!subscription) {
      return NextResponse.json({ subscription: null })
    }

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart?.toISOString() || null,
        currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() || null,
        cancelAt: subscription.cancelAt?.toISOString() || null,
        mpId: subscription.mpId,
      },
    })
  } catch (err) {
    console.error('Subscription error:', err)
    return NextResponse.json({ error: 'Erro ao carregar assinatura' }, { status: 500 })
  }
}

// Cancelar assinatura
export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const { tenantId } = body
    if (!tenantId) {
      return NextResponse.json({ error: 'tenantId é obrigatório' }, { status: 400 })
    }

    await prisma.subscription.update({
      where: { tenantId },
      data: { status: 'CANCELLED', cancelAt: new Date() },
    })

    await prisma.tenant.update({
      where: { id: tenantId },
      data: { status: 'TRIAL' },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Subscription cancel error:', err)
    return NextResponse.json({ error: 'Erro ao cancelar assinatura' }, { status: 500 })
  }
}
