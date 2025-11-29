import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getTierPricing, getTierPriceInCents, type Tier } from '@/lib/tiers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { tier } = body

    if (!tier || (tier !== 'premium' && tier !== 'pro')) {
      return NextResponse.json({ error: 'Invalid tier. Must be "premium" or "pro"' }, { status: 400 })
    }

    // Get pricing from centralized config
    const pricing = getTierPricing(tier as Tier)
    const priceInCents = getTierPriceInCents(tier as Tier)

    // Validate pricing exists
    if (!pricing || priceInCents <= 0) {
      return NextResponse.json({ error: 'Invalid pricing configuration' }, { status: 500 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

    // Create Stripe Checkout Session for subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${pricing.name} Plan`,
              description: `Monthly subscription to ${pricing.name} features`,
            },
            unit_amount: priceInCents,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/dashboard?payment=success`,
      cancel_url: `${baseUrl}/pricing?tier=${tier}&canceled=true`,
      client_reference_id: user.id,
      metadata: {
        tier,
        user_id: user.id,
      },
      subscription_data: {
        metadata: {
          tier,
          user_id: user.id,
        },
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Checkout session creation error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create checkout session'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

