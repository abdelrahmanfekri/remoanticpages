import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const token = requestUrl.searchParams.get('token')
  const type = requestUrl.searchParams.get('type')
  const redirect = requestUrl.searchParams.get('redirect') || '/dashboard'
  const origin = requestUrl.origin

  // Handle error from Supabase
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  
  if (error) {
    console.error('Auth callback error:', error, errorDescription)
    const url = new URL(`${origin}/login`)
    if (error === 'otp_expired' || errorDescription?.includes('expired')) {
      url.searchParams.set('error', 'link_expired')
    } else {
      url.searchParams.set('error', 'auth_failed')
    }
    return NextResponse.redirect(url)
  }

  try {
    const supabase = await createClient()
    
    // For OAuth flows, Supabase SSR's getUser() automatically exchanges the code
    // if the code verifier is in cookies. This is the recommended approach.
    // getUser() will handle the code exchange internally if needed.
    
    // Use getUser() - it automatically handles OAuth code exchange
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // User authenticated! Supabase handled OAuth code exchange automatically
      // Free tier is the default, no subscription record needed
      
      const redirectUrl = redirect.startsWith('/') ? `${origin}${redirect}` : redirect
      return NextResponse.redirect(redirectUrl)
    }
    
    // If no user, try email confirmation token
    if (token && type) {
      // Only handle email verification types
      if (type === 'email' || type === 'signup' || type === 'email_change') {
        const { data: { user: verifiedUser }, error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: type as 'email' | 'signup' | 'email_change',
        })
        
        if (verifyError) {
          console.error('Token verification error:', verifyError)
          const url = new URL(`${origin}/login`)
          url.searchParams.set('error', 'verification_failed')
          return NextResponse.redirect(url)
        }
        
        if (verifiedUser) {
          // Free tier is the default, no subscription record needed
          
          const redirectUrl = redirect.startsWith('/') ? `${origin}${redirect}` : redirect
          return NextResponse.redirect(redirectUrl)
        }
      }
    }
    
    // If we have a code but no user, the code verifier might be missing
    // This usually means the OAuth flow wasn't initiated properly or cookies were lost
    if (code) {
      console.error('OAuth code present but user not authenticated. Code verifier may be missing from cookies.')
      const url = new URL(`${origin}/login`)
      url.searchParams.set('error', 'oauth_failed')
      url.searchParams.set('message', 'OAuth authentication failed. Please try signing in again.')
      return NextResponse.redirect(url)
    }
    
    // No authentication method found
    const url = new URL(`${origin}/login`)
    url.searchParams.set('error', 'no_auth_code')
    return NextResponse.redirect(url)
  } catch (error) {
    console.error('Callback error:', error)
    const url = new URL(`${origin}/login`)
    url.searchParams.set('error', 'auth_failed')
    return NextResponse.redirect(url)
  }

  // URL to redirect to after sign in process completes
  const redirectUrl = redirect.startsWith('/') ? `${origin}${redirect}` : redirect
  return NextResponse.redirect(redirectUrl)
}


