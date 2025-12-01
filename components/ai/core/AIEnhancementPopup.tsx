'use client'

import { useState, useMemo } from 'react'
import { X, Loader2, Check, RotateCcw, Sparkles, ArrowRight, AlertCircle } from 'lucide-react'
import { AI_ENHANCEMENTS, enhanceWithAI, type AIFeatureType } from '@/lib/ai-enhancements'

interface AIEnhancementPopupProps {
  text: string
  onApply: (enhancedText: string) => void
  onClose: () => void
  recipientName?: string
  occasion?: string
}

// Group enhancements by category
const ENHANCEMENT_CATEGORIES = {
  improve: ['improve-text', 'fix-grammar'],
  transform: ['make-romantic', 'make-formal', 'make-casual', 'shorten', 'lengthen'],
  enhance: ['add-emoji', 'translate'],
  generate: ['generate-text'],
}

export function AIEnhancementPopup({
  text,
  onApply,
  onClose,
  recipientName,
  occasion,
}: AIEnhancementPopupProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [selectedEnhancement, setSelectedEnhancement] = useState<AIFeatureType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [originalText, setOriginalText] = useState(text)

  // Group enhancements by category
  const categorizedEnhancements = useMemo(() => {
    const categories: Record<string, typeof AI_ENHANCEMENTS> = {
      'Quick Actions': [],
      'Improve': [],
      'Transform': [],
      'Enhance': [],
      'Generate': [],
    }

    AI_ENHANCEMENTS.forEach((enhancement) => {
      if (ENHANCEMENT_CATEGORIES.improve.includes(enhancement.id)) {
        categories['Improve'].push(enhancement)
      } else if (ENHANCEMENT_CATEGORIES.transform.includes(enhancement.id)) {
        categories['Transform'].push(enhancement)
      } else if (ENHANCEMENT_CATEGORIES.enhance.includes(enhancement.id)) {
        categories['Enhance'].push(enhancement)
      } else if (ENHANCEMENT_CATEGORIES.generate.includes(enhancement.id)) {
        categories['Generate'].push(enhancement)
      } else {
        categories['Quick Actions'].push(enhancement)
      }
    })

    // Move most common to Quick Actions
    const quickActions = ['improve-text', 'fix-grammar', 'make-romantic']
    quickActions.forEach((id) => {
      const enhancement = AI_ENHANCEMENTS.find((e) => e.id === id)
      if (enhancement) {
        const category = Object.keys(categories).find((cat) =>
          categories[cat].some((e) => e.id === id)
        )
        if (category && category !== 'Quick Actions') {
          categories[category] = categories[category].filter((e) => e.id !== id)
          categories['Quick Actions'].push(enhancement)
        }
      }
    })

    return Object.entries(categories).filter(([_, items]) => items.length > 0)
  }, [])

  const handleEnhance = async (enhancement: AIFeatureType) => {
    // Validate text for non-generate enhancements
    if (enhancement !== 'generate-text' && (!text || text.trim().length === 0)) {
      setError('Please enter some text first')
      return
    }

    setIsLoading(true)
    setSelectedEnhancement(enhancement)
    setResult(null)
    setError(null)

    try {
      const enhanced = await enhanceWithAI(
        enhancement === 'generate-text' ? '' : text.trim(), 
        enhancement, 
        {
        recipientName,
        occasion,
        }
      )
      
      if (!enhanced || enhanced.trim().length === 0) {
        throw new Error('AI returned empty response')
      }
      
      setResult(enhanced)
    } catch (err) {
      console.error('Enhancement failed:', err)
      setError(err instanceof Error ? err.message : 'AI enhancement failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApply = () => {
    if (result) {
      onApply(result)
      onClose()
    }
  }

  const handleRevert = () => {
    setResult(null)
    setSelectedEnhancement(null)
    setError(null)
  }

  const handleTryAnother = () => {
    if (selectedEnhancement) {
      handleEnhance(selectedEnhancement)
    }
  }

  const colorClasses = {
    purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    pink: 'from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700',
    gray: 'from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700',
    orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
    red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
    indigo: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
    teal: 'from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700',
    yellow: 'from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[101] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div 
        className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                AI Enhancement
              </h2>
              <p className="text-purple-100 text-xs sm:text-sm mt-0.5">Transform your text with AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-1.5 sm:p-2 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          {/* Side-by-side comparison when result exists */}
          {result && !isLoading ? (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <label className="text-xs sm:text-sm font-semibold text-gray-600">Original</label>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 text-sm sm:text-base text-gray-800 min-h-[120px] max-h-[200px] overflow-y-auto break-words whitespace-pre-wrap">
                    {originalText || <span className="text-gray-400 italic">No text yet...</span>}
                  </div>
                </div>

                {/* Enhanced */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <label className="text-xs sm:text-sm font-semibold text-purple-600 flex items-center gap-1">
                      <Sparkles size={14} />
                      Enhanced
                    </label>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-3 sm:p-4 text-sm sm:text-base text-gray-800 min-h-[120px] max-h-[200px] overflow-y-auto break-words whitespace-pre-wrap">
                    {result}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-2">
                <button
                  onClick={handleApply}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold shadow-lg transition-all text-sm sm:text-base"
                >
                  <Check size={18} className="sm:w-5 sm:h-5" />
                  Apply Changes
                </button>
                <button
                  onClick={handleTryAnother}
                  disabled={isLoading}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold rounded-lg transition-colors text-sm sm:text-base disabled:opacity-50"
                >
                  Try Again
                </button>
                <button
                  onClick={handleRevert}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Original Text Preview */}
              {text && text.trim().length > 0 ? (
                <div className="mb-4 sm:mb-6">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Your Text:
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 text-sm sm:text-base text-gray-800 max-h-32 overflow-y-auto break-words whitespace-pre-wrap">
                    {text}
                  </div>
                </div>
              ) : (
                <div className="mb-4 sm:mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-yellow-600" />
                    <span className="text-xs sm:text-sm text-yellow-700">
                      {selectedEnhancement === 'generate-text' 
                        ? 'AI will generate new text for you' 
                        : 'Please enter some text to enhance'}
                    </span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                  <div className="flex-1">
                    <p className="text-sm text-red-800 font-medium">{error}</p>
                    <button
                      onClick={() => setError(null)}
                      className="text-xs text-red-600 hover:text-red-800 mt-1 underline"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <Loader2 className="text-purple-600 animate-spin mb-4" size={48} />
                      <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-400" size={20} />
                    </div>
                    <p className="text-gray-700 font-medium text-base mb-1">
                      {selectedEnhancement 
                        ? `Applying ${AI_ENHANCEMENTS.find(e => e.id === selectedEnhancement)?.label || 'enhancement'}...`
                        : 'AI is working its magic...'}
                    </p>
                    <p className="text-gray-400 text-sm">This may take a few seconds</p>
                  </div>
                </div>
              )}

              {/* Categorized Enhancement Options */}
              {!isLoading && (
                <div className="space-y-4 sm:space-y-6">
                  {categorizedEnhancements.map(([category, enhancements]) => (
                    <div key={category}>
                      <label className="block text-sm sm:text-base font-bold text-gray-800 mb-3">
                        {category}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                        {enhancements.map((enhancement) => {
                          const Icon = enhancement.icon
                          const isSelected = selectedEnhancement === enhancement.id
                          const requiresText = enhancement.id !== 'generate-text'
                          const isDisabled = isLoading || (requiresText && (!text || text.trim().length === 0))
                          
                          return (
                            <button
                              key={enhancement.id}
                              onClick={() => handleEnhance(enhancement.id)}
                              disabled={isDisabled}
                              className={`group relative bg-gradient-to-br ${
                                colorClasses[enhancement.color as keyof typeof colorClasses]
                              } text-white p-3 sm:p-4 rounded-xl shadow-md transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                                isSelected ? 'ring-2 ring-offset-2 ring-purple-500 scale-105' : ''
                              }`}
                              title={isDisabled && requiresText ? 'Please enter text first' : enhancement.description}
                            >
                              <div className="flex flex-col items-start gap-2">
                                <div className="flex items-center gap-2 w-full">
                                  <Icon size={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
                                  <span className="font-semibold text-xs sm:text-sm text-left flex-1">
                                    {enhancement.label}
                                  </span>
                                  {enhancement.premium && (
                                    <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                      PRO
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] sm:text-xs text-white/90 leading-tight text-left">
                                  {enhancement.description}
                                </p>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-2 flex-shrink-0">
          <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            💡 <strong>Tip:</strong> You can always edit the AI-generated text before applying
          </p>
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors text-xs sm:text-sm"
          >
            Close
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}


