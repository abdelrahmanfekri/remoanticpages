import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { slug, password } = await request.json()

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
  }

  if (!password) {
    return NextResponse.json({ error: 'Password is required' }, { status: 400 })
  }

  const { data: page, error } = await supabase
    .from('pages')
    .select('id, password_hash')
    .eq('slug', slug)
    .single()

  if (error || !page) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 })
  }

  if (!page.password_hash) {
    return NextResponse.json({ valid: true })
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

    return NextResponse.json({ valid: true })
  }

  return NextResponse.json({ valid: false, error: 'Incorrect password' }, { status: 401 })
}

