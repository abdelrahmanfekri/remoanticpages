import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import type { Tier } from '@/lib/tiers'
import { getTierPriceInCents } from '@/lib/tiers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
})

// Validate tier is one of the allowed values
function validateTier(tier: string | undefined): Tier {
  if (tier === 'pro' || tier === 'lifetime') {
    return tier as Tier
  }
  if (tier === 'free') {
    return 'free'
  }
  console.warn(`Invalid tier received: ${tier}, defaulting to pro`)
  return 'pro'
}

// Helper function to safely convert Stripe timestamp to ISO string
function convertStripeTimestamp(timestamp: number | undefined | null, fallbackDays: number = 30): string {
  try {
    if (timestamp && typeof timestamp === 'number') {
      return new Date(timestamp * 1000).toISOString()
    }
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

// Helper function to get customer ID from Stripe
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

// Helper function to create lifetime purchase
async function createLifetimePurchase(
  supabase: ReturnType<typeof createAdminClient>,
  paymentIntent: Stripe.PaymentIntent,
  userId: string,
  tier: Tier
) {
  const customerId = typeof paymentIntent.customer === 'string' 
    ? paymentIntent.customer 
    : paymentIntent.customer?.id || null

  const amountCents = paymentIntent.amount || getTierPriceInCents(tier)

  const { error, data } = await supabase
    .from('purchases')
    .insert({
      user_id: userId,
      tier,
      amount_cents: amountCents,
      stripe_payment_intent_id: paymentIntent.id,
      stripe_customer_id: customerId,
      status: 'completed',
    })

  if (error) {
    console.error('Error creating lifetime purchase:', error)
    return { success: false, error }
  }

  console.log(`✅ Lifetime purchase created for user ${userId} - tier: ${tier}, payment: ${paymentIntent.id}`)
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

    const supabase = createAdminClient()

    switch (event.type) {
      // Handle checkout completion (both subscription and one-time)
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.client_reference_id

        if (!userId) {
          console.error('Missing user_id in checkout.session.completed event')
          break
        }

        const tier = validateTier(session.metadata?.tier as string)
        const isOneTime = session.metadata?.is_one_time === 'true'

        // Handle one-time payment (lifetime)
        if (isOneTime && session.payment_intent) {
          try {
            const paymentIntent = await stripe.paymentIntents.retrieve(
              typeof session.payment_intent === 'string' 
                ? session.payment_intent 
                : session.payment_intent.id
            )
            
            if (paymentIntent.status === 'succeeded') {
              await createLifetimePurchase(supabase, paymentIntent, userId, tier)
            }
          } catch (error) {
            console.error('Error processing lifetime purchase:', error)
          }
          break
        }

        // Handle subscription
        if (session.mode === 'subscription' && session.subscription) {
          try {
            const subscription = await stripe.subscriptions.retrieve(
              typeof session.subscription === 'string' 
                ? session.subscription 
                : session.subscription.id
            )
            
            await upsertSubscription(supabase, subscription, userId, tier)
          } catch (error) {
            console.error('Error processing subscription:', error)
          }
        }
        break
      }

      // Handle payment_intent.succeeded for lifetime purchases
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const tier = validateTier(paymentIntent.metadata?.tier as string)

        if (tier === 'lifetime' && paymentIntent.metadata?.user_id) {
          try {
            await createLifetimePurchase(supabase, paymentIntent, paymentIntent.metadata.user_id, tier)
          } catch (error) {
            console.error('Error processing payment_intent.succeeded for lifetime:', error)
          }
        }
        break
      }

      // Subscription updated
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const tier = validateTier(subscription.metadata?.tier as string)
        
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
        const invoice = event.data.object as any
        const subscriptionId = typeof invoice.subscription === 'string' 
          ? invoice.subscription 
          : invoice.subscription?.id

        if (!subscriptionId) {
          break
        }

        try {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          
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
        const invoice = event.data.object as any
        const subscriptionId = typeof invoice.subscription === 'string' 
          ? invoice.subscription 
          : invoice.subscription?.id
          
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
