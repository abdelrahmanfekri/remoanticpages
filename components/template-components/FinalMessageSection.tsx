'use client'

import React from 'react'
import type { PageWithRelations } from '@/types'

interface FinalMessageSectionProps {
  page: PageWithRelations
  variant?: 'centered' | 'card' | 'minimal' | 'elegant' | 'cosmic' | 'neon' | 'luxury' | 'wedding' | 'romantic'
  theme?: {
    primaryColor?: string
    backgroundColor?: string
    textColor?: string
  }
  settings?: {
    showIcon?: boolean
    showSignature?: boolean
    signature?: string
    animation?: string
    style?: string
  }
  defaultContent?: Record<string, any>
}

export function FinalMessageSection({ 
  page, 
  variant = 'centered',
  theme = {},
  settings = {},
  defaultContent = {}
}: FinalMessageSectionProps) {
  const {
    primaryColor = '#f43f5e',
    backgroundColor = 'bg-white',
    textColor = 'text-gray-700'
  } = theme

  const {
    showIcon = true,
    showSignature = true,
    signature = 'Forever Yours',
    animation = 'fade-in',
    style = ''
  } = settings

  const getText = (field: string | Record<string, string> | null | undefined, lang: string = 'en') => {
    if (!field) return ''
    if (typeof field === 'string') return field
    return field[lang] || field.en || ''
  }

  const content = defaultContent.message || getText(page.final_message)
  const finalSignature = defaultContent.signature || signature
  if (!content) return null

  const finalStyle = style || variant

  if (finalStyle === 'minimal') {
    return (
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className={`text-2xl md:text-3xl leading-relaxed ${textColor}`}>
            {content}
          </p>
          {showSignature && finalSignature && (
            <p className="text-xl mt-6" style={{ color: primaryColor }}>
              {finalSignature}
            </p>
          )}
        </div>
      </section>
    )
  }

  if (finalStyle === 'cosmic') {
    return (
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className="p-12 md:p-16 rounded-3xl shadow-2xl backdrop-blur-md"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              border: `2px solid ${primaryColor}`,
              boxShadow: `0 0 40px ${primaryColor}40`
            }}
          >
            {showIcon && (
              <div className="mb-8">
                <span className="text-6xl">💫</span>
              </div>
            )}
            <p className="text-3xl md:text-4xl leading-relaxed mb-8 text-white">
              {content}
            </p>
            {showSignature && finalSignature && (
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                  {finalSignature}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  if (finalStyle === 'neon') {
    return (
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className="p-12 md:p-16 rounded-3xl"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              border: `3px solid ${primaryColor}`,
              boxShadow: `0 0 30px ${primaryColor}, inset 0 0 30px ${primaryColor}40`
            }}
          >
            {showIcon && (
              <div className="mb-8">
                <span className="text-6xl">⚡</span>
              </div>
            )}
            <p 
              className="text-3xl md:text-4xl leading-relaxed mb-8 font-bold"
              style={{ color: primaryColor }}
            >
              {content}
            </p>
            {showSignature && finalSignature && (
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                  {finalSignature}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  if (finalStyle === 'luxury' || finalStyle === 'wedding' || finalStyle === 'elegant') {
    return (
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className={`p-12 md:p-16 rounded-3xl shadow-2xl`}
            style={{
              backgroundColor: finalStyle === 'luxury' ? '#fef3c7' : finalStyle === 'wedding' ? '#faf5ff' : backgroundColor,
              border: `3px solid ${primaryColor}`,
              boxShadow: `0 20px 50px ${primaryColor}30`
            }}
          >
            {showIcon && (
              <div className="mb-8">
                <span className="text-6xl">{finalStyle === 'luxury' ? '👑' : finalStyle === 'wedding' ? '💑' : '💕'}</span>
              </div>
            )}
            <p className={`text-3xl md:text-4xl leading-relaxed mb-8 font-serif ${textColor}`}>
              {content}
            </p>
            {showSignature && finalSignature && (
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-bold font-serif" style={{ color: primaryColor }}>
                  {finalSignature}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  // Default centered style
  return (
    <section className="py-32 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className={`${backgroundColor} p-12 md:p-16 rounded-3xl shadow-2xl`}>
          {showIcon && (
            <div className="mb-8">
              <span className="text-6xl">💕</span>
            </div>
          )}
          <p className={`text-3xl md:text-4xl leading-relaxed mb-8 ${textColor}`}>
            {content}
          </p>
          {showSignature && finalSignature && (
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                {finalSignature}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

