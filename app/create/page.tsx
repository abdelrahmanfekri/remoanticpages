'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, LayoutTemplate, FileText, ArrowRight, Crown, Loader2 } from 'lucide-react'
import { getCurrentSubscription } from '@/lib/actions/subscriptions'
import type { Tier } from '@/lib/tiers'

export default function CreatePage() {
  const [userTier, setUserTier] = useState<Tier>('free')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTier = async () => {
      try {
        const subscriptionData = await getCurrentSubscription()
        setUserTier(subscriptionData.tier || 'free')
      } catch (error) {
        console.error('Failed to fetch tier:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTier()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-rose-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const creationMethods = [
    {
      id: 'ai-prompt',
      title: 'Create with AI',
      description: 'Describe what you want and let AI generate a personalized page for you',
      icon: <Sparkles size={32} />,
      href: '/create/prompt',
      color: 'from-rose-500 to-pink-500',
      accentColor: 'rose',
      badge: 'Recommended',
      premium: false,
    },
    {
      id: 'template',
      title: 'Choose Template',
      description: 'Start with a beautiful pre-designed template and customize it',
      icon: <LayoutTemplate size={32} />,
      href: '/dashboard/create',
      color: 'from-purple-500 to-pink-500',
      accentColor: 'purple',
      premium: false,
    },
    {
      id: 'blank',
      title: 'Start Blank',
      description: 'Build your page from scratch with complete creative freedom',
      icon: <FileText size={32} />,
      href: '/dashboard/create?template=blank',
      color: 'from-blue-500 to-purple-500',
      accentColor: 'blue',
      premium: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500 mb-4 md:mb-6">
            Create Your Page
          </h1>
          <p className="text-lg md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Choose how you'd like to start creating your beautiful personalized page
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {creationMethods.map((method) => (
            <Link
              key={method.id}
              href={method.href}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden touch-manipulation active:scale-95 md:hover:scale-105"
            >
              {method.badge && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold shadow-lg">
                    ⭐ {method.badge}
                  </span>
                </div>
              )}

              <div className="p-6 md:p-8">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-r ${method.color} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  {method.icon}
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  {method.title}
                </h3>
                <p className="text-base md:text-lg text-gray-600 mb-6 min-h-[60px]">
                  {method.description}
                </p>

                <div
                  className={`inline-flex items-center gap-2 text-${method.accentColor}-600 font-semibold group-hover:gap-3 transition-all`}
                >
                  <span>Get Started</span>
                  <ArrowRight size={20} />
                </div>
              </div>

              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${method.color} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}
              />
            </Link>
          ))}
        </div>

        <div className="mt-12 md:mt-16 text-center">
          <div className="inline-block bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-2xl">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              Not sure which to choose?
            </h3>
            <p className="text-base md:text-lg text-gray-600 mb-4">
              We recommend starting with <strong className="text-rose-600">AI creation</strong> for
              the fastest and easiest experience. Just describe what you want, and our AI will
              generate a personalized page in seconds!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/create/prompt"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-semibold hover:scale-105 transition-transform shadow-lg"
              >
                <Sparkles size={20} />
                Try AI Creation
              </Link>
              {userTier === 'free' && (
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:scale-105 transition-transform shadow-lg"
                >
                  <Crown size={20} />
                  View Premium Features
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="text-gray-600 hover:text-rose-600 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

