'use client'

import { useState } from 'react'
import { Loader2, CreditCard } from 'lucide-react'
import { getTierPricing, type Tier } from '@/lib/tiers'

interface CheckoutButtonProps {
  tier: 'premium' | 'pro'
}

export default function CheckoutButton({ tier }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pricing = getTierPricing(tier as Tier)

  const handleCheckout = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Something went wrong. Please try again.')
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-full font-semibold text-lg hover:scale-105 transition-transform duration-200 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Processing...
          </>
        ) : (
          <>
            <CreditCard size={20} />
            Subscribe ${pricing.price}/{pricing.priceLabel}
          </>
        )}
      </button>
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      <p className="mt-4 text-center text-sm text-gray-500">
        🔒 Secure payment powered by Stripe.
      </p>
    </div>
  )
}

