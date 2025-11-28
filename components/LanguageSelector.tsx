'use client'

import { SUPPORTED_LANGUAGES, type LanguageCode } from '@/lib/ai'

interface LanguageSelectorProps {
  selectedLanguage: LanguageCode | null
  onLanguageChange: (language: LanguageCode) => void
}

export function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Language
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2 border border-rose-200 rounded-lg">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = selectedLanguage === lang.code

          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => onLanguageChange(lang.code)}
              disabled={isSelected}
              className={`
                p-3 rounded-lg border-2 text-left transition-all
                ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50 text-rose-700 opacity-70 cursor-not-allowed'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-rose-200 cursor-pointer'
                }
              `}
            >
              <div className="font-medium text-sm">{lang.native}</div>
              <div className="text-xs text-gray-500">{lang.name}</div>
            </button>
          )
        })}
      </div>
      {selectedLanguage && (
        <p className="text-xs text-gray-500">
          Selected: {SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage)?.native}
        </p>
      )}
    </div>
  )
}

