'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Heart, AlertCircle, Mail, Lock, Chrome } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const supabase = createClient()

  useEffect(() => {
    // Check for error from auth callback
    const errorParam = searchParams.get('error')
    if (errorParam === 'auth_failed') {
      setError('Authentication failed. Please try again.')
    }
  }, [searchParams])

  const handleEmailPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (isSignUp) {
      // Sign up
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
      } else {
        setError('')
        // Check if email confirmation is required
        if (data.user && !data.session) {
          setError('Please check your email to confirm your account before signing in.')
          setLoading(false)
        } else {
          // Auto-signed in, redirect
          router.push(redirect)
        }
      }
    } else {
      // Sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        setLoading(false)
      } else {
        router.push(redirect)
      }
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')

    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    })

    if (googleError) {
      setError(googleError.message)
      setLoading(false)
    }
    // OAuth will redirect, so we don't need to handle success here
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-50 py-12 px-4">
      <div className="glass-card soft-glow max-w-md w-full mx-4 p-8 space-y-6">
        <div className="text-center">
          <Heart className="mx-auto text-rose-500 mb-4" size={48} />
          <h1 className="text-3xl font-serif text-rose-500 mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600">
            {isSignUp ? 'Sign up to create beautiful love pages' : 'Sign in to create beautiful love pages'}
          </p>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50"
        >
          <Chrome size={20} className="text-blue-500" />
          {loading ? 'Loading...' : 'Continue with Google'}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailPassword} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-rose-200 px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-lg border border-rose-200 px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                placeholder={isSignUp ? 'At least 6 characters' : 'Your password'}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-lg soft-glow hover:scale-105 transition-transform duration-200 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Heart size={18} />
            {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
            }}
            className="text-sm text-rose-600 hover:text-rose-700 font-medium"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  )
}

