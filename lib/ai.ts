/**
 * AI utilities for text generation and translation
 */

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'zh', name: 'Chinese', native: '中文' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands' },
  { code: 'pl', name: 'Polish', native: 'Polski' },
  { code: 'sv', name: 'Swedish', native: 'Svenska' },
  { code: 'da', name: 'Danish', native: 'Dansk' },
  { code: 'no', name: 'Norwegian', native: 'Norsk' },
  { code: 'fi', name: 'Finnish', native: 'Suomi' },
  { code: 'cs', name: 'Czech', native: 'Čeština' },
  { code: 'ro', name: 'Romanian', native: 'Română' },
  { code: 'hu', name: 'Hungarian', native: 'Magyar' },
  { code: 'el', name: 'Greek', native: 'Ελληνικά' },
  { code: 'he', name: 'Hebrew', native: 'עברית' },
  { code: 'th', name: 'Thai', native: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu' },
  { code: 'uk', name: 'Ukrainian', native: 'Українська' },
  { code: 'fa', name: 'Persian', native: 'فارسی' },
  { code: 'sr', name: 'Serbian', native: 'Српски' },
  { code: 'hr', name: 'Croatian', native: 'Hrvatski' },
  { code: 'bg', name: 'Bulgarian', native: 'Български' },
  { code: 'sk', name: 'Slovak', native: 'Slovenčina' },
  { code: 'ca', name: 'Catalan', native: 'Català' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili' },
  { code: 'tl', name: 'Tagalog', native: 'Tagalog' },
  { code: 'et', name: 'Estonian', native: 'Eesti' },
  { code: 'lt', name: 'Lithuanian', native: 'Lietuvių' },
  { code: 'sl', name: 'Slovenian', native: 'Slovenščina' },
  { code: 'hr', name: 'Croatian', native: 'Hrvatski' },
  { code: 'sr', name: 'Serbian', native: 'Српски' },
  { code: 'bg', name: 'Bulgarian', native: 'Български' },
  { code: 'sq', name: 'Albanian', native: 'Shqip' },
  { code: 'az', name: 'Azerbaijani', native: 'Azərbaycanca' },
  { code: 'eu', name: 'Basque', native: 'Euskara' },
] as const

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code']

export async function translateText(
  text: string,
  targetLanguage: LanguageCode,
  context?: string
): Promise<string> {
  const response = await fetch('/api/ai/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, targetLanguage, context }),
  })

  if (!response.ok) {
    throw new Error('Translation failed')
  }

  const data = await response.json()
  return data.translatedText
}

export async function generateText(
  type: 'hero' | 'intro' | 'memory' | 'final',
  language: LanguageCode,
  recipientName: string,
  context?: string
): Promise<string> {
  const response = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, language, recipientName, context }),
  })

  if (!response.ok) {
    throw new Error('Text generation failed')
  }

  const data = await response.json()
  return data.text
}

