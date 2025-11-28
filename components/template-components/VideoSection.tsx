'use client'

import React from 'react'
import type { PageWithRelations } from '@/types'

interface VideoSectionProps {
  page: PageWithRelations
  variant?: 'single' | 'grid' | 'carousel' | 'fullscreen'
  theme?: {
    primaryColor?: string
    backgroundColor?: string
  }
  settings?: {
    showTitle?: boolean
    title?: string
    autoplay?: boolean
    loop?: boolean
    muted?: boolean
  }
  defaultContent?: Record<string, any>
}

export function VideoSection({ 
  page, 
  variant = 'single',
  theme = {},
  settings = {},
  defaultContent = {}
}: VideoSectionProps) {
  const {
    primaryColor = '#f43f5e',
    backgroundColor = 'bg-transparent'
  } = theme

  const {
    showTitle = true,
    title = 'Video',
    autoplay = false,
    loop = true,
    muted = true
  } = settings

  // Filter videos from media
  const videos = (page.media || []).filter(item => {
    const url = (item as any).url || (item as any).storage_path || ''
    return url.toLowerCase().endsWith('.mp4') || 
           url.toLowerCase().endsWith('.webm') || 
           url.toLowerCase().endsWith('.mov') ||
           item.file_type === 'video'
  })

  if (videos.length === 0) return null

  const isVideo = (url: string) => {
    const lowerUrl = url.toLowerCase()
    return lowerUrl.endsWith('.mp4') || lowerUrl.endsWith('.webm') || lowerUrl.endsWith('.mov')
  }

  const getVideoUrl = (item: any) => {
    return (item as any).url || (item as any).storage_path || ''
  }

  if (variant === 'fullscreen') {
    return (
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {showTitle && (
            <h2 className="text-4xl md:text-5xl font-serif text-center mb-16" style={{ color: primaryColor }}>
              {title}
            </h2>
          )}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <video
              src={getVideoUrl(videos[0])}
              className="w-full h-full object-cover"
              autoPlay={autoplay}
              loop={loop}
              muted={muted}
              controls
              playsInline
            />
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'grid') {
    return (
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {showTitle && (
            <h2 className="text-4xl md:text-5xl font-serif text-center mb-16" style={{ color: primaryColor }}>
              {title}
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <div
                key={video.id || index}
                className="relative aspect-video rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
              >
                <video
                  src={getVideoUrl(video)}
                  className="w-full h-full object-cover"
                  loop={loop}
                  muted={muted}
                  controls
                  playsInline
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Single video (default)
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {showTitle && (
          <h2 className="text-4xl md:text-5xl font-serif text-center mb-16" style={{ color: primaryColor }}>
            {title}
          </h2>
        )}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl">
          <video
            src={getVideoUrl(videos[0])}
            className="w-full h-full object-cover"
            autoPlay={autoplay}
            loop={loop}
            muted={muted}
            controls
            playsInline
          />
        </div>
      </div>
    </section>
  )
}

