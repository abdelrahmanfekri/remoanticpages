'use client'

import { Check, RefreshCw, Edit3 } from 'lucide-react'
import { useState, useEffect } from 'react'

interface GenerationActionsProps {
  onAccept: () => void
  onRegenerate: () => void
  onEdit: () => void
  isLoading?: boolean
}

export function GenerationActions({
  onAccept,
  onRegenerate,
  onEdit,
  isLoading = false,
}: GenerationActionsProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  return (
    <div
      className={`sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onAccept}
            disabled={isLoading}
            className="flex-1 sm:flex-none sm:px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group animate-pulse-once"
          >
            <Check size={20} className="group-hover:scale-110 transition-transform" />
            <span>Looks Great!</span>
          </button>

          <button
            onClick={onEdit}
            disabled={isLoading}
            className="flex-1 sm:flex-none sm:px-6 py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
          >
            <Edit3 size={20} className="group-hover:scale-110 transition-transform" />
            <span>Edit This</span>
          </button>

          <button
            onClick={onRegenerate}
            disabled={isLoading}
            className="flex-1 sm:flex-none sm:px-6 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
          >
            <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
            <span>Try Again</span>
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-3">
          Accept to save this page, edit to customize it, or regenerate for a new version
        </p>
      </div>
    </div>
  )
}
