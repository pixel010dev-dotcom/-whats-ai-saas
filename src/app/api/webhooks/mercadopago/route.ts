import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPaymentReceipt } from '@/lib/email'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET
    if (!secret) {
      console.warn('[Mercado Pago] WEBHOOK_SECRET not configured, skipping signature verification')
    } else {
      const rawBody = await req.clone().text()
      const signature = req.headers.get('x-signature') || ''
      const [hashPart] = signature.split(',')
      const receivedHash = hashPart?.split('=')[1]
      if (!receivedHash) {
        return NextResponse.json({ error: 'missing signature' }, { status: 401 })
      }
      const expectedHash = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex')
      if (receivedHash !== expectedHash) {
        return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
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

          // Send receipt email
          const tenant = await prisma.tenant.findUnique({
            where: { id: payment.external_reference },
            include: { users: { take: 1 } }
          })
          if (tenant?.users[0]?.email) {
            sendPaymentReceipt({
              to: tenant.users[0].email,
              name: tenant.users[0].name || 'Cliente',
              amount: payment.transaction_amount || 29.90,
              plan: 'WhatsAI - Plano Único',
              paymentMethod: 'PIX',
              tenantSlug: tenant.slug,
            }).catch(() => {})
          }
        }
      }
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
