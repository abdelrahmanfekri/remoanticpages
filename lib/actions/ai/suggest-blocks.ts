'use server'

import { createClient } from '@/lib/supabase/server'
import { createContentAnalyzer } from '@/lib/ai/core'
import type { BlockType } from '@/types'

export interface SuggestBlocksResult {
  suggestions?: Array<{
    blockType: BlockType
    reason: string
    priority: 'high' | 'medium' | 'low'
  }>
  error?: string
}

export async function suggestBlocks(input: {
  existingBlocks: BlockType[]
  pageTitle?: string
  occasion?: string
}): Promise<SuggestBlocksResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    const analyzer = createContentAnalyzer()
    const suggestions = await analyzer.suggestImprovements(
      input.existingBlocks.map((type, i) => ({
        id: `block-${i}`,
        type,
        content: {},
        settings: {},
        order: i,
      }))
    )

    const parsed = suggestions.slice(0, 5).map((suggestion, i) => ({
      blockType: 'text' as BlockType,
      reason: suggestion,
      priority: (i === 0 ? 'high' : i === 1 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
    }))

    return { suggestions: parsed }
  } catch (error) {
    console.error('Block suggestion error:', error)
    return { error: 'Failed to suggest blocks' }
  }
}

