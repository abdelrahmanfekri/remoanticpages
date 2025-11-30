'use server'

import { createClient } from '@/lib/supabase/server'
import { getUserTier } from '@/lib/subscription'
import { createPageGenerator } from '@/lib/ai/core'
import { createRateLimiter } from '@/lib/ai/utils/rate-limiter'
import { pageGenerationCache, createCacheKey } from '@/lib/ai/utils/cache'
import { PageGenerationInputSchema } from '@/lib/ai/schemas'
import { validateInput } from '@/lib/ai/utils/validators'
import { createPage } from '@/lib/actions/pages'
import type { GeneratedPage } from '@/lib/ai/core'

export interface GeneratePageResult {
  page?: GeneratedPage
  error?: string
  rateLimitExceeded?: boolean
}

export interface GeneratePageFromPromptResult {
  data?: {
    pageId: string
    slug: string
  }
  error?: string
  rateLimitExceeded?: boolean
}

export async function generatePageWithAI(input: {
  prompt: string
  occasion?: string
  recipientName?: string
}): Promise<GeneratePageResult> {
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

    const limitCheck = await rateLimiter.checkLimit('page-generation', user.id)
    if (!limitCheck.allowed) {
      return {
        error: limitCheck.message || 'Rate limit exceeded',
        rateLimitExceeded: true,
      }
    }

    const validation = validateInput(PageGenerationInputSchema, {
      ...input,
      tier: userTier,
    })

    if (!validation.success) {
      return { error: validation.error }
    }

    const cacheKey = createCacheKey('page-gen', input.prompt, input.occasion || '', userTier)
    const cached = pageGenerationCache.get(cacheKey)
    
    if (cached) {
      return { page: cached }
    }

    const generator = createPageGenerator(userTier)
    const result = await generator.generatePage({
      prompt: input.prompt,
      occasion: input.occasion as any,
      recipientName: input.recipientName,
      userTier,
    })

    pageGenerationCache.set(cacheKey, result)

    await rateLimiter.recordUsage('page-generation', user.id)

    await supabase.from('ai_suggestions').insert({
      user_id: user.id,
      suggestion_type: 'content_generation',
      context: { prompt: input.prompt, occasion: input.occasion },
      suggestion: result,
      status: 'applied',
    })

    return { page: result }
  } catch (error) {
    console.error('Page generation error:', error)
    return { error: error instanceof Error ? error.message : 'Failed to generate page' }
  }
}

export async function generatePageFromPrompt(input: {
  prompt: string
  occasion?: string
  recipientName?: string
}): Promise<GeneratePageFromPromptResult> {
  try {
    const aiResult = await generatePageWithAI(input)
    
    if (aiResult.error || !aiResult.page) {
      return { 
        error: aiResult.error || 'Failed to generate page',
        rateLimitExceeded: aiResult.rateLimitExceeded 
      }
    }

    const generatedPage = aiResult.page

    const createResult = await createPage({
      title: generatedPage.title,
      recipientName: input.recipientName || generatedPage.recipientName || '',
      theme: generatedPage.theme,
      settings: {},
      blocks: generatedPage.blocks,
      memories: [],
      media: [],
    })

    if (createResult.error || !createResult.page) {
      return { error: createResult.error || 'Failed to create page' }
    }

    return {
      data: {
        pageId: createResult.page.id,
        slug: createResult.page.slug,
      }
    }
  } catch (error) {
    console.error('Generate page from prompt error:', error)
    return { error: error instanceof Error ? error.message : 'Failed to generate page' }
  }
}

export async function getRemainingGenerations(): Promise<{ remaining: number; limit: number; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { remaining: 0, limit: 0, error: 'Unauthorized' }
    }

    const userTier = await getUserTier(user.id)
    const rateLimiter = createRateLimiter(userTier)
    
    const limitCheck = await rateLimiter.checkLimit('page-generation', user.id)

    const limits = {
      free: 1,
      premium: 10,
      pro: -1,
    }

    return {
      remaining: limitCheck.remaining,
      limit: limits[userTier],
    }
  } catch (error) {
    console.error('Get remaining generations error:', error)
    return { remaining: 0, limit: 0, error: 'Failed to check quota' }
  }
}

