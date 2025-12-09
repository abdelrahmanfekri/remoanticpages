'use server'

import { createClient } from '@/lib/supabase/server'
import { getUserTier } from '@/lib/subscription'
import { createBlockEnhancementAgent, createAIClient, getModelForTier } from '@/lib/ai/core'
import { createRateLimiter } from '@/lib/ai/utils/rate-limiter'
import { blockEnhancementCache, createCacheKey, hashPrompt } from '@/lib/ai/utils/cache'
import { BlockEnhancementInputSchema } from '@/lib/ai/schemas'
import { validateInput } from '@/lib/ai/utils/validators'

export interface EnhanceBlockResult {
  suggestions?: string[]
  error?: string
  rateLimitExceeded?: boolean
}

export async function enhanceBlockContent(input: {
  blockType: string
  field: string
  currentContent: string
  context?: {
    pageTitle?: string
    recipientName?: string
    occasion?: string
    tone?: 'formal' | 'casual' | 'romantic' | 'playful'
  }
}): Promise<EnhanceBlockResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    const userTier = await getUserTier(user.id)
    const rateLimiter = createRateLimiter(userTier)

    const limitCheck = await rateLimiter.checkLimit('block-enhancement', user.id)
    if (!limitCheck.allowed) {
      return {
        error: limitCheck.message || 'Rate limit exceeded',
        rateLimitExceeded: true,
      }
    }

    const validation = validateInput(BlockEnhancementInputSchema, input)
    if (!validation.success) {
      return { error: validation.error }
    }

    const cacheKey = createCacheKey(
      'block-enhance',
      input.blockType,
      input.field,
      hashPrompt(input.currentContent),
      input.context?.tone || ''
    )
    
    const cached = blockEnhancementCache.get(cacheKey)
    if (cached) {
      return { suggestions: cached }
    }

    const enhancer = createBlockEnhancementAgent(userTier)
    const result = await enhancer.enhanceBlock({
      blockType: input.blockType as any,
      currentContent: { [input.field]: input.currentContent },
      context: input.context ? {
        pageTitle: input.context.pageTitle,
        recipientName: input.context.recipientName,
        occasion: input.context.occasion,
        overallTone: input.context.tone,
      } : undefined,
    })
    const suggestions = result.suggestions.map(s => s.enhanced)

    blockEnhancementCache.set(cacheKey, suggestions)

    await rateLimiter.recordUsage('block-enhancement', user.id)

    return { suggestions }
  } catch (error) {
    console.error('Block enhancement error:', error)
    return { error: error instanceof Error ? error.message : 'Failed to enhance content' }
  }
}

export async function improveClarity(content: string): Promise<EnhanceBlockResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    const userTier = await getUserTier(user.id)
    const client = createAIClient({ model: getModelForTier(userTier), temperature: 0.3 })

    const systemPrompt = `You are an expert editor. Improve the clarity and flow of the given text while maintaining its meaning and tone. Keep it concise.`

    const userPrompt = `Improve this text:\n\n"${content}"\n\nReturn ONLY the improved version, no explanations.`

    const improved = await client.generateText(userPrompt, systemPrompt)

    return { suggestions: [improved] }
  } catch (error) {
    console.error('Clarity improvement error:', error)
    return { error: 'Failed to improve clarity' }
  }
}

export async function expandContent(
  content: string,
  targetLength: 'short' | 'medium' | 'long' = 'medium'
): Promise<EnhanceBlockResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    const userTier = await getUserTier(user.id)
    const client = createAIClient({ model: getModelForTier(userTier), temperature: 0.7 })

    const lengthGuide = {
      short: '2-3 sentences',
      medium: '4-5 sentences',
      long: '1-2 paragraphs'
    }

    const systemPrompt = `You are an expert writer. Expand the given text to be more detailed and engaging while maintaining its tone and message.`

    const userPrompt = `Expand this text to ${lengthGuide[targetLength]}:\n\n"${content}"\n\nReturn ONLY the expanded version, no explanations.`

    const expanded = await client.generateText(userPrompt, systemPrompt)

    return { suggestions: [expanded] }
  } catch (error) {
    console.error('Content expansion error:', error)
    return { error: 'Failed to expand content' }
  }
}

export async function makeMorePersonal(content: string, recipientName: string): Promise<EnhanceBlockResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    const userTier = await getUserTier(user.id)
    const client = createAIClient({ model: getModelForTier(userTier), temperature: 0.8 })

    const systemPrompt = `You are an expert at writing personal, heartfelt messages.`

    const userPrompt = `Make this text more personal and heartfelt for someone named ${recipientName}:\n\n"${content}"\n\nReturn ONLY the improved version, no explanations.`

    const personalized = await client.generateText(userPrompt, systemPrompt)

    return { suggestions: [personalized] }
  } catch (error) {
    console.error('Personalization error:', error)
    return { error: 'Failed to personalize content' }
  }
}

export async function adjustTone(
  content: string,
  targetTone: 'formal' | 'casual' | 'romantic' | 'playful'
): Promise<EnhanceBlockResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    const userTier = await getUserTier(user.id)
    const client = createAIClient({ model: getModelForTier(userTier), temperature: 0.7 })

    const toneDescriptions = {
      formal: 'formal and elegant',
      casual: 'casual and friendly',
      romantic: 'romantic and passionate',
      playful: 'playful and fun'
    }

    const systemPrompt = `You are an expert writer skilled at adjusting tone.`

    const userPrompt = `Rewrite this text in a ${toneDescriptions[targetTone]} tone:\n\n"${content}"\n\nReturn ONLY the rewritten version, no explanations.`

    const adjusted = await client.generateText(userPrompt, systemPrompt)

    return { suggestions: [adjusted] }
  } catch (error) {
    console.error('Tone adjustment error:', error)
    return { error: 'Failed to adjust tone' }
  }
}

