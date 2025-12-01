'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import {
  PromptInput,
  OccasionSelector,
  ExamplePrompts,
  PromptHelpers,
} from '@/components/ai/prompt'
import { GenerationFlow } from '@/components/ai/generation'

export default function PromptPage() {
  const [prompt, setPrompt] = useState('')
  const [occasion, setOccasion] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    if (prompt.length < 20) return
    setIsGenerating(true)
  }

  const handleCancel = () => {
    setIsGenerating(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-12">
        <div className="mb-6 md:mb-8">
          <Link
            href="/create"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm md:text-base">Back to creation options</span>
          </Link>
        </div>

        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500 mb-3 md:mb-4">
            Create with AI
          </h1>
          <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto">
            Describe what you want to create and let AI generate a beautiful
            personalized page for you
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
              <OccasionSelector selected={occasion} onSelect={setOccasion} />
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
              <label className="block text-sm md:text-base font-semibold text-gray-700 mb-4">
                Describe your page
              </label>
              <PromptInput
                value={prompt}
                onChange={setPrompt}
                onSubmit={handleGenerate}
                isLoading={isGenerating}
              />
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
              <ExamplePrompts
                onSelect={setPrompt}
                occasionFilter={occasion}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 sticky top-6">
              <PromptHelpers />
            </div>
          </div>
        </div>

        {isGenerating && (
          <GenerationFlow
            prompt={prompt}
            occasion={occasion || undefined}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  )
}

