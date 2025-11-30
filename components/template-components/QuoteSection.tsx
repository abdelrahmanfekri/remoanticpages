'use client'

import React from 'react'
import type { PageWithRelations } from '@/types'

interface QuoteSectionProps {
  page: PageWithRelations
  variant?: 'simple' | 'neon-box' | 'elegant' | 'card'
  theme?: {
    primaryColor?: string
    backgroundColor?: string
    textColor?: string
  }
  settings?: {
    showIcon?: boolean
    style?: 'simple' | 'neon-box' | 'elegant' | 'card'
    quote?: string
    author?: string
  }
  defaultContent?: Record<string, any>
}

export function QuoteSection({ 
  page, 
  variant = 'simple',
  theme = {},
  settings = {},
  defaultContent = {}
}: QuoteSectionProps) {
  const {
    primaryColor = '#f43f5e',
    backgroundColor = 'bg-white',
    textColor = 'text-gray-700'
  } = theme

  const {
    showIcon = false,
    style = 'simple',
    quote = '',
    author = ''
  } = settings

  const getText = (field: string | Record<string, string> | null | undefined, lang: string = 'en') => {
    if (!field) return ''
    if (typeof field === 'string') return field
    return field[lang] || field.en || ''
  }

  const quoteText = quote || defaultContent.text || defaultContent.quote || ''
  const authorText = author || defaultContent.author || ''
  const isEditMode = (defaultContent as any)?.viewMode === 'edit'
  if (!quoteText && !isEditMode) return null

  const finalStyle = style || variant

  if (finalStyle === 'neon-box') {
    return (
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 md:p-12 rounded-2xl border-2" style={{ 
            borderColor: primaryColor,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            boxShadow: `0 0 20px ${primaryColor}, inset 0 0 20px ${primaryColor}40`
          }}>
            {showIcon && (
              <div className="text-center mb-6">
                <span className="text-4xl">💖</span>
              </div>
            )}
            <blockquote className="text-2xl md:text-3xl font-bold text-center mb-6" style={{ color: primaryColor }}>
              "{quoteText}"
            </blockquote>
            {authorText && (
              <p className="text-xl text-center opacity-80" style={{ color: primaryColor }}>
                — {authorText}
              </p>
            )}
          </div>
        </div>
      </section>
    )
  }

  if (finalStyle === 'elegant') {
    return (
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className={`${backgroundColor} p-12 md:p-16 rounded-3xl shadow-2xl border-2`} style={{ borderColor: primaryColor }}>
            {showIcon && (
              <div className="text-center mb-8">
                <span className="text-5xl">✨</span>
              </div>
            )}
            <blockquote className="text-3xl md:text-4xl font-serif italic text-center mb-8" style={{ color: primaryColor }}>
              "{quoteText}"
            </blockquote>
            {authorText && (
              <p className="text-xl text-center font-semibold" style={{ color: primaryColor }}>
                — {authorText}
              </p>
            )}
          </div>
        </div>
      </section>
    )
  }

  if (finalStyle === 'card') {
    return (
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className={`${backgroundColor} p-8 md:p-12 rounded-2xl shadow-xl`}>
            {showIcon && (
              <div className="text-center mb-6">
                <span className="text-4xl">💕</span>
              </div>
            )}
            <blockquote className="text-2xl md:text-3xl font-semibold text-center mb-6" style={{ color: primaryColor }}>
              "{quoteText}"
            </blockquote>
            {authorText && (
              <p className="text-lg text-center opacity-80" style={{ color: primaryColor }}>
                — {authorText}
              </p>
            )}
          </div>
        </div>
      </section>
    )
  }

  // Simple style (default)
  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        {showIcon && (
          <div className="mb-6">
            <span className="text-4xl">💖</span>
          </div>
        )}
        <blockquote className="text-2xl md:text-3xl font-semibold mb-6" style={{ color: primaryColor }}>
          "{quoteText}"
        </blockquote>
        {authorText && (
          <p className="text-xl opacity-80" style={{ color: primaryColor }}>
            — {authorText}
          </p>
        )}
      </div>
    </section>
  )
}

