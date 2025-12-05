'use client'

import { X, Sparkles, Lock } from 'lucide-react'
import Link from 'next/link'
import type { Tier } from '@/lib/tiers'
import { getTierDisplayName, getTierPrice, getTierLimits, TIER_LIMITS } from '@/lib/tiers'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  feature: string
  requiredTier: Tier
  currentTier: Tier
  onSkip?: () => void
}

// Helper function to generate feature list based on tier limits
function getTierFeatures(tier: Tier): string[] {
  const limits = getTierLimits(tier)
  const features: string[] = []

  // Pages
  if (limits.maxPages === Infinity) {
    features.push('Unlimited pages')
  } else if (limits.maxPages > 1) {
    features.push(`Up to ${limits.maxPages} pages`)
  }

  // Images
  if (limits.maxImagesPerPage === Infinity) {
    features.push('Unlimited images per page')
  } else if (limits.maxImagesPerPage > 3) {
    features.push(`Up to ${limits.maxImagesPerPage} images per page`)
  }

  // Videos
  if (limits.maxVideosPerPage === Infinity) {
    features.push('Unlimited videos per page')
  } else if (limits.maxVideosPerPage > 0) {
    features.push(`Up to ${limits.maxVideosPerPage} video${limits.maxVideosPerPage > 1 ? 's' : ''} per page`)
  }

  // Music
  if (limits.canUseMusic) {
    features.push('Background music support')
  }

  // Advanced AI
  if (limits.canUseAdvancedAI) {
    features.push('Advanced AI features')
    features.push('AI-powered translations')
  }

  // Custom animations
  if (limits.canUseCustomAnimations) {
    features.push('Custom animations')
  }

  // Analytics
  if (limits.canViewAnalytics) {
    features.push('Analytics dashboard')
  }

  // Premium tier specific additions
  if (tier === 'premium') {
    features.push('Unlimited AI generations')
    features.push('Multiple languages support')
  }

  // Pro tier specific additions
  if (tier === 'pro') {
    features.unshift('Everything in Premium')
    features.push('Unlimited languages')
    features.push('Custom domain support')
    features.push('Priority customer support')
  }

  return features
}

export function UpgradeModal({
  isOpen,
  onClose,
  feature,
  requiredTier,
  currentTier,
  onSkip,
}: UpgradeModalProps) {
  if (!isOpen) return null

  const tierName = getTierDisplayName(requiredTier)
  const tierPrice = getTierPrice(requiredTier)
  const tierFeatures = getTierFeatures(requiredTier)
  const currentTierName = getTierDisplayName(currentTier)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-soft-rise">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full">
              <Lock className="text-rose-600" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-serif text-gray-900">Upgrade Required</h3>
              <p className="text-sm text-gray-500">Unlock this feature</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            <span className="font-semibold">{feature}</span> requires{' '}
            <span className="font-semibold text-rose-600">{tierName}</span> tier.
            {currentTier !== requiredTier && (
              <span className="block mt-1 text-sm text-gray-500">
                You're currently on the {currentTierName} tier.
              </span>
            )}
          </p>

          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-4 border border-rose-200">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="text-rose-500" size={20} />
              <div className="flex-1">
                <span className="font-semibold text-rose-700 text-lg">
                  {tierName}
                </span>
                {tierPrice > 0 && (
                  <span className="text-sm text-gray-600 ml-2">
                    ${tierPrice.toFixed(2)}/month
                  </span>
                )}
                {tierPrice === 0 && (
                  <span className="text-sm text-gray-600 ml-2">Free</span>
                )}
              </div>
            </div>
            <ul className="text-sm text-gray-700 space-y-1.5">
              {tierFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/pricing?tier=${requiredTier}`}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-full hover:scale-105 transition-transform duration-200 font-semibold"
          >
            <Sparkles size={18} />
            Upgrade Now
          </Link>
          {onSkip && (
            <button
              onClick={onSkip}
              className="flex-1 px-6 py-3 rounded-full border-2 border-gray-200 text-gray-700 hover:border-gray-300 transition-colors font-medium"
            >
              Skip This Feature
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-full border-2 border-gray-200 text-gray-700 hover:border-gray-300 transition-colors font-medium sm:hidden"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  )
}

