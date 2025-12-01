'use client'

import { useState, useEffect } from 'react'
import { Sparkles, X, Loader2, Check, RotateCcw } from 'lucide-react'
import { enhanceBlockContent } from '@/lib/actions/ai/enhance-block'
import { useKeyboardShortcut } from '@/lib/hooks/useKeyboardShortcut'

interface AIBlockAssistantProps {
  blockType: string
  field: string
  currentContent: string
  context?: {
    pageTitle?: string
    recipientName?: string
    occasion?: string
    tone?: 'formal' | 'casual' | 'romantic' | 'playful'
  }
  onApply: (enhanced: string) => void
  onClose: () => void
  position?: { top: number; left: number }
}

export function AIBlockAssistant({
  blockType,
  field,
  currentContent,
  context,
  onApply,
  onClose,
  position,
}: AIBlockAssistantProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  useKeyboardShortcut('Escape', onClose, { enabled: true })
  
  useKeyboardShortcut('Enter', () => {
    if (!isLoading && !error && suggestions.length > 0) {
      const selected = selectedIndex !== null ? suggestions[selectedIndex] : currentContent
      handleApply(selected)
    }
  }, { cmd: true, ctrl: true, enabled: true })

  useKeyboardShortcut('ArrowDown', () => {
    if (suggestions.length > 0) {
      setSelectedIndex((prev) => 
        prev === null ? 0 : Math.min(prev + 1, suggestions.length - 1)
      )
    }
  }, { enabled: !isLoading })

  useKeyboardShortcut('ArrowUp', () => {
    if (suggestions.length > 0) {
      setSelectedIndex((prev) => 
        prev === null || prev === 0 ? null : prev - 1
      )
    }
  }, { enabled: !isLoading })

  useEffect(() => {
    loadSuggestions()
  }, [])

  const loadSuggestions = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await enhanceBlockContent({
        blockType,
        field,
        currentContent,
        context,
      })

      if (result.error) {
        setError(result.error)
      } else if (result.suggestions) {
        setSuggestions(result.suggestions)
      }
    } catch (err) {
      setError('Failed to generate suggestions')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApply = (suggestion: string) => {
    onApply(suggestion)
        onClose()
      }

  const positionStyle = position
    ? {
        position: 'fixed' as const,
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateY(-100%)',
        marginTop: '-8px',
      }
    : {}

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
    <div
        className="fixed z-50 bg-white rounded-lg shadow-2xl w-full max-w-md"
        style={position ? positionStyle : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
    >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-purple-500" size={20} />
            <h3 className="font-semibold text-gray-900">AI Enhancement</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
            title="Close (Esc)"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <Loader2 className="animate-spin text-purple-500" size={32} />
              <p className="text-sm text-gray-500">Generating suggestions...</p>
            </div>
          ) : error ? (
            <div className="space-y-3">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{error}</p>
      </div>
            <button
                onClick={loadSuggestions}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
                <RotateCcw size={16} />
                Try Again
            </button>
          </div>
          ) : suggestions.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Choose an AI-enhanced version or keep your original:
                </p>
                <div className="text-xs text-gray-400">
                  ↑↓ Navigate • ⏎ Apply • Esc Close
          </div>
        </div>

              <div
                className={`relative p-3 rounded-lg border-2 cursor-pointer transition ${
                  selectedIndex === null
                    ? 'border-gray-300 bg-gray-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => setSelectedIndex(null)}
              >
                {selectedIndex === null && (
                  <div className="absolute -top-2 -right-2 bg-purple-500 rounded-full p-1">
                    <Check className="text-white" size={12} />
                  </div>
                )}
                <p className="text-sm font-medium text-gray-500 mb-1">Original</p>
                <p className="text-sm text-gray-700">{currentContent}</p>
              </div>

              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`relative p-3 rounded-lg border-2 cursor-pointer transition ${
                    selectedIndex === index
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedIndex(index)}
              >
                  {selectedIndex === index && (
                    <div className="absolute -top-2 -right-2 bg-purple-500 rounded-full p-1">
                      <Check className="text-white" size={12} />
                    </div>
                )}
                  <p className="text-sm font-medium text-purple-600 mb-1">
                    Suggestion {index + 1}
                  </p>
                  <p className="text-sm text-gray-700">{suggestion}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">
              No suggestions available
            </p>
          )}
      </div>

        {!isLoading && !error && suggestions.length > 0 && (
          <div className="p-4 border-t border-gray-200 flex gap-2">
              <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
              >
              Cancel
              </button>
            <button
              onClick={() => {
                const selected = selectedIndex !== null ? suggestions[selectedIndex] : currentContent
                handleApply(selected)
              }}
              className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
            >
              <Check size={16} />
              Apply
            </button>
          </div>
      )}
    </div>
    </>
  )
}
