'use client'

import React from 'react'
import type { PageWithRelations } from '@/types'

interface IntroSectionProps {
  page: PageWithRelations
  variant?: 'card' | 'box' | 'minimal' | 'elegant' | 'glass' | 'glass-dark' | 'golden-box' | 'elegant-box'
  theme?: {
    backgroundColor?: string
    textColor?: string
    borderColor?: string
    primaryColor?: string
  }
  settings?: {
    centered?: boolean
    showIcon?: boolean
    animation?: string
    style?: string
  }
  defaultContent?: Record<string, any>
}

export function IntroSection({ 
  page, 
  variant = 'card',
  theme = {},
  settings = {},
  defaultContent = {}
}: IntroSectionProps) {
  const {
    backgroundColor = 'bg-white/90',
    textColor = 'text-gray-800',
    borderColor = 'border-rose-200',
    primaryColor = '#f43f5e'
  } = theme

  const {
    centered = true,
    showIcon = false,
    animation = 'fade-in',
    style = ''
  } = settings

  const getText = (field: string | Record<string, string> | null | undefined, lang: string = 'en') => {
    if (!field) return ''
    if (typeof field === 'string') return field
    return field[lang] || field.en || ''
  }

  // Support both intro (from page.intro_text) and text-block (from defaultContent)
  const content = defaultContent.text || defaultContent.content || getText(page.intro_text)
  const isEditMode = (defaultContent as any)?.viewMode === 'edit'
  if (!content && !isEditMode) return null

  const finalStyle = style || variant

  if (finalStyle === 'minimal') {
    return (
      <section className="py-20 px-4">
        <div className={`max-w-3xl mx-auto ${centered ? 'text-center' : ''}`}>
          <p className={`text-xl md:text-2xl leading-relaxed ${textColor}`}>
            {content}
          </p>
        </div>
      </section>
    )
  }

  if (finalStyle === 'glass' || finalStyle === 'glass-dark') {
    return (
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div 
            className={`p-8 md:p-12 rounded-2xl shadow-xl backdrop-blur-md ${centered ? 'text-center' : ''}`}
            style={{
              backgroundColor: finalStyle === 'glass-dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.3)',
              border: `2px solid ${primaryColor}40`
            }}
          >
            {showIcon && (
              <div className="text-center mb-6">
                <span className="text-4xl">💕</span>
              </div>
            )}
            <p 
              className={`text-xl md:text-2xl leading-relaxed`}
              style={{ color: finalStyle === 'glass-dark' ? '#ffffff' : textColor }}
            >
              {content}
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (finalStyle === 'golden-box' || finalStyle === 'elegant-box') {
    return (
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div 
            className={`p-8 md:p-12 rounded-2xl shadow-xl ${centered ? 'text-center' : ''}`}
            style={{
              backgroundColor: finalStyle === 'golden-box' ? '#fef3c7' : '#faf5ff',
              border: `3px solid ${primaryColor}`,
              boxShadow: `0 10px 30px ${primaryColor}30`
            }}
          >
            {showIcon && (
              <div className="text-center mb-6">
                <span className="text-4xl">{finalStyle === 'golden-box' ? '✨' : '💕'}</span>
              </div>
            )}
            <p className={`text-xl md:text-2xl leading-relaxed ${textColor}`}>
              {content}
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (finalStyle === 'box') {
    return (
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className={`${backgroundColor} p-8 md:p-12 rounded-2xl shadow-xl border-2 ${borderColor}`}>
            {showIcon && (
              <div className="text-center mb-6">
                <span className="text-4xl">💕</span>
              </div>
            )}
            <p className={`text-xl md:text-2xl leading-relaxed ${centered ? 'text-center' : ''} ${textColor}`}>
              {content}
            </p>
          </div>
        </div>
      </section>
    )
  }

  // Default card style
  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className={`${backgroundColor} p-8 md:p-12 rounded-2xl shadow-xl ${centered ? 'text-center' : ''}`}>
          {showIcon && (
            <div className="text-center mb-6">
              <span className="text-4xl">💕</span>
            </div>
          )}
          <p className={`text-xl md:text-2xl leading-relaxed ${textColor}`}>
            {content}
          </p>
        </div>
      </div>
    </section>
  )
}

