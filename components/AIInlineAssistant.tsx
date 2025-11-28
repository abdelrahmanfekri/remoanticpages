'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles, Wand2, Languages, MessageSquare, Loader2, Check, X, AlertCircle, Maximize2, RotateCcw, Copy } from 'lucide-react'
import { enhanceWithAI } from '@/lib/ai-enhancements'
import { AIEnhancementPopup } from './AIEnhancementPopup'

interface AIInlineAssistantProps {
  text: string
  onApply: (enhancedText: string) => void
  onClose: () => void
  position: { x: number; y: number }
  recipientName?: string
  occasion?: string
}

export function AIInlineAssistant({
  text,
  onApply,
  onClose,
  position,
  recipientName,
  occasion,
}: AIInlineAssistantProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Array<{ type: string; text: string }>>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [showFullPopup, setShowFullPopup] = useState(false)
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const [previewText, setPreviewText] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Quick enhancement options - most common actions
  const quickActions = [
    { id: 'improve-text', label: 'Improve', icon: Wand2, color: 'from-purple-500 to-purple-600', description: 'Enhance clarity' },
    { id: 'make-romantic', label: 'Romantic', icon: MessageSquare, color: 'from-pink-500 to-rose-600', description: 'Add romance' },
    { id: 'fix-grammar', label: 'Fix Grammar', icon: Wand2, color: 'from-teal-500 to-teal-600', description: 'Correct errors' },
    { id: 'add-emoji', label: 'Add Emoji', icon: Sparkles, color: 'from-yellow-500 to-orange-600', description: 'Make fun' },
  ]

  const suggestionLabels: Record<string, string> = {
    improved: '✨ Improved',
    romantic: '💕 Romantic',
    emoji: '🎉 With Emojis',
  }

  // Auto-generate suggestions on mount (only if text exists)
  useEffect(() => {
    if (text && text.length > 3 && suggestions.length === 0 && !isLoading) {
      generateSuggestions()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown' && suggestions.length > 0) {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1))
      } else if (e.key === 'ArrowUp' && suggestions.length > 0) {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter' && suggestions[selectedIndex]) {
        e.preventDefault()
        applySuggestion(suggestions[selectedIndex].text)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [suggestions, selectedIndex, onClose])

  // Scroll selected suggestion into view
  useEffect(() => {
    if (suggestionsRef.current && suggestions.length > 0) {
      const selectedElement = suggestionsRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [selectedIndex, suggestions])

  const generateSuggestions = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Generate 2 quick suggestions (reduced from 3 for faster loading)
      const [improved, romantic] = await Promise.all([
        enhanceWithAI(text, 'improve-text', { recipientName, occasion }).catch(() => null),
        enhanceWithAI(text, 'make-romantic', { recipientName, occasion }).catch(() => null),
      ])

      const validSuggestions = [
        improved && { type: 'improved', text: improved },
        romantic && { type: 'romantic', text: romantic },
      ].filter(Boolean) as Array<{ type: string; text: string }>

      setSuggestions(validSuggestions)
    } catch (error) {
      console.error('Failed to generate suggestions:', error)
      setError('Failed to generate suggestions. Try quick actions instead.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = async (actionId: string) => {
    setIsLoading(true)
    setActiveAction(actionId)
    setError(null)
    setPreviewText(null)
    try {
      const enhanced = await enhanceWithAI(text, actionId as 'improve-text' | 'make-romantic' | 'make-formal' | 'make-casual' | 'shorten' | 'lengthen' | 'fix-grammar' | 'add-emoji', { recipientName, occasion })
      setPreviewText(enhanced)
      // Auto-apply after a brief preview
      setTimeout(() => {
        onApply(enhanced)
        onClose()
      }, 300)
    } catch (error) {
      console.error('Enhancement failed:', error)
      setError('Enhancement failed. Please try again.')
      setActiveAction(null)
    } finally {
      setIsLoading(false)
    }
  }

  const applySuggestion = (suggestion: string) => {
    onApply(suggestion)
    onClose()
  }

  const handleOpenFullPopup = () => {
    setShowFullPopup(true)
  }

  const handleRetry = () => {
    setError(null)
    generateSuggestions()
  }

  const handleCopyText = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy)
    // Could add a toast notification here
  }

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  // Smart positioning - ensure it stays within viewport
  const getPosition = () => {
    const maxWidth = 400
    const maxHeight = 500
    const padding = 16
    
    let left = position.x
    let top = position.y

    // Adjust if too far right
    if (left + maxWidth > window.innerWidth - padding) {
      left = window.innerWidth - maxWidth - padding
    }
    // Adjust if too far left
    if (left < padding) {
      left = padding
    }
    // Adjust if too far down
    if (top + maxHeight > window.innerHeight - padding) {
      top = window.innerHeight - maxHeight - padding
    }
    // Adjust if too far up
    if (top < padding) {
      top = padding
    }

    return { left, top }
  }

  const { left, top } = getPosition()

  return (
    <div
      ref={containerRef}
      className="fixed z-[100] bg-white rounded-2xl shadow-2xl border-2 border-purple-200 overflow-hidden animate-scale-in backdrop-blur-sm"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        maxWidth: '400px',
        width: 'min(90vw, 400px)',
        maxHeight: 'min(80vh, 500px)',
      }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 px-4 py-3 flex items-center justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
        <div className="flex items-center gap-2 relative z-10">
          <div className="bg-white/20 p-1.5 rounded-lg">
            <Sparkles size={18} className="text-white animate-pulse" />
          </div>
          <div>
            <span className="text-white font-semibold text-sm block">AI Assistant</span>
            <span className="text-purple-100 text-[10px]">Quick enhancements</span>
          </div>
        </div>
        <div className="flex items-center gap-1 relative z-10">
          <button
            onClick={handleOpenFullPopup}
            className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-all hover:scale-110"
            title="More options"
            aria-label="Open full enhancement options"
          >
            <Maximize2 size={16} />
          </button>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-all hover:scale-110"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Original Text Preview */}
      {text && text.length > 0 && (
        <div className="px-4 pt-3 pb-2 bg-gray-50/50 border-b">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Your Text</span>
            <button
              onClick={() => handleCopyText(text)}
              className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
              title="Copy original text"
            >
              <Copy size={12} />
            </button>
          </div>
          <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed">{text}</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="p-3 border-b bg-gradient-to-b from-gray-50 to-white">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-700 font-semibold">Quick Actions</p>
          {suggestions.length > 0 && (
            <span className="text-[10px] text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
              {suggestions.length} suggestions below
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon
            const isActive = activeAction === action.id
            return (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.id)}
                disabled={isLoading}
                className={`group relative flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl bg-gradient-to-br ${action.color} text-white text-xs font-semibold shadow-md hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden`}
              >
                {isActive && isLoading && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                )}
                <div className="flex items-center gap-1.5 relative z-10">
                  {isActive && isLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Icon size={14} />
                  )}
                  <span>{action.label}</span>
                </div>
                <span className="text-[10px] text-white/80 relative z-10">{action.description}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border-l-4 border-red-400 animate-slide-down">
          <div className="flex items-start gap-2">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
            <div className="flex-1">
              <p className="text-xs text-red-800 font-medium">{error}</p>
              <button
                onClick={handleRetry}
                className="mt-1.5 text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
              >
                <RotateCcw size={12} />
                Retry
              </button>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 transition-colors"
              aria-label="Dismiss error"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Suggestions */}
      <div className="p-3 max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent" ref={suggestionsRef}>
        {isLoading && suggestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative">
              <Loader2 className="text-purple-600 animate-spin mb-3" size={36} />
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-400 animate-pulse" size={18} />
            </div>
            <p className="text-sm text-gray-700 font-medium mb-1">Generating suggestions...</p>
            <p className="text-xs text-gray-500">This will take just a moment</p>
          </div>
        ) : suggestions.length > 0 ? (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-700 font-semibold flex items-center gap-1.5">
                <Sparkles size={12} className="text-purple-500" />
                AI Suggestions
              </p>
              <span className="text-[10px] text-gray-500">Use ↑↓ to navigate</span>
            </div>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => applySuggestion(suggestion.text)}
                className={`w-full text-left p-3.5 rounded-xl border-2 transition-all duration-200 group relative overflow-hidden ${
                  index === selectedIndex
                    ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 shadow-md scale-[1.02]'
                    : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/50'
                }`}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-green-500 text-white p-1.5 rounded-full shadow-lg">
                    <Check size={12} />
                  </div>
                </div>
                <div className="flex items-start gap-2.5 pr-8">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                    index === selectedIndex 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-purple-100 text-purple-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-semibold text-purple-600 uppercase tracking-wide">
                        {suggestionLabels[suggestion.type] || '✨ Enhanced'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed line-clamp-3">
                      {suggestion.text}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : text && text.length > 0 && !isLoading ? (
          <div className="text-center py-6 text-gray-400">
            <div className="bg-purple-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Sparkles size={24} className="text-purple-400" />
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">No suggestions yet</p>
            <p className="text-xs text-gray-500">Try quick actions above or click "More options" for all enhancements</p>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Sparkles size={32} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Ready to enhance</p>
            <p className="text-xs text-gray-400">Type something to get AI suggestions</p>
          </div>
        )}
      </div>

      {/* Footer Tip */}
      {suggestions.length > 0 && !isLoading && (
        <div className="px-3 py-2.5 bg-gradient-to-r from-purple-50 to-pink-50 border-t border-purple-100">
          <div className="flex items-center justify-between">
            <p className="text-xs text-purple-700 font-medium flex items-center gap-1.5">
              <span>💡</span>
              <span>Click to apply • Press Enter for selected</span>
            </p>
            <button
              onClick={handleOpenFullPopup}
              className="text-xs text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1 transition-colors"
            >
              More options
              <Maximize2 size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Empty Footer */}
      {suggestions.length === 0 && !isLoading && text && text.length > 0 && (
        <div className="px-3 py-2 bg-gray-50 border-t text-center">
          <button
            onClick={handleOpenFullPopup}
            className="text-xs text-purple-600 hover:text-purple-800 font-semibold flex items-center justify-center gap-1.5 mx-auto transition-colors"
          >
            <Maximize2 size={12} />
            View all enhancement options
          </button>
        </div>
      )}

      {/* Full Enhancement Popup */}
      {showFullPopup && (
        <AIEnhancementPopup
          text={text}
          onApply={(enhancedText) => {
            onApply(enhancedText)
            setShowFullPopup(false)
            onClose()
          }}
          onClose={() => setShowFullPopup(false)}
          recipientName={recipientName}
          occasion={occasion}
        />
      )}

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgb(233, 213, 255);
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgb(196, 181, 253);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

