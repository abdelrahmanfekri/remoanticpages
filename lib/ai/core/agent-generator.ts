import { createAIClient, getModelForTier } from './client'
import { BLOCK_DEFINITIONS } from '@/lib/blocks/definitions'
import type { BlockData, PageTheme, BlockType } from '@/types'
import type { Tier } from '@/lib/tiers'
import { z } from 'zod'
import { GeneratedBlockSchema } from '@/lib/ai/schemas/output'

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

export interface GenerationStep {
  step: string
  status: 'pending' | 'in_progress' | 'completed' | 'error'
  message: string
  progress: number
}

export type GenerationCallback = (steps: GenerationStep[]) => void

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

export class AIPageGeneratorAgent {
  private client: ReturnType<typeof createAIClient>
  private steps: GenerationStep[] = []
  private callback?: GenerationCallback

  constructor(tier: Tier = 'free') {
    const model = getModelForTier(tier)
    this.client = createAIClient({ model, temperature: 0.8, maxTokens: 4000 })
  }

  async generatePageWithProgress(
    input: PageGenerationInput,
    callback?: GenerationCallback
  ): Promise<GeneratedPage> {
    this.callback = callback
    this.initializeSteps()

    try {
      this.updateStep('analyze', 'in_progress', 'Analyzing your prompt and requirements...')
      await this.simulateDelay(800)

      const analysisResult = await this.analyzePrompt(input)
      this.updateStep('analyze', 'completed', 'Prompt analyzed successfully')

      this.updateStep('theme', 'in_progress', 'Generating color theme and design...')
      await this.simulateDelay(1000)

      const theme = await this.generateTheme(input, analysisResult)
      this.updateStep('theme', 'completed', 'Theme created successfully')

      this.updateStep('blocks', 'in_progress', 'Selecting and configuring blocks...')
      await this.simulateDelay(1200)

      const blockStructure = await this.determineBlockStructure(input, analysisResult)
      this.updateStep('blocks', 'completed', 'Block structure defined')

      this.updateStep('content', 'in_progress', 'Writing personalized content...')
      await this.simulateDelay(1500)

      const generatedPage = await this.generateFullPage(input, theme, blockStructure)
      this.updateStep('content', 'completed', 'Content generated successfully')

      this.updateStep('finalize', 'in_progress', 'Finalizing your page...')
      await this.simulateDelay(500)

      const blocksWithIds = generatedPage.blocks.map((block, index) => ({
        ...block,
        id: `${block.type}-${Date.now()}-${index}`,
        order: index,
        settings: block.settings || {},
      }))

      this.updateStep('finalize', 'completed', 'Page ready!')

      return {
        ...generatedPage,
        blocks: blocksWithIds as BlockData[],
      }
    } catch (error) {
      const currentStep = this.steps.find((s) => s.status === 'in_progress')
      if (currentStep) {
        this.updateStep(currentStep.step as any, 'error', 'Failed to complete this step')
      }
      throw error
    }
  }

  private initializeSteps() {
    this.steps = [
      { step: 'analyze', status: 'pending', message: 'Analyzing prompt', progress: 0 },
      { step: 'theme', status: 'pending', message: 'Generating theme', progress: 0 },
      { step: 'blocks', status: 'pending', message: 'Selecting blocks', progress: 0 },
      { step: 'content', status: 'pending', message: 'Writing content', progress: 0 },
      { step: 'finalize', status: 'pending', message: 'Finalizing page', progress: 0 },
    ]
    this.callback?.(this.steps)
  }

  private updateStep(
    step: 'analyze' | 'theme' | 'blocks' | 'content' | 'finalize',
    status: GenerationStep['status'],
    message: string
  ) {
    const stepIndex = this.steps.findIndex((s) => s.step === step)
    if (stepIndex !== -1) {
      this.steps[stepIndex] = {
        ...this.steps[stepIndex],
        status,
        message,
        progress: status === 'completed' ? 100 : status === 'in_progress' ? 50 : 0,
      }
      this.callback?.(this.steps)
    }
  }

  private async simulateDelay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private async analyzePrompt(input: PageGenerationInput): Promise<{
    tone: string
    primaryFocus: string
    suggestedBlockTypes: string[]
  }> {
    const systemPrompt = `You are an expert at analyzing user requests for personalized pages.
Your job is to understand the tone, focus, and determine which blocks would be most appropriate.`

    const userPrompt = `Analyze this page creation request:

"${input.prompt}"

Occasion: ${input.occasion || 'not specified'}
User tier: ${input.userTier}

Return JSON with:
{
  "tone": "warm|romantic|playful|elegant|casual",
  "primaryFocus": "brief description of what the page should focus on",
  "suggestedBlockTypes": ["array of 5-8 most relevant block types from: hero, intro, text, quote, gallery, timeline, memories, final-message"]
}`

    try {
      const result = await this.client.generateJSON<{
        tone: string
        primaryFocus: string
        suggestedBlockTypes: string[]
      }>(
        userPrompt,
        z.object({
          tone: z.string(),
          primaryFocus: z.string(),
          suggestedBlockTypes: z.array(z.string()),
        }),
        systemPrompt
      )
      return result
    } catch (error) {
      return {
        tone: 'warm',
        primaryFocus: 'celebration',
        suggestedBlockTypes: ['hero', 'intro', 'text', 'gallery', 'final-message'],
      }
    }
  }

  private async generateTheme(
    input: PageGenerationInput,
    analysis: { tone: string }
  ): Promise<PageTheme> {
    const occasionColorMap: Record<string, { primary: string; secondary: string }> = {
      birthday: { primary: '#ec4899', secondary: '#f97316' },
      anniversary: { primary: '#f43f5e', secondary: '#a855f7' },
      wedding: { primary: '#d4af37', secondary: '#f8fafc' },
      valentine: { primary: '#e11d48', secondary: '#ec4899' },
      christmas: { primary: '#dc2626', secondary: '#16a34a' },
      romance: { primary: '#f43f5e', secondary: '#ec4899' },
      celebration: { primary: '#8b5cf6', secondary: '#06b6d4' },
    }

    const colors = occasionColorMap[input.occasion?.toLowerCase() || ''] || {
      primary: '#f43f5e',
      secondary: '#ec4899',
    }

    const fontMap: Record<string, string> = {
      elegant: 'serif',
      romantic: 'serif',
      casual: 'sans-serif',
      playful: 'sans-serif',
      warm: 'sans-serif',
    }

    return {
      primaryColor: colors.primary,
      secondaryColor: colors.secondary,
      fontFamily: fontMap[analysis.tone] || 'sans-serif',
      backgroundColor: '#ffffff',
    }
  }

  private async determineBlockStructure(
    input: PageGenerationInput,
    analysis: { suggestedBlockTypes: string[] }
  ): Promise<string[]> {
    const isPremium = input.userTier !== 'free'
    const allowedBlocks = analysis.suggestedBlockTypes.filter((type) => {
      const def = BLOCK_DEFINITIONS[type as BlockType]
      return def && (isPremium || !def.isPremium)
    })

    const structure = ['hero', 'intro']

    allowedBlocks.forEach((blockType) => {
      if (!structure.includes(blockType) && structure.length < 8) {
        structure.push(blockType)
      }
    })

    if (!structure.includes('final-message')) {
      structure.push('final-message')
    }

    return structure
  }

  private async generateFullPage(
    input: PageGenerationInput,
    theme: PageTheme,
    blockStructure: string[]
  ): Promise<GeneratedPage> {
    const systemPrompt = this.buildSystemPrompt()
    const userPrompt = this.buildUserPrompt(input, blockStructure)

    const ContentOnlySchema = z.object({
      title: z.string().min(1).max(200),
      recipientName: z.string().max(100),
      blocks: z.array(GeneratedBlockSchema).min(2).max(20),
      reasoning: z.string().optional(),
    })

    try {
      const result = await this.client.generateJSON<z.infer<typeof ContentOnlySchema>>(
        userPrompt,
        ContentOnlySchema,
        systemPrompt
      )

      return {
        ...result,
        theme,
        blocks: result.blocks as any,
      }
    } catch (error) {
      console.error('Page generation error:', error)
      if (error instanceof Error) {
        console.error('Error details:', error.message)
        console.error('Error stack:', error.stack)
      }
      throw new Error('Failed to generate page content')
    }
  }

  private buildSystemPrompt(): string {
    const blockDescriptions = Object.values(BLOCK_DEFINITIONS)
      .map(
        (block) =>
          `- ${block.type}: ${block.description} (${block.isPremium ? 'Premium' : 'Free'})\n  Content fields: ${Object.keys(block.contentSchema).join(', ')}`
      )
      .join('\n')

    return `You are an expert AI agent specializing in creating beautiful, personalized pages for special occasions.
You have deep knowledge of all available block types and how to use them effectively.

# Available Block Types & Their Content:
${blockDescriptions}

# CRITICAL JSON Structure:
Each block MUST have this exact structure:
{
  "type": "block-type-name",
  "content": {
    // ALL block-specific fields go inside the content object
    "field1": "value1",
    "field2": "value2"
  }
}

Example correct structure:
{
  "type": "hero",
  "content": {
    "title": "Happy Birthday!",
    "subtitle": "Celebrating you today",
    "showImage": true,
    "imageUrl": "https://example.com/image.jpg"
  }
}

# Your Capabilities:
1. Create compelling, heartfelt content that resonates emotionally
2. Use appropriate block types for different content needs
3. Structure pages with logical flow and visual hierarchy
4. Match tone and style to the occasion
5. Fill all content fields with realistic, meaningful data
6. Create cohesive narratives across multiple blocks

# Content Guidelines:
- Make text warm, personal, and authentic
- Use the recipient's name naturally throughout
- Keep paragraphs concise (2-4 sentences for text fields)
- Avoid generic phrases like "special person" or "amazing journey"
- Create specific, vivid descriptions
- Match formality to the occasion
- Ensure emotional authenticity

# Block Content Examples:
- hero: title should be impactful, subtitle adds context
- intro: 2-4 sentence introduction setting the tone
- text: focused paragraphs on specific themes
- quote: meaningful quotes that resonate with occasion
- gallery: requires title if showTitle is true
- timeline: needs title and will use separate timeline data
- memories: needs title, displays memory cards
- final-message: heartfelt closing with signature

Return ONLY valid JSON matching the schema. ALL block fields MUST be nested inside the "content" object.`
  }

  private buildUserPrompt(input: PageGenerationInput, blockStructure: string[]): string {
    const { prompt, occasion, recipientName, userTier } = input

    let userPrompt = `Create a personalized page with the following details:\n\n`
    userPrompt += `User's request: "${prompt}"\n\n`

    if (occasion) {
      userPrompt += `Occasion: ${occasion}\n`
    }

    if (recipientName) {
      userPrompt += `Recipient name: ${recipientName}\n`
    }

    userPrompt += `User tier: ${userTier}\n`
    userPrompt += `\nRequired block structure: ${blockStructure.join(' → ')}\n`

    if (userTier === 'free') {
      userPrompt += `\nNote: User is on free tier - only use free blocks\n`
    }

    userPrompt += `\nGenerate a complete page with all blocks filled with meaningful, personalized content.`
    userPrompt += `\nEnsure each block's content fields are properly populated based on the block's contentSchema.`
    userPrompt += `\nBe creative, personal, and emotionally authentic!`

    return userPrompt
  }

  setTier(tier: Tier) {
    const model = getModelForTier(tier)
    this.client.setModel(model)
  }
}

export function createAIPageGeneratorAgent(tier: Tier = 'free'): AIPageGeneratorAgent {
  return new AIPageGeneratorAgent(tier)
}

