'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'

interface PromptInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isLoading?: boolean
  placeholder?: string
  minLength?: number
  maxLength?: number
}

export function PromptInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  placeholder,
  minLength = 50,
  maxLength = 1000,
}: PromptInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const characterCount = value.length
  const isValid = characterCount >= minLength && characterCount <= maxLength
  const percentage = Math.min((characterCount / minLength) * 100, 100)

  useEffect(() => {
    const textarea = document.getElementById('prompt-textarea')
    if (textarea && window.innerWidth >= 768) {
      textarea.focus()
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && isValid && !isLoading) {
      onSubmit()
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={`relative transition-all duration-300 ${
          isFocused
            ? 'ring-2 ring-rose-500 shadow-lg shadow-rose-500/20'
            : 'ring-1 ring-gray-200'
        } rounded-xl bg-white`}
      >
        <textarea
          id="prompt-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Share your story in detail: Who is this page for? What makes this moment special? Include memories, feelings, inside jokes, or specific moments you want to celebrate. The more details you share, the more personalized and beautiful your page will be..."}
          className="w-full px-4 py-4 md:px-6 md:py-5 text-base md:text-lg bg-transparent border-none outline-none resize-none min-h-[180px] md:min-h-[240px] placeholder:text-gray-400 leading-relaxed"
          maxLength={maxLength}
          disabled={isLoading}
        />

        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span
            className={`text-xs md:text-sm font-medium transition-colors ${
              characterCount > maxLength
                ? 'text-red-500'
                : characterCount >= minLength
                ? 'text-green-600'
                : 'text-gray-400'
            }`}
          >
            {characterCount}/{maxLength}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              percentage >= 100 ? 'bg-green-500' : 'bg-rose-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs md:text-sm text-gray-500 text-center">
          {characterCount < minLength
            ? `${minLength - characterCount} more characters needed (share more details for a better result!)`
            : characterCount < 100
            ? '✓ Good start! Add more details for a richer page'
            : characterCount < 200
            ? '✓ Great! Add memories or specific moments for best results'
            : '✓ Perfect! Your page will be personalized and beautiful'}
        </p>
      </div>

      <button
        onClick={onSubmit}
        disabled={!isValid || isLoading}
        className={`w-full py-4 md:py-5 rounded-xl font-semibold text-base md:text-lg transition-all duration-300 touch-manipulation active:scale-95 ${
          isValid && !isLoading
            ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={20} />
            Generating your page...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Sparkles size={20} />
            Generate with AI
          </span>
        )}
      </button>

      <p className="text-xs text-center text-gray-500">
        Press {typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'}+Enter to generate
      </p>
    </div>
  )
}

