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
