'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-50 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <Heart className="mx-auto text-rose-400" size={64} />
        <h1 className="text-4xl md:text-6xl font-serif text-rose-500">Oops!</h1>
        <h2 className="text-2xl font-serif text-gray-700">Something went wrong</h2>
        <p className="text-gray-600">{error.message || 'An unexpected error occurred'}</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-full soft-glow hover:scale-105 transition-transform duration-200 font-medium"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="bg-white text-rose-500 px-8 py-3 rounded-full border-2 border-rose-200 hover:border-rose-300 transition-colors font-medium"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}

