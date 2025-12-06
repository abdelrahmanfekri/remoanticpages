'use client'

import { Music, Image, Video } from 'lucide-react'

export interface MediaPreferences {
  music: boolean
  photos: boolean
  videos: boolean
}

interface MediaPreferencesProps {
  preferences: MediaPreferences
  onChange: (preferences: MediaPreferences) => void
  userTier?: 'free' | 'pro' | 'lifetime'
}

export function MediaPreferences({ preferences, onChange, userTier = 'free' }: MediaPreferencesProps) {
  const canUseMusic = userTier !== 'free'
  const canUseVideos = userTier !== 'free'

  const toggle = (key: keyof MediaPreferences) => {
    if (key === 'music' && !canUseMusic) return
    if (key === 'videos' && !canUseVideos) return
    onChange({ ...preferences, [key]: !preferences[key] })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-center md:justify-start">
        <span className="text-sm md:text-base font-semibold text-gray-700">
          Want to add media? (Optional)
        </span>
      </div>
      <p className="text-xs text-gray-500 text-center md:text-left mb-4">
        Let us know if you plan to add photos, videos, or background music to your page
      </p>
      
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {/* Photos */}
        <button
          onClick={() => toggle('photos')}
          className={`relative p-4 md:p-5 rounded-xl border-2 transition-all duration-200 touch-manipulation active:scale-95 ${
            preferences.photos
              ? 'border-rose-500 bg-gradient-to-br from-rose-50 to-pink-50 shadow-md'
              : 'border-gray-200 bg-white hover:border-rose-300 hover:shadow-sm'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <div className={`p-3 rounded-lg transition-colors ${
              preferences.photos 
                ? 'bg-rose-500 text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              <Image size={24} />
            </div>
            <span className={`text-xs md:text-sm font-medium ${
              preferences.photos ? 'text-rose-600' : 'text-gray-700'
            }`}>
              Photos
            </span>
            {preferences.photos && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            )}
          </div>
        </button>

        {/* Videos */}
        <button
          onClick={() => toggle('videos')}
          disabled={!canUseVideos}
          className={`relative p-4 md:p-5 rounded-xl border-2 transition-all duration-200 touch-manipulation active:scale-95 ${
            !canUseVideos
              ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
              : preferences.videos
              ? 'border-rose-500 bg-gradient-to-br from-rose-50 to-pink-50 shadow-md'
              : 'border-gray-200 bg-white hover:border-rose-300 hover:shadow-sm'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <div className={`p-3 rounded-lg transition-colors ${
              !canUseVideos
                ? 'bg-gray-200 text-gray-400'
                : preferences.videos 
                ? 'bg-rose-500 text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              <Video size={24} />
            </div>
            <span className={`text-xs md:text-sm font-medium ${
              preferences.videos ? 'text-rose-600' : 'text-gray-700'
            }`}>
              Videos
            </span>
            {!canUseVideos && (
              <span className="text-[10px] text-gray-500">Pro only</span>
            )}
            {preferences.videos && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            )}
          </div>
        </button>

        {/* Music */}
        <button
          onClick={() => toggle('music')}
          disabled={!canUseMusic}
          className={`relative p-4 md:p-5 rounded-xl border-2 transition-all duration-200 touch-manipulation active:scale-95 ${
            !canUseMusic
              ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
              : preferences.music
              ? 'border-rose-500 bg-gradient-to-br from-rose-50 to-pink-50 shadow-md'
              : 'border-gray-200 bg-white hover:border-rose-300 hover:shadow-sm'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <div className={`p-3 rounded-lg transition-colors ${
              !canUseMusic
                ? 'bg-gray-200 text-gray-400'
                : preferences.music 
                ? 'bg-rose-500 text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              <Music size={24} />
            </div>
            <span className={`text-xs md:text-sm font-medium ${
              preferences.music ? 'text-rose-600' : 'text-gray-700'
            }`}>
              Music
            </span>
            {!canUseMusic && (
              <span className="text-[10px] text-gray-500">Pro only</span>
            )}
            {preferences.music && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            )}
          </div>
        </button>
      </div>
    </div>
  )
}

