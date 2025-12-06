import { BLOCK_DEFINITIONS } from '@/lib/blocks/definitions'

export function buildPageGenerationPrompt(params: {
  userPrompt: string
  occasion?: string
  recipientName?: string
  tier: 'free' | 'pro' | 'lifetime'
  preferredBlocks?: string[]
  mediaPreferences?: {
    music: boolean
    photos: boolean
    videos: boolean
  }
}): string {
  const { userPrompt, occasion, recipientName, tier, preferredBlocks, mediaPreferences } = params

  const freeBlocks = Object.values(BLOCK_DEFINITIONS)
    .filter((b) => !b.isPremium)
    .map((b) => b.type)
    .join(', ')

  const premiumBlocks = Object.values(BLOCK_DEFINITIONS)
    .filter((b) => b.isPremium)
    .map((b) => b.type)
    .join(', ')

  let prompt = `You are an expert at creating beautiful, personalized romantic pages. Your task is to create a deeply personalized and emotionally resonant page based on the user's detailed story.\n\n`
  prompt += `## User's Story:\n`
  prompt += `"${userPrompt}"\n\n`

  if (occasion) {
    prompt += `**Occasion:** ${occasion}\n`
  }

  if (recipientName) {
    prompt += `**Recipient's Name:** ${recipientName}\n`
  }

  // Media preferences
  if (mediaPreferences) {
    prompt += `\n## Media Plans:\n`
    if (mediaPreferences.photos) {
      prompt += `- User plans to add PHOTOS - include 'gallery' or 'memories' blocks with placeholders\n`
    }
    if (mediaPreferences.videos && tier !== 'free') {
      prompt += `- User plans to add VIDEOS - consider 'video' blocks if appropriate\n`
    }
    if (mediaPreferences.music && tier !== 'free') {
      prompt += `- User plans to add BACKGROUND MUSIC - page should support music playback\n`
    }
  }

  prompt += `\n## Available Blocks:\n`
  prompt += `**Free tier blocks:** ${freeBlocks}\n`
  
  if (tier !== 'free') {
    prompt += `**Premium blocks:** ${premiumBlocks}\n`
  }

  if (preferredBlocks && preferredBlocks.length > 0) {
    prompt += `\n**User's preferred blocks:** ${preferredBlocks.join(', ')}\n`
  }

  prompt += `\n## Detailed Requirements:\n\n`
  
  prompt += `### Story Structure:\n`
  prompt += `1. Create 6-10 blocks that tell a rich, cohesive narrative\n`
  prompt += `2. Start with a stunning 'hero' block with an emotional title and subtitle\n`
  prompt += `3. Follow with an 'intro' block that sets the emotional tone and context\n`
  prompt += `4. Build the story with multiple content blocks (text, quote, timeline, memories, etc.)\n`
  prompt += `5. Include bilingual content (English and etc) if the user's prompt mentions other languages in the text\n`
  prompt += `6. End with a powerful 'final-message' block that leaves a lasting emotional impact\n\n`

  prompt += `### Content Quality:\n`
  prompt += `1. Extract ALL specific details, memories, moments, and feelings from the user's prompt\n`
  prompt += `2. Create deeply personal, heartfelt content that reflects their unique story\n`
  prompt += `3. Use the exact names, places, dates, and moments mentioned\n`
  prompt += `4. Include inside jokes, shared memories, and personal references when mentioned\n`
  prompt += `5. Write in a warm, romantic, and authentic tone - avoid generic or cliché phrases\n`
  prompt += `6. Make each block meaningful and specific to their relationship/story\n`
  prompt += `7. If bilingual, ensure both languages are natural and emotionally equivalent\n\n`

  prompt += `### Design & Theme:\n`
  prompt += `1. Choose colors that match the occasion and emotional tone\n`
  prompt += `2. Use soft, romantic colors (roses, pinks, warm tones) for romantic occasions\n`
  prompt += `3. For birthdays: vibrant but elegant colors\n`
  prompt += `4. For anniversaries: sophisticated, timeless colors\n`
  prompt += `5. For weddings: elegant, celebratory colors\n`
  prompt += `6. Ensure excellent contrast and readability (WCAG AA compliant)\n`
  prompt += `7. Use serif fonts for elegant, romantic feel\n\n`

  prompt += `### Block-Specific Guidelines:\n`
  prompt += `- **Hero:** Create a compelling title and subtitle that captures the essence of the story\n`
  prompt += `- **Intro:** Set the emotional context and introduce the relationship/moment\n`
  prompt += `- **Text blocks:** Tell the story in detail, using specific moments from the prompt\n`
  prompt += `- **Quotes:** Extract meaningful quotes or create impactful statements\n`
  prompt += `- **Timeline:** If journey/story progression mentioned, create a timeline with specific events\n`
  prompt += `- **Memories:** If memories mentioned, create 2-4 memory blocks with titles and descriptions\n`
  prompt += `- **Gallery/Memories Grid:** Include if photos are planned (with placeholders)\n`
  prompt += `- **Final Message:** A powerful closing that captures the depth of feeling\n\n`

  prompt += `### Special Instructions:\n`
  if (tier === 'free') {
    prompt += `- **CRITICAL:** User is on FREE tier - use ONLY free blocks (no video, countdown, testimonials, or map blocks)\n`
  }
  prompt += `- Prioritize emotional depth and personalization over generic content\n`
  prompt += `- Make every word count - each block should add meaningful value\n`
  prompt += `- Create a page that feels like a personalized love letter or memory book\n`
  prompt += `- The page should tell a complete, moving story from start to finish\n\n`

  prompt += `## Output Format:\n`
  prompt += `Generate a complete page configuration with:\n`
  prompt += `1. A compelling title that reflects the story\n`
  prompt += `2. The recipient's name (if provided)\n`
  prompt += `3. A cohesive color theme (primaryColor, secondaryColor, backgroundColor, fontFamily)\n`
  prompt += `4. An array of 6-10 blocks with rich, detailed, personalized content\n`
  prompt += `5. Each block should have complete content fields filled with specific, heartfelt text\n\n`

  prompt += `Remember: The user has shared their personal story. Honor it by creating something beautiful, specific, and deeply meaningful. Make it feel like it was crafted by hand with care and love.\n\n`

  prompt += `Generate the complete page configuration now.`

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

