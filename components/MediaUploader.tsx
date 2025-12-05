'use client'

import { useState, useRef } from 'react'
import { Upload, Image as ImageIcon, Video, Loader2, Trash2 } from 'lucide-react'
import { validateFile, formatFileSize } from '@/lib/storage'
import type { Tier } from '@/lib/tiers'

export interface MediaItem {
  id?: string
  url: string
  type: 'image' | 'video'
  size?: number
  uploading?: boolean
}

interface MediaUploaderProps {
  pageId?: string
  media: MediaItem[]
  onChange: (media: MediaItem[]) => void
  userTier: Tier
  maxImages?: number
  maxVideos?: number
  onUpgradeRequired?: (feature: string, tier: Tier) => void
}

export function MediaUploader({
  pageId,
  media,
  onChange,
  userTier: _userTier,
  maxImages = Infinity,
  maxVideos = 0,
  onUpgradeRequired,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const imageCount = media.filter((m) => m.type === 'image').length
  const videoCount = media.filter((m) => m.type === 'video').length

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setError(null)

    for (const file of files) {
      // Determine file type
      const isVideo = file.type.startsWith('video/')
      const mediaType = isVideo ? 'video' : 'image'

      // Check tier limits
      if (mediaType === 'image' && maxImages !== Infinity && imageCount >= maxImages) {
        setError(`Maximum ${maxImages} images allowed`)
        if (onUpgradeRequired) {
          onUpgradeRequired('Unlimited Images', 'pro')
        }
        continue
      }

      if (mediaType === 'video' && maxVideos === 0) {
        setError('Videos not available on Free tier')
        if (onUpgradeRequired) {
          onUpgradeRequired('Video Upload', 'pro')
        }
        continue
      }

      if (mediaType === 'video' && maxVideos !== Infinity && videoCount >= maxVideos) {
        setError(`Maximum ${maxVideos} videos allowed`)
        if (onUpgradeRequired) {
          onUpgradeRequired('Unlimited Videos', 'pro')
        }
        continue
      }

      const validation = validateFile(file, mediaType)
      if (!validation.valid) {
        setError(validation.error || 'Invalid file')
        continue
      }

      if (!pageId) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const newMedia: MediaItem = {
            url: e.target?.result as string,
            type: mediaType,
            size: file.size,
          }
          onChange([...media, newMedia])
        }
        reader.readAsDataURL(file)
        continue
      }

      setUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('pageId', pageId)
        formData.append('type', mediaType)

        const response = await fetch('/api/upload/media', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          if (data.upgradeRequired && onUpgradeRequired) {
            onUpgradeRequired(
              mediaType === 'image' ? 'Unlimited Images' : 'Video Upload',
              data.requiredTier
            )
          }
          throw new Error(data.error || 'Upload failed')
        }

        const newMedia: MediaItem = {
          id: data.media.id,
          url: data.url,
          type: mediaType,
          size: file.size,
        }

        onChange([...media, newMedia])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed')
      } finally {
        setUploading(false)
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (index: number) => {
    const item = media[index]

    if (item.id && pageId) {
      // Delete from server
      try {
        const response = await fetch(`/api/upload/media?id=${item.id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Delete failed')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Delete failed')
        return
      }
    }

    // Remove from local state
    const newMedia = media.filter((_, i) => i !== index)
    onChange(newMedia)
  }

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-rose-600 hover:to-pink-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation font-semibold shadow-md"
        >
          {uploading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload size={20} />
              <span>Upload Photos/Videos</span>
            </>
          )}
        </button>

        <div className="text-sm text-gray-600 flex items-center justify-center sm:justify-start">
          {maxImages === Infinity ? (
            <span>Unlimited images</span>
          ) : (
            <span>{imageCount}/{maxImages} images</span>
          )}
          {maxVideos > 0 && (
            <>
              <span className="mx-2">•</span>
              {maxVideos === Infinity ? (
                <span>Unlimited videos</span>
              ) : (
                <span>{videoCount}/{maxVideos} videos</span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* File Limits Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <div>• Images: Max 10MB (JPG, PNG, GIF, WebP)</div>
        <div>• Videos: Max 100MB (MP4, WebM, MOV)</div>
      </div>

      {/* Media Grid */}
      {media.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {media.map((item, index) => (
            <div
              key={index}
              className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
            >
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={`Media ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  controls
                />
              )}

              {/* Type Badge */}
              <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                {item.type === 'image' ? (
                  <ImageIcon size={12} />
                ) : (
                  <Video size={12} />
                )}
                {item.type}
              </div>

              {/* Size Badge */}
              {item.size && (
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {formatFileSize(item.size)}
                </div>
              )}

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="absolute bottom-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 group-active:opacity-100 sm:group-active:opacity-100 transition-opacity hover:bg-red-600 active:bg-red-700 touch-manipulation"
                aria-label="Delete media"
              >
                <Trash2 size={16} />
              </button>

              {/* Uploading Overlay */}
              {item.uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="text-white animate-spin" size={32} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {media.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <ImageIcon className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 mb-2">No media uploaded yet</p>
          <p className="text-sm text-gray-500">
            Click &quot;Choose Files&quot; to add images and videos
          </p>
        </div>
      )}
    </div>
  )
}

