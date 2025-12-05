import { createClient } from '@/lib/supabase/server'
import type { Tier } from './tiers'

export interface UserSubscription {
  tier: Tier
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  isLifetime: boolean
}

export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  const supabase = await createClient()
  
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('tier, status, current_period_start, current_period_end, cancel_at_period_end')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()

  if (subscription) {
    const periodEnd = new Date(subscription.current_period_end)
    if (periodEnd >= new Date()) {
      return {
        tier: subscription.tier as Tier,
        status: 'active',
        currentPeriodStart: new Date(subscription.current_period_start),
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
        isLifetime: false,
      }
    } else {
      await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('user_id', userId)
        .eq('status', 'active')
      return null
    }
  }
  return null
}

/**
 * Get user's current tier (checks lifetime purchases first, then subscriptions, defaults to free)
 */
export async function getUserTier(userId: string): Promise<Tier> {
  const supabase = await createClient()
  
  // Check for lifetime purchase first (lifetime takes priority)
  const { data: purchase } = await supabase
    .from('purchases')
    .select('tier')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .eq('tier', 'lifetime')
    .single()

  if (purchase) {
    return purchase.tier as Tier
  }

  // Check for active subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('tier, current_period_end')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()

  if (subscription) {
    const periodEnd = new Date(subscription.current_period_end)
    if (periodEnd >= new Date()) {
      return subscription.tier as Tier
    }
  }

  // Default to free
  return 'free'
}
