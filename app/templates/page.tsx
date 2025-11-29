import Link from 'next/link'
import { Heart, Sparkles } from 'lucide-react'
import { TEMPLATE_SCHEMAS, type TemplateName } from '@/lib/template-schemas'
import type { Tier } from '@/lib/tiers'

const categories = [
  { id: 'all', name: 'All Templates', emoji: '✨' },
  { id: 'birthday', name: 'Birthday', emoji: '🎂' },
  { id: 'anniversary', name: 'Anniversary', emoji: '💍' },
  { id: 'wedding', name: 'Wedding', emoji: '💒' },
  { id: 'romance', name: 'Romance', emoji: '💕' },
  { id: 'general', name: 'General', emoji: '🎁' },
  { id: 'seasonal', name: 'Seasonal', emoji: '🎄' },
]

// Template tier requirements mapping
const TEMPLATE_TIERS: Record<TemplateName, Tier> = {
  RomanticBirthday: 'free',
  ModernAnniversary: 'premium',
  ElegantWedding: 'premium',
  ValentinesDay: 'free',
  Christmas: 'free',
  GalaxyBirthday: 'premium',
  NeonLove: 'pro',
  GoldenLuxury: 'pro',
}

// Featured templates
const FEATURED_TEMPLATES: TemplateName[] = ['RomanticBirthday', 'ModernAnniversary', 'ElegantWedding']

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: { category?: string; tier?: string }
}) {
  // Get all templates from schemas
  let templates = Object.entries(TEMPLATE_SCHEMAS).map(([templateId, schema]) => ({
    id: templateId,
    name: schema.templateName,
    description: `A beautiful ${schema.category} template with ${schema.components.length} sections`,
    category: schema.category,
    required_tier: TEMPLATE_TIERS[templateId as TemplateName],
    is_featured: FEATURED_TEMPLATES.includes(templateId as TemplateName),
    component_name: templateId,
    preview_image_url: null as string | null,
  }))

  // Filter by category
  if (searchParams.category && searchParams.category !== 'all') {
    templates = templates.filter((t) => t.category === searchParams.category)
  }

  // Filter by tier
  if (searchParams.tier) {
    const tierOrder: Tier[] = ['free', 'premium', 'pro']
    const requestedTierIndex = tierOrder.indexOf(searchParams.tier as Tier)
    templates = templates.filter((t) => {
      const templateTierIndex = tierOrder.indexOf(t.required_tier)
      return templateTierIndex <= requestedTierIndex
    })
  }

  // Sort: free templates first, then by tier (free < premium < pro), then featured, then by name
  const tierOrder: Tier[] = ['free', 'premium', 'pro']
  templates.sort((a, b) => {
    // First, sort by tier (free first)
    const aTierIndex = tierOrder.indexOf(a.required_tier)
    const bTierIndex = tierOrder.indexOf(b.required_tier)
    if (aTierIndex !== bTierIndex) {
      return aTierIndex - bTierIndex
    }
    
    // Within same tier, featured first
    if (a.is_featured && !b.is_featured) return -1
    if (!a.is_featured && b.is_featured) return 1
    
    // Then by name
    return a.name.localeCompare(b.name)
  })

  const selectedCategory = searchParams.category || 'all'

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-6 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-up">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500 mb-3 sm:mb-4 px-2">
            Choose Your Template
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Browse our collection of beautiful templates. No signup required to explore!
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-6 sm:mb-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/templates?category=${category.id}`}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-200 text-sm sm:text-base touch-manipulation active:scale-95 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-rose-50 border-2 border-rose-100'
              }`}
            >
              <span className="mr-1 sm:mr-2">{category.emoji}</span>
              <span className="whitespace-nowrap">{category.name}</span>
            </Link>
          ))}
        </div>

        {/* Templates Grid */}
        {templates && templates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {templates.map((template) => (
              <Link
                key={template.id}
                href={`/templates/${template.id}/preview`}
                className="group glass-card p-4 sm:p-6 hover:scale-105 active:scale-100 sm:active:scale-105 transition-all duration-300 hover:shadow-2xl animate-soft-rise touch-manipulation"
              >
                {/* Preview Image Placeholder */}
                <div className="aspect-video bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                  {template.preview_image_url ? (
                    <img
                      src={template.preview_image_url}
                      alt={`${template.name} template preview`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <Heart className="text-rose-300 group-hover:text-rose-400 transition-colors" size={64} />
                  )}
                </div>

                {/* Template Info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-serif text-rose-600 group-hover:text-rose-700">
                      {template.name}
                    </h3>
                    {template.is_featured && (
                      <Sparkles className="text-yellow-500" size={20} />
                    )}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {template.description}
                  </p>
                  
                  {/* Tier Badge */}
                  <div className="flex items-center gap-2 pt-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        template.required_tier === 'free'
                          ? 'bg-green-100 text-green-700'
                          : template.required_tier === 'premium'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {template.required_tier === 'free'
                        ? 'Free'
                        : template.required_tier === 'premium'
                        ? 'Premium'
                        : 'Pro'}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                      {template.category}
                    </span>
                  </div>
                </div>

                {/* Preview Button */}
                <div className="mt-4 pt-4 border-t border-rose-100">
                  <span className="text-sm text-rose-600 font-medium group-hover:text-rose-700">
                    Preview Template →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Heart className="mx-auto text-rose-300 mb-4" size={64} />
            <h2 className="text-2xl font-serif text-gray-700 mb-2">No templates found</h2>
            <p className="text-gray-600">Try selecting a different category</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 sm:mt-16 text-center px-2">
          <div className="glass-card soft-glow p-6 sm:p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-serif text-rose-600 mb-3 sm:mb-4">
              Ready to Create Your Page?
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              Choose a template above and start creating your beautiful heartful page in minutes.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full soft-glow hover:scale-105 active:scale-95 transition-transform duration-200 font-semibold touch-manipulation text-sm sm:text-base"
            >
              <Sparkles size={18} className="sm:w-5 sm:h-5" />
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

