'use client'

import React from 'react'
import type { PageBlock, PageTheme, Memory, Media } from '@/types'

interface BlockProps {
  block: PageBlock
  theme: PageTheme
  memories: Memory[]
  media: Media[]
  editable?: boolean
  onClick?: () => void
  onUpdate?: (content: unknown, settings: unknown) => void
}

export function HeroBlock({ block, theme, editable, onClick }: BlockProps) {
  const content = block.content as {
    title?: string
    subtitle?: string
    showImage?: boolean
    imageUrl?: string
  }
  const settings = block.settings as {
    alignment?: 'left' | 'center' | 'right'
    height?: 'small' | 'medium' | 'large' | 'fullscreen'
    showDecorativeElements?: boolean
  }

  const heightClasses = {
    small: 'min-h-[40vh]',
    medium: 'min-h-[60vh]',
    large: 'min-h-[80vh]',
    fullscreen: 'min-h-screen',
  }

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <section
      className={`relative flex items-center justify-center px-6 py-20 ${heightClasses[settings.height || 'large']} ${
        editable ? 'cursor-pointer hover:ring-2 hover:ring-blue-400' : ''
      }`}
      onClick={onClick}
      style={{
        backgroundImage: content.showImage && content.imageUrl ? `url(${content.imageUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {content.showImage && content.imageUrl && (
        <div className="absolute inset-0 bg-black/30" />
      )}
      
      <div className={`relative z-10 max-w-4xl mx-auto ${alignmentClasses[settings.alignment || 'center']}`}>
        {content.title && (
          <h1
            className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in"
            style={{ color: content.showImage ? '#ffffff' : theme.primaryColor }}
          >
            {content.title}
          </h1>
        )}
        {content.subtitle && (
          <p
            className="text-2xl md:text-3xl animate-fade-in-delay"
            style={{ color: content.showImage ? '#ffffff' : theme.secondaryColor }}
          >
            {content.subtitle}
          </p>
        )}
        {settings.showDecorativeElements && (
          <div className="mt-8 flex justify-center gap-2">
            <div className="w-16 h-1 rounded" style={{ backgroundColor: theme.primaryColor }} />
            <div className="w-16 h-1 rounded" style={{ backgroundColor: theme.secondaryColor }} />
          </div>
        )}
      </div>
    </section>
  )
}

