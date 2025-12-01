'use client'

import { GeneratedPage } from '@/lib/ai/core/agent-generator'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface GenerationPreviewProps {
  page: GeneratedPage
  onClose: () => void
}

export function GenerationPreview({ page, onClose }: GenerationPreviewProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50)
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
      className={`fixed inset-0 z-40 overflow-y-auto transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="min-h-screen bg-gray-900/95 backdrop-blur-sm pb-24">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Preview Your Page</h2>
              <p className="text-sm text-gray-500 mt-1">
                Review the AI-generated content below
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close preview"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div
          className={`max-w-4xl mx-auto px-4 py-8 transform transition-all duration-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <BlockRenderer page={pageForRenderer as any} editable={false} />
          </div>

          {page.reasoning && (
            <div className="mt-6 mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 animate-fade-in">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">✨ AI Reasoning</h3>
              <p className="text-sm text-blue-700">{page.reasoning}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
