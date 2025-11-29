'use server'

import { createClient } from '@/lib/supabase/server'

export interface TrackAnalyticsResult {
  success?: boolean
  error?: string
}

export async function trackAnalytics(
  pageId: string,
  eventType: 'view' | 'share'
): Promise<TrackAnalyticsResult> {
  try {
    if (!pageId || !eventType) {
      return { error: 'Missing required fields' }
    }

    const supabase = await createClient()

    // Verify page exists
    const { data: page } = await supabase
      .from('pages')
      .select('id')
      .eq('id', pageId)
      .single()

    if (!page) {
      return { error: 'Page not found' }
    }

    // Update view_count or share_count
    if (eventType === 'view') {
      // Fetch current count, increment, and update
      const { data: currentPage } = await supabase
        .from('pages')
        .select('view_count')
        .eq('id', pageId)
        .single()
      
      if (currentPage) {
        await supabase
          .from('pages')
          .update({ view_count: (currentPage.view_count || 0) + 1 })
          .eq('id', pageId)
      }
    }

    if (eventType === 'share') {
      // Fetch current count, increment, and update
      const { data: currentPage } = await supabase
        .from('pages')
        .select('share_count')
        .eq('id', pageId)
        .single()

      if (currentPage) {
        await supabase
          .from('pages')
          .update({ share_count: (currentPage.share_count || 0) + 1 })
          .eq('id', pageId)
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Analytics tracking error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to track analytics'
    return { error: errorMessage }
  }
}

