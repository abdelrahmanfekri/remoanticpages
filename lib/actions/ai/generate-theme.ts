'use server'

import { createClient } from '@/lib/supabase/server'
import { createAIClient } from '@/lib/ai/core/client'
import { PageThemeSchema } from '@/lib/ai/schemas'
import type { PageTheme } from '@/types'

export interface GenerateThemeResult {
  theme?: PageTheme
  error?: string
}

export async function generateThemeWithAI(input: {
  occasion?: string
  mood?: string
  description?: string
}): Promise<GenerateThemeResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    const client = createAIClient({ temperature: 0.8 })
    
    let prompt = `Generate a cohesive color theme for a personalized page.\n\n`

    if (input.occasion) {
      prompt += `Occasion: ${input.occasion}\n`
    }

    if (input.mood) {
      prompt += `Mood: ${input.mood}\n`
    }

    if (input.description) {
      prompt += `Description: ${input.description}\n`
    }

    prompt += `\nGenerate primary color, secondary color, background color (hex codes), and font family (serif, sans-serif, or monospace).`
    prompt += `\nThe colors should work well together, match the occasion, and be accessible.`
    prompt += `\nReturn as JSON matching this schema: { primaryColor: "#RRGGBB", secondaryColor: "#RRGGBB", backgroundColor: "#RRGGBB", fontFamily: "serif|sans-serif|monospace" }`

    const theme = await client.generateJSON<PageTheme>(prompt, PageThemeSchema)

    return { theme }
  } catch (error) {
    console.error('Theme generation error:', error)
    return { error: 'Failed to generate theme' }
  }
}

