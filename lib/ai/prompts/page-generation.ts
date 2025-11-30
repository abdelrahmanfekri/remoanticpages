import { BLOCK_DEFINITIONS } from '@/lib/blocks/definitions'
import { TEMPLATES } from '@/lib/blocks/templates'

export function buildPageGenerationPrompt(params: {
  userPrompt: string
  occasion?: string
  recipientName?: string
  tier: 'free' | 'premium' | 'pro'
  preferredBlocks?: string[]
}): string {
  const { userPrompt, occasion, recipientName, tier, preferredBlocks } = params

  const freeBlocks = Object.values(BLOCK_DEFINITIONS)
    .filter((b) => !b.isPremium)
    .map((b) => b.type)
    .join(', ')

  const premiumBlocks = Object.values(BLOCK_DEFINITIONS)
    .filter((b) => b.isPremium)
    .map((b) => b.type)
    .join(', ')

  let prompt = `Create a personalized page based on this request:\n\n`
  prompt += `"${userPrompt}"\n\n`

  if (occasion) {
    prompt += `Occasion: ${occasion}\n`
  }

  if (recipientName) {
    prompt += `Recipient: ${recipientName}\n`
  }

  prompt += `\n# Available Blocks:\n`
  prompt += `Free tier blocks: ${freeBlocks}\n`
  
  if (tier !== 'free') {
    prompt += `Premium blocks: ${premiumBlocks}\n`
  }

  if (preferredBlocks && preferredBlocks.length > 0) {
    prompt += `\nPreferred blocks to include: ${preferredBlocks.join(', ')}\n`
  }

  prompt += `\n# Requirements:\n`
  prompt += `1. Create 4-8 blocks that tell a cohesive story\n`
  prompt += `2. Start with a 'hero' block\n`
  prompt += `3. Include an 'intro' block early\n`
  prompt += `4. End with a 'final-message' block\n`
  prompt += `5. Use appropriate colors for the occasion\n`
  prompt += `6. Fill in realistic, heartfelt content\n`
  prompt += `7. Match the tone to the occasion\n`

  if (tier === 'free') {
    prompt += `\nImportant: User is on FREE tier - use ONLY free blocks (no video, countdown, testimonials, or map blocks)\n`
  }

  prompt += `\nGenerate the complete page configuration now.`

  return prompt
}

export function buildThemeGenerationPrompt(params: {
  occasion?: string
  mood?: string
  description?: string
}): string {
  const { occasion, mood, description } = params

  let prompt = `Generate a cohesive color theme for a personalized page.\n\n`

  if (occasion) {
    prompt += `Occasion: ${occasion}\n`
  }

  if (mood) {
    prompt += `Desired mood: ${mood}\n`
  }

  if (description) {
    prompt += `Description: ${description}\n`
  }

  prompt += `\nGenerate:\n`
  prompt += `1. Primary color (hex code)\n`
  prompt += `2. Secondary color (hex code)\n`
  prompt += `3. Background color (hex code)\n`
  prompt += `4. Font family (serif, sans-serif, or monospace)\n\n`

  prompt += `The colors should:\n`
  prompt += `- Work well together (good contrast)\n`
  prompt += `- Match the occasion/mood\n`
  prompt += `- Be accessible (WCAG AA compliant)\n`
  prompt += `- Create the right emotional tone\n\n`

  prompt += `Return as JSON: { primaryColor, secondaryColor, backgroundColor, fontFamily }`

  return prompt
}

export function buildTemplateSelectionPrompt(params: {
  userPrompt: string
  occasion?: string
}): string {
  const { userPrompt, occasion } = params

  const templateList = Object.values(TEMPLATES)
    .map((t) => `- ${t.name}: ${t.description} (${t.category})`)
    .join('\n')

  let prompt = `Select the most appropriate template for this request:\n\n`
  prompt += `"${userPrompt}"\n\n`

  if (occasion) {
    prompt += `Occasion: ${occasion}\n\n`
  }

  prompt += `Available templates:\n${templateList}\n\n`
  prompt += `Return ONLY the template name that best matches the request.`

  return prompt
}

export function buildBlockSuggestionPrompt(params: {
  existingBlocks: string[]
  pageTitle?: string
  occasion?: string
}): string {
  const { existingBlocks, pageTitle, occasion } = params

  let prompt = `Suggest 3-5 additional blocks to enhance this page:\n\n`

  if (pageTitle) {
    prompt += `Page title: ${pageTitle}\n`
  }

  if (occasion) {
    prompt += `Occasion: ${occasion}\n`
  }

  prompt += `\nCurrent blocks: ${existingBlocks.join(', ')}\n\n`

  prompt += `Available block types:\n`
  Object.values(BLOCK_DEFINITIONS).forEach((block) => {
    prompt += `- ${block.type}: ${block.description}\n`
  })

  prompt += `\nSuggest blocks that would:\n`
  prompt += `1. Fill gaps in the story\n`
  prompt += `2. Add visual interest\n`
  prompt += `3. Enhance emotional impact\n`
  prompt += `4. Improve page structure\n\n`

  prompt += `For each suggestion, explain why it would improve the page.\n`
  prompt += `Format: "- [block type]: [reason]"`

  return prompt
}

export function buildContentExpansionPrompt(params: {
  currentContent: string
  targetLength: 'short' | 'medium' | 'long'
  tone?: string
}): string {
  const { currentContent, targetLength, tone } = params

  const lengthGuide = {
    short: '2-3 sentences (50-75 words)',
    medium: '4-5 sentences (100-150 words)',
    long: '2-3 paragraphs (200-300 words)',
  }

  let prompt = `Expand this content to ${lengthGuide[targetLength]}:\n\n`
  prompt += `"${currentContent}"\n\n`

  if (tone) {
    prompt += `Tone: ${tone}\n\n`
  }

  prompt += `Requirements:\n`
  prompt += `1. Maintain the original message and intent\n`
  prompt += `2. Add meaningful details and depth\n`
  prompt += `3. Keep it natural and flowing\n`
  prompt += `4. Maintain emotional authenticity\n`
  prompt += `5. Avoid filler or generic phrases\n\n`

  prompt += `Return ONLY the expanded content, no explanations.`

  return prompt
}

