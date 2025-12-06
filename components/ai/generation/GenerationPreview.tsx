'use client'

import { GeneratedPage } from '@/lib/ai/core/agent-generator'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { X, Eye, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

interface GenerationPreviewProps {
  page: GeneratedPage
  onClose: () => void
}

export function GenerationPreview({ page, onClose }: GenerationPreviewProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const pageForRenderer = {
    ...page,
    blocks: page.blocks,
    memories: [],
    media: [],
    settings: {},
  }

  return (
    <div
      className={`fixed inset-0 z-40 overflow-y-auto transition-all duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Beautiful gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-pink-50"></div>
      
      {/* Elegant sticky header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-lg border-b border-rose-100/50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-r from-rose-100 to-pink-100 rounded-xl">
                <Sparkles className="text-rose-600" size={22} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Preview Your Creation
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Review the AI-generated page below
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-rose-50 transition-colors group"
              aria-label="Close preview"
            >
              <X size={20} className="text-gray-500 group-hover:text-rose-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main preview content */}
      <div className="relative z-0">
        <div
          className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transform transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          {/* Preview container with elegant styling */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-100/50">
            {/* Preview badge */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-2.5 flex items-center justify-center gap-2">
              <Eye size={16} className="text-white" />
              <span className="text-white text-xs sm:text-sm font-semibold">Live Preview</span>
            </div>

            {/* The actual page */}
            <div className="bg-white min-h-[400px]">
              <BlockRenderer page={pageForRenderer as any} editable={false} />
            </div>
          </div>

          {/* AI Reasoning - More prominent and beautiful */}
          {page.reasoning && (
            <div className="mt-6 sm:mt-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200/50 rounded-2xl p-5 sm:p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-blue-100 rounded-xl flex-shrink-0">
                  <Sparkles size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-blue-900 mb-2 flex items-center gap-2">
                    ✨ AI's Creative Vision
                  </h3>
                  <p className="text-sm sm:text-base text-blue-800 leading-relaxed">
                    {page.reasoning}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
