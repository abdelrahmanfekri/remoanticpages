import type { Tier } from '@/lib/tiers'

interface RateLimitConfig {
  tier: Tier
  operation: 'page-generation' | 'block-enhancement' | 'refinement' | 'analysis'
}

interface RateLimitStatus {
  allowed: boolean
  remaining: number
  resetAt: Date
  message?: string
}

const LIMITS: Record<Tier, Record<string, { requests: number; window: number }>> = {
  free: {
    'page-generation': { requests: 1, window: 24 * 60 * 60 * 1000 }, // 1 per day
    'block-enhancement': { requests: 5, window: 24 * 60 * 60 * 1000 }, // 5 per day
    'refinement': { requests: 2, window: 60 * 60 * 1000 }, // 2 per hour
    'analysis': { requests: 3, window: 24 * 60 * 60 * 1000 }, // 3 per day
  },
  premium: {
    'page-generation': { requests: 10, window: 24 * 60 * 60 * 1000 }, // 10 per day
    'block-enhancement': { requests: 50, window: 24 * 60 * 60 * 1000 }, // 50 per day
    'refinement': { requests: 10, window: 60 * 60 * 1000 }, // 10 per hour
    'analysis': { requests: 20, window: 24 * 60 * 60 * 1000 }, // 20 per day
  },
  pro: {
    'page-generation': { requests: -1, window: 0 }, // Unlimited
    'block-enhancement': { requests: -1, window: 0 }, // Unlimited
    'refinement': { requests: -1, window: 0 }, // Unlimited
    'analysis': { requests: -1, window: 0 }, // Unlimited
  },
}

const usageCache = new Map<string, Array<{ timestamp: number }>>()

export class RateLimiter {
  constructor(private tier: Tier) {}

  async checkLimit(operation: RateLimitConfig['operation'], userId: string): Promise<RateLimitStatus> {
    const limit = LIMITS[this.tier][operation]
    
    // Pro tier has unlimited
    if (limit.requests === -1) {
      return {
        allowed: true,
        remaining: -1,
        resetAt: new Date(Date.now() + limit.window),
      }
    }

    const key = `${userId}:${operation}`
    const now = Date.now()
    const windowStart = now - limit.window

    let usage = usageCache.get(key) || []
    usage = usage.filter((entry) => entry.timestamp > windowStart)

    if (usage.length >= limit.requests) {
      const oldestRequest = usage[0]
      const resetAt = new Date(oldestRequest.timestamp + limit.window)
      
      return {
        allowed: false,
        remaining: 0,
        resetAt,
        message: `Rate limit exceeded. Resets at ${resetAt.toLocaleTimeString()}`,
      }
    }

    return {
      allowed: true,
      remaining: limit.requests - usage.length,
      resetAt: new Date(now + limit.window),
    }
  }

  async recordUsage(operation: RateLimitConfig['operation'], userId: string): Promise<void> {
    const key = `${userId}:${operation}`
    const usage = usageCache.get(key) || []
    
    usage.push({ timestamp: Date.now() })
    usageCache.set(key, usage)
  }

  async getRemainingQuota(operation: RateLimitConfig['operation'], userId: string): Promise<number> {
    const status = await this.checkLimit(operation, userId)
    return status.remaining
  }

  async getUsageStats(userId: string): Promise<Record<string, { used: number; limit: number; remaining: number }>> {
    const stats: Record<string, { used: number; limit: number; remaining: number }> = {}

    for (const operation of ['page-generation', 'block-enhancement', 'refinement', 'analysis'] as const) {
      const limit = LIMITS[this.tier][operation]
      const key = `${userId}:${operation}`
      const now = Date.now()
      const windowStart = now - limit.window

      let usage = usageCache.get(key) || []
      usage = usage.filter((entry) => entry.timestamp > windowStart)

      stats[operation] = {
        used: usage.length,
        limit: limit.requests === -1 ? Infinity : limit.requests,
        remaining: limit.requests === -1 ? Infinity : Math.max(0, limit.requests - usage.length),
      }
    }

    return stats
  }

  getTierLimits(): Record<string, { requests: number; window: string }> {
    const limits = LIMITS[this.tier]
    const formatted: Record<string, { requests: number; window: string }> = {}

    for (const [operation, config] of Object.entries(limits)) {
      const windowHours = config.window / (60 * 60 * 1000)
      formatted[operation] = {
        requests: config.requests,
        window: windowHours >= 24 ? `${windowHours / 24} day(s)` : `${windowHours} hour(s)`,
      }
    }

    return formatted
  }
}

export function createRateLimiter(tier: Tier): RateLimiter {
  return new RateLimiter(tier)
}

export function clearUsageCache(userId?: string) {
  if (userId) {
    for (const key of usageCache.keys()) {
      if (key.startsWith(userId)) {
        usageCache.delete(key)
      }
    }
  } else {
    usageCache.clear()
  }
}

