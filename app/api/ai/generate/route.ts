import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { NextResponse } from 'next/server'
import { getLanguageName } from '@/lib/ai'

// Make sure OPENAI_API_KEY is set in environment
if (!process.env.OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY not set - AI features will not work')
}

const VALID_TYPES = ['hero', 'intro', 'memory', 'final'] as const
type ContentType = (typeof VALID_TYPES)[number]

export async function POST(request: Request) {
  try {
    const { type, language, recipientName, context } = await request.json()

    // Validate required fields
    if (!type || !VALID_TYPES.includes(type as ContentType)) {
      return NextResponse.json(
        { error: `Type must be one of: ${VALID_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    if (!language || typeof language !== 'string') {
      return NextResponse.json(
        { error: 'Language is required' },
        { status: 400 }
      )
    }

    if (!recipientName || typeof recipientName !== 'string' || recipientName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Recipient name is required' },
        { status: 400 }
      )
    }

    // Get language name using shared utility
    const langName = getLanguageName(language)

    // Build prompt based on type
    let prompt = ''

    switch (type) {
      case 'hero':
        prompt = `Write a romantic, warm birthday message in ${langName} for someone named ${recipientName}. 
This is a hero/title message for a birthday page. Keep it heartfelt, personal, and around 2-3 sentences.
${context ? `Context: ${context}` : ''}

Write only the message in ${langName}, no explanations.`
        break

      case 'intro':
        prompt = `Write a beautiful introduction paragraph in ${langName} for a birthday page for ${recipientName}.
This should be warm, romantic, and express how special this person is. Around 3-4 sentences.
${context ? `Context: ${context}` : ''}

Write only the paragraph in ${langName}, no explanations.`
        break

      case 'memory':
        prompt = `Write a romantic memory description in ${langName} for a timeline event.
This should be warm, nostalgic, and capture the emotion of the moment. Around 2-3 sentences.
${context ? `Context: ${context}` : ''}

Write only the description in ${langName}, no explanations.`
        break

      case 'final':
        prompt = `Write a heartfelt final message in ${langName} for a birthday page for ${recipientName}.
This should be a closing message expressing love, gratitude, and wishes for the future. Around 4-5 sentences.
${context ? `Context: ${context}` : ''}

Write only the message in ${langName}, no explanations.`
        break
    }

    const { text: generatedText } = await generateText({
      model: openai('gpt-5-nano'),
      prompt,
      temperature: 0.8,
      maxTokens: 500,
    })

    return NextResponse.json({ 
      text: generatedText.trim() 
    })
  } catch (error) {
    console.error('Generation error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Text generation failed'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

