'use client'

import React from 'react'
import type { PageWithRelations } from '@/types'

interface MemoriesSectionProps {
  page: PageWithRelations
  variant?: 'timeline' | 'grid' | 'stacked' | 'cards'
  theme?: {
    primaryColor?: string
    backgroundColor?: string
    textColor?: string
  }
  settings?: {
    layout?: 'vertical' | 'alternating' | 'horizontal' | 'grid' | 'stacked'
    showDates?: boolean
    showTitle?: boolean
    title?: string
    animation?: string
    columns?: number
  }
  defaultContent?: Record<string, any>
}

export function MemoriesSection({ 
  page, 
  variant = 'timeline',
  theme = {},
  settings = {},
  defaultContent = {}
}: MemoriesSectionProps) {
  const {
    primaryColor = '#f43f5e',
    backgroundColor = 'bg-white',
    textColor = 'text-gray-700'
  } = theme

  const {
    layout = 'vertical',
    showDates = true,
    showTitle = true,
    title = 'Our Love Story',
    animation = 'fade-in',
    columns = 2
  } = settings

  const memories = page.memories || defaultContent.events || []
  // Show empty state in edit mode, hide in preview if empty
  const isEditMode = (defaultContent as any)?.viewMode === 'edit'
  if (memories.length === 0 && !isEditMode) return null

  const getText = (field: string | Record<string, string> | null | undefined, lang: string = 'en') => {
    if (!field) return ''
    if (typeof field === 'string') return field
    return field[lang] || field.en || ''
  }

  const sortedMemories = [...memories].sort((a, b) => (a.display_order || a.order || 0) - (b.display_order || b.order || 0))
  const finalLayout = layout || variant

  if (finalLayout === 'grid') {
    const gridCols = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    }[columns] || 'grid-cols-1 md:grid-cols-2'

    return (
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          {showTitle && (
            <h2 className="text-4xl md:text-5xl font-serif text-center mb-16" style={{ color: primaryColor }}>
              {title}
            </h2>
          )}
          <div className={`grid ${gridCols} gap-8`}>
            {sortedMemories.length === 0 && isEditMode ? (
              <div className="col-span-full text-center py-12 px-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <p className="text-gray-500 mb-2">No memories yet</p>
                <p className="text-sm text-gray-400">Add memories using the edit button above</p>
              </div>
            ) : (
              sortedMemories.map((memory, index) => (
                <div
                  key={memory.id}
                  className={`${backgroundColor} p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all`}
                >
                  {showDates && memory.date && (
                    <h3 className="text-xl font-bold mb-2" style={{ color: primaryColor }}>
                      {memory.date}
                    </h3>
                  )}
                  {memory.title && (
                    <h4 className="text-lg font-semibold mb-2" style={{ color: primaryColor }}>
                      {memory.title}
                    </h4>
                  )}
                  <p className={`${textColor} leading-relaxed`}>
                    {getText(memory.description)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    )
  }

  if (finalLayout === 'stacked') {
    return (
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {showTitle && (
            <h2 className="text-4xl md:text-5xl font-serif text-center mb-16" style={{ color: primaryColor }}>
              {title}
            </h2>
          )}
          <div className="space-y-6">
            {sortedMemories.map((memory, index) => (
              <div
                key={memory.id || index}
                className={`${backgroundColor} p-6 rounded-xl shadow-lg`}
              >
                {showDates && memory.date && (
                  <h3 className="text-xl font-bold mb-2" style={{ color: primaryColor }}>
                    {memory.date}
                  </h3>
                )}
                {memory.title && (
                  <h4 className="text-lg font-semibold mb-2" style={{ color: primaryColor }}>
                    {memory.title}
                  </h4>
                )}
                <p className={`${textColor} leading-relaxed`}>
                  {getText(memory.description)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (finalLayout === 'alternating') {
    return (
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {showTitle && (
            <h2 className="text-4xl md:text-5xl font-serif text-center mb-16" style={{ color: primaryColor }}>
              {title}
            </h2>
          )}
          <div className="space-y-12">
            {sortedMemories.map((memory, index) => {
                const isLeft = index % 2 === 0
                return (
                  <div
                    key={memory.id}
                    className={`flex items-center gap-8 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    <div className="flex-1">
                      <div className={`${backgroundColor} p-6 rounded-xl shadow-lg`}>
                        {showDates && memory.date && (
                          <h3 className="text-xl font-bold mb-2" style={{ color: primaryColor }}>
                            {memory.date}
                          </h3>
                        )}
                        {memory.title && (
                          <h4 className="text-lg font-semibold mb-2" style={{ color: primaryColor }}>
                            {memory.title}
                          </h4>
                        )}
                        <p className={`${textColor} leading-relaxed`}>
                          {getText(memory.description)}
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

  // Default timeline vertical
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
            {sortedMemories.map((memory, index) => {
              const isLeft = index % 2 === 0
              return (
                <div
                  key={memory.id || index}
                  className={`flex flex-col md:flex-row items-center gap-6 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className="flex-1" />
                  <div className="relative flex flex-col items-center">
                    <div 
                      className="w-4 h-4 rounded-full border-4 border-white z-10"
                      style={{ backgroundColor: primaryColor }}
                    />
                    {index !== sortedMemories.length - 1 && (
                      <div 
                        className="hidden md:block w-px h-24 mt-2"
                        style={{ backgroundColor: primaryColor, opacity: 0.3 }}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`${backgroundColor} p-6 rounded-xl shadow-lg`}>
                      {showDates && memory.date && (
                        <h3 className="text-xl font-bold mb-2" style={{ color: primaryColor }}>
                          {memory.date}
                        </h3>
                      )}
                      {memory.title && (
                        <h4 className="text-lg font-semibold mb-2" style={{ color: primaryColor }}>
                          {memory.title}
                        </h4>
                      )}
                      <p className={`${textColor} leading-relaxed`}>
                        {getText(memory.description)}
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

