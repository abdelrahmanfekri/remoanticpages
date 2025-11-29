import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { DynamicTemplateRenderer, type TemplateConfig } from '@/components/template-components'
import { PasswordForm } from '@/components/PasswordForm'
import { AnalyticsTracker } from '@/components/AnalyticsTracker'
import { getTemplateSchema, type TemplateName } from '@/lib/template-schemas'
import { cookies } from 'next/headers'
import type { PageWithRelations } from '@/types'

export default async function PublicPageViewer({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: page, error } = await supabase
    .from('pages')
    .select('*, memories(*), media(*)')
    .eq('slug', slug)
    .single()

  if (error || !page) {
    notFound()
  }

  if (page.password_hash) {
    const cookieStore = await cookies()
    const authCookie = cookieStore.get(`page_auth_${page.id}`)

    if (!authCookie || authCookie.value !== 'verified') {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-50">
            <PasswordForm slug={page.slug} recipientName={page.recipient_name} />
          </div>
        )
      }
  }

  const pageConfig = page.config as TemplateConfig | null
  
  if (!pageConfig) {
    notFound()
  }

  const templateName = page.template_name as TemplateName
  const schema = getTemplateSchema(templateName)

  return (
    <>
      <AnalyticsTracker pageId={page.id} eventType="view" />
      <DynamicTemplateRenderer 
        page={page as PageWithRelations} 
        config={pageConfig}
        schema={schema || undefined}
      />
    </>
  )
}

