'use server'

import { createClient } from '@/lib/supabase/server'
import { getUserTier } from '@/lib/subscription'
import { checkPageLimit } from '@/lib/tiers'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import type { PageWithRelations, PageTheme, PageSettings, BlockData } from '@/types'

export interface CreatePageData {
  title: string
  recipientName?: string
  theme?: PageTheme
  settings?: Partial<PageSettings>
  blocks: BlockData[]
  memories?: Array<{
    id?: string
    title: string
    date?: string
    description: string
    order: number
    image_url?: string | null
  }>
  media?: Array<{
    url: string
    type: 'image' | 'video'
    order?: number
  }>
  password?: string
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
      theme,
      settings,
      blocks,
      memories,
      media,
      password,
    } = data

    if (!title || !blocks || blocks.length === 0) {
      return { error: 'Title and at least one block are required' }
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

    // Use provided theme or default theme
    const pageTheme = theme || {
        primaryColor: '#f43f5e',
        secondaryColor: '#ec4899',
        fontFamily: 'serif',
        backgroundColor: '#ffffff',
    }

    // Prepare settings
    let passwordHash = null
    if (password && password.trim()) {
      passwordHash = await bcrypt.hash(password, 10)
    }

    const pageSettings: PageSettings = {
      musicUrl: settings?.musicUrl || null,
      isPublic: settings?.isPublic ?? false,
      passwordHash: passwordHash || undefined,
      animations: settings?.animations || {
        enabled: true,
        style: 'smooth',
      },
    }

    // Create page
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .insert({
        user_id: user.id,
        slug,
        title,
        recipient_name: recipientName || null,
        template_id: null,
        theme: pageTheme,
        settings: pageSettings,
        tier_used: userTier,
      })
      .select()
      .single()

    if (pageError) {
      console.error('Page creation error:', pageError)
      return { error: pageError.message }
    }

    // Insert blocks
    if (blocks && blocks.length > 0) {
      const blocksToInsert = blocks.map((block) => ({
        page_id: page.id,
        type: block.type,
        display_order: block.order,
        content: block.content || {},
        settings: block.settings || {},
      }))

      const { error: blocksError } = await supabase
        .from('page_blocks')
        .insert(blocksToInsert)

      if (blocksError) {
        console.error('Blocks creation error:', blocksError)
        await supabase.from('pages').delete().eq('id', page.id)
        return { error: 'Failed to create page blocks' }
      }
    }

    // Insert memories if provided
    if (memories && memories.length > 0) {
      const memoriesToInsert = memories.map((memory) => ({
        page_id: page.id,
        title: memory.title || '',
        description: memory.description || '',
        date: memory.date || null,
        image_url: memory.image_url || null,
        display_order: memory.order || 0,
      }))

      await supabase.from('memories').insert(memoriesToInsert)
    }

    // Insert media if provided
    if (media && media.length > 0) {
      const mediaToInsert = media.map((m, index) => ({
        page_id: page.id,
        storage_path: m.url,
        file_type: m.type === 'video' ? ('video' as const) : ('image' as const),
        display_order: m.order ?? index,
      }))

      await supabase.from('media').insert(mediaToInsert)
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
    .select('id, settings')
    .eq('slug', slug)
    .single()

  if (error || !page) {
    return { valid: false, error: 'Page not found' }
  }

  const settings = page.settings as PageSettings
  const passwordHash = settings?.passwordHash

  if (!passwordHash) {
    return { valid: true }
  }

  const isValid = await bcrypt.compare(password, passwordHash)

  if (isValid) {
    const cookieStore = await cookies()
    cookieStore.set(`page_auth_${page.id}`, 'verified', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
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
      blocks:page_blocks(*),
      memories(*),
      media(*)
    `)
    .eq('id', id)
    .single()

  if (error || !page) {
    return { error: error?.message || 'Page not found' }
  }

  const pageWithRelations = page as unknown as PageWithRelations

  if (pageWithRelations.blocks && Array.isArray(pageWithRelations.blocks)) {
    pageWithRelations.blocks.sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
  }

  if (pageWithRelations.memories && Array.isArray(pageWithRelations.memories)) {
    pageWithRelations.memories.sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
  }

  if (pageWithRelations.media && Array.isArray(pageWithRelations.media)) {
    pageWithRelations.media.sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
  }

  return { page: pageWithRelations }
}

export async function updatePage(
  id: string,
  updates: {
    title?: string
    recipientName?: string
    theme?: PageTheme
    settings?: Partial<PageSettings>
    password?: string | null
  }
): Promise<{ page?: unknown; error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { data: existingPage } = await supabase
    .from('pages')
    .select('user_id, settings')
    .eq('id', id)
    .single()

  if (!existingPage || existingPage.user_id !== user.id) {
    return { error: 'Forbidden' }
  }

  const updateData: Record<string, unknown> = {}
  
  if (updates.title !== undefined) updateData.title = updates.title
  if (updates.recipientName !== undefined) updateData.recipient_name = updates.recipientName
  if (updates.theme !== undefined) updateData.theme = updates.theme
  
  if (updates.settings || updates.password !== undefined) {
    const currentSettings = (existingPage.settings as PageSettings) || {}
    const newSettings = { ...currentSettings, ...updates.settings }
    
    if (updates.password !== undefined) {
      if (updates.password === null || updates.password.trim() === '') {
        delete newSettings.passwordHash
      } else {
        newSettings.passwordHash = await bcrypt.hash(updates.password, 10)
      }
    }
    
    updateData.settings = newSettings
  }

  const { data: page, error } = await supabase
    .from('pages')
    .update(updateData)
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
