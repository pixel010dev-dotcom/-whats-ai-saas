// Evolution API Integration

const EVOLUTION_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080'
const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY || ''

interface EvolutionAPIConfig {
  instanceName: string
  token?: string
}

async function api(instance: string, endpoint: string, options: RequestInit = {}) {
  const url = `${EVOLUTION_URL}/instance${endpoint}/${instance}`
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'apiKey': EVOLUTION_KEY,
      ...options.headers
    }
  })
  if (!res.ok) throw new Error(`Evolution API: ${res.status}`)
  return res.json()
}

export async function createInstance(config: EvolutionAPIConfig) {
  const res = await fetch(`${EVOLUTION_URL}/instance/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apiKey': EVOLUTION_KEY
    },
    body: JSON.stringify({
      instanceName: config.instanceName,
      token: config.token || config.instanceName,
      integration: 'WHATSAPP-BAILEYS',
      qrcode: true,
      alwaysOnline: true,
      readMessages: true,
      readStatus: true
    })
  })
  if (!res.ok) throw new Error(`Evolution create: ${res.status}`)
  return res.json()
}

export async function getQRCode(instanceName: string) {
  const url = `${EVOLUTION_URL}/instance/connect/${instanceName}`
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'apiKey': EVOLUTION_KEY }
  })
  if (!res.ok && res.status === 404) {
    return { base64: '', count: 0 }
  }
  if (!res.ok) throw new Error(`Evolution API: ${res.status}`)
  return res.json()
}

export async function createInstanceWithNumber(config: EvolutionAPIConfig & { number: string }) {
  const res = await fetch(`${EVOLUTION_URL}/instance/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apiKey': EVOLUTION_KEY
    },
    body: JSON.stringify({
      instanceName: config.instanceName,
      token: config.token || config.instanceName,
      integration: 'WHATSAPP-BAILEYS',
      qrcode: false,
      number: config.number,
      alwaysOnline: true,
      readMessages: true,
      readStatus: true
    })
  })
  if (!res.ok) throw new Error(`Evolution create: ${res.status}`)
  return res.json()
}

export async function getPairingCode(instanceName: string, number: string) {
  const url = `${EVOLUTION_URL}/instance/connect/${instanceName}?number=${number}`
  const res = await fetch(url, {
    headers: { 'apiKey': EVOLUTION_KEY }
  })
  if (!res.ok) throw new Error(`Evolution API: ${res.status}`)
  return res.json()
}

export async function sendMessage(instanceName: string, to: string, text: string) {
  const phone = to.replace(/\D/g, '')
  const url = `${EVOLUTION_URL}/message/sendText/${instanceName}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apiKey': EVOLUTION_KEY
    },
    body: JSON.stringify({ number: phone, text, delay: 1000 })
  })
  if (!res.ok) throw new Error(`Evolution API: ${res.status}`)
  return res.json()
}

export async function sendImage(instanceName: string, to: string, imageUrl: string, caption?: string) {
  const phone = to.replace(/\D/g, '')
  const url = `${EVOLUTION_URL}/message/sendMedia/${instanceName}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apiKey': EVOLUTION_KEY
    },
    body: JSON.stringify({ number: phone, media: imageUrl, caption: caption || '' })
  })
  if (!res.ok) throw new Error(`Evolution API: ${res.status}`)
  return res.json()
}

export async function fetchInstances() {
  const url = process.env.EVOLUTION_API_URL || 'http://localhost:8080'
  const apiKey = process.env.EVOLUTION_API_KEY || ''
  const res = await fetch(`${url}/instance/fetchInstances`, {
    headers: { 'apiKey': apiKey }
  })
  if (!res.ok) throw new Error(`Evolution API: ${res.status}`)
  return res.json()
}

export async function disconnectInstance(instanceName: string) {
  const url = `${EVOLUTION_URL}/instance/delete/${instanceName}`
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { 'apiKey': EVOLUTION_KEY }
  })
  if (!res.ok) throw new Error(`Evolution API: ${res.status}`)
  return res.json()
}

export async function getInstanceStatus(instanceName: string) {
  return api(instanceName, '/connectionState')
}

export async function setSettings(instanceName: string) {
  const url = `${EVOLUTION_URL}/settings/set/${instanceName}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apiKey': EVOLUTION_KEY
    },
    body: JSON.stringify({
      alwaysOnline: true,
      readMessages: true,
      readStatus: true,
      rejectCall: false,
      groupsIgnore: false,
      syncFullHistory: false,
    })
  })
  if (!res.ok) throw new Error(`Evolution API: ${res.status}`)
  return res.json()
}

export async function setWebhook(instanceName: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://whatsai-app-production.up.railway.app'
  const url = `${EVOLUTION_URL}/webhook/set/${instanceName}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apiKey': EVOLUTION_KEY
    },
    body: JSON.stringify({
      webhook: {
        enabled: true,
        url: `${appUrl}/api/webhooks/whatsapp`,
        webhook_by_events: false,
        webhook_base64: false,
        events: ['MESSAGES_UPSERT'],
      }
    })
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Evolution API: ${res.status} ${text}`)
  }
  return res.json()
}
