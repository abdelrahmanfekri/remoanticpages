'use server'

import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { getLanguageName } from '@/lib/ai'

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

export type EnhancementType = (typeof VALID_ENHANCEMENTS)[number]

export interface EnhanceTextResult {
  enhanced_text?: string
  error?: string
}

export interface EnhanceTextParams {
  text?: string
  enhancement: EnhancementType
  context?: {
    recipientName?: string
    occasion?: string
    tone?: string
    componentType?: string
    fieldType?: 'title' | 'message' | 'text'
    guidance?: string
  }
}

export async function enhanceText(params: EnhanceTextParams): Promise<EnhanceTextResult> {
  try {
    const { text, enhancement, context } = params

    // Validate required fields
    if (!enhancement || !VALID_ENHANCEMENTS.includes(enhancement)) {
      return {
        error: `Enhancement must be one of: ${VALID_ENHANCEMENTS.join(', ')}`,
      }
    }

    // Text is required for all enhancements except generate-text
    if (enhancement !== 'generate-text') {
      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return { error: 'Text is required for this enhancement type' }
      }
    }

    let prompt = ''

    // Build context-aware prompt prefix
    let contextPrefix = ''
    if (context?.fieldType === 'title') {
      contextPrefix = 'IMPORTANT: This is a TITLE or HEADING. Keep it SHORT (2-8 words maximum). Be concise and impactful.\n\n'
    } else if (context?.fieldType === 'message') {
      contextPrefix = 'IMPORTANT: This is a MESSAGE or PARAGRAPH. Aim for 2-4 sentences with emotional depth and detail.\n\n'
    }
    
    if (context?.componentType) {
      contextPrefix += `Component type: ${context.componentType}\n\n`
    }
    
    if (context?.guidance) {
      contextPrefix += `${context.guidance}\n\n`
    }

    switch (enhancement) {
      case 'improve-text':
        prompt = `${contextPrefix}Improve this text to be more engaging, beautiful, and heartfelt. Keep the same meaning but make it more emotionally resonant:

${text}

Return only the improved version, nothing else. Do not include quotes.`
        break

      case 'make-romantic':
        prompt = `${contextPrefix}Make this text more romantic and loving. Add warmth and affection while keeping the core message:

${text}

Return only the romantic version, nothing else. Do not include quotes.`
        break

      case 'make-formal':
        prompt = `${contextPrefix}Rewrite this text in a more formal and professional tone while maintaining respect and warmth:

${text}

Return only the formal version, nothing else. Do not include quotes.`
        break

      case 'make-casual':
        prompt = `${contextPrefix}Rewrite this text in a casual, friendly, and relaxed tone:

${text}

Return only the casual version, nothing else. Do not include quotes.`
        break

      case 'shorten':
        prompt = `${contextPrefix}Make this text shorter and more concise while keeping the main message:

${text}

Return only the shortened version, nothing else. Do not include quotes.`
        break

      case 'lengthen':
        prompt = `${contextPrefix}Expand this text with more details, descriptions, and emotional depth:

${text}

Return only the lengthened version, nothing else. Do not include quotes.`
        break

      case 'fix-grammar':
        prompt = `${contextPrefix}Fix any spelling, grammar, and punctuation errors in this text. Keep the same style and tone:

${text}

Return only the corrected version, nothing else. Do not include quotes.`
        break

      case 'add-emoji':
        prompt = `${contextPrefix}Add appropriate emojis to this text to make it more fun and expressive. Don't overdo it:

${text}

Return only the version with emojis, nothing else. Do not include quotes.`
        break

      case 'generate-text':
        const generateContext = context?.componentType || 'message'
        const fieldGuidance = context?.fieldType === 'title' 
          ? 'Keep it SHORT (2-8 words maximum). Be concise and impactful.'
          : context?.fieldType === 'message'
          ? 'Aim for 2-4 sentences with emotional depth and detail.'
          : 'Make it warm, personal, and memorable. Length: 2-3 sentences.'
        
        prompt = `Generate a heartfelt ${context?.occasion || 'celebration'} ${generateContext} message${
          context?.recipientName ? ` for ${context.recipientName}` : ''
        }. ${fieldGuidance} Do not include quotes in your response.`
        break
    }

    const { text: enhancedText } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt,
      temperature: 0.7,
      maxTokens: 500,
    })

    // Remove quotes from the beginning and end if present
    let cleanedText = enhancedText.trim()
    // Remove leading/trailing quotes (single or double)
    cleanedText = cleanedText.replace(/^["']|["']$/g, '')
    // Remove any quote-wrapped content
    if ((cleanedText.startsWith('"') && cleanedText.endsWith('"')) || 
        (cleanedText.startsWith("'") && cleanedText.endsWith("'"))) {
      cleanedText = cleanedText.slice(1, -1)
    }

    return {
      enhanced_text: cleanedText.trim(),
    }
  } catch (error) {
    console.error('AI enhancement error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return { error: `Failed to enhance text: ${errorMessage}` }
  }
}

const VALID_TYPES = ['hero', 'intro', 'memory', 'final'] as const
export type ContentType = (typeof VALID_TYPES)[number]

export interface GenerateTextResult {
  text?: string
  error?: string
}

export interface GenerateTextParams {
  type: ContentType
  language: string
  recipientName: string
  context?: string
}

export async function generateAIText(params: GenerateTextParams): Promise<GenerateTextResult> {
  try {
    const { type, language, recipientName, context } = params

    // Validate required fields
    if (!type || !VALID_TYPES.includes(type)) {
      return { error: `Type must be one of: ${VALID_TYPES.join(', ')}` }
    }

    if (!language || typeof language !== 'string') {
      return { error: 'Language is required' }
    }

    if (!recipientName || typeof recipientName !== 'string' || recipientName.trim().length === 0) {
      return { error: 'Recipient name is required' }
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
      model: openai('gpt-4o-mini'),
      prompt,
      temperature: 0.8,
      maxTokens: 500,
    })

    // Remove quotes from the beginning and end if present
    let cleanedText = generatedText.trim()
    // Remove leading/trailing quotes (single or double)
    cleanedText = cleanedText.replace(/^["']|["']$/g, '')
    // Remove any quote-wrapped content
    if ((cleanedText.startsWith('"') && cleanedText.endsWith('"')) || 
        (cleanedText.startsWith("'") && cleanedText.endsWith("'"))) {
      cleanedText = cleanedText.slice(1, -1)
    }

    return {
      text: cleanedText.trim(),
    }
  } catch (error) {
    console.error('Generation error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Text generation failed'
    return { error: errorMessage }
  }
}

export interface TranslateTextResult {
  translatedText?: string
  error?: string
}

export interface TranslateTextParams {
  text: string
  targetLanguage: string
  context?: string
}

export async function translateAIText(params: TranslateTextParams): Promise<TranslateTextResult> {
  try {
    const { text, targetLanguage, context } = params

    // Validate required fields
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return { error: 'Valid text is required' }
    }

    if (!targetLanguage || typeof targetLanguage !== 'string') {
      return { error: 'Target language is required' }
    }

    // Get language name using shared utility
    const targetLangName = getLanguageName(targetLanguage)

    // Build prompt with context if provided
    const prompt = context
      ? `Translate the following romantic/love message to ${targetLangName}. Maintain the emotional tone, warmth, and romantic sentiment. The context is: ${context}. 

Original text: ${text}

Provide only the translation in ${targetLangName}, maintaining the same style and emotional impact. Do not include quotes.`
      : `Translate the following romantic/love message to ${targetLangName}. Maintain the emotional tone, warmth, and romantic sentiment.

Original text: ${text}

Provide only the translation in ${targetLangName}, maintaining the same style and emotional impact. Do not include quotes.`

    const { text: translatedText } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Remove quotes from the beginning and end if present
    let cleanedText = translatedText.trim()
    // Remove leading/trailing quotes (single or double)
    cleanedText = cleanedText.replace(/^["']|["']$/g, '')
    // Remove any quote-wrapped content
    if ((cleanedText.startsWith('"') && cleanedText.endsWith('"')) || 
        (cleanedText.startsWith("'") && cleanedText.endsWith("'"))) {
      cleanedText = cleanedText.slice(1, -1)
    }

    return {
      translatedText: cleanedText.trim(),
    }
  } catch (error) {
    console.error('Translation error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Translation failed'
    return { error: errorMessage }
  }
}

