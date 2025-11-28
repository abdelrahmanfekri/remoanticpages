'use client'

import React from 'react'
import type { PageWithRelations } from '@/types'

interface TestimonialsSectionProps {
  page: PageWithRelations
  variant?: 'default' | 'cards' | 'carousel' | 'grid'
  theme?: {
    primaryColor?: string
    backgroundColor?: string
    textColor?: string
  }
  settings?: {
    showTitle?: boolean
    title?: string
    testimonials?: Array<{
      text: string
      author: string
      role?: string
    }>
  }
  defaultContent?: Record<string, any>
}

export function TestimonialsSection({ 
  page, 
  variant = 'default',
  theme = {},
  settings = {},
  defaultContent = {}
}: TestimonialsSectionProps) {
  const {
    primaryColor = '#f43f5e',
    backgroundColor = 'bg-white',
    textColor = 'text-gray-700'
  } = theme

  const {
    showTitle = true,
    title = 'Testimonials',
    testimonials = []
  } = settings

  const getText = (field: string | Record<string, string> | null | undefined, lang: string = 'en') => {
    if (!field) return ''
    if (typeof field === 'string') return field
    return field[lang] || field.en || ''
  }

  const testimonialsList = testimonials.length > 0 
    ? testimonials 
    : (defaultContent.testimonials || [])

  if (testimonialsList.length === 0) return null

  if (variant === 'grid') {
    return (
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {showTitle && (
            <h2 className="text-4xl md:text-5xl font-serif text-center mb-16" style={{ color: primaryColor }}>
              {title}
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonialsList.map((testimonial: { text: string; author: string; role?: string }, index: number) => (
              <div
                key={index}
                className={`${backgroundColor} p-6 rounded-xl shadow-lg`}
              >
                <div className="mb-4">
                  <span className="text-3xl text-yellow-400">⭐</span>
                  <span className="text-3xl text-yellow-400">⭐</span>
                  <span className="text-3xl text-yellow-400">⭐</span>
                  <span className="text-3xl text-yellow-400">⭐</span>
                  <span className="text-3xl text-yellow-400">⭐</span>
                </div>
                <p className={`${textColor} mb-4 italic leading-relaxed`}>
                  "{getText(testimonial.text)}"
                </p>
                <div>
                  <p className="font-semibold" style={{ color: primaryColor }}>
                    {getText(testimonial.author)}
                  </p>
                  {testimonial.role && (
                    <p className="text-sm opacity-70">{getText(testimonial.role)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Default cards style
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {showTitle && (
          <h2 className="text-4xl md:text-5xl font-serif text-center mb-16" style={{ color: primaryColor }}>
            {title}
          </h2>
        )}
        <div className="space-y-8">
          {testimonialsList.map((testimonial: { text: string; author: string; role?: string }, index: number) => (
            <div
              key={index}
              className={`${backgroundColor} p-8 rounded-2xl shadow-xl`}
            >
              <div className="mb-4">
                <span className="text-2xl text-yellow-400">⭐</span>
                <span className="text-2xl text-yellow-400">⭐</span>
                <span className="text-2xl text-yellow-400">⭐</span>
                <span className="text-2xl text-yellow-400">⭐</span>
                <span className="text-2xl text-yellow-400">⭐</span>
              </div>
              <p className={`${textColor} text-lg md:text-xl mb-6 italic leading-relaxed`}>
                "{getText(testimonial.text)}"
              </p>
              <div className="border-t pt-4" style={{ borderColor: primaryColor, opacity: 0.2 }}>
                <p className="font-semibold text-lg" style={{ color: primaryColor }}>
                  {getText(testimonial.author)}
                </p>
                {testimonial.role && (
                  <p className="text-sm opacity-70">{getText(testimonial.role)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

