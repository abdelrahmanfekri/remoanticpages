'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GeneratedPage, GenerationStep } from '@/lib/ai/core/agent-generator'
import { GenerationProgress } from './GenerationProgress'
import { GenerationPreview } from './GenerationPreview'
import { GenerationActions } from './GenerationActions'
import { generatePageWithAI, acceptGeneratedPage } from '@/lib/actions/ai/generate-page'

interface GenerationFlowProps {
  prompt: string
  occasion?: string
  recipientName?: string
  mediaPreferences?: {
    music: boolean
    photos: boolean
    videos: boolean
  }
  onComplete?: (pageId: string, slug: string) => void
  onCancel?: () => void
}

type FlowState = 'idle' | 'generating' | 'preview' | 'accepting' | 'error'

export function GenerationFlow({
  prompt,
  occasion,
  recipientName,
  mediaPreferences,
  onComplete,
  onCancel,
}: GenerationFlowProps) {
  const router = useRouter()
  const [state, setState] = useState<FlowState>('generating')
  const [steps, setSteps] = useState<GenerationStep[]>([])
  const [generatedPage, setGeneratedPage] = useState<GeneratedPage | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(async () => {
    setState('generating')
    setError(null)
    
    const initialSteps: GenerationStep[] = [
      { step: 'analyze', status: 'pending', message: 'Analyzing prompt', progress: 0 },
      { step: 'theme', status: 'pending', message: 'Generating theme', progress: 0 },
      { step: 'blocks', status: 'pending', message: 'Selecting blocks', progress: 0 },
      { step: 'content', status: 'pending', message: 'Writing content', progress: 0 },
      { step: 'finalize', status: 'pending', message: 'Finalizing page', progress: 0 },
    ]
    
    setSteps(initialSteps)

    const simulateProgress = async () => {
      const stepTiming = [
        { index: 0, delay: 800, message: 'Analyzing your prompt and requirements...' },
        { index: 1, delay: 1200, message: 'Creating color theme and design...' },
        { index: 2, delay: 1000, message: 'Selecting the perfect blocks...' },
        { index: 3, delay: 2000, message: 'Writing personalized content...' },
        { index: 4, delay: 800, message: 'Adding final touches...' },
      ]

      for (const { index, delay, message } of stepTiming) {
        await new Promise((resolve) => setTimeout(resolve, delay))
        setSteps((prev) =>
          prev.map((s, i) =>
            i === index
              ? { ...s, status: 'in_progress' as const, message, progress: 50 }
              : i < index
              ? { ...s, status: 'completed' as const, progress: 100 }
              : s
          )
        )
      }
    }

    simulateProgress()

    try {
      const result = await generatePageWithAI({
        prompt,
        occasion,
        recipientName,
        mediaPreferences,
      })

      if (result.error) {
        setError(result.error)
        setState('error')
        return
      }

      if (result.page) {
        setGeneratedPage(result.page)
        setState('preview')
        
        setSteps((prev) =>
          prev.map((s) => ({ ...s, status: 'completed' as const, progress: 100 }))
        )
      }
    } catch (err) {
      console.error('Generation error:', err)
      setError('Failed to generate page. Please try again.')
      setState('error')
    }
  }, [prompt, occasion, recipientName])

  const handleAccept = async () => {
    if (!generatedPage) return

    setState('accepting')

    try {
      const result = await acceptGeneratedPage(generatedPage)

      if (result.error) {
        setError(result.error)
        setState('error')
        return
      }

      if (result.pageId && result.slug) {
        if (onComplete) {
          onComplete(result.pageId, result.slug)
        } else {
          router.push(`/dashboard/edit/${result.pageId}`)
        }
      }
    } catch (err) {
      console.error('Accept error:', err)
      setError('Failed to save page. Please try again.')
      setState('preview')
    }
  }

  const handleRegenerate = () => {
    generate()
  }

  const handleEdit = async () => {
    if (!generatedPage) return

    setState('accepting')

    try {
      const result = await acceptGeneratedPage(generatedPage)

      if (result.error) {
        setError(result.error)
        setState('error')
        return
      }

      if (result.pageId) {
        router.push(`/dashboard/edit/${result.pageId}`)
      }
    } catch (err) {
      console.error('Edit error:', err)
      setError('Failed to create page for editing. Please try again.')
      setState('preview')
    }
  }

  useEffect(() => {
    generate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (state === 'error') {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Generation Failed</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={handleRegenerate}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold hover:from-rose-600 hover:to-pink-600 transition-all"
            >
              Try Again
            </button>
            {onCancel && (
              <button
                onClick={onCancel}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (state === 'accepting') {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 mx-auto mb-4 flex items-center justify-center animate-pulse">
            <svg
              className="w-8 h-8 text-white animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Saving your page...</h3>
          <p className="text-gray-600">This will only take a moment</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <GenerationProgress steps={steps} isGenerating={state === 'generating'} />

      {state === 'preview' && generatedPage && (
        <>
          <GenerationPreview
            page={generatedPage}
            onClose={() => onCancel?.()}
          />
          <GenerationActions
            onAccept={handleAccept}
            onRegenerate={handleRegenerate}
            onEdit={handleEdit}
          />
        </>
      )}
    </>
  )
}
