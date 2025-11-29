'use client'

import type { TemplateComponent } from '@/lib/template-schemas'
import type { MediaItem } from '@/components/MediaUploader'
import {
  HeroSection,
  IntroSection,
  MediaGallery,
  MemoriesSection,
  FinalMessageSection,
  TimelineSection,
  QuoteSection,
  VideoSection,
  CountdownSection,
  TwoColumnSection,
  TestimonialsSection,
  MapLocationSection,
  MusicPlayer,
} from '@/components/template-components'

interface Memory {
  id?: string
  title: string
  date?: string
  description: string
  order: number
}

interface ComponentPreviewProps {
  component: TemplateComponent
  data: Record<string, unknown>
  theme: { primaryColor: string; secondaryColor: string; fontFamily: string }
  media: MediaItem[]
  memories: Memory[]
  musicUrl: string | null
  viewMode?: 'edit' | 'preview'
  editingField?: { componentId: string; field: string } | null
  onInlineEdit?: (componentId: string, field: string) => void
  onInlineSave?: (componentId: string, field: string, value: string) => void
  onOpenMediaPanel?: () => void
  onMediaChange?: (media: MediaItem[]) => void
  pageId?: string
}

export function ComponentPreview({
  component,
  data,
  theme,
  media,
  memories,
  musicUrl,
  viewMode = 'preview',
  editingField,
  onInlineEdit,
  onInlineSave,
  onOpenMediaPanel,
  onMediaChange,
  pageId,
}: ComponentPreviewProps) {
  // Mock page object for template components - cast to any to avoid type issues with preview
  const mockPage: any = {
    id: 'preview',
    title: (data?.title as string) || '',
    recipient_name: (data?.subtitle as string) || '',
    hero_text: (data?.text as string) || '',
    intro_text: (data?.text as string) || '',
    final_message: (data?.message as string) || '',
    media: media,
    memories: memories,
    background_music_url: musicUrl,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: '',
    slug: '',
    is_published: false,
    template_id: '',
    analytics: [],
    template_name: null,
    password_hash: null,
    is_public: true,
    view_count: 0,
    language: 'en',
    custom_domain: null,
    seo_title: null,
    seo_description: null,
  }

  const componentProps: any = {
    page: mockPage,
    theme: theme,
    settings: component.settings,
    defaultContent: {
      ...data,
      viewMode, // Pass viewMode so components know if they're in edit mode
    },
    viewMode,
    editingField: editingField?.componentId === component.id ? editingField.field : null,
    onInlineEdit: onInlineEdit ? (field: string) => onInlineEdit(component.id, field) : undefined,
    onInlineSave: onInlineSave ? (field: string, value: string) => onInlineSave(component.id, field, value) : undefined,
  }

  // Add media panel handler for MediaGallery
  if (component.type === 'photo-gallery') {
    componentProps.onOpenMediaPanel = onOpenMediaPanel
    componentProps.onMediaChange = onMediaChange
    componentProps.pageId = pageId
  }

  // Render appropriate component
  switch (component.type) {
    case 'hero':
      return <HeroSection {...componentProps} />
    case 'intro':
    case 'text-block':
      return <IntroSection {...componentProps} />
    case 'photo-gallery':
      return <MediaGallery {...componentProps} />
    case 'memories-grid':
      return <MemoriesSection {...componentProps} />
    case 'timeline':
      return <TimelineSection {...componentProps} />
    case 'final-message':
      return <FinalMessageSection {...componentProps} />
    case 'quote':
      return <QuoteSection {...componentProps} />
    case 'video-section':
      return <VideoSection {...componentProps} />
    case 'countdown':
      return <CountdownSection {...componentProps} />
    case 'two-column':
      return <TwoColumnSection {...componentProps} />
    case 'testimonials':
      return <TestimonialsSection {...componentProps} />
    case 'map-location':
      return <MapLocationSection {...componentProps} />
    case 'music-player':
      return musicUrl ? <MusicPlayer musicUrl={musicUrl} /> : null
    default:
      return (
        <div className="p-8 bg-gray-100 text-center text-gray-500">
          Component type &quot;{component.type}&quot; preview not available
        </div>
      )
  }
}

