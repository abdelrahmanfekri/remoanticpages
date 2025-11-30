interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  maxSize?: number // Maximum cache size
}

const DEFAULT_TTL = 60 * 60 * 1000 // 1 hour
const DEFAULT_MAX_SIZE = 1000

export class AIResponseCache<T = any> {
  private cache: Map<string, CacheEntry<T>>
  private ttl: number
  private maxSize: number

  constructor(options: CacheOptions = {}) {
    this.cache = new Map()
    this.ttl = options.ttl || DEFAULT_TTL
    this.maxSize = options.maxSize || DEFAULT_MAX_SIZE
  }

  set(key: string, data: T, customTTL?: number): void {
    const now = Date.now()
    const ttl = customTTL || this.ttl
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttl,
    }

    if (this.cache.size >= this.maxSize) {
      this.evictOldest()
    }

    this.cache.set(key, entry)
  }

  get(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  clearExpired(): number {
    const now = Date.now()
    let cleared = 0

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
        cleared++
      }
    }

    return cleared
  }

  size(): number {
    return this.cache.size
  }

  getStats(): {
    size: number
    maxSize: number
    oldestEntry: Date | null
    newestEntry: Date | null
  } {
    let oldestTimestamp = Infinity
    let newestTimestamp = 0

    for (const entry of this.cache.values()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp
      }
      if (entry.timestamp > newestTimestamp) {
        newestTimestamp = entry.timestamp
      }
    }

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      oldestEntry: oldestTimestamp === Infinity ? null : new Date(oldestTimestamp),
      newestEntry: newestTimestamp === 0 ? null : new Date(newestTimestamp),
    }
  }

  private evictOldest(): void {
    let oldestKey: string | null = null
    let oldestTimestamp = Infinity

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey)
    }
  }
}

export function createCacheKey(...parts: (string | number | boolean)[]): string {
  return parts.map(String).join(':')
}

export function hashPrompt(prompt: string): string {
  let hash = 0
  for (let i = 0; i < prompt.length; i++) {
    const char = prompt.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

export const pageGenerationCache = new AIResponseCache({
  ttl: 24 * 60 * 60 * 1000, // 24 hours
  maxSize: 500,
})

export const blockEnhancementCache = new AIResponseCache({
  ttl: 60 * 60 * 1000, // 1 hour
  maxSize: 1000,
})

export const analysisCache = new AIResponseCache({
  ttl: 30 * 60 * 1000, // 30 minutes
  maxSize: 200,
})

setInterval(() => {
  pageGenerationCache.clearExpired()
  blockEnhancementCache.clearExpired()
  analysisCache.clearExpired()
}, 5 * 60 * 1000) // Clean up every 5 minutes

