'use client'

import { Check, Loader2, AlertCircle } from 'lucide-react'
import type { GenerationStep } from '@/lib/ai/core/agent-generator'

interface GenerationProgressProps {
  steps: GenerationStep[]
}

const stepIcons: Record<string, string> = {
  analyze: '✨',
  theme: '🎨',
  blocks: '📦',
  content: '📝',
  finalize: '🎉',
}

const stepLabels: Record<string, string> = {
  analyze: 'Analyzing Request',
  theme: 'Creating Theme',
  blocks: 'Selecting Blocks',
  content: 'Writing Content',
  finalize: 'Finalizing Page',
}

export function GenerationProgress({ steps }: GenerationProgressProps) {
  const completedSteps = steps.filter((s) => s.status === 'completed').length
  const totalSteps = steps.length
  const overallProgress = (completedSteps / totalSteps) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900">
          Creating Your Page
        </h3>
        <span className="text-sm font-medium text-gray-600">
          {completedSteps} / {totalSteps}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500 ease-out"
          style={{ width: `${overallProgress}%` }}
        />
      </div>

      <div className="space-y-3">
        {steps.map((step) => (
          <StepItem key={step.step} step={step} />
        ))}
      </div>
    </div>
  )
}

function StepItem({ step }: { step: GenerationStep }) {
  const icon = stepIcons[step.step] || '•'
  const label = stepLabels[step.step] || step.step

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 transition-all duration-300">
      <div className="flex-shrink-0">
        {step.status === 'completed' && (
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <Check size={18} className="text-green-600" />
          </div>
        )}
        {step.status === 'in_progress' && (
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
            <Loader2 size={18} className="text-rose-600 animate-spin" />
          </div>
        )}
        {step.status === 'error' && (
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle size={18} className="text-red-600" />
          </div>
        )}
        {step.status === 'pending' && (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-lg">{icon}</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium transition-colors ${
            step.status === 'completed'
              ? 'text-green-700'
              : step.status === 'in_progress'
              ? 'text-rose-700'
              : step.status === 'error'
              ? 'text-red-700'
              : 'text-gray-500'
          }`}
        >
          {label}
        </p>
        <p
          className={`text-xs mt-0.5 transition-colors ${
            step.status === 'error' ? 'text-red-600' : 'text-gray-500'
          }`}
        >
          {step.message}
        </p>
      </div>

      {step.status === 'in_progress' && (
        <div className="flex-shrink-0 w-16">
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-rose-500 animate-pulse w-3/4" />
          </div>
        </div>
      )}
    </div>
  )
}

