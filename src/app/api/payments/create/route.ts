import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createPixPayment } from '@/lib/mercadopago'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { tenantId, plan, period } = body

    if (!tenantId) {
      return NextResponse.json({ error: 'tenantId é obrigatório' }, { status: 400 })
    }

    const amount = 29.90

    // Busca tenant para pegar dados do usuário
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: { users: { take: 1 } },
    })

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
    }

    const user = tenant.users[0]
    const name = user?.name || 'Cliente'
    const email = user?.email || 'cliente@email.com'

    // Cria pagamento PIX
    const pixResult = await createPixPayment({
      amount,
      description: `WhatsAI - Plano ${plan}`,
      email,
      name,
      externalReference: tenantId,
    })

    // Salva no banco
    const payment = await prisma.payment.create({
      data: {
        tenantId,
        amount,
        currency: 'BRL',
        status: 'PENDING',
        method: 'PIX',
        mpPaymentId: String(pixResult.id),
      },
    })

    return NextResponse.json({
      payment: {
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
        method: payment.method,
        qrCode: pixResult.point_of_interaction?.transaction_data?.qr_code || '',
        qrCodeBase64: pixResult.point_of_interaction?.transaction_data?.qr_code_base64 || '',
        copyPaste: pixResult.point_of_interaction?.transaction_data?.qr_code || '',
        ticketUrl: pixResult.point_of_interaction?.transaction_data?.ticket_url || '',
      },
    }, { status: 201 })
  } catch (err) {
    console.error('Payment create error:', err)
    return NextResponse.json({ error: 'Erro ao criar pagamento' }, { status: 500 })
  }
}
