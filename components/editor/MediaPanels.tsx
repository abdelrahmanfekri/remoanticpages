'use client'

import React from 'react'
import { X } from 'lucide-react'
import type { Media } from '@/types'
import type { Tier } from '@/lib/tiers'
import { MediaUploader } from '@/components/MediaUploader'

interface MediaPanelProps {
  media: Media[]
  onUpdate: (settings: any) => void
  onClose: () => void
  userTier: Tier
  pageId?: string
}

export function MediaPanel({ media, onUpdate, onClose, userTier, pageId }: MediaPanelProps) {
  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Media</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X size={20} />
        </button>
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-500 mb-4">
          Upload images and videos to use in your page blocks.
        </p>
        
        {/* Placeholder - integrate MediaUploader */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500">Media uploader coming soon</p>
          <p className="text-xs text-gray-400 mt-2">{media.length} media items</p>
        </div>
      </div>
    </div>
  )
}

export function MusicPanel({
  musicUrl,
  onUpdate,
  onClose,
  userTier,
  pageId,
}: {
  musicUrl: string | null
  onUpdate: (url: string | null) => void
  onClose: () => void
  userTier: Tier
  pageId?: string
}) {
  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Background Music</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X size={20} />
        </button>
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-500 mb-4">
          Add background music to your page.
        </p>
        
        {musicUrl ? (
          <div className="space-y-3">
            <audio controls className="w-full">
              <source src={musicUrl} type="audio/mpeg" />
            </audio>
            <button
              onClick={() => onUpdate(null)}
              className="w-full px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
            >
              Remove Music
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500">Music uploader coming soon</p>
          </div>
        )}
      </div>
    </div>
  )
}

