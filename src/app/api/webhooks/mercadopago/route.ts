import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action, data } = body
    if (action === 'payment.created' || action === 'payment.updated') {
      const paymentId = data.id
      const payment = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { 'Authorization': 'Bearer ' + process.env.MERCADO_PAGO_ACCESS_TOKEN }
      }).then(r => r.json())
      if (payment.status === 'approved') {
        await prisma.payment.updateMany({ where: { mpPaymentId: String(paymentId) }, data: { status: 'APPROVED', paidAt: new Date() } })
        if (payment.external_reference) {
          await prisma.subscription.updateMany({ where: { tenantId: payment.external_reference }, data: { status: 'ACTIVE' } })
          await prisma.tenant.update({ where: { id: payment.external_reference }, data: { status: 'ACTIVE' } })
        }
      }
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
