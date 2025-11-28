import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, ArrowRight, Lock } from 'lucide-react'
import { DynamicTemplateRenderer, type TemplateConfig } from '@/components/template-components'
import { TEMPLATE_SCHEMAS, getTemplateSchema, type TemplateName } from '@/lib/template-schemas'
import type { PageWithRelations } from '@/types'
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

// Convert template schema to TemplateConfig
function schemaToConfig(schema: ReturnType<typeof getTemplateSchema>): TemplateConfig | null {
  if (!schema) return null

  return {
    components: schema.components.map((comp) => ({
      id: comp.id,
      type: comp.type,
      order: comp.order,
      settings: comp.settings,
      theme: {},
    })),
    theme: {
      primaryColor: schema.theme.primaryColor,
      secondaryColor: schema.theme.secondaryColor,
      fontFamily: schema.theme.fontFamily,
    },
  }
}

// Create demo page from template schema
function createDemoPageFromSchema(schema: ReturnType<typeof getTemplateSchema>): PageWithRelations {
  const defaultContent = schema?.defaultContent || {}
  const heroContent = (defaultContent.hero as { title?: string; subtitle?: string }) || {}
  const introContent = (defaultContent.intro as { text?: string }) || {}
  const finalContent = (defaultContent.final as { message?: string }) || {}

  return {
    id: 'demo',
    user_id: 'demo',
    template_name: schema?.templateId || '',
    slug: 'demo',
    title: heroContent.title || 'Demo Page',
    recipient_name: heroContent.subtitle || 'Someone Special',
    hero_text: heroContent.title || null,
    intro_text: introContent.text || null,
    final_message: finalContent.message || null,
    password_hash: null,
    is_public: true,
    background_music_url: null,
    language: 'en',
    tier_used: 'free',
    media_count: 0,
    has_music: false,
    has_custom_animations: false,
    view_count: 0,
    share_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    memories: [],
    media: [],
    analytics: [],
  }
}

export default async function TemplatePreviewPage({
  params,
}: {
  params: { id: string }
}) {
  // Get template from schemas
  const templateId = params.id as TemplateName
  const schema = getTemplateSchema(templateId)

  if (!schema) {
    notFound()
  }

  const requiredTier = TEMPLATE_TIERS[templateId] || 'free'
  
  // Create demo page and config
  const demoPage = createDemoPageFromSchema(schema)
  const templateConfig = schemaToConfig(schema)
  
  if (!templateConfig) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Preview Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-serif text-rose-600">{schema.templateName}</h1>
            <p className="text-sm text-gray-500">Template Preview</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/templates"
              className="text-gray-600 hover:text-rose-600 transition-colors"
            >
              ← Back to Templates
            </Link>
            <Link
              href={`/create/template/${templateId}`}
              className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-full soft-glow hover:scale-105 transition-transform duration-200 font-semibold"
            >
              <Sparkles size={18} />
              Use This Template
            </Link>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="relative">
        {/* Tier Requirement Notice */}
        {requiredTier !== 'free' && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-200 py-3">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2 text-blue-700">
              <Lock size={18} />
              <span className="text-sm font-medium">
                This template requires {requiredTier === 'premium' ? 'Premium' : 'Pro'} tier
              </span>
            </div>
          </div>
        )}

        {/* Template Preview */}
        <div className="border-4 border-dashed border-rose-200 m-4 rounded-2xl overflow-hidden">
          <DynamicTemplateRenderer 
            page={demoPage} 
            config={templateConfig}
            schema={schema}
          />
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center glass-card soft-glow p-8">
          <h2 className="text-3xl font-serif text-rose-600 mb-4">
            Love This Template?
          </h2>
          <p className="text-gray-600 mb-6">
            Start creating your own page with this template. It only takes a few minutes!
          </p>
          <Link
            href={`/create/template/${templateId}`}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-10 py-4 rounded-full soft-glow hover:scale-110 transition-transform duration-200 font-semibold text-lg"
          >
            Create Your Page
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  )
}

