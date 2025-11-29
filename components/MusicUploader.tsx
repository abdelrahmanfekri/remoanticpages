'use client'

import { useState, useRef } from 'react'
import { Music, Upload, X, Loader2, Play, Pause } from 'lucide-react'
import { validateFile } from '@/lib/storage'
import type { Tier } from '@/lib/tiers'

interface MusicUploaderProps {
  pageId?: string
  musicUrl: string | null
  onChange: (url: string | null) => void
  userTier: Tier
  canUseMusic: boolean
  onUpgradeRequired?: (feature: string, tier: Tier) => void
}

export function MusicUploader({
  pageId,
  musicUrl,
  onChange,
  userTier: _userTier,
  canUseMusic,
  onUpgradeRequired,
}: MusicUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [playing, setPlaying] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    // Check if user can use music
    if (!canUseMusic) {
      setError('Background music requires Premium tier')
      if (onUpgradeRequired) {
        onUpgradeRequired('Background Music', 'premium')
      }
      return
    }

    // Validate file
    const validation = validateFile(file, 'audio')
    if (!validation.valid) {
      setError(validation.error || 'Invalid file')
      return
    }

    // If no pageId, just add to local state (for preview)
    if (!pageId) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onChange(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    // Upload to server
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('pageId', pageId)

      const response = await fetch('/api/upload/music', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.upgradeRequired && onUpgradeRequired) {
          onUpgradeRequired('Background Music', data.requiredTier)
        }
        throw new Error(data.error || 'Upload failed')
      }

      onChange(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDelete = async () => {
    if (!pageId || !musicUrl) {
      onChange(null)
      return
    }

    try {
      const response = await fetch(`/api/upload/music?pageId=${pageId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Delete failed')
      }

      onChange(null)
      setPlaying(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  const togglePlay = () => {
    if (!audioRef.current) return

    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setPlaying(!playing)
  }

  if (!canUseMusic) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
        <Music className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Background Music</h3>
        <p className="text-gray-600 mb-4">
          Add beautiful background music to your page
        </p>
        <button
          type="button"
          onClick={() => onUpgradeRequired?.('Background Music', 'premium')}
          className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-full hover:scale-105 active:scale-95 transition-transform touch-manipulation font-semibold"
        >
          Upgrade to Add Music
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      {!musicUrl && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-rose-600 hover:to-pink-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation font-semibold shadow-md"
          >
            {uploading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload size={20} />
                <span>Upload Music</span>
              </>
            )}
          </button>

          <div className="text-xs text-gray-500 mt-2">
            Max 20MB • Supported: MP3, WAV, OGG
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Music Player */}
      {musicUrl && (
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg p-6 border border-rose-200">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={togglePlay}
              className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
            >
              {playing ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
            </button>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Music className="text-rose-600" size={18} />
                <span className="font-medium text-gray-900">Background Music</span>
              </div>
              <audio
                ref={audioRef}
                src={musicUrl}
                onEnded={() => setPlaying(false)}
                className="w-full"
              />
            </div>

            <button
              type="button"
              onClick={handleDelete}
              className="flex-shrink-0 p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!musicUrl && !uploading && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <Music className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 mb-2">No music uploaded yet</p>
          <p className="text-sm text-gray-500">
            Click &quot;Choose Audio File&quot; to add background music
          </p>
        </div>
      )}
    </div>
  )
}

