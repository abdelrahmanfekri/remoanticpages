import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { pageId, eventType } = await request.json()

    if (!pageId || !eventType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verify page exists
    const { data: page } = await supabase
      .from('pages')
      .select('id')
      .eq('id', pageId)
      .single()

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to track analytics'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

