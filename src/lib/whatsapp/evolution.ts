// Evolution API Integration

const EVOLUTION_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080'
const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY || ''

interface EvolutionAPIConfig {
  instanceName: string
  token?: string
}

async function api(instance: string, path: string, options: RequestInit = {}) {
  const url = `${EVOLUTION_URL}/instance/${instance}${path}`
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
      qrcode: true
    })
  })
  if (!res.ok) throw new Error(`Evolution create: ${res.status}`)
  return res.json()
}

export async function getQRCode(instanceName: string) {
  return api(instanceName, '/qrcode')
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
      number: config.number
    })
  })
  if (!res.ok) throw new Error(`Evolution create: ${res.status}`)
  return res.json()
}

export async function getPairingCode(instanceName: string, number: string) {
  return api(instanceName, `/connect?number=${number}`)
}

export async function sendMessage(instanceName: string, to: string, text: string) {
  const phone = to.replace(/\D/g, '') + '@s.whatsapp.net'
  return api(instanceName, '/send-message', {
    method: 'POST',
    body: JSON.stringify({
      number: phone,
      text,
      delay: 1000
    })
  })
}

export async function sendImage(instanceName: string, to: string, imageUrl: string, caption?: string) {
  const phone = to.replace(/\D/g, '') + '@s.whatsapp.net'
  return api(instanceName, '/send-image', {
    method: 'POST',
    body: JSON.stringify({
      number: phone,
      image: imageUrl,
      caption: caption || ''
    })
  })
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
  return api(instanceName, '/logout', { method: 'POST' })
}

export async function getInstanceStatus(instanceName: string) {
  return api(instanceName, '/connection-state')
}
