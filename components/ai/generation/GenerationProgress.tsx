'use client'

interface GenerationStep {
  step: string
  status: 'pending' | 'in_progress' | 'completed' | 'error'
  message: string
  progress: number
}
import { AILoadingState } from '@/components/ai/core/AILoadingState'

interface GenerationProgressProps {
  steps: GenerationStep[]
  isGenerating: boolean
}

export function GenerationProgress({ steps, isGenerating }: GenerationProgressProps) {
  if (!isGenerating) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <AILoadingState steps={steps} currentMessage="Creating your personalized page..." />
      </div>
    </div>
  )
}
