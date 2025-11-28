import { Check, X, Sparkles, Heart } from 'lucide-react'
import Link from 'next/link'
import CheckoutButton from '@/components/CheckoutButton'

const tiers = [
  {
    name: 'Free',
    key: 'free',
    price: 0,
    priceLabel: 'Forever Free',
    description: 'Perfect for trying out',
    features: [
      '1 page forever',
      'Basic templates',
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
    name: 'Premium',
    key: 'premium',
    price: 4.99,
    priceLabel: 'per month',
    description: 'Best value for creators',
    features: [
      '✨ Unlimited pages',
      'All premium templates',
      'Unlimited AI text generation',
      'Unlimited images',
      '5 videos per page',
      'Background music',
      'Basic animations',
      'Basic analytics (view count)',
      'QR code sharing',
      'Cancel anytime',
    ],
    limitations: ['Limited to 5 videos per page'],
    cta: 'Subscribe to Premium',
    ctaStyle: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:scale-105 shadow-xl',
    popular: true,
    savings: 'Cancel anytime, no commitment',
    hasCheckout: true,
  },
  {
    name: 'Pro',
    key: 'pro',
    price: 9.99,
    priceLabel: 'per month',
    description: 'Everything unlocked',
    features: [
      '🚀 Everything in Premium',
      'Unlimited languages per page',
      'Advanced AI (multi-language translation)',
      'Unlimited videos',
      'Advanced animations & effects',
      'Custom domain / vanity URL',
      'Detailed analytics dashboard',
      'Priority support',
      'Export options (PDF, video)',
      'Early access to new features',
      'Cancel anytime',
    ],
    limitations: [],
    cta: 'Subscribe to Pro',
    ctaStyle: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 shadow-xl',
    popular: false,
    savings: 'Cancel anytime, no commitment',
    hasCheckout: true,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-block bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-2 rounded-full mb-4">
            <span className="text-green-700 font-semibold">💳 Flexible Monthly Subscriptions • Cancel Anytime</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500 mb-4">
            Simple, Affordable Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start with our free plan and upgrade when you need more. Cancel anytime, no commitment.
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
                  {tier.price > 0 && (
                    <span className="text-sm font-medium text-green-600">Billed monthly</span>
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
                <CheckoutButton tier={tier.key as 'premium' | 'pro'} />
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

        {/* Why Subscribe */}
        <div className="mb-16 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif text-blue-900 mb-4">Why Subscribe?</h2>
            <p className="text-blue-700 max-w-2xl mx-auto">
              Affordable monthly pricing with the flexibility to cancel anytime. No long-term commitment required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-semibold text-gray-900 mb-2">Affordable Pricing</h3>
              <p className="text-sm text-gray-600">
                Low monthly fees starting at just $4.99. No hidden costs or surprises.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔄</div>
              <h3 className="font-semibold text-gray-900 mb-2">Cancel Anytime</h3>
              <p className="text-sm text-gray-600">
                No long-term commitment. Cancel your subscription whenever you want.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="font-semibold text-gray-900 mb-2">Always Updated</h3>
              <p className="text-sm text-gray-600">
                Get all new features and updates automatically included in your subscription
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
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600 text-sm">
                Yes! You can cancel your subscription at any time. No questions asked, no penalties.
              </p>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Can I upgrade or downgrade?</h3>
              <p className="text-gray-600 text-sm">
                Absolutely! You can upgrade from Free to Premium or Pro anytime, or downgrade if you need less features.
              </p>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-semibold text-gray-900 mb-2">What happens if I cancel?</h3>
              <p className="text-gray-600 text-sm">
                You&apos;ll continue to have access until the end of your billing period. After that, you&apos;ll move to the Free tier.
              </p>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Will I get future updates?</h3>
              <p className="text-gray-600 text-sm">
                Yes! All new features and improvements are automatically included in your subscription at no extra cost.
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
              href="/templates"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-10 py-4 rounded-full soft-glow hover:scale-105 transition-transform duration-200 font-semibold text-lg"
            >
              <Sparkles size={20} />
              Browse Templates
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
