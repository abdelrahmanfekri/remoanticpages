'use client'

import React from 'react'
import type { PageWithRelations } from '@/types'
import type { ComponentType, TemplateSchema } from '@/lib/template-schemas'
import { HeroSection } from './HeroSection'
import { IntroSection } from './IntroSection'
import { MediaGallery } from './MediaGallery'
import { MemoriesSection } from './MemoriesSection'
import { FinalMessageSection } from './FinalMessageSection'
import { TimelineSection } from './TimelineSection'
import { QuoteSection } from './QuoteSection'
import { VideoSection } from './VideoSection'
import { CountdownSection } from './CountdownSection'
import { TwoColumnSection } from './TwoColumnSection'
import { TestimonialsSection } from './TestimonialsSection'
import { MapLocationSection } from './MapLocationSection'
import { MusicPlayer } from './MusicPlayer'

export interface TemplateComponentConfig {
  id: string
  type: ComponentType
  variant?: string
  order: number
  theme?: Record<string, any>
  settings?: Record<string, any>
}

export interface TemplateConfig {
  components: TemplateComponentConfig[]
  theme: {
    primaryColor?: string
    secondaryColor?: string
    backgroundGradient?: string
    fontFamily?: string
  }
  background?: {
    type?: 'gradient' | 'solid' | 'pattern'
    value?: string
  }
}

interface DynamicTemplateRendererProps {
  page: PageWithRelations
  config: TemplateConfig
  schema?: TemplateSchema
}

export function DynamicTemplateRenderer({ page, config, schema }: DynamicTemplateRendererProps) {
  const { components, theme, background } = config

  // Sort components by order
  const sortedComponents = [...components].sort((a, b) => a.order - b.order)

  const backgroundClass = background?.type === 'gradient' 
    ? `bg-gradient-to-br ${background.value || 'from-pink-50 via-white to-rose-50'}`
    : background?.type === 'solid'
    ? `bg-[${background.value || '#ffffff'}]`
    : schema?.theme?.primaryColor && schema?.theme?.secondaryColor
    ? `bg-gradient-to-br from-[${schema.theme.primaryColor}]20 via-white to-[${schema.theme.secondaryColor}]20`
    : 'bg-gradient-to-br from-pink-50 via-white to-rose-50'

  // Get default content from schema if available
  const getDefaultContent = (componentId: string) => {
    return schema?.defaultContent?.[componentId] || {}
  }

  return (
    <div className={`min-h-screen ${backgroundClass} relative overflow-hidden`} style={{
      fontFamily: theme.fontFamily || schema?.theme?.fontFamily || 'inherit'
    }}>
      {/* Music Player */}
      {page.background_music_url && (
        <MusicPlayer musicUrl={page.background_music_url} />
      )}

      {/* Render components in order */}
      {sortedComponents.map((component, index) => {
        const componentTheme = { 
          ...theme, 
          ...component.theme,
          primaryColor: component.theme?.primaryColor || theme.primaryColor || schema?.theme?.primaryColor,
          secondaryColor: component.theme?.secondaryColor || theme.secondaryColor || schema?.theme?.secondaryColor,
          fontFamily: component.theme?.fontFamily || theme.fontFamily || schema?.theme?.fontFamily
        }
        const componentSettings = { ...component.settings }
        const defaultContent = getDefaultContent(component.id)

        switch (component.type) {
          case 'hero':
            return (
              <HeroSection
                key={`${component.id}-${component.type}-${index}`}
                page={page}
                variant={component.variant as any}
                theme={componentTheme}
                settings={componentSettings}
                defaultContent={defaultContent}
              />
            )
          case 'intro':
            return (
              <IntroSection
                key={`${component.id}-${component.type}-${index}`}
                page={page}
                variant={component.variant as any}
                theme={componentTheme}
                settings={componentSettings}
                defaultContent={defaultContent}
              />
            )
          case 'photo-gallery':
            return (
              <MediaGallery
                key={`${component.id}-${component.type}-${index}`}
                page={page}
                variant={component.variant as any}
                theme={componentTheme}
                settings={componentSettings}
                defaultContent={defaultContent}
              />
            )
          case 'memories-grid':
            return (
              <MemoriesSection
                key={`${component.id}-${component.type}-${index}`}
                page={page}
                variant={component.variant as any}
                theme={componentTheme}
                settings={componentSettings}
                defaultContent={defaultContent}
              />
            )
          case 'timeline':
            return (
              <TimelineSection
                key={`${component.id}-${component.type}-${index}`}
                page={page}
                variant={component.variant as any}
                theme={componentTheme}
                settings={componentSettings}
                defaultContent={defaultContent}
              />
            )
          case 'final-message':
            return (
              <FinalMessageSection
                key={`${component.id}-${component.type}-${index}`}
                page={page}
                variant={component.variant as any}
                theme={componentTheme}
                settings={componentSettings}
                defaultContent={defaultContent}
              />
            )
          case 'quote':
            return (
              <QuoteSection
                key={`${component.id}-${component.type}-${index}`}
                page={page}
                variant={component.variant as any}
                theme={componentTheme}
                settings={componentSettings}
                defaultContent={defaultContent}
              />
            )
          case 'video-section':
            return (
              <VideoSection
                key={`${component.id}-${component.type}-${index}`}
                page={page}
                variant={component.variant as any}
                theme={componentTheme}
                settings={componentSettings}
                defaultContent={defaultContent}
              />
            )
          case 'countdown':
            return (
              <CountdownSection
                key={`${component.id}-${component.type}-${index}`}
                page={page}
                variant={component.variant as any}
                theme={componentTheme}
                settings={componentSettings}
                defaultContent={defaultContent}
              />
            )
          case 'text-block':
            return (
              <IntroSection
                key={`${component.id}-${component.type}-${index}`}
                page={page}
                variant={component.variant as any}
                theme={componentTheme}
                settings={componentSettings}
                defaultContent={defaultContent}
              />
            )
          case 'two-column':
            return (
              <TwoColumnSection
                key={`${component.id}-${component.type}-${index}`}
                page={page}
                variant={component.variant as any}
                theme={componentTheme}
                settings={componentSettings}
                defaultContent={defaultContent}
              />
            )
          case 'testimonials':
            return (
              <TestimonialsSection
                key={`${component.id}-${component.type}-${index}`}
                page={page}
                variant={component.variant as any}
                theme={componentTheme}
                settings={componentSettings}
                defaultContent={defaultContent}
              />
            )
          case 'map-location':
            return (
              <MapLocationSection
                key={`${component.id}-${component.type}-${index}`}
                page={page}
                variant={component.variant as any}
                theme={componentTheme}
                settings={componentSettings}
                defaultContent={defaultContent}
              />
            )
          case 'music-player':
            return (
              <MusicPlayer
                key={`${component.id}-${component.type}-${index}`}
                musicUrl={page.background_music_url || undefined}
                position={componentSettings.position as any}
                settings={componentSettings}
              />
            )
          default:
            return null
        }
      })}
    </div>
  )
}

