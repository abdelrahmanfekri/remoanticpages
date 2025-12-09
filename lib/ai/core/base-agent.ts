import { AIClient, createAIClient, getModelForTier } from './client'
import type { Tier } from '@/lib/tiers'

export interface AgentConfig {
  tier: Tier
  temperature?: number
  maxTokens?: number
}

export interface ProgressCallback {
  (step: string, status: 'pending' | 'in_progress' | 'completed' | 'error', message: string): void
}

export abstract class BaseAgent {
  protected client: AIClient
  protected tier: Tier
  protected progressCallback?: ProgressCallback

  constructor(config: AgentConfig) {
    const model = getModelForTier(config.tier)
    this.client = createAIClient({
      model,
      temperature: config.temperature ?? this.getDefaultTemperature(),
      maxTokens: config.maxTokens ?? this.getDefaultMaxTokens(),
    })
    this.tier = config.tier
  }

  protected abstract getDefaultTemperature(): number
  protected abstract getDefaultMaxTokens(): number

  setProgressCallback(callback: ProgressCallback) {
    this.progressCallback = callback
  }

  protected updateProgress(step: string, status: 'pending' | 'in_progress' | 'completed' | 'error', message: string) {
    this.progressCallback?.(step, status, message)
  }

  protected async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  protected isPremiumTier(): boolean {
    return this.tier !== 'free'
  }

  protected getTierLimits() {
    return {
      maxBlocks: this.tier === 'free' ? 5 : this.tier === 'pro' ? 15 : 25,
      advancedFeatures: this.tier !== 'free',
      mediaSupport: this.tier !== 'free',
    }
  }
}
