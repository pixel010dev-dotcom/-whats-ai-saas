// Mercado Pago Integration

const MP_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN || ''
const API_URL = 'https://api.mercadopago.com'

interface CreatePreferenceParams {
  title: string
  description: string
  amount: number
  quantity?: number
  payerEmail?: string
  externalReference?: string
  autoReturn?: string
  backUrls?: { success: string; failure: string; pending: string }
}

interface CreateSubscriptionParams {
  planId?: string
  payerEmail: string
  cardTokenId?: string
  externalReference?: string
}

function idempotencyKey() {
  return crypto.randomUUID()
}

async function api(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
      'X-Idempotency-Key': idempotencyKey(),
      ...options.headers
    }
  })
  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Mercado Pago API error: ${res.status} - ${error}`)
  }
  return res.json()
}

export async function createPaymentPreference(params: CreatePreferenceParams) {
  const body = {
    items: [{
      title: params.title,
      description: params.description,
      quantity: params.quantity || 1,
      currency_id: 'BRL',
      unit_price: params.amount
    }],
    payer: params.payerEmail ? { email: params.payerEmail } : undefined,
    external_reference: params.externalReference,
    auto_return: params.autoReturn || 'approved',
    back_urls: params.backUrls || {
      success: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      failure: `${process.env.NEXT_PUBLIC_APP_URL}/register`,
      pending: `${process.env.NEXT_PUBLIC_APP_URL}/register`
    },
    payment_methods: {
      excluded_payment_types: [],
      installments: 12
    }
  }

  return api('/checkout/preferences', {
    method: 'POST',
    body: JSON.stringify(body)
  })
}

export async function createSubscription(params: CreateSubscriptionParams) {
  const body = {
    auto_recurring: {
      frequency: 1,
      frequency_type: 'months',
      billing_day: 1,
      billing_day_proportional: true,
      transaction_amount: params.planId === 'premium' ? 297 : params.planId === 'profissional' ? 197 : 97,
      currency_id: 'BRL'
    },
    payer_email: params.payerEmail,
    external_reference: params.externalReference
  }

  return api('/preapproval', {
    method: 'POST',
    body: JSON.stringify(body)
  })
}

export async function getPayment(id: string) {
  return api(`/v1/payments/${id}`)
}

export async function getSubscription(id: string) {
  return api(`/preapproval/${id}`)
}

export async function cancelSubscription(id: string) {
  return api(`/preapproval/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status: 'cancelled' })
  })
}

export async function createPixPayment(params: {
  amount: number
  description: string
  email: string
  name: string
  externalReference?: string
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://whatsai-app-production.up.railway.app'
  const body = {
    transaction_amount: params.amount,
    description: params.description,
    payment_method_id: 'pix',
    payer: {
      email: params.email,
      first_name: params.name.split(' ')[0],
      last_name: params.name.split(' ').slice(1).join(' ') || params.name
    },
    external_reference: params.externalReference,
    notification_url: `${appUrl}/api/webhooks/mercadopago`
  }

  return api('/v1/payments', {
    method: 'POST',
    body: JSON.stringify(body)
  })
}
