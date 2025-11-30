export function buildRefinementPrompt(params: {
  userRequest: string
  currentPageState: {
    title: string
    blocks: Array<{ type: string; content?: any }>
    theme?: { primaryColor: string; secondaryColor: string }
  }
}): string {
  const { userRequest, currentPageState } = params

  let prompt = `Refine this page based on user feedback:\n\n`
  prompt += `User request: "${userRequest}"\n\n`

  prompt += `Current page:\n`
  prompt += `- Title: ${currentPageState.title}\n`

  if (currentPageState.theme) {
    prompt += `- Colors: ${currentPageState.theme.primaryColor} / ${currentPageState.theme.secondaryColor}\n`
  }

  prompt += `- Blocks: ${currentPageState.blocks.map((b) => b.type).join(', ')}\n\n`

  prompt += `Provide specific changes to implement the user's request.\n`
  prompt += `Return as JSON with:\n`
  prompt += `{\n`
  prompt += `  "changes": [\n`
  prompt += `    { "action": "update|add|delete", "blockId": "...", "changes": {...} }\n`
  prompt += `  ],\n`
  prompt += `  "themeChanges": { "primaryColor": "...", ... },\n`
  prompt += `  "reasoning": "Why these changes address the request"\n`
  prompt += `}`

  return prompt
}

export function buildQuickRefinementPrompts() {
  return {
    morePlayful: `Make the content more playful and fun while keeping the same message. Add lighthearted touches and upbeat language.`,
    
    warmerColors: `Suggest warmer, more inviting colors for the theme. Provide 2-3 warm color palettes that maintain good contrast.`,
    
    moreDetails: `Add more specific details and depth to the content. Expand key points and make descriptions more vivid and personal.`,
    
    simplify: `Simplify the content to be more concise and direct. Remove unnecessary words while keeping the emotional impact.`,
    
    moreElegant: `Make the design and content more elegant and sophisticated. Suggest refined language and classic design choices.`,
    
    moreRomantic: `Enhance the romantic tone throughout. Use more passionate, intimate language while staying tasteful.`,
    
    addEmphasis: `Add emphasis to key moments and messages. Suggest visual and textual changes to highlight important content.`,
    
    improveFlow: `Improve the flow and transitions between sections. Suggest reordering or bridging content for better storytelling.`,
  }
}

export function buildIterativeRefinementPrompt(params: {
  userRequest: string
  previousChanges: Array<{ action: string; description: string }>
  currentIssues?: string[]
}): string {
  const { userRequest, previousChanges, currentIssues } = params

  let prompt = `Continue refining the page:\n\n`
  prompt += `Latest request: "${userRequest}"\n\n`

  if (previousChanges.length > 0) {
    prompt += `Previous changes made:\n`
    previousChanges.forEach((change, i) => {
      prompt += `${i + 1}. ${change.action}: ${change.description}\n`
    })
    prompt += `\n`
  }

  if (currentIssues && currentIssues.length > 0) {
    prompt += `Current issues:\n`
    currentIssues.forEach((issue) => {
      prompt += `- ${issue}\n`
    })
    prompt += `\n`
  }

  prompt += `Provide the next set of changes to:\n`
  prompt += `1. Address the latest request\n`
  prompt += `2. Resolve any current issues\n`
  prompt += `3. Build on previous improvements\n`
  prompt += `4. Maintain overall coherence\n\n`

  prompt += `Return as JSON with changes array and reasoning.`

  return prompt
}

export function buildComparisonPrompt(params: {
  originalVersion: string
  refinedVersion: string
  focusAreas?: string[]
}): string {
  const { originalVersion, refinedVersion, focusAreas } = params

  let prompt = `Compare these two versions:\n\n`
  prompt += `Original:\n"${originalVersion}"\n\n`
  prompt += `Refined:\n"${refinedVersion}"\n\n`

  if (focusAreas && focusAreas.length > 0) {
    prompt += `Focus on: ${focusAreas.join(', ')}\n\n`
  }

  prompt += `Provide:\n`
  prompt += `1. Key improvements\n`
  prompt += `2. Any regressions\n`
  prompt += `3. Score (1-10) for each version\n`
  prompt += `4. Recommendation (keep original/use refined/hybrid)\n`

  return prompt
}

export function buildUndoAnalysisPrompt(params: {
  changeDescription: string
  beforeState: any
  afterState: any
}): string {
  const { changeDescription, beforeState, afterState } = params

  let prompt = `Analyze this change to help user decide whether to undo:\n\n`
  prompt += `Change: ${changeDescription}\n\n`
  prompt += `Before: ${JSON.stringify(beforeState, null, 2)}\n`
  prompt += `After: ${JSON.stringify(afterState, null, 2)}\n\n`

  prompt += `Provide:\n`
  prompt += `1. Summary of what changed\n`
  prompt += `2. Improvements gained\n`
  prompt += `3. Potential losses\n`
  prompt += `4. Recommendation (keep/undo/modify)\n`

  return prompt
}

