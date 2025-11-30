'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { VisualTemplateEditor } from '@/components/VisualTemplateEditor'
import { getTemplateSchema, getTemplateIdByDisplayName, type TemplateName } from '@/lib/template-schemas'
import type { Tier } from '@/lib/tiers'
import { createPage, updatePage, getPageById } from '@/lib/actions/pages'
import { getCurrentSubscription } from '@/lib/actions/subscriptions'

export default function CreatePageEditor({ params }: { params: Promise<{ templateId: string }> }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editPageId = searchParams.get('edit')
  const [userTier, setUserTier] = useState<Tier>('free')
  const [loading, setLoading] = useState(true)
  const [templateId, setTemplateId] = useState<string>('')
  const [resolvedParams, setResolvedParams] = useState<{ templateId: string } | null>(null)
  const [initialData, setInitialData] = useState<Record<string, unknown> | undefined>(undefined)
  const [pageId, setPageId] = useState<string | undefined>(undefined)

  useEffect(() => {
    // Resolve params promise
    const resolveParams = async () => {
      const resolved = await params
      setResolvedParams(resolved)
      
      // Fetch user tier
      try {
        const subscriptionData = await getCurrentSubscription()
        setUserTier(subscriptionData.tier || 'free')

        // If editing, load existing page data
        if (editPageId) {
          const { page, error } = await getPageById(editPageId)
          if (error || !page) {
            console.error('Failed to load page:', error)
            router.push('/dashboard')
            return
          }

          setPageId(page.id)
          
          // Extract template ID from page - convert display name to template ID if needed
          const pageTemplateName = page.template_name
          if (pageTemplateName) {
            // Convert display name (e.g., "Elegant Wedding") to template ID (e.g., "ElegantWedding")
            const convertedTemplateId = getTemplateIdByDisplayName(pageTemplateName)
            if (convertedTemplateId && convertedTemplateId !== 'custom') {
              const schema = getTemplateSchema(convertedTemplateId as TemplateName)
              if (schema) {
                setTemplateId(convertedTemplateId)
              } else if (resolved.templateId !== 'custom') {
                setTemplateId(resolved.templateId)
              } else {
                setTemplateId('RomanticBirthday')
              }
            } else if (convertedTemplateId === 'custom') {
              setTemplateId('RomanticBirthday') // Use default template for custom pages
            } else if (resolved.templateId !== 'custom') {
              setTemplateId(resolved.templateId)
            } else {
              setTemplateId('RomanticBirthday')
            }
          } else {
            setTemplateId(resolved.templateId === 'custom' ? 'RomanticBirthday' : resolved.templateId)
          }

          // Convert page data to editor format
          const config = page.config as Record<string, unknown> | null
          const content: Record<string, unknown> = {}
          
          // Extract component data from page
          if (config?.components) {
            const components = config.components as Array<{ id: string; type: string }>
            components.forEach((comp) => {
              if (comp.id === 'hero') {
                content.hero = {
                  title: page.title || '',
                  subtitle: page.recipient_name || '',
                }
              } else if (comp.id === 'intro') {
                content.intro = {
                  text: page.intro_text || '',
                }
              } else if (comp.id === 'final') {
                content.final = {
                  message: page.final_message || '',
                }
              }
            })
          }

          setInitialData(content)
        } else {
          // New page - validate template exists or handle custom
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
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    resolveParams()
  }, [params, router, editPageId])

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

      const isPrivate = (data.isPrivate as boolean) || false
      const password = (data.password as string) || ''

      if (editPageId && pageId) {
        const bcrypt = await import('bcryptjs')
        let passwordHash = null
        if (isPrivate && password) {
          passwordHash = await bcrypt.default.hash(password, 10)
        } else if (!isPrivate) {
          passwordHash = null
        }

        const result = await updatePage(pageId, {
          title,
          recipient_name: recipientName,
          hero_text: heroText,
          intro_text: introText,
          final_message: finalMessage,
          background_music_url: (musicUrl as string) || null,
          has_music: !!musicUrl,
          media_count: formattedMedia.length,
          is_public: !isPrivate,
          password_hash: passwordHash,
          config: pageConfig,
        })

        if (result.error) {
          throw new Error(result.error)
        }

        // Update memories and media (simplified - in production you'd want to sync properly)
        router.push('/dashboard')
        return
      }

      // Create new page
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
        password: isPrivate ? password : '',
        isPublic: !isPrivate,
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
      alert(error instanceof Error ? error.message : 'Failed to save page')
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
      initialData={initialData}
      onSave={handleSave}
      onCancel={handleCancel}
      userTier={userTier}
      pageId={pageId}
    />
  )
}

