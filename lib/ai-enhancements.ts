// AI Enhancement System for Visual Editor
import { Sparkles, Wand2, RefreshCw, Languages, MessageSquare } from 'lucide-react'
import { enhanceText } from '@/lib/actions/ai'

export type AIFeatureType =
  | 'improve-text'
  | 'generate-text'
  | 'translate'
  | 'make-romantic'
  | 'make-formal'
  | 'make-casual'
  | 'shorten'
  | 'lengthen'
  | 'fix-grammar'
  | 'add-emoji'
  | 'generate-memory'
  | 'suggest-title'

export interface AIEnhancementOption {
  id: AIFeatureType
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  description: string
  color: string
  premium?: boolean
}

export const AI_ENHANCEMENTS: AIEnhancementOption[] = [
  {
    id: 'improve-text',
    label: 'Improve with AI',
    icon: Wand2,
    description: 'Make your text more engaging and beautiful',
    color: 'purple',
  },
  {
    id: 'generate-text',
    label: 'Generate Content',
    icon: Sparkles,
    description: 'Let AI write for you',
    color: 'blue',
  },
  {
    id: 'translate',
    label: 'Translate',
    icon: Languages,
    description: 'Translate to multiple languages',
    color: 'green',
    premium: true,
  },
  {
    id: 'make-romantic',
    label: 'Make Romantic',
    icon: MessageSquare,
    description: 'Add romantic flair',
    color: 'pink',
    premium: true,
  },
  {
    id: 'make-formal',
    label: 'Make Formal',
    icon: MessageSquare,
    description: 'Professional tone',
    color: 'gray',
    premium: true,
  },
  {
    id: 'make-casual',
    label: 'Make Casual',
    icon: MessageSquare,
    description: 'Friendly and relaxed',
    color: 'orange',
    premium: true,
  },
  {
    id: 'shorten',
    label: 'Shorten',
    icon: RefreshCw,
    description: 'Make it more concise',
    color: 'red',
  },
  {
    id: 'lengthen',
    label: 'Lengthen',
    icon: RefreshCw,
    description: 'Expand with more details',
    color: 'indigo',
  },
  {
    id: 'fix-grammar',
    label: 'Fix Grammar',
    icon: Wand2,
    description: 'Correct spelling and grammar',
    color: 'teal',
  },
  {
    id: 'add-emoji',
    label: 'Add Emojis',
    icon: Sparkles,
    description: 'Make it fun with emojis',
    color: 'yellow',
    premium: true,
  },
]

export const COMPONENT_AI_FEATURES: Record<string, AIFeatureType[]> = {
  hero: ['suggest-title', 'improve-text', 'translate', 'add-emoji'],
  intro: ['generate-text', 'improve-text', 'make-romantic', 'make-casual', 'translate'],
  'text-block': ['generate-text', 'improve-text', 'fix-grammar', 'lengthen', 'shorten'],
  quote: ['generate-text', 'make-romantic', 'improve-text'],
  'final-message': ['improve-text', 'make-romantic', 'translate', 'add-emoji'],
  timeline: ['generate-memory', 'improve-text', 'translate'],
  'memories-grid': ['generate-memory', 'improve-text', 'make-romantic'],
}

// AI API call helper
export async function enhanceWithAI(
  text: string,
  enhancement: AIFeatureType,
  context?: {
    recipientName?: string
    occasion?: string
    tone?: string
  }
): Promise<string> {
  try {
    const result = await enhanceText({
      text,
      enhancement: enhancement as any,
      context,
    })

    if (result.error) {
      throw new Error(result.error)
    }

    if (!result.enhanced_text) {
      throw new Error('AI enhancement failed')
    }

    return result.enhanced_text
  } catch (error) {
    console.error('AI enhancement error:', error)
    throw error
  }
}

// Generate content from scratch
export async function generateContent(
  prompt: string,
  type: 'title' | 'message' | 'memory' | 'quote',
  context?: { recipientName?: string; occasion?: string; [key: string]: unknown }
): Promise<string> {
  try {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        type,
        context,
      }),
    })

    if (!response.ok) throw new Error('AI generation failed')

    const data = await response.json()
    return data.generated_text
  } catch (error) {
    console.error('AI generation error:', error)
    throw error
  }
}

// Translate text
export async function translateText(
  text: string,
  targetLanguages: string[]
): Promise<Record<string, string>> {
  try {
    const response = await fetch('/api/ai/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        languages: targetLanguages,
      }),
    })

    if (!response.ok) throw new Error('Translation failed')

    const data = await response.json()
    return data.translations
  } catch (error) {
    console.error('Translation error:', error)
    throw error
  }
}


