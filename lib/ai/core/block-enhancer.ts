import { BaseAgent, AgentConfig } from './base-agent'
import { BLOCK_DEFINITIONS } from '@/lib/blocks/definitions'
import { Tier } from '@/lib/tiers'
import type { BlockData, BlockType } from '@/types'
import { z } from 'zod'

export interface BlockEnhancementInput {
  blockType: BlockType
  currentContent: Record<string, any>
  context?: {
    pageTitle?: string
    recipientName?: string
    occasion?: string
    overallTone?: string
  }
}

export interface EnhancementResult {
  suggestions: Array<{
    field: string
    original: string
    enhanced: string
    reasoning: string
  }>
  overallAssessment: string
}

export class BlockEnhancementAgent extends BaseAgent {
  constructor(config: AgentConfig) {
    super(config)
  }

  protected getDefaultTemperature(): number {
    return 0.6
  }

  protected getDefaultMaxTokens(): number {
    return 1500
  }

  async enhanceBlock(input: BlockEnhancementInput): Promise<EnhancementResult> {
    const blockDef = BLOCK_DEFINITIONS[input.blockType]
    if (!blockDef) {
      throw new Error(`Unknown block type: ${input.blockType}`)
    }

    const enhancementSchema = z.object({
      suggestions: z.array(z.object({
        field: z.string(),
        original: z.string(),
        enhanced: z.string(),
        reasoning: z.string(),
      })),
      overallAssessment: z.string(),
    })

    const contentFields = Object.keys(blockDef.contentSchema)
    const currentContentStr = contentFields
      .map(field => `${field}: "${input.currentContent[field] || ''}"`)
      .join('\n')

    const prompt = `Enhance this ${input.blockType} block:

CURRENT CONTENT:
${currentContentStr}

CONTEXT:
${input.context?.pageTitle ? `Page Title: ${input.context.pageTitle}` : ''}
${input.context?.recipientName ? `Recipient: ${input.context.recipientName}` : ''}
${input.context?.occasion ? `Occasion: ${input.context.occasion}` : ''}
${input.context?.overallTone ? `Tone: ${input.context.overallTone}` : ''}

Suggest specific improvements to make this block more engaging, emotional, and personalized.`

    const systemPrompt = `You are an expert content enhancer specializing in emotional, personalized content.

ENHANCEMENT PRINCIPLES:
1. Make content more specific and personal
2. Increase emotional impact and authenticity
3. Improve clarity and flow
4. Add sensory details and vivid language
5. Ensure consistency with overall page tone
6. Keep enhancements natural and authentic

For each field, provide:
- Original text (truncated if long)
- Enhanced version
- Specific reasoning for the improvement

Focus on making the content feel more heartfelt and meaningful.`

    try {
      const result = await this.client.generateJSON<EnhancementResult>(prompt, enhancementSchema, systemPrompt)
      return result
    } catch (error) {
      console.error('Block enhancement error:', error)
      return {
        suggestions: [],
        overallAssessment: 'Unable to generate enhancements at this time.',
      }
    }
  }

  async suggestBlockImprovements(block: BlockData, context?: BlockEnhancementInput['context']): Promise<EnhancementResult> {
    return this.enhanceBlock({
      blockType: block.type,
      currentContent: block.content,
      context,
    })
  }
}

export function createBlockEnhancementAgent(tier: Tier): BlockEnhancementAgent {
  return new BlockEnhancementAgent({ tier })
}
