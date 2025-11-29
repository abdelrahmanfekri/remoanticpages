import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { getTemplateIdByDisplayName } from '@/lib/template-schemas'

export default async function EditPageRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: page } = await supabase
    .from('pages')
    .select('template_name')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!page || !page.template_name) {
    notFound()
  }

  // Convert template display name to template ID
  const templateId = getTemplateIdByDisplayName(page.template_name)
  
  if (!templateId) {
    redirect('/create/choose-template')
  }

  if (templateId === 'custom') {
    redirect(`/create/custom?edit=${id}`)
  }

  redirect(`/create/${templateId}?edit=${id}`)
}

