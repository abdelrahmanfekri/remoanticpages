'use server'

import { createClient } from '@/lib/supabase/server'
import { getUserTier } from '@/lib/subscription'
import { createContentEnhancer } from '@/lib/ai/core'
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

    const enhancer = createContentEnhancer(userTier)
    const suggestions = await enhancer.enhanceText(input)

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
    const enhancer = createContentEnhancer(userTier)
    
    const improved = await enhancer.improveClarity(content)

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
    const enhancer = createContentEnhancer(userTier)
    
    const expanded = await enhancer.expandText(content, targetLength)

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
    const enhancer = createContentEnhancer(userTier)
    
    const personalized = await enhancer.makeMorePersonal(content, recipientName)

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
    const enhancer = createContentEnhancer(userTier)
    
    const adjusted = await enhancer.adjustTone(content, targetTone)

    return { suggestions: [adjusted] }
  } catch (error) {
    console.error('Tone adjustment error:', error)
    return { error: 'Failed to adjust tone' }
  }
}

