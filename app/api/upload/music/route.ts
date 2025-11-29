import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { getUserTier } from '@/lib/subscription'
import { getTierLimits } from '@/lib/tiers'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const pageId = formData.get('pageId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!pageId) {
      return NextResponse.json({ error: 'Page ID required' }, { status: 400 })
    }

    // Verify page ownership
    const { data: page } = await supabase
      .from('pages')
      .select('user_id, background_music_url')
      .eq('id', pageId)
      .eq('user_id', user.id)
      .single()

    if (!page) {
      return NextResponse.json({ error: 'Page not found or unauthorized' }, { status: 404 })
    }

    // Get user tier and check if music is allowed
    const userTier = await getUserTier(user.id)
    const limits = getTierLimits(userTier)

    if (!limits.canUseMusic) {
      return NextResponse.json(
        {
          error: 'Music not available',
          message: 'Background music is not available on the Free tier. Upgrade to Premium to add music.',
          upgradeRequired: true,
          requiredTier: 'premium',
        },
        { status: 403 }
      )
    }

    // Validate file size (20MB max)
    const maxSize = 20 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB` },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Delete old music file if exists
    if (page.background_music_url) {
      try {
        const url = new URL(page.background_music_url)
        const oldPath = url.pathname.split('/storage/v1/object/public/music/')[1]
        if (oldPath) {
          await supabase.storage.from('music').remove([oldPath])
        }
      } catch (error) {
        console.error('Error deleting old music:', error)
      }
    }

    // Generate file path
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    const filePath = `music/${user.id}/${pageId}/${timestamp}_${randomString}.${extension}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('music')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from('music').getPublicUrl(uploadData.path)

    // Update page with music URL
    const { error: updateError } = await supabase
      .from('pages')
      .update({
        background_music_url: urlData.publicUrl,
        has_music: true,
      })
      .eq('id', pageId)

    if (updateError) {
      // Clean up uploaded file if database update fails
      await supabase.storage.from('music').remove([uploadData.path])
      return NextResponse.json(
        { error: `Database error: ${updateError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
    })
  } catch (error) {
    console.error('Music upload error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

// Delete music
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get('pageId')

    if (!pageId) {
      return NextResponse.json({ error: 'Page ID required' }, { status: 400 })
    }

    // Get page and verify ownership
    const { data: page } = await supabase
      .from('pages')
      .select('user_id, background_music_url')
      .eq('id', pageId)
      .eq('user_id', user.id)
      .single()

    if (!page) {
      return NextResponse.json({ error: 'Page not found or unauthorized' }, { status: 404 })
    }

    // Delete from storage
    if (page.background_music_url) {
      try {
        const url = new URL(page.background_music_url)
        const path = url.pathname.split('/storage/v1/object/public/music/')[1]
        if (path) {
          await supabase.storage.from('music').remove([path])
        }
      } catch (error) {
        console.error('Error deleting music file:', error)
      }
    }

    // Update page
    const { error: updateError } = await supabase
      .from('pages')
      .update({
        background_music_url: null,
        has_music: false,
      })
      .eq('id', pageId)

    if (updateError) {
      return NextResponse.json(
        { error: `Update failed: ${updateError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Music delete error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Delete failed'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

