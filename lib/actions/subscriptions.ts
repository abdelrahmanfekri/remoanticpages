'use server'

import { createClient } from '@/lib/supabase/server'
import { getUserSubscription } from '@/lib/subscription'

export interface CurrentSubscriptionResult {
  tier: 'free' | 'premium' | 'pro'
  status: string | null
  isLifetime?: boolean
  currentPeriodStart?: string
  currentPeriodEnd?: string
  cancelAtPeriodEnd?: boolean
  error?: string
}

export async function getCurrentSubscription(): Promise<CurrentSubscriptionResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { tier: 'free', status: null }
    }

    const subscription = await getUserSubscription(user.id)

    if (!subscription) {
      return { tier: 'free', status: null }
    }

    return {
      tier: subscription.tier,
      status: subscription.status,
      isLifetime: subscription.isLifetime,
      currentPeriodStart: subscription.currentPeriodStart.toISOString(),
      currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    }
  } catch (error) {
    console.error('Get subscription error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return { tier: 'free', status: null, error: errorMessage }
  }
}

