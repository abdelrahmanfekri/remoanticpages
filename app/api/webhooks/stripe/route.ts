import { createClient } from '@/lib/supabase/server'
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

    const supabase = await createClient()

    switch (event.type) {
      // Subscription created/updated
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.client_reference_id
        const tier = validateTier(session.metadata?.tier as string)

        // Only process if it's a subscription and has userId
        if (session.mode === 'subscription' && session.subscription && userId) {
          try {
            // Get subscription details
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
            
            const subData = subscription as any // Stripe types can be inconsistent
            const { error: upsertError } = await supabase
              .from('subscriptions')
              .upsert({
                user_id: userId,
                tier,
                status: subscription.status === 'active' || subscription.status === 'trialing' ? 'active' : 'canceled',
                stripe_subscription_id: subscription.id,
                stripe_customer_id: typeof subscription.customer === 'string' ? subscription.customer : (subscription.customer as any)?.id || '',
                current_period_start: new Date(subData.current_period_start * 1000).toISOString(),
                current_period_end: new Date(subData.current_period_end * 1000).toISOString(),
                cancel_at_period_end: subscription.cancel_at_period_end || false,
              }, {
                onConflict: 'stripe_subscription_id'
              })

            if (upsertError) {
              console.error('Error upserting subscription:', upsertError)
            }
          } catch (subError) {
            console.error('Error retrieving subscription:', subError)
          }
        } else if (!userId) {
          console.error('Missing user_id in checkout.session.completed event')
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
        
        const userId = existing?.user_id
        if (userId) {
          const status = subscription.status === 'active' || subscription.status === 'trialing' ? 'active' : 
                        subscription.status === 'canceled' ? 'canceled' : 
                        subscription.status === 'past_due' ? 'past_due' : 'unpaid'

          const subData = subscription as any // Stripe types can be inconsistent
          const { error: upsertError } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: userId,
              tier,
              status,
              stripe_subscription_id: subscription.id,
              stripe_customer_id: typeof subscription.customer === 'string' ? subscription.customer : (subscription.customer as any)?.id || '',
              current_period_start: new Date(subData.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subData.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end || false,
            }, {
              onConflict: 'stripe_subscription_id'
            })

          if (upsertError) {
            console.error('Error upserting subscription update:', upsertError)
          }
        } else {
          console.warn(`No user found for subscription ${subscription.id}`)
        }
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
        const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id
        if (subscriptionId) {
          try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId)
            const subData = subscription as any
            const { error: updateError } = await supabase
              .from('subscriptions')
              .update({
                status: 'active',
                current_period_start: new Date(subData.current_period_start * 1000).toISOString(),
                current_period_end: new Date(subData.current_period_end * 1000).toISOString(),
              })
              .eq('stripe_subscription_id', subscription.id)

            if (updateError) {
              console.error('Error updating payment succeeded:', updateError)
            }
          } catch (error) {
            console.error('Error retrieving subscription for payment succeeded:', error)
          }
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
