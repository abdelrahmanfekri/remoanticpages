'use client'

import React from 'react'
import type { PageWithRelations } from '@/types'

interface TwoColumnSectionProps {
  page: PageWithRelations
  variant?: 'default' | 'split' | 'image-text' | 'text-image'
  theme?: {
    primaryColor?: string
    backgroundColor?: string
    textColor?: string
  }
  settings?: {
    columns?: number
    showTitle?: boolean
    title?: string
    leftContent?: string
    rightContent?: string
  }
  defaultContent?: Record<string, any>
}

export function TwoColumnSection({ 
  page, 
  variant = 'default',
  theme = {},
  settings = {},
  defaultContent = {}
}: TwoColumnSectionProps) {
  const {
    primaryColor = '#f43f5e',
    backgroundColor = 'bg-white',
    textColor = 'text-gray-700'
  } = theme

  const {
    columns = 2,
    showTitle = true,
    title = 'Two Column Section',
    leftContent = '',
    rightContent = ''
  } = settings

  const getText = (field: string | Record<string, string> | null | undefined, lang: string = 'en') => {
    if (!field) return ''
    if (typeof field === 'string') return field
    return field[lang] || field.en || ''
  }

  const left = leftContent || defaultContent.leftContent || defaultContent.left || ''
  const right = rightContent || defaultContent.rightContent || defaultContent.right || ''
  const media = page.media || []
  const firstMedia = media[0]

  const getMediaUrl = (item: any) => {
    return (item as any).url || (item as any).storage_path || ''
  }

  const isVideo = (url: string) => {
    const lowerUrl = url.toLowerCase()
    return lowerUrl.endsWith('.mp4') || lowerUrl.endsWith('.webm') || lowerUrl.endsWith('.mov')
  }

  if (variant === 'image-text' && firstMedia) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {showTitle && (
            <h2 className="text-4xl md:text-5xl font-serif text-center mb-16" style={{ color: primaryColor }}>
              {title}
            </h2>
          )}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              {isVideo(getMediaUrl(firstMedia)) ? (
                <video
                  src={getMediaUrl(firstMedia)}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={getMediaUrl(firstMedia)}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className={`${backgroundColor} p-8 rounded-2xl`}>
              <p className={`text-lg md:text-xl leading-relaxed ${textColor}`}>
                {right || left}
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'text-image' && firstMedia) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {showTitle && (
            <h2 className="text-4xl md:text-5xl font-serif text-center mb-16" style={{ color: primaryColor }}>
              {title}
            </h2>
          )}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className={`${backgroundColor} p-8 rounded-2xl`}>
              <p className={`text-lg md:text-xl leading-relaxed ${textColor}`}>
                {left || right}
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              {isVideo(getMediaUrl(firstMedia)) ? (
                <video
                  src={getMediaUrl(firstMedia)}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={getMediaUrl(firstMedia)}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Default two column layout
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-4'
  }[columns] || 'grid-cols-1 md:grid-cols-2'

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {showTitle && (
          <h2 className="text-4xl md:text-5xl font-serif text-center mb-16" style={{ color: primaryColor }}>
            {title}
          </h2>
        )}
        <div className={`grid ${gridCols} gap-8`}>
          <div className={`${backgroundColor} p-8 rounded-2xl shadow-lg`}>
            <p className={`text-lg md:text-xl leading-relaxed ${textColor}`}>
              {left}
            </p>
          </div>
          <div className={`${backgroundColor} p-8 rounded-2xl shadow-lg`}>
            <p className={`text-lg md:text-xl leading-relaxed ${textColor}`}>
              {right}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

