'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { VisualTemplateEditor } from '@/components/VisualTemplateEditor'
import { getTemplateSchema, type TemplateName } from '@/lib/template-schemas'
import type { Tier } from '@/lib/tiers'
import { createPage } from '@/lib/actions/pages'
import { getCurrentSubscription } from '@/lib/actions/subscriptions'

export default function CreatePageEditor({ params }: { params: Promise<{ templateId: string }> }) {
  const router = useRouter()
  const [userTier, setUserTier] = useState<Tier>('free')
  const [loading, setLoading] = useState(true)
  const [templateId, setTemplateId] = useState<string>('')
  const [resolvedParams, setResolvedParams] = useState<{ templateId: string } | null>(null)

  useEffect(() => {
    // Resolve params promise
    const resolveParams = async () => {
      const resolved = await params
      setResolvedParams(resolved)
      
      // Fetch user tier
      try {
        const subscriptionData = await getCurrentSubscription()
        setUserTier(subscriptionData.tier || 'free')

        // Validate template exists or handle custom
        if (resolved.templateId === 'custom') {
          // Custom page - use default config template (RomanticBirthday as base)
          setTemplateId('RomanticBirthday')
        } else {
          const schema = getTemplateSchema(resolved.templateId as TemplateName)
          if (!schema) {
            console.error('Template not found:', resolved.templateId)
            router.push('/create/choose-template')
            return
          }
          setTemplateId(resolved.templateId)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    resolveParams()
  }, [params, router])

  const handleSave = async (data: Record<string, unknown>) => {
    try {
      // Extract data from VisualTemplateEditor format
      const {
        templateId: editorTemplateId,
        components,
        content,
        theme,
        media,
        musicUrl,
        memories,
      } = data

      // Get recipient name from content
      const contentData = content as Record<string, Record<string, unknown>> || {}
      const heroData = contentData.hero || {}
      const introData = contentData.intro || {}
      
      const recipientName = (heroData.subtitle as string) || 
                           (heroData.title as string) || 
                           'My Love'
      
      // Get title from content or use template name
      const title = (heroData.title as string) || 
                   (introData.title as string) ||
                   'My Heartful Page'

      // Convert VisualTemplateEditor format to API format
      const currentTemplateId = resolvedParams?.templateId || templateId
      const isCustom = currentTemplateId === 'custom'
      const finalTemplateId = isCustom ? undefined : (editorTemplateId as string || currentTemplateId)

      // Build config from editor data
      const pageConfig = {
        components: components as Array<{
          id: string
          type: string
          order: number
          settings?: Record<string, unknown>
        }>,
        theme: theme as {
          primaryColor?: string
          secondaryColor?: string
          fontFamily?: string
        },
        background: {
          type: 'gradient' as const,
          value: `from-[${(theme as Record<string, unknown>)?.primaryColor || '#f43f5e'}]20 via-white to-[${(theme as Record<string, unknown>)?.secondaryColor || '#ec4899'}]20`,
        },
      }

      // Convert memories format
      const formattedMemories = (memories as Array<{
        id?: string
        title: string
        date?: string
        description: string
        order: number
      }> || []).map((m, index) => ({
        id: m.id || `memory-${index}`,
        title: m.title || '',
        date: m.date || '',
        description: { en: m.description || '' },
        order: m.order ?? index,
      }))

      // Convert media format
      const formattedMedia = (media as Array<{
        url: string
        type: 'image' | 'video'
        order?: number
      }> || []).map((m, index) => ({
        url: m.url,
        type: m.type,
        order: m.order ?? index,
      }))

      // Extract text content
      const finalData = contentData.final || {}
      const heroText = (heroData.title as string) || ''
      const introText = (introData.text as string) || ''
      const finalMessage = (finalData.message as string) || ''

      const result = await createPage({
        title,
        recipientName,
        languages: ['en'],
        heroText: { en: heroText },
        introText: { en: introText },
        finalMessage: { en: finalMessage },
        memories: formattedMemories,
        media: formattedMedia,
        musicUrl: (musicUrl as string) || undefined,
        password: '',
        isPublic: false,
        templateId: finalTemplateId,
        isCustom,
        config: pageConfig,
      })

      if (result.error) {
        throw new Error(result.error)
      }

      if (!result.page) {
        throw new Error('Failed to create page')
      }

      router.push(`/p/${result.page.slug}`)
    } catch (error) {
      console.error('Save failed:', error)
      alert(error instanceof Error ? error.message : 'Failed to create page')
    }
  }

  const handleCancel = () => {
    router.push('/create/choose-template')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <VisualTemplateEditor
      templateId={templateId}
      onSave={handleSave}
      onCancel={handleCancel}
                  userTier={userTier}
    />
  )
}

