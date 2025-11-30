import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import type { Tier } from '@/lib/tiers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
})

// Validate tier is one of the allowed values
function validateTier(tier: string | undefined): Tier {
  if (tier === 'premium' || tier === 'pro') {
    return tier as Tier
  }
  // Default to premium if invalid (shouldn't happen, but safety check)
  console.warn(`Invalid tier received: ${tier}, defaulting to premium`)
  return 'premium'
}

// Helper function to safely convert Stripe timestamp to ISO string
function convertStripeTimestamp(timestamp: number | undefined | null, fallbackDays: number = 30): string {
  try {
    if (timestamp && typeof timestamp === 'number') {
      return new Date(timestamp * 1000).toISOString()
    }
    // Fallback to current time + specified days
    return new Date(Date.now() + fallbackDays * 24 * 60 * 60 * 1000).toISOString()
  } catch (error) {
    console.error('Date conversion error:', error)
    return new Date(Date.now() + fallbackDays * 24 * 60 * 60 * 1000).toISOString()
  }
}

// Helper function to get subscription status
function getSubscriptionStatus(stripeStatus: string): 'active' | 'canceled' | 'past_due' | 'unpaid' {
  if (stripeStatus === 'active' || stripeStatus === 'trialing') {
    return 'active'
  }
  if (stripeStatus === 'canceled') {
    return 'canceled'
  }
  if (stripeStatus === 'past_due') {
    return 'past_due'
  }
  return 'unpaid'
}

// Helper function to get customer ID from Stripe subscription
function getCustomerId(customer: string | Stripe.Customer | Stripe.DeletedCustomer): string {
  if (typeof customer === 'string') {
    return customer
  }
  if (customer && typeof customer === 'object' && 'id' in customer) {
    return customer.id
  }
  return ''
}

// Helper function to upsert subscription to database
async function upsertSubscription(
  supabase: ReturnType<typeof createAdminClient>,
  subscription: Stripe.Subscription,
  userId: string,
  tier: Tier
) {
  const subData = subscription as any
  const periodStart = convertStripeTimestamp(subData.current_period_start, 0)
  const periodEnd = convertStripeTimestamp(subData.current_period_end, 30)
  const status = getSubscriptionStatus(subscription.status)
  const customerId = getCustomerId(subscription.customer)

  const { error, data } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      tier,
      status,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: customerId,
      current_period_start: periodStart,
      current_period_end: periodEnd,
      cancel_at_period_end: subscription.cancel_at_period_end || false,
    }, {
      onConflict: 'stripe_subscription_id'
    })

  if (error) {
    console.error('Error upserting subscription:', error)
    return { success: false, error }
  }

  console.log(`✅ Subscription ${subscription.id} saved for user ${userId} - tier: ${tier}, status: ${status}`)
  return { success: true, data }
}

export async function POST(request: NextRequest) {
  try {
    const sig = request.headers.get('stripe-signature')
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
    
    if (!sig || !webhookSecret) {
      return NextResponse.json(
        { error: 'Missing webhook signature or secret' },
        { status: 400 }
      )
    }

    const body = await request.text()
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret)

    // Use admin client to bypass RLS for webhook operations
    const supabase = createAdminClient()

    switch (event.type) {
      // Subscription created/updated
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.client_reference_id

        if (!userId) {
          console.error('Missing user_id in checkout.session.completed event')
          break
        }

        if (session.mode !== 'subscription' || !session.subscription) {
          console.error('Not a subscription checkout or missing subscription ID')
          break
        }

        try {
          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
          
          // Get tier from session metadata or subscription metadata
          const tier = validateTier(
            session.metadata?.tier || subscription.metadata?.tier as string
          )

          await upsertSubscription(supabase, subscription, userId, tier)
        } catch (error) {
          console.error('Error processing checkout.session.completed:', error)
        }
        break
      }

      // Subscription updated
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const tier = validateTier(subscription.metadata?.tier as string)
        
        // Get user_id from existing subscription
        const { data: existing } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .maybeSingle()
        
        if (!existing?.user_id) {
          console.warn(`No user found for subscription ${subscription.id}`)
          break
        }

        await upsertSubscription(supabase, subscription, existing.user_id, tier)
        break
      }

      // Subscription canceled/deleted
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({ 
            status: 'canceled',
            cancel_at_period_end: false,
          })
          .eq('stripe_subscription_id', subscription.id)

        if (updateError) {
          console.error('Error updating deleted subscription:', updateError)
        }
        break
      }

      // Subscription payment succeeded
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any // Stripe Invoice type
        const subscriptionId = typeof invoice.subscription === 'string' 
          ? invoice.subscription 
          : invoice.subscription?.id

        if (!subscriptionId) {
          break
        }

        try {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          
          // Get user_id from existing subscription
          const { data: existing } = await supabase
            .from('subscriptions')
            .select('user_id, tier')
            .eq('stripe_subscription_id', subscription.id)
            .maybeSingle()

          if (!existing?.user_id) {
            console.warn(`No user found for subscription ${subscription.id} in payment_succeeded`)
            break
          }

          const tier = validateTier(subscription.metadata?.tier || existing.tier)
          await upsertSubscription(supabase, subscription, existing.user_id, tier)
        } catch (error) {
          console.error('Error processing invoice.payment_succeeded:', error)
        }
        break
      }

      // Subscription payment failed
      case 'invoice.payment_failed': {
        const invoice = event.data.object as any // Stripe Invoice type
        const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id
        if (subscriptionId) {
          const { error: updateError } = await supabase
            .from('subscriptions')
            .update({ status: 'past_due' })
            .eq('stripe_subscription_id', subscriptionId)

          if (updateError) {
            console.error('Error updating payment failed:', updateError)
          }
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Webhook handler error'
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    )
  }
}
