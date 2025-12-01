'use client'

import { Loader2 } from 'lucide-react'
import { GenerationStep } from '@/lib/ai/core/agent-generator'

interface AILoadingStateProps {
  steps: GenerationStep[]
  currentMessage?: string
}

export function AILoadingState({ steps, currentMessage }: AILoadingStateProps) {
  const completedCount = steps.filter((s) => s.status === 'completed').length
  const totalSteps = steps.length
  const progress = (completedCount / totalSteps) * 100

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 mb-4 animate-pulse">
          <Loader2 className="text-white animate-spin" size={32} />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {currentMessage || 'Creating your page...'}
        </h3>
        
        <div className="w-full max-w-xs mx-auto mt-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {completedCount} of {totalSteps} steps completed
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={step.step}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
              step.status === 'completed'
                ? 'bg-green-50 border border-green-200'
                : step.status === 'in_progress'
                ? 'bg-blue-50 border border-blue-200'
                : step.status === 'error'
                ? 'bg-red-50 border border-red-200'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div className="flex-shrink-0">
              {step.status === 'completed' ? (
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : step.status === 'in_progress' ? (
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              ) : step.status === 'error' ? (
                <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold">
                  {index + 1}
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium ${
                  step.status === 'completed'
                    ? 'text-green-900'
                    : step.status === 'in_progress'
                    ? 'text-blue-900'
                    : step.status === 'error'
                    ? 'text-red-900'
                    : 'text-gray-500'
                }`}
              >
                {step.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

