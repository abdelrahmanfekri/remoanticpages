'use client'

import React from 'react'
import type { PageWithRelations } from '@/types'

interface MediaGalleryProps {
  page: PageWithRelations
  variant?: 'grid' | 'masonry' | 'carousel' | 'stacked'
  theme?: {
    borderColor?: string
    hoverEffect?: string
    primaryColor?: string
  }
  settings?: {
    columns?: number
    aspectRatio?: 'square' | 'landscape' | 'portrait' | 'auto' | 'cover'
    showTitle?: boolean
    title?: string
    animation?: string
    neonBorder?: boolean
    elegantFrame?: boolean
    goldenFrame?: boolean
    glowEffect?: boolean
  }
  defaultContent?: Record<string, any>
}

export function MediaGallery({ 
  page, 
  variant = 'grid',
  theme = {},
  settings = {},
  defaultContent = {}
}: MediaGalleryProps) {
  const {
    borderColor = 'border-gray-200',
    hoverEffect = 'scale-110',
    primaryColor = '#f43f5e'
  } = theme

  const {
    columns = 3,
    aspectRatio = 'square',
    showTitle = true,
    title = 'Our Beautiful Moments',
    animation = 'fade-in',
    neonBorder = false,
    elegantFrame = false,
    goldenFrame = false,
    glowEffect = false
  } = settings

  const media = page.media || defaultContent.images || []
  if (media.length === 0) return null

  const isVideo = (url: string) => {
    if (!url) return false
    const lowerUrl = url.toLowerCase()
    return lowerUrl.endsWith('.mp4') || lowerUrl.endsWith('.webm') || lowerUrl.endsWith('.mov')
  }

  const getMediaUrl = (item: any) => {
    return (item as any).url || (item as any).storage_path || ''
  }
  
  const aspectClass = {
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[3/4]',
    auto: '',
    cover: 'aspect-cover'
  }[aspectRatio]

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }[columns] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'

  const frameStyle = neonBorder 
    ? { border: `2px solid ${primaryColor}`, boxShadow: `0 0 20px ${primaryColor}` }
    : elegantFrame || goldenFrame
    ? { border: `3px solid ${primaryColor}`, boxShadow: `0 10px 30px ${primaryColor}30` }
    : {}

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {showTitle && (
          <h2 className="text-4xl md:text-5xl font-serif text-center mb-16" style={{ color: primaryColor }}>
            {title}
          </h2>
        )}
        <div className={`grid ${gridCols} gap-6`}>
          {media
            .sort((a, b) => ((a as any).order || (a as any).display_order || 0) - ((b as any).order || (b as any).display_order || 0))
            .map((item, index) => {
              const url = getMediaUrl(item)
              return (
                <div
                  key={(item as any).id || index}
                  className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ${aspectClass}`}
                  style={{
                    ...frameStyle,
                    boxShadow: glowEffect ? `0 0 30px ${primaryColor}40` : frameStyle.boxShadow
                  }}
                >
                  {isVideo(url) ? (
                    <video
                      src={url}
                      className={`w-full h-full object-cover transform group-hover:${hoverEffect} transition-transform duration-500`}
                      controls
                    />
                  ) : (
                    <img
                      src={url}
                      alt={`Gallery ${index + 1}`}
                      className={`w-full h-full object-cover transform group-hover:${hoverEffect} transition-transform duration-500`}
                    />
                  )}
                </div>
              )
            })}
        </div>
      </div>
    </section>
  )
}

