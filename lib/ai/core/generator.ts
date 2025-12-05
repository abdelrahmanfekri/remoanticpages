import { createAIClient, getModelForTier } from './client'
import { BLOCK_DEFINITIONS } from '@/lib/blocks/definitions'
import type { BlockData, PageTheme, BlockType } from '@/types'
import type { Tier } from '@/lib/tiers'
import { z } from 'zod'

export interface PageGenerationInput {
  prompt: string
  occasion?: string
  recipientName?: string
  userTier: Tier
  specificBlocks?: BlockType[]
}

export interface GeneratedPage {
  title: string
  recipientName: string
  theme: PageTheme
  blocks: BlockData[]
  reasoning?: string
}

const BlockSchema = z.object({
  type: z.enum([
    'hero',
    'intro',
    'text',
    'quote',
    'gallery',
    'video',
    'timeline',
    'memories',
    'countdown',
    'two-column',
    'testimonials',
    'map',
    'divider',
    'spacer',
    'button',
    'social-links',
    'final-message',
  ]),
  content: z.record(z.any()),
  settings: z.record(z.any()).optional(),
})

const GeneratedPageSchema = z.object({
  title: z.string(),
  recipientName: z.string(),
  theme: z.object({
    primaryColor: z.string(),
    secondaryColor: z.string(),
    fontFamily: z.string(),
    backgroundColor: z.string().optional(),
  }),
  blocks: z.array(BlockSchema),
  reasoning: z.string().optional(),
})

export class PageGenerator {
  private client: ReturnType<typeof createAIClient>

  constructor(tier: Tier = 'free') {
    const model = getModelForTier(tier)
    this.client = createAIClient({ model, temperature: 0.8 })
  }

  async generatePage(input: PageGenerationInput): Promise<GeneratedPage> {
    const systemPrompt = this.buildSystemPrompt()
    const userPrompt = this.buildUserPrompt(input)

    try {
      const result = await this.client.generateJSON<GeneratedPage>(
        userPrompt,
        GeneratedPageSchema,
        systemPrompt
      )

      const blocksWithIds = result.blocks.map((block, index) => ({
        ...block,
        id: `${block.type}-${Date.now()}-${index}`,
        order: index,
        settings: block.settings || {},
      }))

      return {
        ...result,
        blocks: blocksWithIds as BlockData[],
      }
    } catch (error) {
      console.error('Page generation error:', error)
      throw new Error('Failed to generate page')
    }
  }

  private buildSystemPrompt(): string {
    const blockDescriptions = Object.values(BLOCK_DEFINITIONS)
      .map(
        (block) =>
          `- ${block.type}: ${block.description} (${block.isPremium ? 'Premium' : 'Free'})`
      )
      .join('\n')

    return `You are an expert page designer specializing in creating beautiful, personalized pages for special occasions.

# Available Block Types:
${blockDescriptions}

# Your Task:
Create a complete page configuration based on the user's prompt. The page should:
1. Have an appropriate title and recipient name
2. Use a cohesive color theme that matches the occasion
3. Include 4-8 relevant blocks arranged in a logical flow
4. Fill in realistic, heartfelt content for each block
5. Match the tone and style to the occasion

# Block Structure Guidelines:
- Always start with a 'hero' block
- Include an 'intro' block early on
- Use 'gallery' or 'memories' blocks for photo-based occasions
- Add 'timeline' for relationship milestones
- End with a 'final-message' block
- Use 'divider' or 'spacer' blocks for visual separation

# Content Guidelines:
- Make text warm, personal, and heartfelt
- Use the recipient's name naturally
- Keep paragraphs concise (2-4 sentences)
- Match formality to the occasion
- Avoid generic phrases

# Theme Guidelines:
- Birthday: Warm, vibrant colors (pinks, purples, oranges)
- Anniversary: Romantic colors (roses, purples, golds)
- Wedding: Elegant colors (golds, whites, soft pastels)
- Valentine's: Red, pink, romantic
- General celebration: Bright, joyful colors

Return ONLY valid JSON matching the schema. Do not include explanations outside the JSON.`
  }

  private buildUserPrompt(input: PageGenerationInput): string {
    const { prompt, occasion, recipientName, userTier, specificBlocks } = input

    let userPrompt = `Create a personalized page with the following details:\n\n`
    userPrompt += `User's request: "${prompt}"\n\n`

    if (occasion) {
      userPrompt += `Occasion: ${occasion}\n`
    }

    if (recipientName) {
      userPrompt += `Recipient name: ${recipientName}\n`
    }

    userPrompt += `User tier: ${userTier}\n`

    if (specificBlocks && specificBlocks.length > 0) {
      userPrompt += `\nRequired blocks: ${specificBlocks.join(', ')}\n`
    }

    if (userTier === 'free') {
      userPrompt += `\nNote: User is on free tier - only use free blocks (avoid premium features like video, countdown, testimonials, map)\n`
    }

    userPrompt += `\nGenerate a complete page configuration that fulfills this request. Be creative and personal!`

    return userPrompt
  }

  setTier(tier: Tier) {
    const model = getModelForTier(tier)
    this.client.setModel(model)
  }
}

export function createPageGenerator(tier: Tier = 'free'): PageGenerator {
  return new PageGenerator(tier)
}

