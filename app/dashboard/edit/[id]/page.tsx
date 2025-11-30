import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'

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
    .select('config')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!page) {
    notFound()
  }

  if (!page.config) {
    notFound()
  }

  redirect(`/create/custom?edit=${id}`)
}

