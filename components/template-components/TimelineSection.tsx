'use client'

import React from 'react'
import type { PageWithRelations } from '@/types'

interface TimelineSectionProps {
  page: PageWithRelations
  variant?: 'vertical' | 'alternating' | 'horizontal' | 'luxury' | 'vertical-elegant'
  theme?: {
    primaryColor?: string
    backgroundColor?: string
    textColor?: string
  }
  settings?: {
    layout?: 'vertical' | 'alternating' | 'horizontal' | 'luxury' | 'vertical-elegant'
    showDates?: boolean
    showTitle?: boolean
    title?: string
    animation?: string
  }
  defaultContent?: Record<string, any>
}

export function TimelineSection({ 
  page, 
  variant = 'vertical',
  theme = {},
  settings = {},
  defaultContent = {}
}: TimelineSectionProps) {
  const {
    primaryColor = '#f43f5e',
    backgroundColor = 'bg-white',
    textColor = 'text-gray-700'
  } = theme

  const {
    layout = 'vertical',
    showDates = true,
    showTitle = true,
    title = 'Timeline',
    animation = 'fade-in'
  } = settings

  // Use memories as timeline events
  const events = page.memories || []
  if (events.length === 0) return null

  const getText = (field: string | Record<string, string> | null | undefined, lang: string = 'en') => {
    if (!field) return ''
    if (typeof field === 'string') return field
    return field[lang] || field.en || ''
  }

  const sortedEvents = [...events].sort((a, b) => (a.display_order || 0) - (b.display_order || 0))

  if (layout === 'alternating' || variant === 'alternating') {
    return (
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {showTitle && (
            <h2 className="text-4xl md:text-5xl font-serif text-center mb-16" style={{ color: primaryColor }}>
              {title}
            </h2>
          )}
          <div className="space-y-12">
            {sortedEvents.map((event, index) => {
              const isLeft = index % 2 === 0
              return (
                <div
                  key={event.id}
                  className={`flex items-center gap-8 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className="flex-1">
                    <div className={`${backgroundColor} p-6 rounded-xl shadow-lg`}>
                      {showDates && event.date && (
                        <h3 className="text-xl font-bold mb-2" style={{ color: primaryColor }}>
                          {event.date}
                        </h3>
                      )}
                      {event.title && (
                        <h4 className="text-lg font-semibold mb-2" style={{ color: primaryColor }}>
                          {event.title}
                        </h4>
                      )}
                      <p className={`${textColor} leading-relaxed`}>
                        {getText(event.description)}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  if (layout === 'luxury' || variant === 'luxury') {
    return (
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          {showTitle && (
            <h2 className="text-4xl md:text-5xl font-serif text-center mb-16" style={{ color: primaryColor }}>
              {title}
            </h2>
          )}
          <div className="relative">
            <div 
              className="absolute left-1/2 top-0 -translate-x-1/2 w-1 h-full hidden md:block"
              style={{ backgroundColor: primaryColor, opacity: 0.2 }}
            />
            <div className="space-y-16">
              {sortedEvents.map((event, index) => {
                const isLeft = index % 2 === 0
                return (
                  <div
                    key={event.id}
                    className={`flex flex-col md:flex-row items-center gap-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    <div className={`flex-1 ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                      <div className={`${backgroundColor} p-8 rounded-2xl shadow-xl border-2`} style={{ borderColor: primaryColor }}>
                        {showDates && event.date && (
                          <div className="text-sm font-semibold mb-2 opacity-70" style={{ color: primaryColor }}>
                            {event.date}
                          </div>
                        )}
                        {event.title && (
                          <h3 className="text-2xl font-bold mb-3" style={{ color: primaryColor }}>
                            {event.title}
                          </h3>
                        )}
                        <p className={`${textColor} leading-relaxed text-lg`}>
                          {getText(event.description)}
                        </p>
                      </div>
                    </div>
                    <div className="relative flex flex-col items-center">
                      <div 
                        className="w-6 h-6 rounded-full border-4 border-white z-10 shadow-lg"
                        style={{ backgroundColor: primaryColor }}
                      />
                      {index !== sortedEvents.length - 1 && (
                        <div 
                          className="hidden md:block w-1 h-32 mt-2"
                          style={{ backgroundColor: primaryColor, opacity: 0.2 }}
                        />
                      )}
                    </div>
                    <div className="flex-1" />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Default vertical timeline
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {showTitle && (
          <h2 className="text-4xl md:text-5xl font-serif text-center mb-16" style={{ color: primaryColor }}>
            {title}
          </h2>
        )}
        <div className="relative">
          <div 
            className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-full hidden md:block"
            style={{ backgroundColor: primaryColor, opacity: 0.3 }}
          />
          <div className="space-y-12">
            {sortedEvents.map((event, index) => {
              const isLeft = index % 2 === 0
              return (
                <div
                  key={event.id}
                  className={`flex flex-col md:flex-row items-center gap-6 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className="flex-1" />
                  <div className="relative flex flex-col items-center">
                    <div 
                      className="w-4 h-4 rounded-full border-4 border-white z-10"
                      style={{ backgroundColor: primaryColor }}
                    />
                    {index !== sortedEvents.length - 1 && (
                      <div 
                        className="hidden md:block w-px h-24 mt-2"
                        style={{ backgroundColor: primaryColor, opacity: 0.3 }}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`${backgroundColor} p-6 rounded-xl shadow-lg`}>
                      {showDates && event.date && (
                        <h3 className="text-xl font-bold mb-2" style={{ color: primaryColor }}>
                          {event.date}
                        </h3>
                      )}
                      {event.title && (
                        <h4 className="text-lg font-semibold mb-2" style={{ color: primaryColor }}>
                          {event.title}
                        </h4>
                      )}
                      <p className={`${textColor} leading-relaxed`}>
                        {getText(event.description)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

