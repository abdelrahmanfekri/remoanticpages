import { createAIClient } from './client'
import type { BlockData, PageTheme } from '@/types'

export interface AnalysisResult {
  score: number
  suggestions: string[]
  strengths: string[]
  issues: string[]
}

export interface PageAnalysis {
  overall: AnalysisResult
  content: AnalysisResult
  design: AnalysisResult
  structure: AnalysisResult
}

export class ContentAnalyzer {
  private client: ReturnType<typeof createAIClient>

  constructor() {
    this.client = createAIClient({ temperature: 0.3 })
  }

  async analyzePage(
    title: string,
    blocks: BlockData[],
    theme: PageTheme
  ): Promise<PageAnalysis> {
    const systemPrompt = `You are an expert page designer and content analyst. Analyze pages for quality, engagement, and effectiveness.`

    const pageDescription = this.describePageForAnalysis(title, blocks, theme)
    
    const userPrompt = `Analyze this page and provide feedback:\n\n${pageDescription}\n\nProvide analysis in this format:
    
CONTENT (Score: X/10):
Strengths:
- [strength]
Issues:
- [issue]
Suggestions:
- [suggestion]

DESIGN (Score: X/10):
Strengths:
- [strength]
Issues:
- [issue]
Suggestions:
- [suggestion]

STRUCTURE (Score: X/10):
Strengths:
- [strength]
Issues:
- [issue]
Suggestions:
- [suggestion]

OVERALL (Score: X/10):
Strengths:
- [strength]
Issues:
- [issue]
Suggestions:
- [suggestion]`

    try {
      const result = await this.client.generateText(userPrompt, systemPrompt)
      return this.parseAnalysisResult(result)
    } catch (error) {
      console.error('Analysis error:', error)
      throw new Error('Failed to analyze page')
    }
  }

  async suggestImprovements(blocks: BlockData[]): Promise<string[]> {
    const systemPrompt = `You are an expert page designer. Suggest specific improvements for page content and structure.`

    const blockList = blocks.map((b, i) => `${i + 1}. ${b.type}`).join('\n')
    
    const userPrompt = `Current blocks:\n${blockList}\n\nSuggest 3-5 specific improvements to make this page more engaging.`

    try {
      const result = await this.client.generateText(userPrompt, systemPrompt)
      
      return result
        .split('\n')
        .filter((line) => line.trim().startsWith('-') || line.trim().match(/^\d+\./))
        .map((line) => line.replace(/^[-\d.]\s*/, '').trim())
        .filter((s) => s.length > 0)
    } catch (error) {
      console.error('Suggestions error:', error)
      throw new Error('Failed to generate suggestions')
    }
  }

  async analyzeColorHarmony(theme: PageTheme): Promise<{
    harmony: 'excellent' | 'good' | 'fair' | 'poor'
    suggestions: string[]
  }> {
    const systemPrompt = `You are a color theory expert. Analyze color combinations for harmony and accessibility.`

    const userPrompt = `Analyze this color scheme:
Primary: ${theme.primaryColor}
Secondary: ${theme.secondaryColor}
Background: ${theme.backgroundColor || '#ffffff'}

Provide:
1. Harmony rating (excellent/good/fair/poor)
2. Specific suggestions for improvement`

    try {
      const result = await this.client.generateText(userPrompt, systemPrompt)
      
      let harmony: 'excellent' | 'good' | 'fair' | 'poor' = 'good'
      if (result.toLowerCase().includes('excellent')) harmony = 'excellent'
      else if (result.toLowerCase().includes('poor')) harmony = 'poor'
      else if (result.toLowerCase().includes('fair')) harmony = 'fair'

      const suggestions = result
        .split('\n')
        .filter((line) => line.trim().startsWith('-') || line.trim().match(/^\d+\./))
        .map((line) => line.replace(/^[-\d.]\s*/, '').trim())
        .filter((s) => s.length > 0)

      return { harmony, suggestions }
    } catch (error) {
      console.error('Color analysis error:', error)
      return { harmony: 'good', suggestions: [] }
    }
  }

  private describePageForAnalysis(title: string, blocks: BlockData[], theme: PageTheme): string {
    let description = `Title: ${title}\n\n`
    description += `Theme:\n`
    description += `- Primary: ${theme.primaryColor}\n`
    description += `- Secondary: ${theme.secondaryColor}\n`
    description += `- Font: ${theme.fontFamily}\n\n`
    description += `Blocks (${blocks.length} total):\n`
    
    blocks.forEach((block, i) => {
      description += `${i + 1}. ${block.type}\n`
      const content = block.content as Record<string, any>
      if (content.title) description += `   Title: ${content.title}\n`
      if (content.text) description += `   Text: ${content.text.substring(0, 100)}...\n`
    })

    return description
  }

  private parseAnalysisResult(text: string): PageAnalysis {
    const sections = {
      content: this.extractSection(text, 'CONTENT'),
      design: this.extractSection(text, 'DESIGN'),
      structure: this.extractSection(text, 'STRUCTURE'),
      overall: this.extractSection(text, 'OVERALL'),
    }

    return {
      content: sections.content,
      design: sections.design,
      structure: sections.structure,
      overall: sections.overall,
    }
  }

  private extractSection(text: string, sectionName: string): AnalysisResult {
    const regex = new RegExp(`${sectionName}.*?Score:\\s*(\\d+)`, 'i')
    const match = text.match(regex)
    const score = match ? parseInt(match[1]) : 7

    const sectionText = text.substring(
      text.indexOf(sectionName),
      text.indexOf('\n\n', text.indexOf(sectionName))
    )

    const strengths = this.extractList(sectionText, 'Strengths:')
    const issues = this.extractList(sectionText, 'Issues:')
    const suggestions = this.extractList(sectionText, 'Suggestions:')

    return { score, strengths, issues, suggestions }
  }

  private extractList(text: string, marker: string): string[] {
    const startIdx = text.indexOf(marker)
    if (startIdx === -1) return []

    const section = text.substring(startIdx)
    const endIdx = section.indexOf('\n\n')
    const listText = section.substring(0, endIdx > 0 ? endIdx : undefined)

    return listText
      .split('\n')
      .filter((line) => line.trim().startsWith('-'))
      .map((line) => line.replace(/^-\s*/, '').trim())
      .filter((s) => s.length > 0)
  }
}

export function createContentAnalyzer(): ContentAnalyzer {
  return new ContentAnalyzer()
}

