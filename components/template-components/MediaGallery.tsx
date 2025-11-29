'use client'

import React, { useRef } from 'react'
import { Upload, Image as ImageIcon } from 'lucide-react'
import type { PageWithRelations } from '@/types'
import type { MediaItem } from '@/components/MediaUploader'

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
  viewMode?: 'edit' | 'preview'
  onOpenMediaPanel?: () => void
  onMediaChange?: (media: MediaItem[]) => void
  pageId?: string
}

export function MediaGallery({ 
  page, 
  variant = 'grid',
  theme = {},
  settings = {},
  defaultContent = {},
  viewMode = 'preview',
  onOpenMediaPanel,
  onMediaChange,
  pageId
}: MediaGalleryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
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

  const rawMedia = page.media || defaultContent.images || []
  // Normalize media items to MediaItem format
  const media: MediaItem[] = rawMedia.map((item: any) => {
    if (item.url && item.type) {
      return item as MediaItem
    }
    // Convert from database format
    return {
      id: item.id,
      url: item.storage_path || item.url || '',
      type: item.file_type || item.type || 'image',
      size: item.size,
    } as MediaItem
  })
  
  const isEditMode = viewMode === 'edit' || (defaultContent as any)?.viewMode === 'edit'
  // Show empty state in edit mode, hide in preview if empty
  if (media.length === 0 && !isEditMode) return null

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // If onOpenMediaPanel is provided, open the panel instead (preferred method)
    if (onOpenMediaPanel) {
      onOpenMediaPanel()
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    // Otherwise, handle upload directly (for preview mode or when no panel available)
    if (!onMediaChange) return

    const newMediaItems: MediaItem[] = []
    const filePromises: Promise<void>[] = []
    
    for (const file of files) {
      const isVideo = file.type.startsWith('video/')
      const mediaType = isVideo ? 'video' : 'image'

      // Validate file size
      const maxSize = mediaType === 'image' ? 10 * 1024 * 1024 : 100 * 1024 * 1024 // 10MB for images, 100MB for videos
      if (file.size > maxSize) {
        alert(`${mediaType === 'image' ? 'Image' : 'Video'} is too large. Max size: ${mediaType === 'image' ? '10MB' : '100MB'}`)
        continue
      }

      // Create preview URL using Promise
      const filePromise = new Promise<void>((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const newMedia: MediaItem = {
            url: e.target?.result as string,
            type: mediaType,
            size: file.size,
          }
          newMediaItems.push(newMedia)
          resolve()
        }
        reader.onerror = () => resolve() // Skip on error
        reader.readAsDataURL(file)
      })
      filePromises.push(filePromise)
    }

    // Wait for all files to be processed, then update
    await Promise.all(filePromises)
    if (newMediaItems.length > 0) {
      onMediaChange([...media, ...newMediaItems])
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

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
    <section className="py-12 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {showTitle && (
          <div className="flex items-center justify-between mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-center flex-1" style={{ color: primaryColor }}>
              {title}
            </h2>
            {isEditMode && (
              <div className="ml-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => {
                    if (onOpenMediaPanel) {
                      onOpenMediaPanel()
                    } else {
                      fileInputRef.current?.click()
                    }
                  }}
                  className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-rose-600 hover:to-pink-600 active:scale-95 transition-all shadow-md touch-manipulation text-sm sm:text-base font-semibold"
                  title="Upload photos"
                >
                  <Upload size={18} />
                  <span className="hidden sm:inline">Add Photos</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
            )}
          </div>
        )}
        {!showTitle && isEditMode && (
          <div className="mb-4 flex justify-end">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => {
                if (onOpenMediaPanel) {
                  onOpenMediaPanel()
                } else {
                  fileInputRef.current?.click()
                }
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-rose-600 hover:to-pink-600 active:scale-95 transition-all shadow-md touch-manipulation text-sm sm:text-base font-semibold"
              title="Upload photos"
            >
              <Upload size={18} />
              <span className="hidden sm:inline">Add Photos</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        )}
        <div className={`grid ${gridCols} gap-4 md:gap-6`}>
          {media.length === 0 && isEditMode ? (
            <div className="col-span-full text-center py-16 px-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">📸</div>
                <p className="text-lg font-semibold text-gray-700 mb-2">No photos yet</p>
                <p className="text-sm text-gray-500 mb-4">
                  Click the button above or use the Media panel to add photos
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => {
                    if (onOpenMediaPanel) {
                      onOpenMediaPanel()
                    } else {
                      fileInputRef.current?.click()
                    }
                  }}
                  className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-rose-600 hover:to-pink-600 active:scale-95 transition-all shadow-md touch-manipulation font-semibold mx-auto"
                >
                  <Upload size={20} />
                  Upload Photos
                </button>
                <div className="flex flex-col sm:flex-row gap-2 justify-center text-xs text-gray-400 mt-4">
                  <span>💡 Tip: Upload multiple photos at once</span>
                </div>
              </div>
            </div>
          ) : (
            media
              .sort((a, b) => ((a as any).order || (a as any).display_order || 0) - ((b as any).order || (b as any).display_order || 0))
              .map((item, index) => {
                const url = getMediaUrl(item)
                return (
                  <div
                    key={(item as any).id || index}
                    className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ${aspectClass} touch-manipulation`}
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
                        playsInline
                      />
                    ) : (
                      <img
                        src={url}
                        alt={`Gallery ${index + 1}`}
                        className={`w-full h-full object-cover transform group-hover:${hoverEffect} transition-transform duration-500`}
                        loading="lazy"
                      />
                    )}
                    {/* Mobile-friendly overlay on tap */}
                    {isEditMode && (
                      <div className="absolute inset-0 bg-black/0 group-active:bg-black/20 transition-colors pointer-events-none" />
                    )}
                  </div>
                )
              })
          )}
        </div>
      </div>
    </section>
  )
}

