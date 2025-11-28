import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { NextResponse } from 'next/server'
import { getLanguageName } from '@/lib/ai'

if (!process.env.OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY not set - AI features will not work')
}

export async function POST(request: Request) {
  try {
    const { text, targetLanguage, context } = await request.json()

    // Validate required fields
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Valid text is required' },
        { status: 400 }
      )
    }

    if (!targetLanguage || typeof targetLanguage !== 'string') {
      return NextResponse.json(
        { error: 'Target language is required' },
        { status: 400 }
      )
    }

    // Get language name using shared utility
    const targetLangName = getLanguageName(targetLanguage)

    // Build prompt with context if provided
    const prompt = context
      ? `Translate the following romantic/love message to ${targetLangName}. Maintain the emotional tone, warmth, and romantic sentiment. The context is: ${context}. 

Original text: "${text}"

Provide only the translation in ${targetLangName}, maintaining the same style and emotional impact.`
      : `Translate the following romantic/love message to ${targetLangName}. Maintain the emotional tone, warmth, and romantic sentiment.

Original text: "${text}"

Provide only the translation in ${targetLangName}, maintaining the same style and emotional impact.`

    const { text: translatedText } = await generateText({
      model: openai('gpt-5-nano'),
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return NextResponse.json({ 
      translatedText: translatedText.trim() 
    })
  } catch (error) {
    console.error('Translation error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Translation failed'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

