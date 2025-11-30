'use server'

import { createClient } from '@/lib/supabase/server'
import { createAIClient } from '@/lib/ai/core/client'
import { z } from 'zod'

const MemoriesSchema = z.array(
  z.object({
    title: z.string(),
    description: z.string(),
    date: z.string().optional(),
  })
)

export interface GenerateMemoriesResult {
  memories?: Array<{
    title: string
    description: string
    date?: string
  }>
  error?: string
}

export async function generateMemories(input: {
  pageTitle: string
  recipientName?: string
  occasion?: string
  count?: number
}): Promise<GenerateMemoriesResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    const client = createAIClient({ temperature: 0.9 })
    const count = input.count || 3

    let prompt = `Generate ${count} heartfelt memories/moments for a personalized page.\n\n`
    prompt += `Page title: ${input.pageTitle}\n`

    if (input.recipientName) {
      prompt += `Recipient: ${input.recipientName}\n`
    }

    if (input.occasion) {
      prompt += `Occasion: ${input.occasion}\n`
    }

    prompt += `\nEach memory should have:\n`
    prompt += `- title: Short title (3-5 words)\n`
    prompt += `- description: 2-3 sentences describing the moment\n`
    prompt += `- date (optional): When it happened\n\n`
    prompt += `Make them realistic, personal, and emotionally resonant.`
    prompt += `\nReturn as JSON array: [{ title, description, date }]`

    const memories = await client.generateJSON(prompt, MemoriesSchema)

    return { memories }
  } catch (error) {
    console.error('Memories generation error:', error)
    return { error: 'Failed to generate memories' }
  }
}

