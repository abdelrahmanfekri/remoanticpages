import { BaseAgent, AgentConfig, ProgressCallback } from './base-agent'
import { BLOCK_DEFINITIONS, getTierBlock } from '@/lib/blocks/definitions'
import type { BlockData, PageTheme, BlockType } from '@/types'
import type { Tier } from '@/lib/tiers'
import type { GeneratedPage, GeneratedBlock } from '@/lib/ai/schemas/output'
import { GeneratedPageSchema, GeneratedBlockSchema } from '@/lib/ai/schemas/output'
import { z } from 'zod'

export interface PageGenerationInput {
  prompt: string
  occasion?: string
  recipientName?: string
  uploadedMedia?: {
    photos?: Array<{ url: string; id?: string }>
    videos?: Array<{ url: string; id?: string }>
    music?: { url: string }
  }
}

interface ContentAnalysis {
  tone: 'romantic' | 'celebratory' | 'sentimental' | 'playful' | 'elegant'
  keyElements: string[]
  emotionalFocus: string
  contentType: 'personal_story' | 'celebration' | 'memorial' | 'announcement'
}

interface BlockStrategy {
  blocks: BlockType[]
  reasoning: string
}

export class PageGeneratorAgent extends BaseAgent {
  constructor(config: AgentConfig) {
    super(config)
  }

  protected getDefaultTemperature(): number {
    return 0.8
  }

  protected getDefaultMaxTokens(): number {
    return 4000
  }

  async generatePage(input: PageGenerationInput, callback?: ProgressCallback): Promise<GeneratedPage> {
    if (callback) {
      this.setProgressCallback(callback)
    }

    try {
      this.updateProgress('analysis', 'in_progress', 'Analyzing your story and occasion...')
      await this.delay(500)

      const analysis = await this.analyzeContent(input)
      this.updateProgress('analysis', 'completed', 'Content analyzed successfully')

      this.updateProgress('design', 'in_progress', 'Designing your page layout...')
      await this.delay(600)

      const blockStrategy = await this.determineBlockStrategy(input, analysis)
      this.updateProgress('design', 'completed', 'Page structure designed')

      this.updateProgress('theme', 'in_progress', 'Creating beautiful theme and colors...')
      await this.delay(400)

      const theme = await this.generateTheme(input, analysis)
      this.updateProgress('theme', 'completed', 'Theme created')

      this.updateProgress('content', 'in_progress', 'Writing personalized content...')
      await this.delay(1200)

      const page = await this.generateContent(input, theme, blockStrategy, analysis)
      this.updateProgress('content', 'completed', 'Content generated successfully')

      this.updateProgress('finalizing', 'in_progress', 'Finalizing your page...')
      await this.delay(300)

      const finalizedPage = this.finalizePage(page)
      this.updateProgress('finalizing', 'completed', 'Page ready!')

      return finalizedPage
    } catch (error) {
      console.error('Page generation error:', error)
      throw error
    }
  }

  private async analyzeContent(input: PageGenerationInput): Promise<ContentAnalysis> {
    const analysisSchema = z.object({
      tone: z.enum(['romantic', 'celebratory', 'sentimental', 'playful', 'elegant'] as const),
      keyElements: z.array(z.string()),
      emotionalFocus: z.string(),
      contentType: z.enum(['personal_story', 'celebration', 'memorial', 'announcement'] as const),
    })

    const prompt = `Analyze this request for a personalized page:

"${input.prompt}"

${input.occasion ? `Occasion: ${input.occasion}` : ''}

Provide a JSON analysis of the tone, key elements, emotional focus, and content type.`

    const systemPrompt = `You are an expert at understanding human emotions and stories. Analyze the given text to understand:
- Tone: The emotional atmosphere (romantic, celebratory, sentimental, playful, elegant)
- Key Elements: Specific details, memories, names, dates, places mentioned
- Emotional Focus: What feeling or message is central to the story
- Content Type: Whether this is a personal story, celebration, memorial, or announcement`

    try {
      return await this.client.generateJSON(prompt, analysisSchema, systemPrompt)
    } catch (error) {
      // Fallback analysis
      return {
        tone: 'romantic',
        keyElements: ['personal story', 'relationship'],
        emotionalFocus: 'love and connection',
        contentType: 'personal_story',
      }
    }
  }

  private async determineBlockStrategy(input: PageGenerationInput, analysis: ContentAnalysis): Promise<BlockStrategy> {
    const availableBlocks = getTierBlock(this.tier).map(block => block.type)
    const limits = this.getTierLimits()

    const strategySchema = z.object({
      blocks: z.array(z.string()),
      reasoning: z.string(),
    })

    const prompt = `Design the optimal block structure for this page:

CONTENT ANALYSIS:
- Tone: ${analysis.tone}
- Emotional Focus: ${analysis.emotionalFocus}
- Content Type: ${analysis.contentType}
- Key Elements: ${analysis.keyElements.join(', ')}

CONSTRAINTS:
- User Tier: ${this.tier} (${limits.maxBlocks} max blocks)
- Available blocks: ${availableBlocks.join(', ')}

${input.uploadedMedia?.photos && input.uploadedMedia.photos.length > 0 
  ? `- ${input.uploadedMedia.photos.length} photo(s) uploaded - include gallery blocks to showcase them` 
  : '- No photos uploaded yet - suggest user can upload photos to enhance the page'}
${input.uploadedMedia?.videos && input.uploadedMedia.videos.length > 0 
  ? `- ${input.uploadedMedia.videos.length} video(s) uploaded - include video blocks to showcase them` 
  : '- No videos uploaded yet - suggest user can upload videos to enhance the page'}
${input.uploadedMedia?.music 
  ? '- Background music uploaded - page will support music playback' 
  : '- No music uploaded yet - suggest user can upload background music to enhance the page'}

Choose 3-8 blocks that best tell this story. Start with hero/intro, end with final-message.
${input.uploadedMedia?.photos && input.uploadedMedia.photos.length > 0 ? 'Include gallery blocks to display the uploaded photos.' : ''}
${input.uploadedMedia?.videos && input.uploadedMedia.videos.length > 0 ? 'Include video blocks to display the uploaded videos.' : ''}`

    const systemPrompt = `You are a page design expert. Choose blocks that create a compelling narrative flow.
Always include: hero, intro, final-message
Consider: gallery for photos, video for videos, timeline for stories, memories for recollections
Premium blocks only for pro+ users: video, countdown, testimonials, map, two-column, social-links

When media is not uploaded, suggest in your reasoning that users can enhance their page by uploading photos, videos, or background music.`

    try {
      const result = await this.client.generateJSON<BlockStrategy>(prompt, strategySchema, systemPrompt)
      return {
        blocks: result.blocks.filter(block => availableBlocks.includes(block as BlockType)) as BlockType[],
        reasoning: result.reasoning,
      }
    } catch (error) {
      // Fallback strategy
      return {
        blocks: ['hero', 'intro', 'text', 'gallery', 'final-message'] as BlockType[],
        reasoning: 'Standard romantic page structure',
      }
    }
  }

  private async generateTheme(input: PageGenerationInput, analysis: ContentAnalysis): Promise<PageTheme> {
    const themeSchema = z.object({
      primaryColor: z.string(),
      secondaryColor: z.string(),
      fontFamily: z.enum(['serif', 'sans-serif', 'monospace']),
      backgroundColor: z.string().optional(),
      backgroundGradient: z.object({
        from: z.string(),
        via: z.string().optional(),
        to: z.string(),
        direction: z.enum(['to-b', 'to-r', 'to-bl', 'to-br']),
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
    })

    const prompt = `Create a beautiful theme for this page:

OCCASION: ${input.occasion || 'general celebration'}
TONE: ${analysis.tone}
EMOTIONAL FOCUS: ${analysis.emotionalFocus}

Design colors, fonts, and visual effects that match the mood and occasion.`

    const systemPrompt = `You are a design expert. Create themes that enhance emotional impact:
- Romantic occasions: Soft pinks, reds, floating hearts, elegant serif fonts
- Celebratory: Bright colors, particles, sans-serif fonts
- Sentimental: Warm earth tones, soft gradients, classic typography
- Playful: Vibrant colors, fun animations, modern fonts
- Elegant: Gold, white, subtle animations, serif fonts

Always include primary/secondary colors and font family. Optionally add gradients and animations.`

    try {
      const result = await this.client.generateJSON(prompt, themeSchema, systemPrompt)
      return result as PageTheme
    } catch (error) {
      // Fallback theme
      return {
        primaryColor: '#f43f5e',
        secondaryColor: '#ec4899',
        fontFamily: 'serif',
        backgroundGradient: {
          from: '#fdf2f8',
          via: '#ffffff',
          to: '#fef3c7',
          direction: 'to-br',
        },
        backgroundAnimation: analysis.tone === 'romantic' ? {
          enabled: true,
          type: 'floating-hearts',
          color: '#f43f5e',
          opacity: 0.4,
          count: 12,
          speed: 'normal',
          size: 'medium',
        } : undefined,
      }
    }
  }

  private async generateContent(
    input: PageGenerationInput,
    theme: PageTheme,
    strategy: BlockStrategy,
    analysis: ContentAnalysis
  ): Promise<GeneratedPage> {
    const contentSchema = z.object({
      title: z.string().min(1).max(200),
      recipientName: z.string().max(100),
      blocks: z.array(GeneratedBlockSchema).min(2).max(20),
      reasoning: z.string().optional(),
    })

    const blockDescriptions = strategy.blocks.map(blockType => {
      const def = BLOCK_DEFINITIONS[blockType]
      const fields = Object.entries(def.contentSchema)
        .map(([key, schema]) => `${key} (${schema.required ? 'required' : 'optional'}): ${schema.label}`)
        .join(', ')
      return `${blockType}: ${def.description}\n  Content fields: ${fields}\n  Example content structure: ${JSON.stringify(def.defaultContent, null, 2)}`
    }).join('\n\n')

    const prompt = `Create deeply personal content for this page:

STORY: "${input.prompt}"

RECIPIENT: ${input.recipientName || 'Not specified'}
OCCASION: ${input.occasion || 'General celebration'}
TONE: ${analysis.tone}
EMOTIONAL FOCUS: ${analysis.emotionalFocus}
CONTENT TYPE: ${analysis.contentType}

REQUIRED BLOCKS: ${strategy.blocks.join(' → ')}

BLOCK DESCRIPTIONS:
${blockDescriptions}

KEY ELEMENTS TO INCLUDE: ${analysis.keyElements.join(', ')}

${input.uploadedMedia?.photos && input.uploadedMedia.photos.length > 0 
  ? `UPLOADED PHOTOS: ${input.uploadedMedia.photos.length} photo(s) have been uploaded. Include gallery blocks and reference these photos naturally in the content. Structure the page to showcase these images.` 
  : 'PHOTOS: No photos uploaded yet. User can upload photos later to enhance the page.'}
${input.uploadedMedia?.videos && input.uploadedMedia.videos.length > 0 
  ? `UPLOADED VIDEOS: ${input.uploadedMedia.videos.length} video(s) have been uploaded. Include video blocks and reference these videos naturally in the content. Structure the page to showcase these videos.` 
  : 'VIDEOS: No videos uploaded yet. User can upload videos later to enhance the page.'}
${input.uploadedMedia?.music 
  ? 'BACKGROUND MUSIC: Music has been uploaded. The page will support music playback.' 
  : 'MUSIC: No music uploaded yet. User can upload background music later.'}

Create authentic, heartfelt content that feels like a personal love letter or memory book.
${input.uploadedMedia?.photos && input.uploadedMedia.photos.length > 0 ? 'Make sure to incorporate the uploaded photos into the narrative naturally.' : ''}
${input.uploadedMedia?.videos && input.uploadedMedia.videos.length > 0 ? 'Make sure to incorporate the uploaded videos into the narrative naturally.' : ''}`

    const systemPrompt = `You are a master storyteller and content creator specializing in deeply personal, emotional pages.

CONTENT PRINCIPLES:
1. Extract every specific detail from the user's story - names, places, dates, memories, feelings
2. Write authentically, as if you experienced these moments yourself
3. Use exact details mentioned - no generic placeholders
4. Create emotional depth that moves the reader
5. Match tone perfectly to the occasion and story
6. Make each block meaningful and connected to the overall narrative

BLOCK STRUCTURE:
- hero: Compelling title + emotional subtitle
- intro: Set emotional context with specific details
- text: Tell the story in detail using actual moments
- quote: Meaningful quotes from or inspired by the story
- gallery/memories: For photos/videos with descriptive placeholders
- timeline: If journey/story progression mentioned
- final-message: Powerful emotional closing

JSON FORMAT: Each block must have "type" and "content" fields. Put all block-specific data inside "content".`

    try {
      const result = await this.client.generateJSON<z.infer<typeof contentSchema>>(prompt, contentSchema, systemPrompt)
      return {
        title: result.title,
        recipientName: result.recipientName,
        theme,
        blocks: result.blocks,
        reasoning: result.reasoning,
      }
    } catch (error) {
      console.error('Content generation error:', error)
      throw new Error('Failed to generate page content')
    }
  }

  private finalizePage(page: GeneratedPage): GeneratedPage & { blocks: BlockData[] } {
    const blocksWithIds = page.blocks.map((block, index) => ({
      ...block,
      id: `${block.type}-${Date.now()}-${index}`,
      order: index,
      settings: block.settings || {},
    })) as BlockData[]

    return {
      ...page,
      blocks: blocksWithIds,
    }
  }

  async enhancePage(
    currentPage: {
      title: string
      recipientName: string
      theme: PageTheme
      blocks: BlockData[]
    },
    enhancementPrompt: string
  ): Promise<{
    updates: {
      title?: string
      recipientName?: string
      theme?: Partial<PageTheme>
      blocks?: BlockData[]
    }
    reasoning: string
  }> {
    const enhanceSchema = z.object({
      updates: z.object({
        title: z.string().optional(),
        recipientName: z.string().optional(),
        theme: z.record(z.any()).optional(),
        blocks: z.array(z.object({
          id: z.string(),
          type: z.string(),
          content: z.record(z.any()),
          settings: z.record(z.any()).optional(),
          order: z.number(),
        })).optional(),
      }),
      reasoning: z.string(),
    })

    const blockDescriptions = Object.values(BLOCK_DEFINITIONS)
      .map(def => {
        const fields = Object.entries(def.contentSchema)
          .map(([key, schema]) => `${key} (${schema.required ? 'required' : 'optional'}): ${schema.label}`)
          .join(', ')
        return `${def.type}: ${def.description}\n  Content fields: ${fields}\n  Example: ${JSON.stringify(def.defaultContent, null, 2)}`
      })
      .join('\n\n')

    const currentPageStr = JSON.stringify({
      title: currentPage.title,
      recipientName: currentPage.recipientName,
      theme: currentPage.theme,
      blocks: currentPage.blocks.map(b => ({
        id: b.id,
        type: b.type,
        content: b.content,
        settings: b.settings || {},
        order: b.order,
      })),
    }, null, 2)

    const prompt = `Enhance this existing page based on the user's request:

USER REQUEST: "${enhancementPrompt}"

CURRENT PAGE STATE:
${currentPageStr}

Available block types: ${Object.keys(BLOCK_DEFINITIONS).join(', ')}

BLOCK DEFINITIONS:
${blockDescriptions}

Analyze the request and return ONLY the fields that need to be updated. Preserve existing blocks unless explicitly asked to add/remove/modify.`

    const systemPrompt = `You are an AI assistant that helps users enhance their personalized pages.

ENHANCEMENT PRINCIPLES:
1. Understand exactly what the user wants to change
2. Preserve existing content that works well
3. Only update fields that need to change based on the request
4. Maintain consistency with the current page style
5. If modifying blocks, preserve IDs and order unless explicitly changing structure
6. Ensure all block content fields are properly structured as objects

BLOCK CONTENT STRUCTURE:
- Each block MUST have "content" as an object with block-specific fields
- Example hero block: { "type": "hero", "content": { "title": "...", "subtitle": "..." }, "id": "...", "order": 0 }
- Example intro block: { "type": "intro", "content": { "text": "..." }, "id": "...", "order": 1 }
- NEVER return blocks with missing "content" field

Return JSON with only the fields that need updating:
{
  "updates": {
    "title": "new title" (only if changing),
    "theme": { "primaryColor": "#hex" } (only changed theme fields),
    "blocks": [complete blocks array with ALL blocks] (only if modifying blocks - MUST include ALL existing blocks with updated content, preserving IDs unless adding new blocks)
  },
  "reasoning": "explanation of changes"
}

IMPORTANT: If you modify ANY blocks, you MUST return the COMPLETE blocks array with ALL blocks (both modified and unmodified), preserving all existing block IDs. Only include new IDs for blocks you're adding.`

    try {
      const result = await this.client.generateJSON<{
        updates: {
          title?: string
          recipientName?: string
          theme?: Record<string, any>
          blocks?: Array<{
            id: string
            type: string
            content: Record<string, any>
            settings?: Record<string, any>
            order: number
          }>
        }
        reasoning: string
      }>(prompt, enhanceSchema, systemPrompt)
      
      if (result.updates.blocks) {
        result.updates.blocks = result.updates.blocks.map((block) => ({
          ...block,
          type: block.type as BlockType,
          content: block.content || {},
          settings: block.settings || {},
        })) as BlockData[]
      }

      return {
        updates: {
          ...result.updates,
          blocks: result.updates.blocks ? result.updates.blocks.map((block) => ({
            ...block,
            type: block.type as BlockType,
            content: block.content || {},
            settings: block.settings || {},
          })) as BlockData[] : undefined,
        },
        reasoning: result.reasoning,
      }
    } catch (error) {
      console.error('Page enhancement error:', error)
      throw new Error('Failed to enhance page')
    }
  }
}

export function createPageGeneratorAgent(tier: Tier): PageGeneratorAgent {
  return new PageGeneratorAgent({ tier })
}
