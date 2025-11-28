'use client'

import { Sparkles } from 'lucide-react'

interface QuickSetupScreenProps {
  templateName: string
  recipientName: string
  mainMessage: string
  onRecipientNameChange: (value: string) => void
  onMainMessageChange: (value: string) => void
  onCancel: () => void
  onContinue: () => void
}

export function QuickSetupScreen({
  templateName,
  recipientName,
  mainMessage,
  onRecipientNameChange,
  onMainMessageChange,
  onCancel,
  onContinue,
}: QuickSetupScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 sm:p-12">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✨</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Let's Get Started!
          </h1>
          <p className="text-gray-600">
            Just a few quick details to personalize your {templateName}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Who is this for? 💝
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => onRecipientNameChange(e.target.value)}
              placeholder="e.g., Sarah, My Love, Best Friend..."
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-rose-500 focus:outline-none"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your opening message 💌
            </label>
            <textarea
              value={mainMessage}
              onChange={(e) => onMainMessageChange(e.target.value)}
              placeholder="Write something heartfelt..."
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-rose-500 focus:outline-none resize-none min-h-[120px]"
            />
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-start gap-3">
              <Sparkles className="text-purple-600 flex-shrink-0 mt-1" size={20} />
              <div className="text-sm text-purple-700">
                <strong>Pro tip:</strong> Don't worry about perfection! You can edit everything and add photos, music, and more in the next step. AI will help you enhance your text too!
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onContinue}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg"
          >
            Continue to Editor →
          </button>
        </div>
      </div>
    </div>
  )
}

