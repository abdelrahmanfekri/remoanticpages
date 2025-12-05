import { Check, X, Sparkles, Heart } from 'lucide-react'
import Link from 'next/link'
import CheckoutButton from '@/components/CheckoutButton'
import { getTierPricing, type Tier } from '@/lib/tiers'

const tierConfigs = [
  {
    key: 'free' as Tier,
    features: [
      '1 page forever',
      'AI-powered generation',
      '1 language per page',
      'Basic AI text generation',
      '3 images per page',
      'Password protection',
      'Basic sharing',
    ],
    limitations: ['No videos', 'No music', 'No analytics', 'No custom domain'],
    cta: 'Get Started Free',
    ctaStyle: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    popular: false,
    savings: null,
    hasCheckout: false,
  },
  {
    key: 'pro' as Tier,
    features: [
      '✨ Unlimited pages',
      'Unlimited AI generations',
      'Unlimited AI text generation',
      'Unlimited images',
      'Unlimited videos',
      'Background music',
      'Advanced animations & effects',
      'Analytics dashboard',
      'Multi-language support',
      'Custom domain support',
      'Priority support',
      'Cancel anytime',
    ],
    limitations: [],
    cta: 'Subscribe to Pro',
    ctaStyle: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:scale-105 shadow-xl',
    popular: true,
    savings: 'Cancel anytime, no commitment',
    hasCheckout: true,
  },
  {
    key: 'lifetime' as Tier,
    features: [
      '🚀 Everything in Pro',
      'Unlimited pages forever',
      'Unlimited AI generations',
      'Unlimited videos & images',
      'All premium features',
      'Multi-language support',
      'Custom domain support',
      'Priority support',
      'Export options (PDF, video)',
      'Early access to new features',
      'Lifetime access - no recurring fees',
    ],
    limitations: [],
    cta: 'Get Lifetime Access',
    ctaStyle: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 shadow-xl',
    popular: false,
    savings: 'Best value - pay once, use forever',
    hasCheckout: true,
  },
]

// Combine pricing from centralized config with tier features
const tiers = tierConfigs.map(config => {
  const pricing = getTierPricing(config.key)
  return {
    ...config,
    name: pricing.name,
    price: pricing.price,
    priceLabel: pricing.priceLabel,
    description: pricing.description,
    isOneTime: pricing.isOneTime,
  }
})

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-block bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-2 rounded-full mb-4">
            <span className="text-green-700 font-semibold">💳 Pro Monthly • Lifetime One-Time • Cancel Anytime</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500 mb-4">
            Simple, Affordable Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start with our free plan and upgrade when you need more. Choose monthly Pro or lifetime access.
          </p>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`glass-card p-8 relative ${
                tier.popular ? 'ring-4 ring-rose-300 scale-105' : ''
              } hover:shadow-2xl transition-all duration-300 animate-soft-rise`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-serif text-rose-600 mb-2">{tier.name}</h3>
                <div className="flex flex-col items-center gap-1 mb-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-gray-900">${tier.price}</span>
                    {tier.price > 0 && (
                      <span className="text-xl text-gray-500">/{tier.priceLabel}</span>
                    )}
                  </div>
                  {tier.price > 0 && !tier.isOneTime && (
                    <span className="text-sm font-medium text-green-600">Billed monthly</span>
                  )}
                  {tier.price > 0 && tier.isOneTime && (
                    <span className="text-sm font-medium text-green-600">One-time payment</span>
                  )}
                  {tier.price === 0 && (
                    <span className="text-sm font-medium text-green-600">{tier.priceLabel}</span>
                  )}
                </div>
                <p className="text-gray-600 text-sm font-medium">{tier.description}</p>
                {tier.savings && (
                  <div className="mt-2 inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {tier.savings}
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
                {tier.limitations.length > 0 && (
                  <>
                    {tier.limitations.map((limitation, idx) => (
                      <li key={idx} className="flex items-start gap-2 opacity-50">
                        <X className="text-gray-400 mt-0.5 flex-shrink-0" size={20} />
                        <span className="text-gray-500 text-sm line-through">{limitation}</span>
                      </li>
                    ))}
                  </>
                )}
              </ul>

              {/* Pricing buttons or checkout */}
              {tier.hasCheckout ? (
                <CheckoutButton tier={tier.key} />
              ) : (
                <Link
                  href="/login"
                  className={`block w-full text-center px-6 py-4 rounded-full font-semibold transition-all duration-200 ${tier.ctaStyle}`}
                >
                  {tier.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Why Choose */}
        <div className="mb-16 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif text-blue-900 mb-4">Why Choose Us?</h2>
            <p className="text-blue-700 max-w-2xl mx-auto">
              Flexible pricing options to fit your needs. Choose monthly Pro or lifetime access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-semibold text-gray-900 mb-2">Affordable Pricing</h3>
              <p className="text-sm text-gray-600">
                Pro plan at just ${getTierPricing('pro').price}/month or lifetime access for ${getTierPricing('lifetime').price}. No hidden costs.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔄</div>
              <h3 className="font-semibold text-gray-900 mb-2">Flexible Options</h3>
              <p className="text-sm text-gray-600">
                Choose monthly Pro and cancel anytime, or pay once for lifetime access.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="font-semibold text-gray-900 mb-2">Always Updated</h3>
              <p className="text-sm text-gray-600">
                Get all new features and updates automatically included at no extra cost.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-serif text-center text-rose-600 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel my Pro subscription anytime?</h3>
              <p className="text-gray-600 text-sm">
                Yes! You can cancel your Pro subscription at any time. No questions asked, no penalties.
              </p>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-semibold text-gray-900 mb-2">What's the difference between Pro and Lifetime?</h3>
              <p className="text-gray-600 text-sm">
                Pro is a monthly subscription at ${getTierPricing('pro').price}/month that you can cancel anytime. Lifetime is a one-time payment of ${getTierPricing('lifetime').price} for permanent access with the same features.
              </p>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-semibold text-gray-900 mb-2">What happens if I cancel Pro?</h3>
              <p className="text-gray-600 text-sm">
                You&apos;ll continue to have access until the end of your billing period. After that, you&apos;ll move to the Free tier.
              </p>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Will I get future updates?</h3>
              <p className="text-gray-600 text-sm">
                Yes! All new features and improvements are automatically included for both Pro and Lifetime users at no extra cost.
              </p>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-semibold text-gray-900 mb-2">What if I only need one page?</h3>
              <p className="text-gray-600 text-sm">
                Start with the Free plan! You get 1 page forever with basic features. Upgrade only if you need more.
              </p>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Is my data safe?</h3>
              <p className="text-gray-600 text-sm">
                Absolutely! We use bank-level encryption and secure cloud storage. Your pages and data are always protected.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-16 text-center">
          <div className="glass-card soft-glow p-8 max-w-2xl mx-auto">
            <Heart className="mx-auto text-rose-400 mb-4" size={48} />
            <h2 className="text-3xl font-serif text-rose-600 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 mb-6">
              Start with our free tier and upgrade when you&apos;re ready for more features.
            </p>
            <Link
              href="/create/prompt"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-10 py-4 rounded-full soft-glow hover:scale-105 transition-transform duration-200 font-semibold text-lg"
            >
              <Sparkles size={20} />
              Start Creating with AI
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
