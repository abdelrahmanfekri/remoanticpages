import { createClient } from '@/lib/supabase/server'
import { getUserTier } from '@/lib/subscription'
import { Navbar } from './Navbar'

export async function NavbarWrapper() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let userTier: 'free' | 'pro' | 'lifetime' = 'free'
  
  if (user) {
    userTier = await getUserTier(user.id)
  }

  return (
    <Navbar
      user={user ? { id: user.id, email: user.email } : null}
      userTier={userTier}
    />
  )
}

