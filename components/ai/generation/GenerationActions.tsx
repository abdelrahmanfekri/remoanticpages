'use client'

import { Check, RefreshCw, Edit3, Heart, Sparkles } from 'lucide-react'
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
    setTimeout(() => setIsVisible(true), 300)
  }, [])

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-rose-200 shadow-2xl transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        {/* Header text */}
        <div className="text-center mb-4 sm:mb-5">
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            Love what you see? Choose your next step
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Accept Button - Primary */}
          <button
            onClick={onAccept}
            disabled={isLoading}
            className="flex-1 sm:flex-none sm:flex-1 group relative overflow-hidden bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl font-bold text-base sm:text-lg py-4 sm:py-5 hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <Heart size={22} className="relative z-10 group-hover:scale-110 transition-transform fill-current" />
            <span className="relative z-10">Looks Perfect! Save It</span>
          </button>

          {/* Edit Button - Secondary */}
          <button
            onClick={onEdit}
            disabled={isLoading}
            className="flex-1 sm:flex-none sm:w-48 group bg-blue-500 text-white rounded-2xl font-semibold text-base sm:text-lg py-4 sm:py-5 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <Edit3 size={20} className="group-hover:scale-110 transition-transform" />
            <span>Edit & Customize</span>
          </button>

          {/* Regenerate Button - Tertiary */}
          <button
            onClick={onRegenerate}
            disabled={isLoading}
            className="flex-1 sm:flex-none sm:w-44 group bg-white text-gray-700 border-2 border-gray-300 rounded-2xl font-semibold text-base sm:text-lg py-4 sm:py-5 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <RefreshCw 
              size={20} 
              className={`group-hover:rotate-180 transition-transform duration-500 ${isLoading ? 'animate-spin' : ''}`} 
            />
            <span>Try Again</span>
          </button>
        </div>

        {/* Helpful hint */}
        <div className="mt-4 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            <span className="font-semibold">Tip:</span> You can always edit your page after saving
          </p>
        </div>
      </div>
    </div>
  )
}
