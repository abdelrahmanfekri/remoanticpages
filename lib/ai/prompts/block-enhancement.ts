export function buildBlockEnhancementPrompt(params: {
  blockType: string
  field: string
  currentContent: string
  context?: {
    pageTitle?: string
    recipientName?: string
    occasion?: string
    tone?: 'formal' | 'casual' | 'romantic' | 'playful'
  }
}): string {
  const { blockType, field, currentContent, context } = params

  let prompt = `Enhance this content for a ${blockType} block:\n\n`
  prompt += `Field: ${field}\n`
  prompt += `Current: "${currentContent}"\n\n`

  if (context) {
    prompt += `Context:\n`
    if (context.pageTitle) prompt += `- Page: ${context.pageTitle}\n`
    if (context.recipientName) prompt += `- Recipient: ${context.recipientName}\n`
    if (context.occasion) prompt += `- Occasion: ${context.occasion}\n`
    if (context.tone) prompt += `- Tone: ${context.tone}\n`
    prompt += `\n`
  }

  prompt += `Provide 3 enhanced versions that are:\n`
  prompt += `1. More engaging and heartfelt\n`
  prompt += `2. Appropriate for the occasion\n`
  prompt += `3. Natural and authentic\n`
  prompt += `4. Similar in length\n\n`

  prompt += `Format: One suggestion per line, starting with "- "`

  return prompt
}

export function buildToneAdjustmentPrompt(params: {
  content: string
  targetTone: 'formal' | 'casual' | 'romantic' | 'playful'
  currentTone?: string
}): string {
  const { content, targetTone, currentTone } = params

  const toneDescriptions = {
    formal: 'formal, elegant, and respectful',
    casual: 'casual, friendly, and relaxed',
    romantic: 'romantic, passionate, and intimate',
    playful: 'playful, fun, and lighthearted',
  }

  let prompt = `Adjust the tone of this content:\n\n`
  prompt += `"${content}"\n\n`

  if (currentTone) {
    prompt += `Current tone: ${currentTone}\n`
  }

  prompt += `Target tone: ${targetTone} (${toneDescriptions[targetTone]})\n\n`

  prompt += `Requirements:\n`
  prompt += `1. Maintain the core message\n`
  prompt += `2. Match the target tone naturally\n`
  prompt += `3. Keep similar length\n`
  prompt += `4. Sound authentic, not forced\n\n`

  prompt += `Return ONLY the adjusted content, no explanations.`

  return prompt
}

export function buildClarityImprovementPrompt(params: {
  content: string
  issues?: string[]
}): string {
  const { content, issues } = params

  let prompt = `Improve the clarity of this content:\n\n`
  prompt += `"${content}"\n\n`

  if (issues && issues.length > 0) {
    prompt += `Specific issues to address:\n`
    issues.forEach((issue) => {
      prompt += `- ${issue}\n`
    })
    prompt += `\n`
  }

  prompt += `Make it:\n`
  prompt += `1. Clearer and easier to understand\n`
  prompt += `2. More concise (remove unnecessary words)\n`
  prompt += `3. Better structured\n`
  prompt += `4. More impactful\n\n`

  prompt += `Return ONLY the improved content, no explanations.`

  return prompt
}

export function buildPersonalizationPrompt(params: {
  content: string
  recipientName: string
  relationship?: string
  sharedMemories?: string[]
}): string {
  const { content, recipientName, relationship, sharedMemories } = params

  let prompt = `Make this content more personal for ${recipientName}:\n\n`
  prompt += `"${content}"\n\n`

  if (relationship) {
    prompt += `Relationship: ${relationship}\n`
  }

  if (sharedMemories && sharedMemories.length > 0) {
    prompt += `\nShared memories/experiences:\n`
    sharedMemories.forEach((memory) => {
      prompt += `- ${memory}\n`
    })
    prompt += `\n`
  }

  prompt += `Make it more personal by:\n`
  prompt += `1. Using their name naturally\n`
  prompt += `2. Adding specific, personal touches\n`
  prompt += `3. Referencing shared experiences (if provided)\n`
  prompt += `4. Making it feel unique to them\n\n`

  prompt += `Return ONLY the personalized content, no explanations.`

  return prompt
}

