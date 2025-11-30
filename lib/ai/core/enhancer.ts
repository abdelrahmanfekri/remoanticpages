import { createAIClient, getModelForTier } from './client'
import { BLOCK_DEFINITIONS } from '@/lib/blocks/definitions'
import type { BlockContent, BlockType } from '@/types'
import type { Tier } from '@/lib/tiers'

export interface EnhancementInput {
  blockType: BlockType
  field: string
  currentContent: string
  context?: {
    pageTitle?: string
    recipientName?: string
    occasion?: string
    tone?: 'formal' | 'casual' | 'romantic' | 'playful'
  }
}

export interface EnhancementSuggestions {
  original: string
  suggestions: string[]
  reasoning?: string
}

export class ContentEnhancer {
  private client: ReturnType<typeof createAIClient>

  constructor(tier: Tier = 'free') {
    const model = getModelForTier(tier)
    this.client = createAIClient({ model, temperature: 0.8, maxTokens: 500 })
  }

  async enhanceText(input: EnhancementInput): Promise<string[]> {
    const systemPrompt = this.buildSystemPrompt(input.blockType, input.field)
    const userPrompt = this.buildUserPrompt(input)

    try {
      const result = await this.client.generateText(userPrompt, systemPrompt)
      
      const suggestions = result
        .split('\n')
        .filter((line) => line.trim().startsWith('-') || line.trim().match(/^\d+\./))
        .map((line) => line.replace(/^[-\d.]\s*/, '').trim())
        .filter((s) => s.length > 0)
        .slice(0, 3)

      if (suggestions.length === 0) {
        return [result.trim()]
      }

      return suggestions
    } catch (error) {
      console.error('Enhancement error:', error)
      throw new Error('Failed to enhance content')
    }
  }

  async improveClarity(text: string): Promise<string> {
    const systemPrompt = `You are an expert editor. Improve the clarity and flow of the given text while maintaining its meaning and tone. Keep it concise.`
    
    const userPrompt = `Improve this text:\n\n"${text}"\n\nReturn ONLY the improved version, no explanations.`

    try {
      return await this.client.generateText(userPrompt, systemPrompt)
    } catch (error) {
      console.error('Clarity improvement error:', error)
      throw new Error('Failed to improve text')
    }
  }

  async expandText(text: string, targetLength: 'short' | 'medium' | 'long' = 'medium'): Promise<string> {
    const lengthGuide = {
      short: '2-3 sentences',
      medium: '4-5 sentences',
      long: '1-2 paragraphs'
    }

    const systemPrompt = `You are an expert writer. Expand the given text to be more detailed and engaging while maintaining its tone and message.`
    
    const userPrompt = `Expand this text to ${lengthGuide[targetLength]}:\n\n"${text}"\n\nReturn ONLY the expanded version, no explanations.`

    try {
      return await this.client.generateText(userPrompt, systemPrompt)
    } catch (error) {
      console.error('Text expansion error:', error)
      throw new Error('Failed to expand text')
    }
  }

  async makeMorePersonal(text: string, recipientName: string): Promise<string> {
    const systemPrompt = `You are an expert at writing personal, heartfelt messages.`
    
    const userPrompt = `Make this text more personal and heartfelt for someone named ${recipientName}:\n\n"${text}"\n\nReturn ONLY the improved version, no explanations.`

    try {
      return await this.client.generateText(userPrompt, systemPrompt)
    } catch (error) {
      console.error('Personalization error:', error)
      throw new Error('Failed to personalize text')
    }
  }

  async adjustTone(text: string, tone: 'formal' | 'casual' | 'romantic' | 'playful'): Promise<string> {
    const toneDescriptions = {
      formal: 'formal and elegant',
      casual: 'casual and friendly',
      romantic: 'romantic and passionate',
      playful: 'playful and fun'
    }

    const systemPrompt = `You are an expert writer skilled at adjusting tone.`
    
    const userPrompt = `Rewrite this text in a ${toneDescriptions[tone]} tone:\n\n"${text}"\n\nReturn ONLY the rewritten version, no explanations.`

    try {
      return await this.client.generateText(userPrompt, systemPrompt)
    } catch (error) {
      console.error('Tone adjustment error:', error)
      throw new Error('Failed to adjust tone')
    }
  }

  private buildSystemPrompt(blockType: BlockType, field: string): string {
    const blockDef = BLOCK_DEFINITIONS[blockType]
    const fieldDef = blockDef?.contentSchema[field]

    let prompt = `You are an expert content writer specializing in personalized pages for special occasions.\n\n`
    
    if (blockDef) {
      prompt += `Block Type: ${blockDef.label}\n`
      prompt += `Description: ${blockDef.description}\n\n`
    }

    if (fieldDef) {
      prompt += `Field: ${fieldDef.label}\n`
      if (fieldDef.placeholder) {
        prompt += `Placeholder: ${fieldDef.placeholder}\n`
      }
    }

    prompt += `\nYour task: Generate 3 alternative versions of the content that are:\n`
    prompt += `- More engaging and heartfelt\n`
    prompt += `- Appropriate for the context\n`
    prompt += `- Natural and authentic\n`
    prompt += `- Similar in length to the original\n\n`
    prompt += `Format: Return 3 suggestions, one per line, starting with "- " or numbered.`

    return prompt
  }

  private buildUserPrompt(input: EnhancementInput): string {
    let prompt = `Current content: "${input.currentContent}"\n\n`

    if (input.context) {
      prompt += `Context:\n`
      if (input.context.pageTitle) prompt += `- Page title: ${input.context.pageTitle}\n`
      if (input.context.recipientName) prompt += `- Recipient: ${input.context.recipientName}\n`
      if (input.context.occasion) prompt += `- Occasion: ${input.context.occasion}\n`
      if (input.context.tone) prompt += `- Desired tone: ${input.context.tone}\n`
      prompt += `\n`
    }

    prompt += `Generate 3 improved alternatives for this content.`

    return prompt
  }

  setTier(tier: Tier) {
    const model = getModelForTier(tier)
    this.client.setModel(model)
  }
}

export function createContentEnhancer(tier: Tier = 'free'): ContentEnhancer {
  return new ContentEnhancer(tier)
}

