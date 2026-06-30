import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createInstance, getQRCode, getInstanceStatus, disconnectInstance } from '@/lib/whatsapp/evolution'

export async function POST(req: Request) {
  try {
    const { action, tenantId } = await req.json()
    if (!tenantId) {
      return NextResponse.json({ error: 'tenantId é obrigatório' }, { status: 400 })
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
