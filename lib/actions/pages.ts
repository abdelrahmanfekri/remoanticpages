'use server'

import { createClient } from '@/lib/supabase/server'
import { getUserTier } from '@/lib/subscription'
import { checkPageLimit } from '@/lib/tiers'
import bcrypt from 'bcryptjs'
import { getTemplateSchema, schemaToConfig, getDefaultConfig, type TemplateName } from '@/lib/template-schemas'
import { cookies } from 'next/headers'
import type { PageWithRelations } from '@/types'

export interface CreatePageData {
  title: string
  recipientName: string
  languages: string[]
  heroText?: Record<string, string>
  introText?: Record<string, string>
  finalMessage?: Record<string, string>
  memories?: Array<{
    id?: string
    title: string
    date?: string
    description: string | Record<string, string>
    order: number
    image_url?: string | null
  }>
  media?: Array<{
    url: string
    type: 'image' | 'video'
    order?: number
    uploading?: boolean
  }>
  musicUrl?: string
  password?: string
  isPublic?: boolean
  templateId?: string
  isCustom?: boolean
  config?: Record<string, unknown>
}

export interface CreatePageResult {
  page?: {
    id: string
    slug: string
  }
  error?: string
}

export async function createPage(data: CreatePageData): Promise<CreatePageResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    const {
      title,
      recipientName,
      languages,
      heroText,
      introText,
      finalMessage,
      memories,
      media,
      musicUrl,
      password,
      isPublic,
      templateId,
      isCustom = false,
    } = data

    // Validate required fields
    if (!title || !recipientName) {
      return { error: 'Title and recipient name are required' }
    }

    // Check page limit
    const userTier = await getUserTier(user.id)
    const { data: existingPages } = await supabase
      .from('pages')
      .select('id')
      .eq('user_id', user.id)

    const pageLimitCheck = checkPageLimit(userTier, existingPages?.length || 0)
    if (!pageLimitCheck.allowed) {
      return { error: pageLimitCheck.message || 'Page limit reached' }
    }

    // Generate slug
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50)
    
    let slug = baseSlug
    let slugExists = true
    let counter = 1

    while (slugExists) {
      const { data: existing } = await supabase
        .from('pages')
        .select('id')
        .eq('slug', slug)
        .single()

      if (!existing) {
        slugExists = false
      } else {
        slug = `${baseSlug}-${counter}`
        counter++
      }
    }

    // Get template config
    let pageConfig
    let templateName: string

    if (isCustom) {
      // Use default config for custom pages
      pageConfig = getDefaultConfig()
      templateName = 'Custom'
    } else if (templateId) {
      // Get template schema and convert to config
      const schema = getTemplateSchema(templateId as TemplateName)
      if (!schema) {
        return { error: 'Template not found' }
      }
      pageConfig = schemaToConfig(schema)
      templateName = schema.templateName
    } else {
      return { error: 'Template ID or custom flag required' }
    }

    // Hash password if provided
    let passwordHash = null
    if (password && password.trim()) {
      passwordHash = await bcrypt.hash(password, 10)
    }

    // Create page
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .insert({
        user_id: user.id,
        template_name: templateName,
        slug,
        title,
        recipient_name: recipientName,
        hero_text: heroText?.[languages[0]] || null,
        intro_text: introText?.[languages[0]] || null,
        final_message: finalMessage?.[languages[0]] || null,
        password_hash: passwordHash,
        is_public: isPublic || false,
        background_music_url: musicUrl || null,
        language: languages.join(','),
        tier_used: userTier,
        media_count: media?.length || 0,
        has_music: !!musicUrl,
        has_custom_animations: false,
        config: pageConfig,
      })
      .select()
      .single()

    if (pageError) {
      console.error('Page creation error:', pageError)
      return { error: pageError.message }
    }

    if (memories && Array.isArray(memories) && memories.length > 0) {
      const memoriesToInsert = memories.map((memory) => ({
        page_id: page.id,
        title: memory.title || '',
        description: typeof memory.description === 'string' 
          ? memory.description 
          : memory.description?.[languages[0]] || '',
        date: memory.date || '',
        image_url: memory.image_url || null,
        display_order: memory.order || 0,
      }))

      await supabase.from('memories').insert(memoriesToInsert)
    }

    if (media && Array.isArray(media) && media.length > 0) {
      const mediaToInsert = media
        .filter((m) => m.url && !m.uploading)
        .map((m, index) => ({
          page_id: page.id,
          storage_path: m.url,
          file_type: m.type === 'video' ? 'video' : 'image',
          display_order: m.order ?? index,
        }))

      if (mediaToInsert.length > 0) {
        await supabase.from('media').insert(mediaToInsert)
      }
    }

    return { page: { id: page.id, slug: page.slug } }
  } catch (error) {
    console.error('Page creation error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return { error: errorMessage }
  }
}

export interface VerifyPagePasswordResult {
  valid: boolean
  error?: string
}

export async function verifyPagePassword(slug: string, password: string): Promise<VerifyPagePasswordResult> {
  const supabase = await createClient()
  
  if (!slug) {
    return { valid: false, error: 'Slug is required' }
  }

  if (!password) {
    return { valid: false, error: 'Password is required' }
  }

  const { data: page, error } = await supabase
    .from('pages')
    .select('id, password_hash')
    .eq('slug', slug)
    .single()

  if (error || !page) {
    return { valid: false, error: 'Page not found' }
  }

  if (!page.password_hash) {
    return { valid: true }
  }

  // Verify password against bcrypt hash
  const isValid = await bcrypt.compare(password, page.password_hash)

  if (isValid) {
    const cookieStore = await cookies()
    cookieStore.set(`page_auth_${page.id}`, 'verified', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: `/p/${slug}`,
    })

    return { valid: true }
  }

  return { valid: false, error: 'Incorrect password' }
}

export async function getPageById(id: string): Promise<{ page?: PageWithRelations; error?: string }> {
  const supabase = await createClient()
  const { data: page, error } = await supabase
    .from('pages')
    .select(`
      *,
      memories(*),
      media(*),
    `)
    .eq('id', id)
    .single()

  if (error || !page) {
    return { error: error?.message || 'Page not found' }
  }

  // Type assertion for page with relations
  const pageWithRelations = page as unknown as PageWithRelations

  // Order memories by display_order if they exist
  if (pageWithRelations.memories && Array.isArray(pageWithRelations.memories)) {
    pageWithRelations.memories.sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
  }

  // Order media by display_order if they exist
  if (pageWithRelations.media && Array.isArray(pageWithRelations.media)) {
    pageWithRelations.media.sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
  }

  return { page: pageWithRelations }
}

export async function updatePage(
  id: string,
  updates: Record<string, unknown>
): Promise<{ page?: unknown; error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Verify ownership
  const { data: existingPage } = await supabase
    .from('pages')
    .select('user_id')
    .eq('id', id)
    .single()

  if (!existingPage || existingPage.user_id !== user.id) {
    return { error: 'Forbidden' }
  }

  const { data: page, error } = await supabase
    .from('pages')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  return { page }
}

export async function deletePage(id: string): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Verify ownership
  const { data: existingPage } = await supabase
    .from('pages')
    .select('user_id')
    .eq('id', id)
    .single()

  if (!existingPage || existingPage.user_id !== user.id) {
    return { error: 'Forbidden' }
  }

  const { error } = await supabase.from('pages').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

