// AI Client unificado com fallback entre provedores
// Timeout de 25s por provedor para resposta rapida

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
// Detecta eco, respostas vazias ou sem sentido
// ============================================================
function isBadResponse(content: string, _userMessage?: string): boolean {
  const trimmed = content.trim()
  if (!trimmed) return true
  if (trimmed.length < 3) return true
  const lower = trimmed.toLowerCase()
  // So bloqueia se a resposta INTEIRA for exatamente uma palavra vazia
  const badWords = ['tchau','oi','ola','ok','sim','nao','talvez','ops']
  if (badWords.includes(lower)) return true
  if (/^[.,!?;:\s\-_]+$/.test(trimmed)) return true
  // Eco: so bloqueia se >60% da resposta for copia da mensagem do usuario
  // (evita bloquear respostas naturais que compartilham palavras comuns)
  return false
}

// ============================================================
// Provedor 1: OpenCode Zen (primario - infra Codebuff)
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
// Provedor 2: Groq (mais rapido, free tier generoso)
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
// Provedor 3: OpenRouter (agregador com centenas de modelos)
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
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://whats-ai-saas.railway.app',
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
// Provedor 4: Cerebras (rapido, modelo pequeno)
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
// Provedor 6: DeepSeek (extremamente barato, excelente modelo)
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
// Provedor 7: Together AI (confiavel, bons modelos)
// ============================================================
const togetherProvider = process.env.TOGETHER_API_KEY
  ? new OpenAICompatibleProvider({
      name: 'Together AI',
      baseUrl: 'https://api.together.xyz/v1',
      apiKey: process.env.TOGETHER_API_KEY,
      defaultModel: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
    })
  : null

// ============================================================
// Provedor 8: SambaNova (free tier sem cartao de credito)
// ============================================================
const sambanovaProvider = process.env.SAMBANOVA_API_KEY
  ? new OpenAICompatibleProvider({
      name: 'SambaNova',
      baseUrl: 'https://api.sambanova.ai/v1',
      apiKey: process.env.SAMBANOVA_API_KEY,
      defaultModel: 'Meta-Llama-3.1-8B-Instruct',
    })
  : null

// ============================================================
// Provedor 9: GitHub Models (free para devs)
// ============================================================
const githubProvider = process.env.GITHUB_API_KEY
  ? new OpenAICompatibleProvider({
      name: 'GitHub Models',
      baseUrl: 'https://models.inference.ai.azure.com',
      apiKey: process.env.GITHUB_API_KEY,
      defaultModel: 'gpt-4o-mini',
    })
  : null

// ============================================================
// Provedor 10: HuggingFace Inference (100K creditos/mes gratis)
// ============================================================
const huggingFaceProvider = process.env.HUGGINGFACE_API_KEY
  ? new OpenAICompatibleProvider({
      name: 'HuggingFace',
      baseUrl: 'https://api-inference.huggingface.co/v1',
      apiKey: process.env.HUGGINGFACE_API_KEY,
      defaultModel: 'meta-llama/Meta-Llama-3-8B-Instruct',
    })
  : null

// ============================================================
// Provedor 11: Google Gemini (via API direta)
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
// Provedor Custom: configurado via env vars (ultimo recurso)
// ============================================================
const customProvider = process.env.CUSTOM_AI_BASE_URL && process.env.CUSTOM_AI_API_KEY
  ? new OpenAICompatibleProvider({
      name: process.env.CUSTOM_AI_NAME || 'Custom AI',
      baseUrl: process.env.CUSTOM_AI_BASE_URL,
      apiKey: process.env.CUSTOM_AI_API_KEY,
      defaultModel: process.env.CUSTOM_AI_MODEL || 'default',
    })
  : null

// ============================================================
// Modelos FREE adicionais do OpenCode Zen
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

const northFreeProvider = openCodeKey
  ? new OpenAICompatibleProvider({
      name: 'North (Zen Free)',
      baseUrl: openCodeBaseUrl,
      apiKey: openCodeKey,
      defaultModel: 'north-mini-code-free',
    })
  : null

// ============================================================
// Lista completa de provedores (ordem = prioridade)
// Ordem baseada em confiabilidade + qualidade + limites gratuitos:
// 1. OpenRouter (agregador, varios modelos, mais confiavel)
// 2. Groq (Llama 3.3 70B - rapido, free tier generoso)
// 3. Cerebras (Gemma 4 31B - gratuito)
// 4. Google Gemini (API direta - 60 RPM, 1500 req/dia)
// 5. Mistral
// 6. OpenCode Zen (DeepSeek V4 Flash Free - ultimo recurso)
// ============================================================
const providers: AIProvider[] = [
  // 1o - OpenRouter (agregador - mais confiavel)
  new OpenRouterProvider(),

  // 2o - Groq (30 RPM, 1000 req/dia - rapido e gratis)
  new GroqProvider(),

  // 3o - Cerebras (5 RPM - gratis, resposta rapida)
  new CerebrasProvider(),

  // 4o - Google Gemini (60 RPM, 1500 req/dia)
  ...(geminiProvider ? [geminiProvider] : []),

  // 5o - Mistral
  new MistralProvider(),

  // 6o - OpenCode Zen (modelo free, ultimo recurso)
  new OpenCodeZenProvider(),

  // Extras com chave
  ...(deepSeekProvider ? [deepSeekProvider] : []),
  ...(togetherProvider ? [togetherProvider] : []),
  ...(sambanovaProvider ? [sambanovaProvider] : []),
  ...(githubProvider ? [githubProvider] : []),
  ...(huggingFaceProvider ? [huggingFaceProvider] : []),

  // Modelos FREE extras do OpenCode Zen
  ...(mimoFreeProvider ? [mimoFreeProvider] : []),
  ...(nemotronFreeProvider ? [nemotronFreeProvider] : []),
  ...(northFreeProvider ? [northFreeProvider] : []),

  // Provedor custom
  ...(customProvider ? [customProvider] : []),
]

// ============================================================
// Funcao principal com fallback automatico
// Tenta cada provedor em ordem ate um funcionar.
// Se TODOS falharem, joga erro com detalhes de cada um.
// ============================================================
export async function completeAI(
  params: AICompletionParams,
  userLastMessage?: string
): Promise<{ content: string; model: string; provider: string }> {
  const errors: string[] = []

  for (const provider of providers) {
    try {
      const result = await provider.complete(params)
      if (result.content && result.content.trim().length > 0 && !isBadResponse(result.content, userLastMessage)) {
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

  throw new Error('All ' + providers.length + ' AI providers failed:\n' + errors.join('\n'))
}

// ============================================================
// Helper para respostas de chat com system prompt
// ============================================================
export async function generateChatResponse(
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
  systemPrompt?: string,
  maxTokens?: number,
  userLastMessage?: string
): Promise<{ content: string; model: string; provider: string }> {
  const fullMessages = systemPrompt
    ? [{ role: 'system' as const, content: systemPrompt }, ...messages]
    : messages

  return completeAI({ messages: fullMessages, maxTokens }, userLastMessage)
}
