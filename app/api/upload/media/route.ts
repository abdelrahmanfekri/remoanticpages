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
    const mediaType = formData.get('type') as 'image' | 'video'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!pageId) {
      return NextResponse.json({ error: 'Page ID required' }, { status: 400 })
    }

    // Verify page ownership
    const { data: page } = await supabase
      .from('pages')
      .select('user_id, media_count')
      .eq('id', pageId)
      .eq('user_id', user.id)
      .single()

    if (!page) {
      return NextResponse.json({ error: 'Page not found or unauthorized' }, { status: 404 })
    }

    // Get user tier and check limits
    const userTier = await getUserTier(user.id)
    const limits = getTierLimits(userTier)

    // Count existing media
    const { data: existingMedia } = await supabase
      .from('media')
      .select('type')
      .eq('page_id', pageId)

    const imageCount = existingMedia?.filter((m) => m.type === 'image').length || 0
    const videoCount = existingMedia?.filter((m) => m.type === 'video').length || 0

    // Check image limit
    if (mediaType === 'image' && limits.maxImagesPerPage !== Infinity) {
      if (imageCount >= limits.maxImagesPerPage) {
        return NextResponse.json(
          {
            error: 'Image limit reached',
            message: `Your ${userTier} tier allows ${limits.maxImagesPerPage} images per page. Upgrade to add more.`,
            upgradeRequired: true,
            requiredTier: 'premium',
          },
          { status: 403 }
        )
      }
    }

    // Check video limit
    if (mediaType === 'video') {
      if (limits.maxVideosPerPage === 0) {
        return NextResponse.json(
          {
            error: 'Videos not available',
            message: 'Videos are not available on the Free tier. Upgrade to Premium to add videos.',
            upgradeRequired: true,
            requiredTier: 'premium',
          },
          { status: 403 }
        )
      }
      if (limits.maxVideosPerPage !== Infinity && videoCount >= limits.maxVideosPerPage) {
        return NextResponse.json(
          {
            error: 'Video limit reached',
            message: `Your ${userTier} tier allows ${limits.maxVideosPerPage} videos per page. Upgrade to Pro for unlimited.`,
            upgradeRequired: true,
            requiredTier: 'pro',
          },
          { status: 403 }
        )
      }
    }

    // Validate file size and type
    const maxSize = mediaType === 'image' ? 10 * 1024 * 1024 : 100 * 1024 * 1024 // 10MB for images, 100MB for videos
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB` },
        { status: 400 }
      )
    }

    const allowedTypes = mediaType === 'image' 
      ? ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      : ['video/mp4', 'video/webm', 'video/quicktime']

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Generate file path
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    const filePath = `media/${user.id}/${pageId}/${timestamp}_${randomString}.${extension}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
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
    const { data: urlData } = supabase.storage.from('media').getPublicUrl(uploadData.path)

    // Get next order number
    const nextOrder = (existingMedia?.length || 0)

    // Save media record to database
    const { data: mediaRecord, error: dbError } = await supabase
      .from('media')
      .insert({
        page_id: pageId,
        url: urlData.publicUrl,
        type: mediaType,
        order: nextOrder,
      })
      .select()
      .single()

    if (dbError) {
      // Clean up uploaded file if database insert fails
      await supabase.storage.from('media').remove([uploadData.path])
      return NextResponse.json(
        { error: `Database error: ${dbError.message}` },
        { status: 500 }
      )
    }

    // Update page media count
    await supabase
      .from('pages')
      .update({ media_count: nextOrder + 1 })
      .eq('id', pageId)

    return NextResponse.json({
      success: true,
      media: mediaRecord,
      url: urlData.publicUrl,
    })
  } catch (error) {
    console.error('Media upload error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

// Delete media
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
    const mediaId = searchParams.get('id')

    if (!mediaId) {
      return NextResponse.json({ error: 'Media ID required' }, { status: 400 })
    }

    // Get media record and verify ownership
    const { data: media } = await supabase
      .from('media')
      .select('*, page:page_id(user_id)')
      .eq('id', mediaId)
      .single()

    if (!media || media.page?.user_id !== user.id) {
      return NextResponse.json({ error: 'Media not found or unauthorized' }, { status: 404 })
    }

    // Extract path from URL
    const url = new URL(media.url)
    const path = url.pathname.split('/storage/v1/object/public/media/')[1]

    // Delete from storage
    if (path) {
      await supabase.storage.from('media').remove([path])
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('media')
      .delete()
      .eq('id', mediaId)

    if (deleteError) {
      return NextResponse.json(
        { error: `Delete failed: ${deleteError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Media delete error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Delete failed'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

