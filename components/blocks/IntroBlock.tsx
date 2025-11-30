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

export function IntroBlock({ block, theme, editable, onClick }: BlockProps) {
  const content = block.content as {
    text?: string
    showIcon?: boolean
  }
  const settings = block.settings as {
    style?: 'default' | 'card' | 'bordered'
    centered?: boolean
  }

  const styleClasses = {
    default: '',
    card: 'bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-8',
    bordered: 'border-2 rounded-lg p-8',
  }

  return (
    <section
      className={`py-16 px-6 ${editable ? 'cursor-pointer hover:ring-2 hover:ring-blue-400' : ''}`}
      onClick={onClick}
    >
      <div className={`max-w-3xl mx-auto ${settings.centered ? 'text-center' : ''} ${styleClasses[settings.style || 'default']}`}
           style={settings.style === 'bordered' ? { borderColor: theme.primaryColor } : undefined}>
        {content.showIcon && (
          <div className="mb-6">
            <span className="text-5xl">💝</span>
          </div>
        )}
        {content.text && (
          <p className="text-lg md:text-xl leading-relaxed whitespace-pre-wrap" style={{ color: theme.primaryColor }}>
            {content.text}
          </p>
        )}
      </div>
    </section>
  )
}

