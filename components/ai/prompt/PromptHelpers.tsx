'use client'

import { Info, Check } from 'lucide-react'

const tips = [
  'Be specific about who the page is for',
  'Mention the occasion or celebration',
  'Include personality traits or interests',
  'Describe the tone (romantic, playful, elegant)',
  'Add special memories or moments to include',
]

export function PromptHelpers() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Info size={18} className="text-blue-500" />
        <h3 className="text-sm md:text-base font-semibold text-gray-700">
          Tips for better results
        </h3>
      </div>
      <ul className="space-y-2">
        {tips.map((tip, index) => (
          <li
            key={index}
            className="flex items-start gap-2 text-sm md:text-base text-gray-600"
          >
            <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-100">
        <p className="text-xs md:text-sm text-blue-900">
          <strong>Pro tip:</strong> The more details you provide, the more
          personalized your page will be! Don't worry about perfect grammar,
          just describe what you want in your own words.
        </p>
      </div>
    </div>
  )
}

