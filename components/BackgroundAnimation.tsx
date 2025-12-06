'use client'

import { Heart, Sparkles, Star } from 'lucide-react'

interface BackgroundAnimationProps {
  type: 'floating-hearts' | 'particles' | 'stars' | 'none'
  color?: string
  opacity?: number
  count?: number
  speed?: 'slow' | 'normal' | 'fast'
  size?: 'small' | 'medium' | 'large'
}

export function BackgroundAnimation({ 
  type, 
  color = '#f43f5e', 
  opacity = 0.4, 
  count = 12,
  speed = 'normal',
  size = 'medium'
}: BackgroundAnimationProps) {
  if (type === 'none') {
    return null
  }

  // Speed multipliers
  const speedMultipliers = {
    slow: 1.5,
    normal: 1,
    fast: 0.7,
  }
  const speedMultiplier = speedMultipliers[speed]

  // Size multipliers
  const sizeMultipliers = {
    small: 0.75,
    medium: 1,
    large: 1.25,
  }
  const sizeMultiplier = sizeMultipliers[size]

  // Deterministic variation based on index (for consistent rendering)
  const getVariation = (base: number, variation: number, index: number) => {
    const seed = index * 7.3 // Deterministic seed
    const normalized = (Math.sin(seed) + 1) / 2 // 0 to 1
    return base + (normalized * variation * 2 - variation)
  }

  const renderAnimation = () => {
    switch (type) {
      case 'floating-hearts':
        return Array.from({ length: count }).map((_, i) => {
          const baseSize = (20 + (i % 4) * 4) * sizeMultiplier
          const baseDuration = (10 + (i % 5)) * speedMultiplier
          return (
            <Heart
              key={i}
              className="floating-heart absolute fill-current"
              style={{
                left: `${getVariation(10 + (i * 7) % 80, 3, i)}%`,
                bottom: `${-20 - i * 8}px`,
                animationDelay: `${i * 0.9}s`,
                animationDuration: `${baseDuration}s`,
                color,
                transform: `scale(${0.9 + (i % 3) * 0.1})`,
              }}
              size={baseSize}
            />
          )
        })

      case 'particles':
        return Array.from({ length: count }).map((_, i) => {
          const baseSize = (16 + (i % 3) * 3) * sizeMultiplier
          const baseDuration = (8 + (i % 4)) * speedMultiplier
          return (
            <Sparkles
              key={i}
              className="floating-heart absolute"
              style={{
                left: `${getVariation(5 + (i * 8) % 85, 4, i)}%`,
                bottom: `${-15 - i * 6}px`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${baseDuration}s`,
                color,
                opacity: (0.6 + (i % 3) * 0.1) * opacity,
              }}
              size={baseSize}
            />
          )
        })

      case 'stars':
        return Array.from({ length: count }).map((_, i) => {
          const baseSize = (18 + (i % 3) * 3) * sizeMultiplier
          const baseDuration = (12 + (i % 6)) * speedMultiplier
          return (
            <Star
              key={i}
              className="floating-heart absolute fill-current"
              style={{
                left: `${getVariation(8 + (i * 9) % 82, 5, i)}%`,
                bottom: `${-25 - i * 7}px`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${baseDuration}s`,
                color,
                opacity: (0.5 + (i % 2) * 0.2) * opacity,
                transform: `rotate(${(i * 45) % 360}deg) scale(${0.85 + (i % 2) * 0.15})`,
              }}
              size={baseSize}
            />
          )
        })

      default:
        return null
    }
  }

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" style={{ opacity }}>
      {renderAnimation()}
    </div>
  )
}

