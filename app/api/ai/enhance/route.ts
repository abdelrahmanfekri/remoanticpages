import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

if (!process.env.OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY not set - AI features will not work')
}

const VALID_ENHANCEMENTS = [
  'improve-text',
  'make-romantic',
  'make-formal',
  'make-casual',
  'shorten',
  'lengthen',
  'fix-grammar',
  'add-emoji',
  'generate-text',
] as const

type EnhancementType = (typeof VALID_ENHANCEMENTS)[number]

export async function POST(request: NextRequest) {
  try {
    const { text, enhancement, context } = await request.json()

    // Validate required fields
    if (!enhancement || !VALID_ENHANCEMENTS.includes(enhancement as EnhancementType)) {
      return NextResponse.json(
        { error: `Enhancement must be one of: ${VALID_ENHANCEMENTS.join(', ')}` },
        { status: 400 }
      )
    }

    // Text is required for all enhancements except generate-text
    if (enhancement !== 'generate-text') {
      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return NextResponse.json(
          { error: 'Text is required for this enhancement type' },
          { status: 400 }
        )
      }
    }

    let prompt = ''

    switch (enhancement) {
      case 'improve-text':
        prompt = `Improve this text to be more engaging, beautiful, and heartfelt. Keep the same meaning but make it more emotionally resonant:

"${text}"

Return only the improved version, nothing else.`
        break

      case 'make-romantic':
        prompt = `Make this text more romantic and loving. Add warmth and affection while keeping the core message:

"${text}"

Return only the romantic version, nothing else.`
        break

      case 'make-formal':
        prompt = `Rewrite this text in a more formal and professional tone while maintaining respect and warmth:

"${text}"

Return only the formal version, nothing else.`
        break

      case 'make-casual':
        prompt = `Rewrite this text in a casual, friendly, and relaxed tone:

"${text}"

Return only the casual version, nothing else.`
        break

      case 'shorten':
        prompt = `Make this text shorter and more concise while keeping the main message:

"${text}"

Return only the shortened version, nothing else.`
        break

      case 'lengthen':
        prompt = `Expand this text with more details, descriptions, and emotional depth:

"${text}"

Return only the lengthened version, nothing else.`
        break

      case 'fix-grammar':
        prompt = `Fix any spelling, grammar, and punctuation errors in this text. Keep the same style and tone:

"${text}"

Return only the corrected version, nothing else.`
        break

      case 'add-emoji':
        prompt = `Add appropriate emojis to this text to make it more fun and expressive. Don't overdo it:

"${text}"

Return only the version with emojis, nothing else.`
        break

      case 'generate-text':
        prompt = `Generate a heartfelt ${context?.occasion || 'celebration'} message${
          context?.recipientName ? ` for ${context.recipientName}` : ''
        }. Make it warm, personal, and memorable. Length: 2-3 sentences.`
        break
    }

    const { text: enhancedText } = await generateText({
      model: openai('gpt-5-nano'),
      prompt,
      temperature: 0.7,
      maxTokens: 500,
    })

    return NextResponse.json({
      enhanced_text: enhancedText.trim(),
    })
  } catch (error) {
    console.error('AI enhancement error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to enhance text', details: errorMessage },
      { status: 500 }
    )
  }
}
