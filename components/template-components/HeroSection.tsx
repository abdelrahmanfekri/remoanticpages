'use client'

import React from 'react'
import type { PageWithRelations } from '@/types'

interface HeroSectionProps {
  page: PageWithRelations
  variant?: 'default' | 'centered' | 'split' | 'minimal' | 'cosmic' | 'neon' | 'luxury' | 'elegant'
  theme?: {
    primaryColor?: string
    secondaryColor?: string
    backgroundGradient?: string
    textColor?: string
  }
  settings?: {
    showSubtitle?: boolean
    showImage?: boolean
    showDecorativeElements?: boolean
    animation?: string
    showStars?: boolean
    showRocket?: boolean
    showHearts?: boolean
    showRings?: boolean
    showSnowflakes?: boolean
    showCrown?: boolean
    elegant?: boolean
    neonEffect?: boolean
    gridBackground?: boolean
    goldenParticles?: boolean
    title?: string
    subtitle?: string
  }
  defaultContent?: Record<string, any>
}

export function HeroSection({ 
  page, 
  variant = 'default',
  theme = {},
  settings = {},
  defaultContent = {}
}: HeroSectionProps) {
  const {
    primaryColor = '#f43f5e',
    secondaryColor = '#ec4899',
    backgroundGradient = 'from-pink-50 via-white to-rose-50',
    textColor = 'text-rose-600'
  } = theme

  const {
    showSubtitle = true,
    showImage = false,
    showDecorativeElements = true,
    animation = 'fade-up',
    showStars = false,
    showRocket = false,
    showHearts = false,
    showRings = false,
    showSnowflakes = false,
    showCrown = false,
    elegant = false,
    neonEffect = false,
    gridBackground = false,
    goldenParticles = false,
    title: settingsTitle,
    subtitle: settingsSubtitle
  } = settings

  const getText = (field: string | Record<string, string> | null | undefined, lang: string = 'en') => {
    if (!field) return ''
    if (typeof field === 'string') return field
    return field[lang] || field.en || ''
  }

  const heroTitle = page.title || settingsTitle || defaultContent.title
  const heroSubtitle = page.recipient_name || settingsSubtitle || defaultContent.subtitle
  const heroImage = defaultContent.image || null

  const currentMedia = heroImage ? null : page.media?.[0]
  const mediaUrl = heroImage || (currentMedia ? ((currentMedia as any).url || (currentMedia as any).storage_path) : null)
  
  const isVideo = (url: string) => {
    if (!url) return false
    const lowerUrl = url.toLowerCase()
    return lowerUrl.endsWith('.mp4') || lowerUrl.endsWith('.webm') || lowerUrl.endsWith('.mov')
  }

  // Decorative elements
  const renderDecorativeElements = () => {
    if (!showDecorativeElements) return null
    
    return (
      <>
        {showStars && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              >
                <span className="text-2xl">⭐</span>
              </div>
            ))}
          </div>
        )}
        {showHearts && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              >
                <span className="text-2xl">💕</span>
              </div>
            ))}
          </div>
        )}
        {showSnowflakes && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`
                }}
              >
                <span className="text-xl">❄️</span>
              </div>
            ))}
          </div>
        )}
        {showRocket && (
          <div className="absolute top-20 right-10 animate-bounce">
            <span className="text-5xl">🚀</span>
          </div>
        )}
        {showCrown && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 animate-pulse">
            <span className="text-6xl">👑</span>
          </div>
        )}
        {showRings && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 flex gap-4">
            <span className="text-4xl animate-pulse">💍</span>
            <span className="text-4xl animate-pulse" style={{ animationDelay: '0.5s' }}>💍</span>
          </div>
        )}
      </>
    )
  }

  const backgroundStyle = neonEffect 
    ? { background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)` }
    : gridBackground
    ? { 
        backgroundImage: `linear-gradient(${primaryColor}20 1px, transparent 1px), linear-gradient(90deg, ${primaryColor}20 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }
    : {}

  if (variant === 'centered' || variant === 'elegant') {
    return (
      <section 
        className={`min-h-screen flex items-center justify-center px-4 py-20 relative`}
        style={{
          background: elegant 
            ? `linear-gradient(135deg, ${primaryColor}15, ${secondaryColor}15)`
            : `linear-gradient(to bottom right, ${primaryColor}20, ${secondaryColor}20)`,
          ...backgroundStyle
        }}
      >
        {renderDecorativeElements()}
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {showCrown && !variant.includes('crown') && (
            <div className="mb-4">
              <span className="text-6xl">👑</span>
            </div>
          )}
          <h1 
            className={`text-6xl md:text-8xl font-bold mb-6 ${elegant ? 'font-serif' : ''}`}
            style={{ 
              color: primaryColor,
              textShadow: neonEffect ? `0 0 20px ${primaryColor}` : undefined
            }}
          >
            {heroTitle}
          </h1>
          {showSubtitle && heroSubtitle && (
            <p 
              className="text-2xl md:text-3xl mb-4"
              style={{ color: secondaryColor }}
            >
              {heroSubtitle}
            </p>
          )}
          {page.hero_text && (
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mt-8">
              {getText(page.hero_text)}
            </p>
          )}
        </div>
      </section>
    )
  }

  if (variant === 'split') {
    return (
      <section 
        className={`min-h-screen flex items-center justify-center px-4 py-20 relative`}
        style={{
          background: `linear-gradient(to bottom right, ${primaryColor}20, ${secondaryColor}20)`,
          ...backgroundStyle
        }}
      >
        {renderDecorativeElements()}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center relative z-10">
          <div className="space-y-6 text-center md:text-left">
            <h1 
              className={`text-5xl md:text-6xl lg:text-7xl font-serif leading-tight`}
              style={{ color: primaryColor }}
            >
              {heroTitle}
            </h1>
            {showSubtitle && heroSubtitle && (
              <p className="text-lg md:text-xl leading-relaxed" style={{ color: secondaryColor }}>
                {heroSubtitle}
              </p>
            )}
            {page.intro_text && (
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                {getText(page.intro_text)}
              </p>
            )}
          </div>
          {showImage && mediaUrl && (
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                {isVideo(mediaUrl) ? (
                  <video
                    src={mediaUrl}
                    className="w-full h-80 object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={mediaUrl}
                    alt="Hero"
                    className="w-full h-80 object-cover"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    )
  }

  // Default variant
  return (
    <section 
      className={`min-h-screen flex items-center justify-center px-4 py-20 relative`}
      style={{
        background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
        ...backgroundStyle
      }}
    >
      {renderDecorativeElements()}
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 
          className={`text-6xl md:text-8xl font-bold mb-6`}
          style={{ 
            color: primaryColor,
            textShadow: neonEffect ? `0 0 20px ${primaryColor}` : undefined
          }}
        >
          {heroTitle}
        </h1>
        {showSubtitle && heroSubtitle && (
          <p 
            className="text-2xl md:text-3xl mb-4"
            style={{ color: secondaryColor }}
          >
            {heroSubtitle}
          </p>
        )}
        {page.hero_text && (
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mt-8">
            {getText(page.hero_text)}
          </p>
        )}
      </div>
    </section>
  )
}

