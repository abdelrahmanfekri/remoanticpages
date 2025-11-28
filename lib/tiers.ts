/**
 * Tier management and feature gating utilities
 */

export type Tier = 'free' | 'premium' | 'pro'
export type Feature = 
  | 'unlimited_pages'
  | 'premium_templates'
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
  premium: {
    maxPages: 5,
    maxImagesPerPage: 10,
    maxVideosPerPage: 2,
    canUseMusic: true,
    canUseAdvancedAI: false,
    canUseCustomAnimations: false,
    canViewAnalytics: true,
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
}

export const FEATURE_TIERS: Record<Feature, Tier> = {
  unlimited_pages: 'premium',
  premium_templates: 'premium',
  unlimited_images: 'premium',
  videos: 'premium',
  music: 'premium',
  advanced_ai: 'pro',
  custom_animations: 'pro',
  analytics: 'premium',
}

export function canUseFeature(feature: Feature, userTier: Tier): boolean {
  const requiredTier = FEATURE_TIERS[feature]
  const tierOrder: Tier[] = ['free', 'premium', 'pro']
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
      message: `Free tier allows ${limits.maxPages} pages. Upgrade to Premium for unlimited pages.`,
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
    const nextTier = tier === 'free' ? 'Premium' : 'Pro'
    return {
      allowed: false,
      message: `${nextTier} tier allows ${imageLimit === Infinity ? 'unlimited' : imageLimit} images per page. Upgrade${nextTier === 'Pro' ? ' to Pro' : ''} for ${nextTier === 'Pro' ? 'unlimited' : imageLimit} images.`,
      type: 'image',
    }
  }

  const canUseVideos = canUseFeature('videos', tier)
  const videoLimit = TIER_LIMITS[tier].maxVideosPerPage

  if (!canUseVideos && currentVideoCount > 0) {
    return {
      allowed: false,
      message: `Videos are not available on the ${tier === 'free' ? 'Free' : tier.charAt(0).toUpperCase() + tier.slice(1)} tier. Upgrade to Premium to add videos.`,
      type: 'video',
    }
  }
  if (canUseVideos && videoLimit !== Infinity && currentVideoCount >= videoLimit) {
    const nextTier = tier === 'free' ? 'Premium' : 'Pro'
    return {
      allowed: false,
      message: `${nextTier} tier allows ${videoLimit === Infinity ? 'unlimited' : videoLimit} videos per page. Upgrade${nextTier === 'Pro' ? ' to Pro' : ''} for ${nextTier === 'Pro' ? 'unlimited' : videoLimit} videos.`,
      type: 'video',
    }
  }

  return { allowed: true }
}


export function getUpgradeMessage(feature: Feature, currentTier: Tier): string {
  const requiredTier = FEATURE_TIERS[feature]
  if (currentTier === requiredTier) {
    return ''
  }
  
  const tierNames = {
    free: 'Free',
    premium: 'Premium',
    pro: 'Pro',
  }
  
  return `This feature requires ${tierNames[requiredTier]}. Upgrade now to unlock it!`
}

export function getTierDisplayName(tier: Tier): string {
  const names = {
    free: 'Free',
    premium: 'Premium',
    pro: 'Pro',
  }
  return names[tier]
}

export function getTierPrice(tier: Tier): number {
  const prices = {
    free: 0,
    premium: 4.99, // Monthly subscription
    pro: 9.99, // Monthly subscription
  }
  return prices[tier]
}

