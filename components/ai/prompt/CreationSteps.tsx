'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check } from 'lucide-react'
import { OccasionSelector } from './OccasionSelector'
import { PromptInput } from './PromptInput'
import { ExamplePrompts } from './ExamplePrompts'

interface CreationStepsProps {
  onComplete: (prompt: string, occasion: string | null) => void
  onBack?: () => void
}

type Step = 1 | 2

export function CreationSteps({ onComplete, onBack }: CreationStepsProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [occasion, setOccasion] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')

  const handleOccasionSelect = (selectedOccasion: string) => {
    setOccasion(selectedOccasion)
    setTimeout(() => {
      setCurrentStep(2)
    }, 300)
  }

  const handlePromptSubmit = () => {
    if (prompt.length >= 20) {
      onComplete(prompt, occasion)
    }
  }

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1)
      setPrompt('')
    } else {
      if (onBack) {
        onBack()
      } else {
        router.push('/create')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-12">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm md:text-base">Back</span>
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8 md:mb-12">
          <div className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                currentStep >= 1
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {currentStep > 1 ? <Check size={20} /> : '1'}
            </div>
            <span
              className={`hidden md:block font-medium ${
                currentStep >= 1 ? 'text-rose-600' : 'text-gray-400'
              }`}
            >
              Occasion
            </span>
          </div>
          <div
            className={`h-1 w-16 md:w-24 transition-all ${
              currentStep >= 2 ? 'bg-gradient-to-r from-rose-500 to-pink-500' : 'bg-gray-200'
            }`}
          />
          <div className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                currentStep >= 2
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              2
            </div>
            <span
              className={`hidden md:block font-medium ${
                currentStep >= 2 ? 'text-rose-600' : 'text-gray-400'
              }`}
            >
              Your Prompt
            </span>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-10 animate-fade-up">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500 mb-3">
                  What's the occasion?
                </h2>
                <p className="text-gray-600 text-base md:text-lg">
                  Choose an occasion to personalize your page
                </p>
              </div>
              <OccasionSelector selected={occasion} onSelect={handleOccasionSelect} />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-up">
            {/* Examples Section - Shown First */}
            {occasion && (
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                <ExamplePrompts onSelect={setPrompt} occasionFilter={occasion} />
              </div>
            )}

            {/* Prompt Input Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-10">
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500 mb-3">
                    Describe your page
                  </h2>
                  <p className="text-gray-600 text-base md:text-lg">
                    {occasion
                      ? `Tell us what you want for this ${occasion} page`
                      : 'Tell us what you want to create'}
                  </p>
                </div>

                <PromptInput
                  value={prompt}
                  onChange={setPrompt}
                  onSubmit={handlePromptSubmit}
                  placeholder={
                    occasion
                      ? `Create a beautiful ${occasion} page...`
                      : 'Describe the page you want to create...'
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
