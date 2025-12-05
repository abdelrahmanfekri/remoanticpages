import { openai } from '@ai-sdk/openai'
import { generateText, streamText, generateObject } from 'ai'

const DEFAULT_MODEL = 'gpt-4o-mini'
const ADVANCED_MODEL = 'gpt-4o'

export interface AIClientConfig {
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

export class AIClient {
  private model: string
  private temperature: number
  private maxTokens: number

  constructor(config: AIClientConfig = {}) {
    this.model = config.model || DEFAULT_MODEL
    this.temperature = config.temperature ?? 0.7
    this.maxTokens = config.maxTokens || 2000
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    try {
      const messages: Array<{ role: 'system' | 'user'; content: string }> = []
      
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt })
      }
      
      messages.push({ role: 'user', content: prompt })

      const { text } = await generateText({
        model: openai(this.model),
        messages,
        temperature: this.temperature,
        maxTokens: this.maxTokens,
      })

      return text
    } catch (error) {
      console.error('AI text generation error:', error)
      throw new Error('Failed to generate text')
    }
  }

  async generateJSON<T>(
    prompt: string,
    schema: any,
    systemPrompt?: string
  ): Promise<T> {
    try {
      const messages: Array<{ role: 'system' | 'user'; content: string }> = []
      
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt })
      }
      
      messages.push({ role: 'user', content: prompt })

      const { object } = await generateObject({
        model: openai(this.model),
        schema,
        messages,
        temperature: this.temperature,
      })

      return object as T
    } catch (error) {
      console.error('AI JSON generation error:', error)
      throw new Error('Failed to generate structured output')
    }
  }

  async streamText(prompt: string, systemPrompt?: string) {
    try {
      const messages: Array<{ role: 'system' | 'user'; content: string }> = []
      
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt })
      }
      
      messages.push({ role: 'user', content: prompt })

      return streamText({
        model: openai(this.model),
        messages,
        temperature: this.temperature,
        maxTokens: this.maxTokens,
      })
    } catch (error) {
      console.error('AI stream generation error:', error)
      throw new Error('Failed to stream text')
    }
  }

  setModel(model: string) {
    this.model = model
  }

  setTemperature(temperature: number) {
    this.temperature = Math.max(0, Math.min(2, temperature))
  }

  setMaxTokens(tokens: number) {
    this.maxTokens = tokens
  }

  useAdvancedModel() {
    this.model = ADVANCED_MODEL
  }

  useDefaultModel() {
    this.model = DEFAULT_MODEL
  }
}

export function createAIClient(config?: AIClientConfig): AIClient {
  return new AIClient(config)
}

export function getModelForTier(tier: 'free' | 'pro' | 'lifetime'): string {
  switch (tier) {
    case 'pro':
    case 'lifetime':
      return ADVANCED_MODEL
    case 'free':
    default:
      return DEFAULT_MODEL
  }
}

