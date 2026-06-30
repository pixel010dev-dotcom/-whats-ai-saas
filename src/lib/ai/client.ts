// AI Client unificado com fallback entre provedores

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

class OpenCodeZenProvider implements AIProvider {
  name = 'OpenCode Zen'
  private baseUrl = process.env.OPENCODE_ZEN_BASE_URL || 'https://opencode.ai/zen/v1'
  private apiKey = process.env.OPENCODE_ZEN_API_KEY || ''

  async complete(params: AICompletionParams) {
    const model = params.model || 'deepseek/deepseek-v4-flash'
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: params.messages,
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens ?? 1000
      })
    })
    if (!res.ok) throw new Error(`OpenCode Zen: ${res.status}`)
    const data = await res.json()
    return { content: data.choices[0].message.content, model }
  }
}

class OpenRouterProvider implements AIProvider {
  name = 'OpenRouter'
  private baseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'
  private apiKey = process.env.OPENROUTER_API_KEY || ''

  async complete(params: AICompletionParams) {
    const model = params.model || 'google/gemini-2.0-flash-001'
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://whats-ai-saas.railway.app',
        'X-Title': 'WhatsAI'
      },
      body: JSON.stringify({
        model,
        messages: params.messages,
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens ?? 1000
      })
    })
    if (!res.ok) throw new Error(`OpenRouter: ${res.status}`)
    const data = await res.json()
    return { content: data.choices[0].message.content, model }
  }
}

class GroqProvider implements AIProvider {
  name = 'Groq'
  private baseUrl = 'https://api.groq.com/openai/v1'
  private apiKey = process.env.GROQ_API_KEY || ''

  async complete(params: AICompletionParams) {
    const model = params.model || 'llama-3.3-70b-versatile'
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: params.messages,
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens ?? 1000
      })
    })
    if (!res.ok) throw new Error(`Groq: ${res.status}`)
    const data = await res.json()
    return { content: data.choices[0].message.content, model }
  }
}

class CerebrasProvider implements AIProvider {
  name = 'Cerebras'
  private baseUrl = 'https://api.cerebras.ai/v1'
  private apiKey = process.env.CEREBRAS_API_KEY || ''

  async complete(params: AICompletionParams) {
    const model = params.model || 'llama3.1-8b'
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: params.messages,
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens ?? 1000
      })
    })
    if (!res.ok) throw new Error(`Cerebras: ${res.status}`)
    const data = await res.json()
    return { content: data.choices[0].message.content, model }
  }
}

class MistralProvider implements AIProvider {
  name = 'Mistral'
  private baseUrl = 'https://api.mistral.ai/v1'
  private apiKey = process.env.MISTRAL_API_KEY || ''

  async complete(params: AICompletionParams) {
    const model = params.model || 'mistral-small-latest'
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: params.messages,
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens ?? 1000
      })
    })
    if (!res.ok) throw new Error(`Mistral: ${res.status}`)
    const data = await res.json()
    return { content: data.choices[0].message.content, model }
  }
}

const providers: AIProvider[] = [
  new OpenCodeZenProvider(),
  new OpenRouterProvider(),
  new GroqProvider(),
  new CerebrasProvider(),
  new MistralProvider()
]

export async function completeAI(params: AICompletionParams): Promise<{ content: string; model: string; provider: string }> {
  const errors: string[] = []
  
  for (const provider of providers) {
    try {
      const result = await provider.complete(params)
      return { ...result, provider: provider.name }
    } catch (err) {
      errors.push(`${provider.name}: ${err instanceof Error ? err.message : 'unknown error'}`)
      console.warn(`[AI Fallback] ${provider.name} failed, trying next...`)
    }
  }
  
  throw new Error(`All AI providers failed:\n${errors.join('\n')}`)
}

export async function generateChatResponse(
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
  systemPrompt?: string
): Promise<{ content: string; model: string; provider: string }> {
  const fullMessages = systemPrompt
    ? [{ role: 'system' as const, content: systemPrompt }, ...messages]
    : messages
  
  return completeAI({ messages: fullMessages })
}
