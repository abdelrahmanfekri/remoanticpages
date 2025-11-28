import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-50 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <Heart className="mx-auto text-rose-400" size={64} />
        <h1 className="text-4xl md:text-6xl font-serif text-rose-500">404</h1>
        <h2 className="text-2xl font-serif text-gray-700">Page Not Found</h2>
        <p className="text-gray-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-full soft-glow hover:scale-105 transition-transform duration-200 font-medium"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}

