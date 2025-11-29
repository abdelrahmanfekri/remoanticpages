'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles, Wand2, MessageSquare, Loader2, X, AlertCircle, Maximize2, RotateCcw, Copy } from 'lucide-react'
import { enhanceWithAI } from '@/lib/ai-enhancements'
import { AIEnhancementPopup } from './AIEnhancementPopup'

interface AIInlineAssistantProps {
  text: string
  onApply: (enhancedText: string) => void
  onClose: () => void
  position: { x: number; y: number }
  recipientName?: string
  occasion?: string
  componentType?: string
  fieldType?: 'title' | 'message' | 'text'
}

export function AIInlineAssistant({
  text,
  onApply,
  onClose,
  position,
  recipientName,
  occasion,
  componentType,
  fieldType = 'text',
}: AIInlineAssistantProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFullPopup, setShowFullPopup] = useState(false)
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const [previewText, setPreviewText] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Quick enhancement options - Generate is first, then most common actions
  const quickActions = [
    { id: 'generate-text', label: 'Generate', icon: Sparkles, color: 'from-blue-500 to-indigo-600', description: 'AI writes for you' },
    { id: 'improve-text', label: 'Improve', icon: Wand2, color: 'from-purple-500 to-purple-600', description: 'Enhance clarity' },
    { id: 'make-romantic', label: 'Romantic', icon: MessageSquare, color: 'from-pink-500 to-rose-600', description: 'Add romance' },
    { id: 'add-emoji', label: 'Add Emoji', icon: Sparkles, color: 'from-yellow-500 to-orange-600', description: 'Make fun' },
  ]

  const handleQuickAction = async (actionId: string) => {
    // Generate doesn't require existing text, others do
    if (actionId !== 'generate-text' && (!text || text.trim().length === 0)) {
      setError('Please enter some text first')
      return
    }

    setIsLoading(true)
    setActiveAction(actionId)
    setError(null)
    setPreviewText(null)
    try {
      // Build context with component and field type information
      const context: any = { recipientName, occasion }
      
      // Add field type guidance for AI
      if (fieldType === 'title') {
        context.fieldType = 'title'
        context.guidance = 'Keep it short and concise, typically 2-8 words. This is a title or heading.'
      } else if (fieldType === 'message') {
        context.fieldType = 'message'
        context.guidance = 'This is a longer message or paragraph. Aim for 2-4 sentences with emotional depth.'
      }
      
      if (componentType) {
        context.componentType = componentType
      }

      const enhanced = await enhanceWithAI(
        actionId === 'generate-text' ? '' : text.trim(), 
        actionId as 'improve-text' | 'make-romantic' | 'make-formal' | 'make-casual' | 'shorten' | 'lengthen' | 'fix-grammar' | 'add-emoji' | 'generate-text', 
        context
      )
      
      if (!enhanced || enhanced.trim().length === 0) {
        throw new Error('AI returned empty response')
      }
      
      setPreviewText(enhanced)
      // Auto-apply after a brief preview
      setTimeout(() => {
        onApply(enhanced)
        onClose()
      }, 500)
    } catch (error) {
      console.error('Enhancement failed:', error)
      setError(error instanceof Error ? error.message : 'Enhancement failed. Please try again.')
      setActiveAction(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenFullPopup = () => {
    setShowFullPopup(true)
  }

  const handleRetry = () => {
    setError(null)
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
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[99] bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup */}
    <div
      ref={containerRef}
        className="fixed z-[100] bg-white rounded-2xl shadow-2xl border-2 border-purple-200 overflow-hidden animate-scale-in"
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
      {text && text.trim().length > 0 ? (
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
          <p className="text-xs text-gray-700 line-clamp-3 leading-relaxed break-words">{text}</p>
        </div>
      ) : (
        <div className="px-4 pt-3 pb-2 bg-blue-50/50 border-b border-blue-200">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-blue-600" />
            <span className="text-xs text-blue-700 font-medium">✨ Use "Generate" to create text from scratch, or type something first to enhance it</span>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="p-3 border-b bg-gradient-to-b from-gray-50 to-white">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-700 font-semibold">Quick Actions</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon
            const isActive = activeAction === action.id
            // Generate doesn't require text, others do
            const isDisabled = isLoading || (action.id !== 'generate-text' && (!text || text.trim().length === 0))
            return (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.id)}
                disabled={isDisabled}
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
    </>
  )
}
