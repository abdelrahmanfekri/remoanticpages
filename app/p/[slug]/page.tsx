import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { BlockRenderer } from '@/components/blocks'
import { PasswordForm } from '@/components/PasswordForm'
import { AnalyticsTracker } from '@/components/AnalyticsTracker'
import { cookies } from 'next/headers'
import type { PageWithRelations, PageSettings } from '@/types'

export default async function PublicPageViewer({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: page, error } = await supabase
    .from('pages')
    .select(`
      *,
      blocks:page_blocks(*),
      memories(*),
      media(*)
    `)
    .eq('slug', slug)
    .single()

  if (error || !page) {
    notFound()
  }

  const settings = page.settings as PageSettings

  // Check if page is private
  const isPrivate = !settings.isPublic || !!settings.passwordHash
  
  if (isPrivate && settings.passwordHash) {
    const cookieStore = await cookies()
    const authCookie = cookieStore.get(`page_auth_${page.id}`)

    if (!authCookie || authCookie.value !== 'verified') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-50">
          <PasswordForm slug={page.slug} recipientName={page.recipient_name || 'someone special'} />
        </div>
      )
    }
  }

  // Sort blocks and memories by display_order
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

  return (
    <>
      <AnalyticsTracker pageId={page.id} eventType="view" />
      <BlockRenderer page={pageWithRelations} />
    </>
  )
}
