import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET
    if (secret) {
      const rawBody = await req.clone().text()
      const signature = req.headers.get('x-signature') || ''
      const [hashPart] = signature.split(',')
      const receivedHash = hashPart?.split('=')[1]
      if (receivedHash) {
        const expectedHash = crypto
          .createHmac('sha256', secret)
          .update(rawBody)
          .digest('hex')
        if (receivedHash !== expectedHash) {
          return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
        }
      }
    }

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
          const thirtyDays = 30 * 24 * 60 * 60 * 1000
          await prisma.subscription.upsert({
            where: { tenantId: payment.external_reference },
            update: { status: 'ACTIVE', currentPeriodStart: new Date(), currentPeriodEnd: new Date(Date.now() + thirtyDays) },
            create: { tenantId: payment.external_reference, plan: 'UNICO', status: 'ACTIVE', currentPeriodStart: new Date(), currentPeriodEnd: new Date(Date.now() + thirtyDays) },
          })
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
