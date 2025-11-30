export interface TokenUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
  cost: number
}

export interface UsageRecord {
  userId: string
  operation: string
  model: string
  tokens: TokenUsage
  timestamp: Date
}

const PRICING = {
  'gpt-4o-mini': {
    prompt: 0.00015 / 1000, // $0.15 per 1M tokens
    completion: 0.0006 / 1000, // $0.60 per 1M tokens
  },
  'gpt-4o': {
    prompt: 0.005 / 1000, // $5 per 1M tokens
    completion: 0.015 / 1000, // $15 per 1M tokens
  },
}

const usageRecords: UsageRecord[] = []

export class TokenCounter {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  recordUsage(operation: string, model: string, tokens: TokenUsage): void {
    const record: UsageRecord = {
      userId: this.userId,
      operation,
      model,
      tokens,
      timestamp: new Date(),
    }
    
    usageRecords.push(record)
  }

  calculateCost(model: string, promptTokens: number, completionTokens: number): number {
    const pricing = PRICING[model as keyof typeof PRICING]
    if (!pricing) return 0

    const promptCost = promptTokens * pricing.prompt
    const completionCost = completionTokens * pricing.completion
    
    return promptCost + completionCost
  }

  getUserUsage(startDate?: Date, endDate?: Date): {
    totalTokens: number
    totalCost: number
    byOperation: Record<string, { tokens: number; cost: number; count: number }>
  } {
    const filtered = usageRecords.filter((record) => {
      if (record.userId !== this.userId) return false
      if (startDate && record.timestamp < startDate) return false
      if (endDate && record.timestamp > endDate) return false
      return true
    })

    let totalTokens = 0
    let totalCost = 0
    const byOperation: Record<string, { tokens: number; cost: number; count: number }> = {}

    for (const record of filtered) {
      totalTokens += record.tokens.totalTokens
      totalCost += record.tokens.cost

      if (!byOperation[record.operation]) {
        byOperation[record.operation] = { tokens: 0, cost: 0, count: 0 }
      }

      byOperation[record.operation].tokens += record.tokens.totalTokens
      byOperation[record.operation].cost += record.tokens.cost
      byOperation[record.operation].count++
    }

    return { totalTokens, totalCost, byOperation }
  }

  getUsageToday(): { tokens: number; cost: number } {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const usage = this.getUserUsage(today)
    return {
      tokens: usage.totalTokens,
      cost: usage.totalCost,
    }
  }

  getUsageThisMonth(): { tokens: number; cost: number } {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    
    const usage = this.getUserUsage(startOfMonth)
    return {
      tokens: usage.totalTokens,
      cost: usage.totalCost,
    }
  }

  estimateTokens(text: string): number {
    return Math.ceil(text.length / 4)
  }

  estimateCost(model: string, promptText: string, expectedCompletionLength = 500): number {
    const promptTokens = this.estimateTokens(promptText)
    const completionTokens = this.estimateTokens('x'.repeat(expectedCompletionLength))
    
    return this.calculateCost(model, promptTokens, completionTokens)
  }

  getModelPricing(model: string): { prompt: number; completion: number } | null {
    const pricing = PRICING[model as keyof typeof PRICING]
    if (!pricing) return null

    return {
      prompt: pricing.prompt * 1000000, // per 1M tokens
      completion: pricing.completion * 1000000,
    }
  }
}

export function createTokenCounter(userId: string): TokenCounter {
  return new TokenCounter(userId)
}

export function getGlobalUsageStats(): {
  totalRequests: number
  totalTokens: number
  totalCost: number
  byUser: Record<string, { tokens: number; cost: number; requests: number }>
} {
  let totalRequests = usageRecords.length
  let totalTokens = 0
  let totalCost = 0
  const byUser: Record<string, { tokens: number; cost: number; requests: number }> = {}

  for (const record of usageRecords) {
    totalTokens += record.tokens.totalTokens
    totalCost += record.tokens.cost

    if (!byUser[record.userId]) {
      byUser[record.userId] = { tokens: 0, cost: 0, requests: 0 }
    }

    byUser[record.userId].tokens += record.tokens.totalTokens
    byUser[record.userId].cost += record.tokens.cost
    byUser[record.userId].requests++
  }

  return { totalRequests, totalTokens, totalCost, byUser }
}

export function clearUsageRecords(userId?: string) {
  if (userId) {
    const filtered = usageRecords.filter((record) => record.userId !== userId)
    usageRecords.length = 0
    usageRecords.push(...filtered)
  } else {
    usageRecords.length = 0
  }
}

