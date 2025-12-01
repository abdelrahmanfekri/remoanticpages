'use client'

import { Sparkles } from 'lucide-react'

interface InlineAIEnhancerProps {
  onEnhance: () => void
  disabled?: boolean
}

export function InlineAIEnhancer({ onEnhance, disabled }: InlineAIEnhancerProps) {
  return (
    <button
      onClick={onEnhance}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
      title="Enhance with AI"
    >
      <Sparkles size={14} />
      <span>AI Enhance</span>
    </button>
  )
}

