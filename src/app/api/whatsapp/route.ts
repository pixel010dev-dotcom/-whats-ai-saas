import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createInstance, createInstanceWithNumber, getQRCode, getPairingCode, getInstanceStatus, disconnectInstance, fetchInstances } from '@/lib/whatsapp/evolution'

async function checkSubscription(tenantId: string): Promise<boolean> {
  const sub = await prisma.subscription.findUnique({ where: { tenantId } })
  return sub?.status === 'ACTIVE'
}

export async function POST(req: Request) {
  try {
    const { action, tenantId } = await req.json()
    if (!tenantId) {
      return NextResponse.json({ error: 'tenantId é obrigatório' }, { status: 400 })
    }

    if (action === 'connect' || action === 'connect-pairing') {
      const hasActiveSub = await checkSubscription(tenantId)
      if (!hasActiveSub) {
        return NextResponse.json({ error: 'Assinatura inativa. Acesse /dashboard/planos para pagar.', status: 'SUBSCRIPTION_REQUIRED' }, { status: 402 })
      }
    }

    if (action === 'connect') {
      let wa = await prisma.whatsApp.findFirst({ where: { tenantId } })
      const instanceName = `wa-${tenantId.slice(0, 8)}`

      if (!wa) {
        wa = await prisma.whatsApp.create({
          data: { tenantId, instanceName, status: 'CREATING' },
        })
      }

      try {
        await createInstance({ instanceName })
        const qrData = await getQRCode(instanceName)
        await prisma.whatsApp.update({
          where: { id: wa.id },
          data: { status: 'WAITING_QR', qrCode: qrData?.qrcode || '' },
        })
        return NextResponse.json({
          success: true,
          qrcode: qrData?.qrcode || '',
          instanceName,
          status: 'WAITING_QR',
        })
      } catch (err) {
        console.error('WhatsApp create error:', err)
        return NextResponse.json({ error: 'Erro ao criar instância WhatsApp' }, { status: 500 })
      }
    }

    if (action === 'connect-pairing') {
      const { number } = await req.json()
      if (!number) {
        return NextResponse.json({ error: 'Número de telefone é obrigatório' }, { status: 400 })
      }

      let wa = await prisma.whatsApp.findFirst({ where: { tenantId } })
      const instanceName = `wa-${tenantId.slice(0, 8)}`

      if (!wa) {
        wa = await prisma.whatsApp.create({
          data: { tenantId, instanceName, status: 'CREATING' },
        })
      }

      try {
        await createInstanceWithNumber({ instanceName, number })
        const pairData = await getPairingCode(instanceName, number)
        await prisma.whatsApp.update({
          where: { id: wa.id },
          data: { status: 'WAITING_QR', qrCode: null },
        })
        return NextResponse.json({
          success: true,
          pairingCode: pairData?.pairingCode || '',
          instanceName,
          status: 'PAIRING',
        })
      } catch (err) {
        console.error('WhatsApp pairing error:', err)
        return NextResponse.json({ error: 'Erro ao gerar código de pareamento' }, { status: 500 })
      }
    }

    if (action === 'status') {
      const wa = await prisma.whatsApp.findFirst({ where: { tenantId } })
      if (!wa || !wa.instanceName) {
        return NextResponse.json({ status: 'DISCONNECTED' })
      }
      try {
        const statusData = await getInstanceStatus(wa.instanceName)
        const waStatus = statusData?.state || 'DISCONNECTED'
        await prisma.whatsApp.update({
          where: { id: wa.id },
          data: { status: waStatus },
        })
        return NextResponse.json({ status: waStatus, instanceName: wa.instanceName })
      } catch {
        return NextResponse.json({ status: wa.status })
      }
    }

    if (action === 'disconnect') {
      const wa = await prisma.whatsApp.findFirst({ where: { tenantId } })
      if (wa?.instanceName) {
        await disconnectInstance(wa.instanceName).catch(() => {})
      }
      if (wa) {
        await prisma.whatsApp.update({
          where: { id: wa.id },
          data: { status: 'DISCONNECTED', qrCode: null },
        })
      }
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
  } catch (err) {
    console.error('WhatsApp API error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
