'use client'

import { useState } from 'react'
import { Wand2, Loader2, X, Sparkles } from 'lucide-react'
import type { BlockData, PageTheme } from '@/types'

interface AIEnhancementPanelProps {
  pageTitle: string
  recipientName: string
  theme: PageTheme
  blocks: BlockData[]
  onApplyChanges: (updates: {
    title?: string
    recipientName?: string
    theme?: Partial<PageTheme>
    blocks?: BlockData[]
  }) => void
}

export function AIEnhancementPanel({
  pageTitle,
  recipientName,
  theme,
  blocks,
  onApplyChanges,
}: AIEnhancementPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!prompt.trim() || isProcessing) return

    setIsProcessing(true)
    setError(null)

    try {
      const { enhancePageWithAI } = await import('@/lib/actions/ai/generate-page')
      
      const result = await enhancePageWithAI({
        prompt: prompt.trim(),
        currentPage: {
          title: pageTitle,
          recipientName,
          theme,
          blocks,
        },
      })

      if (result.error) {
        throw new Error(result.error)
      }

      if (result.updates) {
        onApplyChanges(result.updates)
        setPrompt('')
        setSuccessMessage('Changes applied successfully!')
        setTimeout(() => setSuccessMessage(null), 3000)
      }
    } catch (err) {
      console.error('AI enhancement error:', err)
      setError(err instanceof Error ? err.message : 'Failed to enhance page')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      {/* Floating AI Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        title="AI Assistant"
      >
        <Wand2 className="w-5 h-5" />
        <span className="font-medium">AI Assistant</span>
      </button>

      {/* AI Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">AI Page Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            <p className="text-sm text-gray-600">
              Tell me how you'd like to enhance your page. I'll analyze the current content and apply your changes.
            </p>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., 'Make the intro more romantic', 'Add a timeline of our relationship', 'Change the colors to blue and gold'..."
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isProcessing}
            />

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">{successMessage}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!prompt.trim() || isProcessing}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Enhancing...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>Enhance Page</span>
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Changes will be applied immediately to your page
            </p>
          </div>
        </div>
      )}
    </>
  )
}

