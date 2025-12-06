'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check } from 'lucide-react'
import { OccasionSelector } from './OccasionSelector'
import { PromptInput } from './PromptInput'
import { ExamplePrompts } from './ExamplePrompts'
import { MediaPreferences } from './MediaPreferences'
import { usePromptStore } from '@/lib/stores/prompt-store'

interface CreationStepsProps {
  onComplete: () => void
  onBack?: () => void
}

export function CreationSteps({ onComplete, onBack }: CreationStepsProps) {
  const router = useRouter()
  const {
    currentStep,
    occasion,
    prompt,
    mediaPreferences,
    userTier,
    setOccasion,
    setPrompt,
    setMediaPreferences,
    previousStep,
    startGeneration,
    loadUserTier,
  } = usePromptStore()

  useEffect(() => {
    loadUserTier()
  }, [loadUserTier])

  const handleOccasionSelect = (selectedOccasion: string) => {
    setOccasion(selectedOccasion)
  }

  const handlePromptSubmit = () => {
    if (prompt.length >= 50) {
      startGeneration()
      onComplete()
    }
  }

  const handleBack = () => {
    if (currentStep === 2) {
      previousStep()
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
                      ? `Share the story behind this ${occasion}: Who is it for? What makes this moment special? Include memories, feelings, inside jokes, or specific moments. The more details you share, the more personalized your page will be...`
                      : 'Share your story in detail: Who is this page for? What makes this moment special? Include memories, feelings, inside jokes, or specific moments you want to celebrate. The more details you share, the more personalized and beautiful your page will be...'
                  }
                />

                {/* Media Preferences */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <MediaPreferences
                    preferences={mediaPreferences}
                    onChange={setMediaPreferences}
                    userTier={userTier}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
