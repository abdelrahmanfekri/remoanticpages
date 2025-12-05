/**
 * Tier management and feature gating utilities
 */

export type Tier = 'free' | 'pro' | 'lifetime'
export type Feature = 
  | 'unlimited_pages'
  | 'unlimited_images'
  | 'videos'
  | 'music'
  | 'advanced_ai'
  | 'custom_animations'
  | 'analytics'

export interface TierLimits {
  maxPages: number
  maxImagesPerPage: number
  maxVideosPerPage: number
  canUseMusic: boolean
  canUseAdvancedAI: boolean
  canUseCustomAnimations: boolean
  canViewAnalytics: boolean
}

export const TIER_LIMITS: Record<Tier, TierLimits> = {
  free: {
    maxPages: 1,
    maxImagesPerPage: 3,
    maxVideosPerPage: 0,
    canUseMusic: false,
    canUseAdvancedAI: false,
    canUseCustomAnimations: false,
    canViewAnalytics: false,
  },
  pro: {
    maxPages: Infinity,
    maxImagesPerPage: Infinity,
    maxVideosPerPage: Infinity,
    canUseMusic: true,
    canUseAdvancedAI: true,
    canUseCustomAnimations: true,
    canViewAnalytics: true,
  },
  lifetime: {
    maxPages: Infinity,
    maxImagesPerPage: Infinity,
    maxVideosPerPage: Infinity,
    canUseMusic: true,
    canUseAdvancedAI: true,
    canUseCustomAnimations: true,
    canViewAnalytics: true,
  },
}

export const FEATURE_TIERS: Record<Feature, Tier> = {
  unlimited_pages: 'pro',
  unlimited_images: 'pro',
  videos: 'pro',
  music: 'pro',
  advanced_ai: 'pro',
  custom_animations: 'pro',
  analytics: 'pro',
}

export function canUseFeature(feature: Feature, userTier: Tier): boolean {
  const requiredTier = FEATURE_TIERS[feature]
  const tierOrder: Tier[] = ['free', 'pro', 'lifetime']
  return tierOrder.indexOf(userTier) >= tierOrder.indexOf(requiredTier)
}

export function getTierLimits(tier: Tier): TierLimits {
  return TIER_LIMITS[tier]
}

export function checkPageLimit(tier: Tier, currentPageCount: number): { allowed: boolean; message?: string } {
  const limits = TIER_LIMITS[tier]
  if (limits.maxPages === Infinity) {
    return { allowed: true }
  }
  if (currentPageCount >= limits.maxPages) {
    return {
      allowed: false,
      message: `Free tier allows ${limits.maxPages} pages. Upgrade to Pro for unlimited pages.`,
    }
  }
  return { allowed: true }
}

export function checkMediaLimit(
  tier: Tier,
  currentImageCount: number,
  currentVideoCount: number
): { allowed: boolean; message?: string; type?: 'image' | 'video' } {
  const canUseUnlimitedImages = canUseFeature('unlimited_images', tier)
  const imageLimit = TIER_LIMITS[tier].maxImagesPerPage

  if (!canUseUnlimitedImages && imageLimit !== Infinity && currentImageCount >= imageLimit) {
    const nextTier = tier === 'free' ? 'Pro' : 'Lifetime'
    return {
      allowed: false,
      message: `${nextTier} tier allows ${imageLimit === Infinity ? 'unlimited' : imageLimit} images per page. Upgrade to ${nextTier} for unlimited images.`,
      type: 'image',
    }
  }

  const canUseVideos = canUseFeature('videos', tier)
  const videoLimit = TIER_LIMITS[tier].maxVideosPerPage

  if (!canUseVideos && currentVideoCount > 0) {
    return {
      allowed: false,
      message: `Videos are not available on the ${tier === 'free' ? 'Free' : tier.charAt(0).toUpperCase() + tier.slice(1)} tier. Upgrade to Pro to add videos.`,
      type: 'video',
    }
  }
  if (canUseVideos && videoLimit !== Infinity && currentVideoCount >= videoLimit) {
    const nextTier = tier === 'free' ? 'Pro' : 'Lifetime'
    return {
      allowed: false,
      message: `${nextTier} tier allows ${videoLimit === Infinity ? 'unlimited' : videoLimit} videos per page. Upgrade to ${nextTier} for unlimited videos.`,
      type: 'video',
    }
  }

  return { allowed: true }
}


export function getUpgradeMessage(feature: Feature, currentTier: Tier): string {
  const requiredTier = FEATURE_TIERS[feature]
  if (currentTier === requiredTier || currentTier === 'lifetime') {
    return ''
  }
  
  const tierNames = {
    free: 'Free',
    pro: 'Pro',
    lifetime: 'Lifetime',
  }
  
  return `This feature requires ${tierNames[requiredTier]}. Upgrade now to unlock it!`
}

export function getTierDisplayName(tier: Tier): string {
  const names = {
    free: 'Free',
    pro: 'Pro',
    lifetime: 'Lifetime',
  }
  return names[tier]
}

/**
 * Pricing configuration - single source of truth for all pricing
 */
export interface TierPricing {
  name: string
  price: number
  priceInCents: number
  priceLabel: string
  description: string
  isOneTime: boolean
}

export const TIER_PRICING: Record<Tier, TierPricing> = {
  free: {
    name: 'Free',
    price: 0,
    priceInCents: 0,
    priceLabel: 'Forever Free',
    description: 'Perfect for trying out',
    isOneTime: false,
  },
  pro: {
    name: 'Pro',
    price: 4.99,
    priceInCents: 499,
    priceLabel: 'per month',
    description: 'Unlimited features',
    isOneTime: false,
  },
  lifetime: {
    name: 'Lifetime',
    price: 59,
    priceInCents: 5900,
    priceLabel: 'one time',
    description: 'Pay once, use forever',
    isOneTime: true,
  },
}

export function getTierPrice(tier: Tier): number {
  return TIER_PRICING[tier].price
}

export function getTierPriceInCents(tier: Tier): number {
  return TIER_PRICING[tier].priceInCents
}

export function getTierPricing(tier: Tier): TierPricing {
  return TIER_PRICING[tier]
}
