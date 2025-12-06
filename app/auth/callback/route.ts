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
    
    // Handle OAuth code exchange
    if (code) {
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('OAuth code exchange error:', exchangeError)
        const url = new URL(`${origin}/login`)
        url.searchParams.set('error', 'oauth_failed')
        url.searchParams.set('message', 'OAuth authentication failed. Please try signing in again.')
        return NextResponse.redirect(url)
      }

      if (data.session && data.user) {
        // Successfully authenticated via OAuth
        const redirectUrl = redirect.startsWith('/') ? `${origin}${redirect}` : redirect
        return NextResponse.redirect(redirectUrl)
      }
    }
    
    // Check if user is already authenticated (for cases where code was already exchanged)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const redirectUrl = redirect.startsWith('/') ? `${origin}${redirect}` : redirect
      return NextResponse.redirect(redirectUrl)
    }
    
    // Handle email confirmation token
    if (token && type) {
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
          const redirectUrl = redirect.startsWith('/') ? `${origin}${redirect}` : redirect
          return NextResponse.redirect(redirectUrl)
        }
      }
    }
    
    // No valid authentication found
    const url = new URL(`${origin}/login`)
    url.searchParams.set('error', 'auth_failed')
    url.searchParams.set('message', 'Authentication failed. Please try again.')
    return NextResponse.redirect(url)
  } catch (error) {
    console.error('Callback error:', error)
    const url = new URL(`${origin}/login`)
    url.searchParams.set('error', 'auth_failed')
    url.searchParams.set('message', 'An unexpected error occurred. Please try again.')
    return NextResponse.redirect(url)
  }
}
