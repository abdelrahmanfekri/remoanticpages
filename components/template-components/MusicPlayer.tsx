'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Music } from 'lucide-react'

interface MusicPlayerProps {
  musicUrl: string | null | undefined
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  settings?: {
    showTitle?: boolean
    title?: string
    autoplay?: boolean
    volume?: number
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  }
}

export function MusicPlayer({ musicUrl, position = 'top-right', settings = {} }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const {
    autoplay = true,
    volume = 0.25,
    position: settingsPosition
  } = settings

  const finalPosition = settingsPosition || position

  useEffect(() => {
    if (!audioRef.current || !musicUrl) return
    const playAudio = async () => {
      try {
        audioRef.current!.volume = volume
        if (autoplay) {
          await audioRef.current!.play()
          setIsPlaying(true)
        }
      } catch {
        // Browser blocked autoplay
      }
    }
    playAudio()
  }, [musicUrl, autoplay, volume])

  if (!musicUrl) return null

  const toggleMusic = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const positionClasses = {
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6'
  }[finalPosition]

  return (
    <>
      <audio ref={audioRef} loop>
        <source src={musicUrl} type="audio/mpeg" />
      </audio>
      <button
        onClick={toggleMusic}
        className={`fixed ${positionClasses} z-50 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-300 flex items-center gap-2`}
      >
        <Music className={isPlaying ? 'text-rose-500' : 'text-gray-400'} size={22} />
        <span className="hidden md:inline text-sm font-medium text-gray-700">
          {isPlaying ? 'Pause' : 'Play'}
        </span>
      </button>
    </>
  )
}

