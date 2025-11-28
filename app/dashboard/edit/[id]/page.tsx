import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'

export default async function EditPageRedirect({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: page } = await supabase
    .from('pages')
    .select('template_id')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!page) {
    notFound()
  }

  redirect(`/create/${page.template_id}?edit=${params.id}`)
}

