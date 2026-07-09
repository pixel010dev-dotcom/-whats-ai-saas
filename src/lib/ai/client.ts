// AI Client unificado com fallback entre provedores
// Timeout de 25s por provedor para resposta rapida
// Ordem: mais confiavel primeiro, ultimo recurso OpenCode Zen Free

interface AICompletionParams {
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[]
  temperature?: number
  maxTokens?: number
  model?: string
}

interface AIProvider {
  name: string
  complete(params: AICompletionParams): Promise<{ content: string; model: string }>
}

// ============================================================
// Classe base reutilizavel para provedores OpenAI-compativeis
// ============================================================
class OpenAICompatibleProvider implements AIProvider {
  name: string
  private baseUrl: string
  private apiKey: string
  private defaultModel: string
  private extraHeaders: Record<string, string>

  constructor(config: {
    name: string
    baseUrl: string
    apiKey: string
    defaultModel: string
    extraHeaders?: Record<string, string>
  }) {
    this.name = config.name
    this.baseUrl = config.baseUrl.replace(/\/+$/, '')
    this.apiKey = config.apiKey
    this.defaultModel = config.defaultModel
    this.extraHeaders = config.extraHeaders || {}
  }

  async complete(params: AICompletionParams) {
    const model = params.model || this.defaultModel
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 25000)

    try {
      const body: Record<string, unknown> = {
        model,
        messages: params.messages,
        temperature: params.temperature ?? 0.7,
      }
      if (params.maxTokens !== undefined) body.max_tokens = params.maxTokens
      const res = await fetch(this.baseUrl + '/chat/completions', {
        signal: controller.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.apiKey,
          ...this.extraHeaders,
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(this.name + ': ' + res.status + ' ' + res.statusText)
      const data = await res.json()
      return { content: data.choices[0].message.content, model }
    } finally {
      clearTimeout(timeout)
    }
  }
}

// ============================================================
// Validador de respostas ruins
// ============================================================
function isBadResponse(content: string): boolean {
  const trimmed = content.trim()
  if (!trimmed) return true
  if (trimmed.length < 3) return true
  const lower = trimmed.toLowerCase()
  const badWords = ['tchau','oi','ola','ok','sim','nao','talvez','ops']
  if (badWords.includes(lower)) return true
  if (/^[.,!?;:\s\-_]+$/.test(trimmed)) return true
  return false
}

// ============================================================
// Provedor 1: OpenRouter (agregador, mais confiavel)
// Modelo: Gemini 2.5 Flash (gratuito, excelente qualidade)
// ============================================================
class OpenRouterProvider implements AIProvider {
  name = 'OpenRouter'
  private baseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'
  private apiKey = process.env.OPENROUTER_API_KEY || ''

  async complete(params: AICompletionParams) {
    const model = params.model || 'google/gemini-2.5-flash'
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 25000)

    try {
      const body: Record<string, unknown> = {
        model,
        messages: params.messages,
        temperature: params.temperature ?? 0.7,
      }
      if (params.maxTokens !== undefined) body.max_tokens = params.maxTokens
      const res = await fetch(this.baseUrl + '/chat/completions', {
        signal: controller.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.apiKey,
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://whatsai-app-production.up.railway.app',
          'X-Title': 'WhatsAI',
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('OpenRouter: ' + res.status)
      const data = await res.json()
      return { content: data.choices[0].message.content, model }
    } finally {
      clearTimeout(timeout)
    }
  }
}

// ============================================================
// Provedor 2: Groq (mais rapido, free tier generoso)
// Modelo: Llama 3.3 70B
// ============================================================
class GroqProvider implements AIProvider {
  name = 'Groq'
  private baseUrl = 'https://api.groq.com/openai/v1'
  private apiKey = process.env.GROQ_API_KEY || ''

  async complete(params: AICompletionParams) {
    const model = params.model || 'llama-3.3-70b-versatile'
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 25000)

    try {
      const body: Record<string, unknown> = {
        model,
        messages: params.messages,
        temperature: params.temperature ?? 0.7,
      }
      if (params.maxTokens !== undefined) body.max_tokens = params.maxTokens
      const res = await fetch(this.baseUrl + '/chat/completions', {
        signal: controller.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.apiKey,
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Groq: ' + res.status)
      const data = await res.json()
      return { content: data.choices[0].message.content, model }
    } finally {
      clearTimeout(timeout)
    }
  }
}

// ============================================================
// Provedor 3: Cerebras (gratuito, resposta rapida)
// Modelo: Gemma 4 31B
// ============================================================
class CerebrasProvider implements AIProvider {
  name = 'Cerebras'
  private baseUrl = 'https://api.cerebras.ai/v1'
  private apiKey = process.env.CEREBRAS_API_KEY || ''

  async complete(params: AICompletionParams) {
    const model = params.model || 'gemma-4-31b'
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 25000)

    try {
      const body: Record<string, unknown> = {
        model,
        messages: params.messages,
        temperature: params.temperature ?? 0.7,
      }
      if (params.maxTokens !== undefined) body.max_tokens = params.maxTokens
      const res = await fetch(this.baseUrl + '/chat/completions', {
        signal: controller.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.apiKey,
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Cerebras: ' + res.status)
      const data = await res.json()
      return { content: data.choices[0].message.content, model }
    } finally {
      clearTimeout(timeout)
    }
  }
}

// ============================================================
// Provedor 4: Google Gemini (via API direta)
// Modelo: Gemini 2.0 Flash
// ============================================================
const geminiProvider = process.env.GEMINI_API_KEY
  ? new OpenAICompatibleProvider({
      name: 'Google Gemini',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
      apiKey: process.env.GEMINI_API_KEY,
      defaultModel: 'gemini-2.0-flash',
    })
  : null

// ============================================================
// Provedor 5: Mistral (bom modelo open-source)
// ============================================================
class MistralProvider implements AIProvider {
  name = 'Mistral'
  private baseUrl = 'https://api.mistral.ai/v1'
  private apiKey = process.env.MISTRAL_API_KEY || ''

  async complete(params: AICompletionParams) {
    const model = params.model || 'mistral-small-latest'
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 25000)

    try {
      const body: Record<string, unknown> = {
        model,
        messages: params.messages,
        temperature: params.temperature ?? 0.7,
      }
      if (params.maxTokens !== undefined) body.max_tokens = params.maxTokens
      const res = await fetch(this.baseUrl + '/chat/completions', {
        signal: controller.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.apiKey,
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Mistral: ' + res.status)
      const data = await res.json()
      return { content: data.choices[0].message.content, model }
    } finally {
      clearTimeout(timeout)
    }
  }
}

// ============================================================
// Provedor 6: OpenCode Zen (DeepSeek V4 Flash Free - 100% gratis)
// ============================================================
class OpenCodeZenProvider implements AIProvider {
  name = 'OpenCode Zen'
  private baseUrl = process.env.OPENCODE_ZEN_BASE_URL || 'https://opencode.ai/zen/v1'
  private apiKey = process.env.OPENCODE_ZEN_API_KEY || ''

  async complete(params: AICompletionParams) {
    const model = params.model || 'deepseek-v4-flash-free'
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 25000)

    try {
      const body: Record<string, unknown> = {
        model,
        messages: params.messages,
        temperature: params.temperature ?? 0.7,
      }
      if (params.maxTokens !== undefined) body.max_tokens = params.maxTokens
      const res = await fetch(this.baseUrl + '/chat/completions', {
        signal: controller.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.apiKey,
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('OpenCode Zen: ' + res.status)
      const data = await res.json()
      return { content: data.choices[0].message.content, model }
    } finally {
      clearTimeout(timeout)
    }
  }
}

// ============================================================
// Provedor 7: DeepSeek (chave dedicada, bom modelo)
// ============================================================
const deepSeekProvider = process.env.DEEPSEEK_API_KEY
  ? new OpenAICompatibleProvider({
      name: 'DeepSeek',
      baseUrl: 'https://api.deepseek.com/v1',
      apiKey: process.env.DEEPSEEK_API_KEY,
      defaultModel: 'deepseek-chat',
    })
  : null

// ============================================================
// Modelos FREE extras do OpenCode Zen (ultimos recursos)
// ============================================================
const openCodeBaseUrl = process.env.OPENCODE_ZEN_BASE_URL || 'https://opencode.ai/zen/v1'
const openCodeKey = process.env.OPENCODE_ZEN_API_KEY

const mimoFreeProvider = openCodeKey
  ? new OpenAICompatibleProvider({
      name: 'Mimo (Zen Free)',
      baseUrl: openCodeBaseUrl,
      apiKey: openCodeKey,
      defaultModel: 'mimo-v2.5-free',
    })
  : null

const nemotronFreeProvider = openCodeKey
  ? new OpenAICompatibleProvider({
      name: 'Nemotron (Zen Free)',
      baseUrl: openCodeBaseUrl,
      apiKey: openCodeKey,
      defaultModel: 'nemotron-3-ultra-free',
    })
  : null

// ============================================================
// Lista de provedores (ordem = prioridade)
// ============================================================
const providers: AIProvider[] = [
  // 1o - OpenRouter (mais confiavel, Gemini 2.5 Flash)
  new OpenRouterProvider(),

  // 2o - Groq (rapido, free tier generoso)
  new GroqProvider(),

  // 3o - Cerebras (gratuito, resposta rapida)
  new CerebrasProvider(),

  // 4o - Google Gemini (via API direta)
  ...(geminiProvider ? [geminiProvider] : []),

  // 5o - Mistral
  new MistralProvider(),

  // 6o - OpenCode Zen (DeepSeek V4 Flash Free)
  new OpenCodeZenProvider(),

  // 7o - DeepSeek (chave dedicada)
  ...(deepSeekProvider ? [deepSeekProvider] : []),

  // Modelos FREE extras do OpenCode Zen (ultimo recurso)
  ...(mimoFreeProvider ? [mimoFreeProvider] : []),
  ...(nemotronFreeProvider ? [nemotronFreeProvider] : []),
]

// ============================================================
// Funcao principal com fallback automatico
// ============================================================
export async function completeAI(
  params: AICompletionParams
): Promise<{ content: string; model: string; provider: string }> {
  const errors: string[] = []

  for (const provider of providers) {
    try {
      const result = await provider.complete(params)
      if (result.content && result.content.trim().length > 0 && !isBadResponse(result.content)) {
        return { ...result, provider: provider.name }
      }
      const reason = !result.content || result.content.trim().length === 0
        ? 'resposta vazia'
        : 'resposta ruim (eco/tchau)'
      errors.push(provider.name + ': ' + reason)
      console.warn('[AI Fallback] ' + provider.name + ' retornou ' + reason + ', tentando proximo...')
    } catch (err) {
      if (err instanceof Object && 'name' in err && (err as {name: string}).name === 'AbortError') {
        errors.push(provider.name + ': timeout after 25s')
        console.warn('[AI Fallback] ' + provider.name + ' timed out, trying next...')
      } else {
        errors.push(
          provider.name + ': ' + (err instanceof Error ? err.message : 'unknown error')
        )
        console.warn('[AI Fallback] ' + provider.name + ' failed, trying next...')
      }
    }
  }

  // Se tudo falhar, tenta responder com mensagem amigavel
  console.error('[AI] Todos os ' + providers.length + ' provedores falharam')
  return { content: '', model: 'none', provider: 'none' }
}

// ============================================================
// Helper para respostas de chat com system prompt
// ============================================================
export async function generateChatResponse(
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
  systemPrompt?: string,
  maxTokens?: number
): Promise<{ content: string; model: string; provider: string }> {
  const fullMessages = systemPrompt
    ? [{ role: 'system' as const, content: systemPrompt }, ...messages]
    : messages

  return completeAI({ messages: fullMessages, maxTokens: maxTokens ?? 512 })
}
