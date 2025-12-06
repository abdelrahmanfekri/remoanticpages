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
  mediaPreferences?: {
    music: boolean
    photos: boolean
    videos: boolean
  }
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
    backgroundGradient: z.object({
      from: z.string(),
      via: z.string().optional(),
      to: z.string(),
      direction: z.enum(['to-b', 'to-r', 'to-bl', 'to-br']).optional(),
    }).optional(),
    backgroundAnimation: z.object({
      enabled: z.boolean(),
      type: z.enum(['floating-hearts', 'particles', 'stars', 'none']),
      color: z.string().optional(),
      opacity: z.number().optional(),
      count: z.number().optional(),
      speed: z.enum(['slow', 'normal', 'fast']).optional(),
      size: z.enum(['small', 'medium', 'large']).optional(),
    }).optional(),
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
    // Advanced color schemes with gradients for each occasion
    const occasionColorMap: Record<string, {
      primary: string
      secondary: string
      gradient: { from: string; via?: string; to: string; direction: 'to-b' | 'to-r' | 'to-bl' | 'to-br' }
      animation?: { type: 'floating-hearts' | 'particles' | 'stars'; color: string }
    }> = {
      birthday: {
        primary: '#ec4899',
        secondary: '#f97316',
        gradient: { from: '#fdf2f8', via: '#ffffff', to: '#fef3c7', direction: 'to-br' },
        animation: { type: 'particles', color: '#ec4899' }
      },
      anniversary: {
        primary: '#f43f5e',
        secondary: '#a855f7',
        gradient: { from: '#fdf2f8', via: '#ffffff', to: '#faf5ff', direction: 'to-b' },
        animation: { type: 'floating-hearts', color: '#f43f5e' }
      },
      wedding: {
        primary: '#d4af37',
        secondary: '#f8fafc',
        gradient: { from: '#fffbeb', via: '#ffffff', to: '#fef3c7', direction: 'to-b' },
        animation: { type: 'floating-hearts', color: '#d4af37' }
      },
      valentine: {
        primary: '#e11d48',
        secondary: '#ec4899',
        gradient: { from: '#fdf2f8', via: '#ffffff', to: '#fdf2f8', direction: 'to-b' },
        animation: { type: 'floating-hearts', color: '#e11d48' }
      },
      valentines: {
        primary: '#e11d48',
        secondary: '#ec4899',
        gradient: { from: '#fdf2f8', via: '#ffffff', to: '#fdf2f8', direction: 'to-b' },
        animation: { type: 'floating-hearts', color: '#e11d48' }
      },
      christmas: {
        primary: '#dc2626',
        secondary: '#16a34a',
        gradient: { from: '#fef2f2', via: '#ffffff', to: '#f0fdf4', direction: 'to-b' },
        animation: { type: 'stars', color: '#dc2626' }
      },
      romance: {
        primary: '#f43f5e',
        secondary: '#ec4899',
        gradient: { from: '#fdf2f8', via: '#ffffff', to: '#fef3c7', direction: 'to-br' },
        animation: { type: 'floating-hearts', color: '#f43f5e' }
      },
      celebration: {
        primary: '#8b5cf6',
        secondary: '#06b6d4',
        gradient: { from: '#faf5ff', via: '#ffffff', to: '#ecfeff', direction: 'to-b' },
        animation: { type: 'particles', color: '#8b5cf6' }
      },
    }

    const defaultTheme = {
      primary: '#f43f5e',
      secondary: '#ec4899',
      gradient: { from: '#fdf2f8', via: '#ffffff', to: '#fdf2f8', direction: 'to-b' as const },
      animation: { type: 'floating-hearts' as const, color: '#f43f5e' }
    }

    const occasionKey = input.occasion?.toLowerCase() || ''
    const themeConfig = occasionColorMap[occasionKey] || defaultTheme

    const fontMap: Record<string, string> = {
      elegant: 'serif',
      romantic: 'serif',
      casual: 'sans-serif',
      playful: 'sans-serif',
      warm: 'serif',
    }

    // Enable background animation for romantic occasions
    const shouldEnableAnimation = ['anniversary', 'wedding', 'valentine', 'valentines', 'romance'].includes(occasionKey)

    return {
      primaryColor: themeConfig.primary,
      secondaryColor: themeConfig.secondary,
      fontFamily: fontMap[analysis.tone] || 'serif',
      backgroundColor: themeConfig.gradient.from,
      backgroundGradient: themeConfig.gradient,
      backgroundAnimation: shouldEnableAnimation && themeConfig.animation ? {
        enabled: true,
        type: themeConfig.animation.type,
        color: themeConfig.animation.color,
        opacity: 0.4,
        count: 12,
        speed: 'normal' as const,
        size: 'medium' as const,
      } : undefined
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

    return `You are an expert AI agent specializing in creating stunning, deeply personalized pages for special occasions. You craft pages that feel hand-made with love and care, like beautiful love letters or memory books.

Your expertise includes:
- Creating emotionally resonant, personalized content
- Extracting and honoring every detail from the user's story
- Designing cohesive narratives that flow beautifully
- Matching tone, style, and colors to the occasion
- Crafting content that feels authentic and specific, not generic

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
    "title": "Happy Birthday, My Love",
    "subtitle": "Celebrating the day you came into my world",
    "showImage": true,
    "imageUrl": "https://example.com/image.jpg"
  }
}

# Content Creation Principles:
1. **Extract Everything:** Pull out every specific detail, name, place, date, memory, feeling, and moment from the user's story
2. **Be Specific:** Use actual names, places, dates, and moments mentioned - never use generic placeholders
3. **Stay Authentic:** Write like you're the person who experienced these moments - warm, personal, real
4. **Avoid Clichés:** Skip generic phrases like "special person" or "amazing journey" - use their actual story
5. **Bilingual Support:** If the story includes Arabic text or mentions bilingual content, naturally include both languages
6. **Emotional Depth:** Every block should add emotional value and move the story forward
7. **Visual Thinking:** Consider how photos/videos/music will enhance the page when planned

# Block-Specific Guidelines:
- **hero:** Create an impactful title and emotional subtitle that captures the essence. Use large, elegant typography with gradient text effects. If media is available, showcase it prominently.
- **intro:** Set the tone with 3-5 sentences using specific details from the story. Use glass-card styling with soft glow.
- **text:** Write detailed paragraphs (4-6 sentences) using specific moments and memories. Format in elegant cards with proper spacing.
- **quote:** Extract or create meaningful quotes that resonate with their story. Display with elegant typography and decorative elements.
- **timeline:** Create 3-6 timeline items with specific dates, titles, and detailed bilingual descriptions if requested. Use alternating left/right layout with connecting lines.
- **memories:** Generate 2-4 memory entries with specific titles, dates, and detailed descriptions. Format as cards in a grid.
- **gallery:** If photos planned, include with descriptive title. Use responsive grid layout (1-3 columns). Show placeholders if media will be uploaded.
- **final-message:** A powerful, heartfelt closing (4-6 sentences) with large typography, possibly with decorative heart icon. Use full-width hero-style section.

# Quality Standards:
- Make it feel hand-crafted and personalized, not AI-generated
- Every word should serve the story and the relationship
- Create pages that could bring tears to the eyes - that's how meaningful they should be
- If the user shared details, use them - honor their story completely
- Balance emotional depth with readability and flow

Return ONLY valid JSON matching the schema. ALL block fields MUST be nested inside the "content" object.`
  }

  private buildUserPrompt(input: PageGenerationInput, blockStructure: string[]): string {
    const { prompt, occasion, recipientName, userTier, mediaPreferences } = input

    let userPrompt = `## User's Detailed Story:\n`
    userPrompt += `"${prompt}"\n\n`

    // Detect if user wants bilingual content
    const wantsBilingual = /[\u0600-\u06FF]/.test(prompt) || prompt.toLowerCase().includes('arabic') || prompt.toLowerCase().includes('bilingual')

    if (occasion) {
      userPrompt += `**Occasion:** ${occasion}\n`
      // Suggest background animation for romantic occasions
      if (['anniversary', 'wedding', 'valentine', 'valentines', 'romance'].includes(occasion.toLowerCase())) {
        userPrompt += `**Visual Style:** This is a romantic occasion - use floating heart animations, soft pink gradients, glass-card effects, and elegant serif typography.\n`
      }
    }

    if (recipientName) {
      userPrompt += `**Recipient's Name:** ${recipientName}\n`
    }

    if (wantsBilingual) {
      userPrompt += `**Language:** User wants bilingual content (English + Arabic). Include both languages naturally throughout.\n`
    } else {
      userPrompt += `**Language:** Use only English unless the story explicitly contains Arabic text.\n`
    }

    // Media preferences
    if (mediaPreferences) {
      userPrompt += `\n## Media Plans:\n`
      if (mediaPreferences.photos) {
        userPrompt += `- User plans to add PHOTOS - include 'gallery' or 'memories' blocks with placeholders if not already in structure\n`
      }
      if (mediaPreferences.videos && userTier !== 'free') {
        userPrompt += `- User plans to add VIDEOS - consider 'video' blocks if appropriate\n`
      }
      if (mediaPreferences.music && userTier !== 'free') {
        userPrompt += `- User plans to add BACKGROUND MUSIC - page should support music playback\n`
      }
    }

    userPrompt += `\n**User tier:** ${userTier}\n`
    userPrompt += `\n**Required block structure:** ${blockStructure.join(' → ')}\n\n`

    userPrompt += `## Critical Requirements:\n\n`
    userPrompt += `### Story & Content:\n`
    userPrompt += `1. Extract ALL specific details, memories, moments, and feelings from the user's story above\n`
    userPrompt += `2. Create deeply personal, heartfelt content that reflects their unique story\n`
    userPrompt += `3. Use exact names, places, dates, and moments mentioned in the story\n`
    userPrompt += `4. Include inside jokes, shared memories, and personal references when mentioned\n`
    userPrompt += `5. Write in a warm, romantic, and authentic tone - avoid generic or cliché phrases\n`
    userPrompt += `6. Make each block meaningful and specific to their relationship/story\n`
    userPrompt += `7. If the story includes Arabic text or mentions bilingual content, include both English and Arabic naturally\n\n`

    userPrompt += `### Block Content:\n`
    userPrompt += `- **Hero:** Create a compelling title and subtitle that captures the essence of the story\n`
    userPrompt += `- **Intro:** Set the emotional context using specific details from the story\n`
    userPrompt += `- **Text blocks:** Tell the story in detail, using specific moments from the prompt\n`
    userPrompt += `- **Quotes:** Extract meaningful quotes or create impactful statements from the story\n`
    userPrompt += `- **Timeline:** If journey/story progression mentioned, create timeline items with specific events\n`
    userPrompt += `- **Memories:** If memories mentioned, create 2-4 memory entries with titles and descriptions\n`
    userPrompt += `- **Gallery/Memories Grid:** If photos planned, include with descriptive placeholder text\n`
    userPrompt += `- **Final Message:** A powerful closing that captures the depth of feeling from the story\n\n`

    if (userTier === 'free') {
      userPrompt += `### Tier Limitation:\n`
      userPrompt += `**CRITICAL:** User is on FREE tier - use ONLY free blocks. No video, countdown, testimonials, or map blocks.\n\n`
    }

    userPrompt += `### Advanced Visual Design:\n`
    userPrompt += `1. **Background Gradients:** Use beautiful multi-stop gradients (from-rose-50 via-white to-pink-50 style)\n`
    userPrompt += `2. **Glass Effects:** Apply glass-card styling to content blocks (semi-transparent white with backdrop blur)\n`
    userPrompt += `3. **Soft Glows:** Add subtle glow effects to hero sections, cards, and important buttons\n`
    userPrompt += `4. **Animations:** Use floating hearts for romantic occasions, particles for birthdays, stars for special moments\n`
    userPrompt += `5. **Typography:** Large, elegant serif fonts for titles (Playfair Display style), readable sans-serif for body\n`
    userPrompt += `6. **Spacing:** Generous padding and margins for breathing room\n`
    userPrompt += `7. **Visual Hierarchy:** Use size, color, and spacing to guide the eye\n`
    userPrompt += `8. **Color Harmony:** Create sophisticated color palettes that work together beautifully\n\n`

    userPrompt += `### Quality Standards:\n`
    userPrompt += `- Prioritize emotional depth and personalization over generic content\n`
    userPrompt += `- Make every word count - each block should add meaningful value\n`
    userPrompt += `- Create a page that feels like a personalized love letter or memory book\n`
    userPrompt += `- The page should tell a complete, moving story from start to finish\n`
    userPrompt += `- Honor the user's story by creating something beautiful, specific, and deeply meaningful\n`
    userPrompt += `- The final result should look professionally designed, not template-like\n`
    userPrompt += `- Every visual element should enhance the emotional impact\n\n`

    userPrompt += `Generate the complete page now with all blocks filled with rich, personalized, heartfelt content based on their story.`

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

