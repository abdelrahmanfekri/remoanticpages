import { z } from 'zod'

export const PageThemeSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  fontFamily: z.enum(['serif', 'sans-serif', 'monospace']),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
})

export const BlockContentSchema = z.record(z.any()).refine(
  (val) => typeof val === 'object' && val !== null && !Array.isArray(val),
  {
    message: 'Content must be an object, not a string or array',
  }
)

export const BlockSettingsSchema = z.record(z.any())

export const GeneratedBlockSchema = z.object({
  type: z.enum([
    'hero',
    'intro',
    'text',
    'quote',
    'gallery',
    'video',
    'timeline',
    'memories',
    'countdown',
    'two-column',
    'testimonials',
    'map',
    'divider',
    'spacer',
    'button',
    'social-links',
    'final-message',
  ]),
  content: BlockContentSchema,
  settings: BlockSettingsSchema.optional(),
})

export const GeneratedPageSchema = z.object({
  title: z.string().min(1).max(200),
  recipientName: z.string().max(100),
  theme: PageThemeSchema,
  blocks: z.array(GeneratedBlockSchema).min(2).max(20),
  reasoning: z.string().optional(),
})

export const EnhancementSuggestionsSchema = z.object({
  original: z.string(),
  suggestions: z.array(z.string()).min(1).max(5),
  reasoning: z.string().optional(),
})

export const AnalysisResultSchema = z.object({
  score: z.number().min(0).max(10),
  strengths: z.array(z.string()),
  issues: z.array(z.string()),
  suggestions: z.array(z.string()),
})

export const PageAnalysisSchema = z.object({
  overall: AnalysisResultSchema,
  content: AnalysisResultSchema,
  design: AnalysisResultSchema,
  structure: AnalysisResultSchema,
})

export const BlockSuggestionSchema = z.object({
  blockType: z.string(),
  reason: z.string(),
  priority: z.enum(['high', 'medium', 'low']),
  estimatedImpact: z.string().optional(),
})

export const RefinementChangesSchema = z.object({
  changes: z.array(
    z.object({
      action: z.enum(['update', 'add', 'delete', 'reorder']),
      blockId: z.string().optional(),
      blockType: z.string().optional(),
      changes: z.record(z.any()).optional(),
    })
  ),
  themeChanges: PageThemeSchema.partial().optional(),
  reasoning: z.string(),
})

export const MemorySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  date: z.string().optional(),
  imageUrl: z.string().url().optional(),
})

export const GeneratedMemoriesSchema = z.object({
  memories: z.array(MemorySchema).min(1).max(10),
  reasoning: z.string().optional(),
})

export const ColorHarmonyAnalysisSchema = z.object({
  harmony: z.enum(['excellent', 'good', 'fair', 'poor']),
  contrastRatio: z.number().optional(),
  suggestions: z.array(z.string()),
})

export type PageTheme = z.infer<typeof PageThemeSchema>
export type GeneratedBlock = z.infer<typeof GeneratedBlockSchema>
export type GeneratedPage = z.infer<typeof GeneratedPageSchema>
export type EnhancementSuggestions = z.infer<typeof EnhancementSuggestionsSchema>
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>
export type PageAnalysis = z.infer<typeof PageAnalysisSchema>
export type BlockSuggestion = z.infer<typeof BlockSuggestionSchema>
export type RefinementChanges = z.infer<typeof RefinementChangesSchema>
export type Memory = z.infer<typeof MemorySchema>
export type GeneratedMemories = z.infer<typeof GeneratedMemoriesSchema>
export type ColorHarmonyAnalysis = z.infer<typeof ColorHarmonyAnalysisSchema>

