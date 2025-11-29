import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Heart, Sparkles, Lock, Wand2 } from 'lucide-react'
import { getUserTier } from '@/lib/subscription'
import { canUseFeature } from '@/lib/tiers'
import { TEMPLATE_SCHEMAS, type TemplateName } from '@/lib/template-schemas'
import type { Tier } from '@/lib/tiers'

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

export default async function ChooseTemplatePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/create/choose-template')
  }

  const userTier = await getUserTier(user.id)

  // Get templates from lib instead of database
  const templates = Object.entries(TEMPLATE_SCHEMAS).map(([templateId, schema]) => ({
    id: templateId,
    name: schema.templateName,
    description: `${schema.category} template with ${schema.components.length} sections`,
    category: schema.category,
    component_name: templateId,
    required_tier: TEMPLATE_TIERS[templateId as TemplateName] || 'free',
    is_featured: FEATURED_TEMPLATES.includes(templateId as TemplateName),
    preview_image_url: null,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-up">
          <h1 className="text-5xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500 mb-4">
            Choose Your Template
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select a template to start creating your heartful page
          </p>
        </div>

        {/* Create Your Own Option */}
        <div className="mb-12">
          <Link
            href="/create/custom"
            className="group glass-card p-8 hover:scale-105 transition-all duration-300 hover:shadow-xl animate-soft-rise flex items-center gap-6"
          >
            <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
              <Wand2 className="text-purple-600 group-hover:text-purple-700 transition-colors" size={48} />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-serif text-rose-600 group-hover:text-rose-700 mb-2">
                Create Your Own
              </h3>
              <p className="text-gray-600">
                Start from scratch with a blank canvas and build your perfect page
              </p>
            </div>
            <div className="text-rose-600 font-medium group-hover:text-rose-700">
              Start Creating →
            </div>
          </Link>
        </div>

        {/* Templates Grid */}
        {templates && templates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => {
              const canUse = canUseFeature('premium_templates', userTier) || template.required_tier === 'free'
              
              return (
                <Link
                  key={template.id}
                  href={canUse ? `/create/${template.id}` : `/pricing?tier=${template.required_tier}`}
                  className="group glass-card p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl animate-soft-rise relative"
                >
                  {!canUse && (
                    <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 z-10">
                      <Lock size={12} />
                      {template.required_tier === 'premium' ? 'Premium' : 'Pro'}
                    </div>
                  )}

                  <div className="aspect-video bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative">
                    {template.preview_image_url ? (
                      <img
                        src={template.preview_image_url}
                        alt={`${template.name} template preview`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="text-center">
                        <Heart className="text-rose-300 group-hover:text-rose-400 transition-colors mx-auto mb-2" size={48} />
                        <p className="text-xs text-gray-500">{template.category}</p>
                      </div>
                    )}
                    {template.is_featured && (
                      <div className="absolute top-2 left-2 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Sparkles size={12} />
                        Featured
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-serif text-rose-600 group-hover:text-rose-700">
                        {template.name}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {template.description}
                    </p>
                    
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
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-rose-100">
                    <span className="text-sm text-rose-600 font-medium group-hover:text-rose-700">
                      {canUse ? 'Start Creating →' : 'Upgrade to Use →'}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <Heart className="mx-auto text-rose-300 mb-4" size={64} />
            <h2 className="text-2xl font-serif text-gray-700 mb-2">No templates available</h2>
          </div>
        )}
      </div>
    </div>
  )
}

