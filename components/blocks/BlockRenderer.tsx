'use client'

import React from 'react'
import type { PageWithRelations, PageBlock, PageTheme, Memory, Media } from '@/types'
import { HeroBlock } from './HeroBlock'
import { IntroBlock } from './IntroBlock'
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

  const bgGradient = `linear-gradient(135deg, ${theme.primaryColor}15 0%, ${theme.backgroundColor || '#ffffff'} 50%, ${theme.secondaryColor}15 100%)`

  return (
    <div 
      className="min-h-screen relative overflow-hidden" 
      style={{
        background: bgGradient,
        fontFamily: theme.fontFamily || 'serif',
      }}
    >
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

