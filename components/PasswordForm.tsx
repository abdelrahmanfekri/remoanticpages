'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function PasswordForm({ slug, recipientName }: { slug: string; recipientName: string }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch(`/api/pages/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, password }),
    })

    const data = await res.json()

    if (data.valid) {
      router.push(`/p/${slug}?password=${encodeURIComponent(password)}`)
    } else {
      setError(data.error || 'Incorrect password')
      setLoading(false)
    }
  }

  return (
    <div
      className="relative z-10 glass-card soft-glow max-w-md w-full mx-4 p-8 space-y-6 rounded-3xl shadow-xl border-2 border-rose-100 bg-gradient-to-tl from-rose-50 via-pink-50 to-rose-100"
      style={{
        boxShadow: '0 4px 32px 8px rgba(244,114,182,0.10), 0 2px 8px 1px rgba(239, 68, 98, 0.10)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Lovely heart accent */}
      <div className="absolute -top-7 left-1/2 transform -translate-x-1/2">
        <span className="flex items-center justify-center w-16 h-16 bg-pink-200 rounded-full shadow-lg border-4 border-rose-200">
          <svg
            width="34"
            height="34"
            viewBox="0 0 32 32"
            fill="none"
            className="mx-auto animate-bounce"
          >
            <path
              d="M16 28s-8-5.33-11.31-9.06A7.5 7.5 0 018 4a6.54 6.54 0 018 4 6.54 6.54 0 018-4 7.5 7.5 0 013.31 14.94C24 22.67 16 28 16 28z"
              fill="url(#heart-gradient)"
              stroke="#F43F5E"
              strokeWidth="2"
            />
            <defs>
              <linearGradient id="heart-gradient" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F9A8D4" />
                <stop offset="1" stopColor="#F43F5E" />
              </linearGradient>
            </defs>
          </svg>
        </span>
      </div>
      <p className="text-center text-[13px] uppercase tracking-[0.28em] text-rose-400 font-semibold mt-8 drop-shadow-sm">
        Private – for <span className="text-pink-500">{recipientName}</span> only
      </p>
      <h1 className="text-4xl md:text-5xl font-serif text-rose-500 text-center drop-shadow font-bold flex items-center justify-center gap-2">
        Just for you
        <span className="inline-block animate-pulse">💖</span>
      </h1>
      <p className="text-rose-600/90 text-center text-base md:text-lg font-arabic font-semibold">
        This page is password protected.<br />
        <span className="text-pink-400/80 font-light">Enter the secret word to unlock something magical!</span>
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="💌 Your secret word..."
            autoFocus
            className="w-full rounded-full border-2 border-rose-200 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-pink-300 bg-white/80 text-center text-lg shadow-inner transition"
            style={{
              boxShadow:
                '0 2px 12px 0 rgba(244,114,182,0.07), 0 1px 4px 0 rgba(239, 68, 98, 0.08)'
            }}
          />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-pink-300 select-none pointer-events-none">
            🔒
          </span>
        </div>
        {error && (
          <div className="flex flex-col items-center">
            <p className="text-sm text-center text-rose-500 font-semibold animate-shake">{error}</p>
            <span className="text-xs text-gray-400 mt-1">If you forgot, ask your sender! 🌸</span>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 text-white py-3 rounded-full shadow-lg font-semibold text-lg soft-glow hover:scale-105 transition-transform duration-200 tracking-wide border-2 border-pink-300 active:scale-95 disabled:opacity-60"
        >
          {loading ? (
            <span>
              <span className="animate-spin inline-block mr-2">💖</span>
              Checking...
            </span>
          ) : (
            <>
              <span className="mr-2">🔓</span>
              Open
            </>
          )}
        </button>
      </form>
      <div className="mt-3 text-center text-xs text-rose-400 animate-fade-in-slow">
        With love, sealed just for you <span className="animate-pulse">🌷</span>
      </div>
    </div>
  )
}

