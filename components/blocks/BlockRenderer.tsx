'use client'

import React from 'react'
import type { PageWithRelations, PageBlock, PageTheme, Memory, Media } from '@/types'
import { HeroBlock } from './HeroBlock'
import { IntroBlock } from './IntroBlock'
import { BackgroundAnimation } from '@/components/BackgroundAnimation'
import {
  TextBlock,
  QuoteBlock,
  GalleryBlock,
  VideoBlock,
  TimelineBlock,
  MemoriesBlock,
  CountdownBlock,
  TwoColumnBlock,
  TestimonialsBlock,
  MapBlock,
  DividerBlock,
  SpacerBlock,
  ButtonBlock,
  SocialLinksBlock,
  FinalMessageBlock,
  MusicPlayer,
} from './AllBlocks'

interface BlockRendererProps {
  page: PageWithRelations
  editable?: boolean
  onBlockClick?: (blockId: string) => void
  onBlockUpdate?: (blockId: string, content: unknown, settings: unknown) => void
}

export function BlockRenderer({ page, editable = false, onBlockClick, onBlockUpdate }: BlockRendererProps) {
  const theme = (page.theme as unknown as PageTheme) || { primaryColor: '#f43f5e', secondaryColor: '#ec4899', fontFamily: 'serif' }
  const settings = page.settings as any
  const blocks = page.blocks || []
  const memories = page.memories || []
  const media = page.media || []

  const sortedBlocks = [...blocks].sort((a, b) => a.display_order - b.display_order)

  const renderBlock = (block: PageBlock) => {
    const commonProps = {
      key: block.id,
      block,
      theme,
      memories,
      media,
      editable,
      onClick: editable ? () => onBlockClick?.(block.id) : undefined,
      onUpdate: editable ? (content: unknown, settings: unknown) => onBlockUpdate?.(block.id, content, settings) : undefined,
    }

    switch (block.type) {
      case 'hero':
        return <HeroBlock {...commonProps} />
      case 'intro':
        return <IntroBlock {...commonProps} />
      case 'text':
        return <TextBlock {...commonProps} />
      case 'quote':
        return <QuoteBlock {...commonProps} />
      case 'gallery':
        return <GalleryBlock {...commonProps} />
      case 'video':
        return <VideoBlock {...commonProps} />
      case 'timeline':
        return <TimelineBlock {...commonProps} />
      case 'memories':
        return <MemoriesBlock {...commonProps} />
      case 'countdown':
        return <CountdownBlock {...commonProps} />
      case 'two-column':
        return <TwoColumnBlock {...commonProps} />
      case 'testimonials':
        return <TestimonialsBlock {...commonProps} />
      case 'map':
        return <MapBlock {...commonProps} />
      case 'divider':
        return <DividerBlock {...commonProps} />
      case 'spacer':
        return <SpacerBlock {...commonProps} />
      case 'button':
        return <ButtonBlock {...commonProps} />
      case 'social-links':
        return <SocialLinksBlock {...commonProps} />
      case 'final-message':
        return <FinalMessageBlock {...commonProps} />
      default:
        return null
    }
  }

  // Build background gradient style from theme
  const getBackgroundStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      fontFamily: theme.fontFamily === 'serif' ? 'Playfair Display, serif' : 'Inter, sans-serif',
    }

    if (theme.backgroundGradient) {
      const { from, via, to, direction = 'to-b' } = theme.backgroundGradient
      const directionMap: Record<string, string> = {
        'to-b': 'to bottom',
        'to-r': 'to right',
        'to-bl': 'to bottom left',
        'to-br': 'to bottom right',
      }
      
      const gradientDirection = directionMap[direction] || 'to bottom'
      const gradientStops = via
        ? `linear-gradient(${gradientDirection}, ${from}, ${via}, ${to})`
        : `linear-gradient(${gradientDirection}, ${from}, ${to})`
      
      return {
        ...baseStyle,
        background: gradientStops,
      }
    }

    // Fallback to simple gradient
    return {
      ...baseStyle,
      background: theme.backgroundColor || 'linear-gradient(to bottom right, #fdf2f8, #ffffff, #fdf2f8)',
    }
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={getBackgroundStyle()}
    >
      {/* Background Animation */}
      {theme.backgroundAnimation?.enabled && (
        <BackgroundAnimation
          type={theme.backgroundAnimation.type}
          color={theme.backgroundAnimation.color || theme.primaryColor}
          opacity={theme.backgroundAnimation.opacity || 0.4}
          count={theme.backgroundAnimation.count || 12}
          speed={theme.backgroundAnimation.speed || 'normal'}
          size={theme.backgroundAnimation.size || 'medium'}
        />
      )}

      {/* Music Player */}
      {settings?.musicUrl && (
        <MusicPlayer musicUrl={settings.musicUrl} />
      )}

      {/* Render blocks */}
      <div className="relative z-10">
        {sortedBlocks.map(renderBlock)}
      </div>
    </div>
  )
}

