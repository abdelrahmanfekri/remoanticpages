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
}

export function TextBlock({ block, theme, editable, onClick }: BlockProps) {
  const content = block.content as { text?: string }
  const settings = block.settings as { fontSize?: 'small' | 'medium' | 'large'; centered?: boolean }

  const sizeClasses = {
    small: 'text-base',
    medium: 'text-lg',
    large: 'text-xl',
  }

  return (
    <section className={`py-12 px-6 ${editable ? 'cursor-pointer hover:ring-2 hover:ring-blue-400' : ''}`} onClick={onClick}>
      <div className={`max-w-3xl mx-auto ${settings.centered ? 'text-center' : ''}`}>
        <p className={`${sizeClasses[settings.fontSize || 'medium']} whitespace-pre-wrap`} style={{ color: theme.primaryColor }}>
          {content.text}
        </p>
      </div>
    </section>
  )
}

export function QuoteBlock({ block, theme, editable, onClick }: BlockProps) {
  const content = block.content as { text?: string; author?: string }
  const settings = block.settings as { style?: string; showIcon?: boolean }

  return (
    <section className={`py-16 px-6 ${editable ? 'cursor-pointer hover:ring-2 hover:ring-blue-400' : ''}`} onClick={onClick}>
      <div className="max-w-2xl mx-auto text-center">
        {settings.showIcon && <span className="text-4xl mb-4 block">💭</span>}
        <blockquote className="text-2xl italic mb-4" style={{ color: theme.primaryColor }}>
          "{content.text}"
        </blockquote>
        {content.author && (
          <p className="text-lg" style={{ color: theme.secondaryColor }}>
            — {content.author}
          </p>
        )}
      </div>
    </section>
  )
}

export function GalleryBlock({ block, theme, media, editable, onClick }: BlockProps) {
  const content = block.content as { title?: string; showTitle?: boolean }
  const settings = block.settings as { columns?: string; aspectRatio?: string; gap?: string }

  const imageMedia = media.filter((m) => m.file_type === 'image')
  const columns = parseInt(settings.columns || '3')

  return (
    <section className={`py-16 px-6 ${editable ? 'cursor-pointer hover:ring-2 hover:ring-blue-400' : ''}`} onClick={onClick}>
      <div className="max-w-6xl mx-auto">
        {content.showTitle && content.title && (
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: theme.primaryColor }}>
            {content.title}
          </h2>
        )}
        <div className={`grid grid-cols-${columns} gap-4`}>
          {imageMedia.map((item) => (
            <div key={item.id} className="aspect-square overflow-hidden rounded-lg">
              <img src={item.storage_path} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function VideoBlock({ block, theme, editable, onClick }: BlockProps) {
  const content = block.content as { videoUrl?: string; title?: string; showTitle?: boolean }

  return (
    <section className={`py-16 px-6 ${editable ? 'cursor-pointer hover:ring-2 hover:ring-blue-400' : ''}`} onClick={onClick}>
      <div className="max-w-4xl mx-auto">
        {content.showTitle && content.title && (
          <h2 className="text-3xl font-bold text-center mb-8" style={{ color: theme.primaryColor }}>
            {content.title}
          </h2>
        )}
        <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
          {content.videoUrl && (
            <iframe src={content.videoUrl} className="w-full h-full" allowFullScreen />
          )}
        </div>
      </div>
    </section>
  )
}

export function TimelineBlock({ block, theme, memories, editable, onClick }: BlockProps) {
  const content = block.content as { title?: string; showTitle?: boolean }
  const settings = block.settings as { layout?: string; showDates?: boolean }

  return (
    <section className={`py-16 px-6 ${editable ? 'cursor-pointer hover:ring-2 hover:ring-blue-400' : ''}`} onClick={onClick}>
      <div className="max-w-4xl mx-auto">
        {content.showTitle && content.title && (
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: theme.primaryColor }}>
            {content.title}
          </h2>
        )}
        <div className="space-y-8">
          {memories.map((memory) => (
            <div key={memory.id} className="flex gap-4">
              <div className="flex-shrink-0 w-2 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
              <div className="flex-1">
                {settings.showDates && memory.date && (
                  <p className="text-sm mb-2" style={{ color: theme.secondaryColor }}>{memory.date}</p>
                )}
                <h3 className="text-xl font-semibold mb-2" style={{ color: theme.primaryColor }}>{memory.title}</h3>
                <p className="text-gray-700">{memory.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function MemoriesBlock({ block, theme, memories, editable, onClick }: BlockProps) {
  const content = block.content as { title?: string; showTitle?: boolean }
  const settings = block.settings as { layout?: string; columns?: string }

  return (
    <section className={`py-16 px-6 ${editable ? 'cursor-pointer hover:ring-2 hover:ring-blue-400' : ''}`} onClick={onClick}>
      <div className="max-w-6xl mx-auto">
        {content.showTitle && content.title && (
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: theme.primaryColor }}>
            {content.title}
          </h2>
        )}
        <div className="grid md:grid-cols-2 gap-6">
          {memories.map((memory) => (
            <div key={memory.id} className="bg-white/80 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-2" style={{ color: theme.primaryColor }}>{memory.title}</h3>
              {memory.date && <p className="text-sm mb-3" style={{ color: theme.secondaryColor }}>{memory.date}</p>}
              <p className="text-gray-700">{memory.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CountdownBlock({ block, theme, editable, onClick }: BlockProps) {
  const content = block.content as { title?: string; targetDate?: string; message?: string }
  
  return (
    <section className={`py-16 px-6 ${editable ? 'cursor-pointer hover:ring-2 hover:ring-blue-400' : ''}`} onClick={onClick}>
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8" style={{ color: theme.primaryColor }}>{content.title}</h2>
        <div className="text-5xl font-bold" style={{ color: theme.secondaryColor }}>
          {/* Placeholder - implement actual countdown */}
          00:00:00
        </div>
      </div>
    </section>
  )
}

export function TwoColumnBlock({ block, theme, editable, onClick }: BlockProps) {
  const content = block.content as { leftContent?: string; rightContent?: string }

  return (
    <section className={`py-16 px-6 ${editable ? 'cursor-pointer hover:ring-2 hover:ring-blue-400' : ''}`} onClick={onClick}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        <div className="whitespace-pre-wrap" style={{ color: theme.primaryColor }}>{content.leftContent}</div>
        <div className="whitespace-pre-wrap" style={{ color: theme.primaryColor }}>{content.rightContent}</div>
      </div>
    </section>
  )
}

export function TestimonialsBlock({ block, theme, editable, onClick }: BlockProps) {
  const content = block.content as { title?: string; showTitle?: boolean }

  return (
    <section className={`py-16 px-6 ${editable ? 'cursor-pointer hover:ring-2 hover:ring-blue-400' : ''}`} onClick={onClick}>
      <div className="max-w-4xl mx-auto text-center">
        {content.showTitle && content.title && (
          <h2 className="text-3xl font-bold mb-12" style={{ color: theme.primaryColor }}>{content.title}</h2>
        )}
        <p className="text-gray-500">Testimonials coming soon</p>
      </div>
    </section>
  )
}

export function MapBlock({ block, theme, editable, onClick }: BlockProps) {
  const content = block.content as { title?: string; address?: string }

  return (
    <section className={`py-16 px-6 ${editable ? 'cursor-pointer hover:ring-2 hover:ring-blue-400' : ''}`} onClick={onClick}>
      <div className="max-w-4xl mx-auto">
        {content.title && (
          <h2 className="text-3xl font-bold text-center mb-8" style={{ color: theme.primaryColor }}>{content.title}</h2>
        )}
        <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Map: {content.address}</p>
        </div>
      </div>
    </section>
  )
}

export function DividerBlock({ block, theme, editable, onClick }: BlockProps) {
  const settings = block.settings as { style?: string; thickness?: string }

  const thicknessMap = { thin: 1, medium: 2, thick: 4 }
  const height = thicknessMap[settings.thickness as keyof typeof thicknessMap] || 1

  return (
    <section className={`py-8 px-6 ${editable ? 'cursor-pointer hover:ring-2 hover:ring-blue-400' : ''}`} onClick={onClick}>
      <div className="max-w-4xl mx-auto">
        <div className={`w-full border-${settings.style || 'solid'}`} style={{ height: `${height}px`, backgroundColor: theme.primaryColor }} />
      </div>
    </section>
  )
}

export function SpacerBlock({ block, editable, onClick }: BlockProps) {
  const settings = block.settings as { height?: string }

  const heightMap = { small: 32, medium: 64, large: 128, xlarge: 256 }
  const height = heightMap[settings.height as keyof typeof heightMap] || 64

  return (
    <div className={`${editable ? 'cursor-pointer hover:ring-2 hover:ring-blue-400' : ''}`} style={{ height: `${height}px` }} onClick={onClick} />
  )
}

export function ButtonBlock({ block, theme, editable, onClick }: BlockProps) {
  const content = block.content as { text?: string; url?: string }
  const settings = block.settings as { style?: string; size?: string; alignment?: string }

  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }

  return (
    <section className={`py-8 px-6 ${editable ? 'cursor-pointer hover:ring-2 hover:ring-blue-400' : ''}`} onClick={onClick}>
      <div className={`max-w-4xl mx-auto flex ${alignmentClasses[settings.alignment as keyof typeof alignmentClasses] || 'justify-center'}`}>
        <a 
          href={content.url} 
          className="px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          style={{ backgroundColor: theme.primaryColor, color: '#ffffff' }}
        >
          {content.text}
        </a>
      </div>
    </section>
  )
}

export function SocialLinksBlock({ block, theme, editable, onClick }: BlockProps) {
  return (
    <section className={`py-8 px-6 ${editable ? 'cursor-pointer hover:ring-2 hover:ring-blue-400' : ''}`} onClick={onClick}>
      <div className="max-w-4xl mx-auto flex justify-center gap-4">
        <p className="text-gray-500">Social links coming soon</p>
      </div>
    </section>
  )
}

export function FinalMessageBlock({ block, theme, editable, onClick }: BlockProps) {
  const content = block.content as { message?: string; signature?: string; showIcon?: boolean }
  const settings = block.settings as { style?: string; centered?: boolean }

  return (
    <section className={`py-20 px-6 ${editable ? 'cursor-pointer hover:ring-2 hover:ring-blue-400' : ''}`} onClick={onClick}>
      <div className={`max-w-2xl mx-auto ${settings.centered ? 'text-center' : ''}`}>
        {content.showIcon && <span className="text-5xl block mb-6">💝</span>}
        <p className="text-2xl mb-6 whitespace-pre-wrap" style={{ color: theme.primaryColor }}>
          {content.message}
        </p>
        {content.signature && (
          <p className="text-xl italic" style={{ color: theme.secondaryColor}}>
            {content.signature}
          </p>
        )}
      </div>
    </section>
  )
}

export function MusicPlayer({ musicUrl }: { musicUrl: string }) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <audio controls className="w-64 h-12">
        <source src={musicUrl} type="audio/mpeg" />
      </audio>
    </div>
  )
}

