'use server'

import { createClient } from '@/lib/supabase/server'
import { getUserTier } from '@/lib/subscription'
import { createRateLimiter } from '@/lib/ai/utils/rate-limiter'

export async function refinePageWithAI(pageId: string, request: string): Promise<{
  success?: boolean
  error?: string
  rateLimitExceeded?: boolean
}> {
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

    const limitCheck = await rateLimiter.checkLimit('refinement', user.id)
    if (!limitCheck.allowed) {
      return {
        error: limitCheck.message || 'Rate limit exceeded',
        rateLimitExceeded: true,
      }
    }

    await rateLimiter.recordUsage('refinement', user.id)

    return { success: true }
  } catch (error) {
    console.error('Page refinement error:', error)
    return { error: 'Failed to refine page' }
  }
}

