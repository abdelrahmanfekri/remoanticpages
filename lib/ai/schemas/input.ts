import { z } from 'zod'

export const PageGenerationInputSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters').max(1000, 'Prompt too long'),
  occasion: z.enum([
    'birthday',
    'anniversary',
    'wedding',
    'valentine',
    'valentines',
    'christmas',
    'graduation',
    'thank-you',
    'apology',
    'romance',
    'celebration',
    'general',
    'other',
  ]).optional(),
  recipientName: z.string().min(1).max(100).optional(),
  specificBlocks: z.array(z.string()).optional(),
  tone: z.enum(['formal', 'casual', 'romantic', 'playful']).optional(),
})

export const BlockEnhancementInputSchema = z.object({
  blockType: z.string().min(1),
  field: z.string().min(1),
  currentContent: z.string().min(1).max(5000),
  context: z.object({
    pageTitle: z.string().optional(),
    recipientName: z.string().optional(),
    occasion: z.string().optional(),
    tone: z.enum(['formal', 'casual', 'romantic', 'playful']).optional(),
  }).optional(),
})

export const ThemeGenerationInputSchema = z.object({
  occasion: z.string().optional(),
  mood: z.enum(['warm', 'cool', 'vibrant', 'elegant', 'playful', 'romantic']).optional(),
  description: z.string().max(500).optional(),
  avoidColors: z.array(z.string()).optional(),
})

export const RefinementInputSchema = z.object({
  pageId: z.string().uuid(),
  request: z.string().min(5, 'Request must be at least 5 characters').max(500),
  focusArea: z.enum(['content', 'design', 'structure', 'tone', 'all']).optional(),
})

export const ContentExpansionInputSchema = z.object({
  content: z.string().min(1).max(1000),
  targetLength: z.enum(['short', 'medium', 'long']),
  tone: z.string().optional(),
  additionalContext: z.string().max(200).optional(),
})

export const ToneAdjustmentInputSchema = z.object({
  content: z.string().min(1).max(5000),
  targetTone: z.enum(['formal', 'casual', 'romantic', 'playful']),
  preserveLength: z.boolean().optional(),
})

export const MemoryGenerationInputSchema = z.object({
  pageContext: z.object({
    title: z.string(),
    recipientName: z.string().optional(),
    occasion: z.string().optional(),
  }),
  count: z.number().min(1).max(10).default(3),
  includeImages: z.boolean().optional(),
  specificThemes: z.array(z.string()).optional(),
})

export const BlockSuggestionInputSchema = z.object({
  currentBlocks: z.array(z.string()),
  pageTitle: z.string().optional(),
  occasion: z.string().optional(),
  maxSuggestions: z.number().min(1).max(10).default(5),
})

export const AnalysisInputSchema = z.object({
  pageId: z.string().uuid(),
  focusAreas: z.array(z.enum(['content', 'design', 'structure', 'accessibility'])).optional(),
  includeScores: z.boolean().default(true),
})

export type PageGenerationInput = z.infer<typeof PageGenerationInputSchema>
export type BlockEnhancementInput = z.infer<typeof BlockEnhancementInputSchema>
export type ThemeGenerationInput = z.infer<typeof ThemeGenerationInputSchema>
export type RefinementInput = z.infer<typeof RefinementInputSchema>
export type ContentExpansionInput = z.infer<typeof ContentExpansionInputSchema>
export type ToneAdjustmentInput = z.infer<typeof ToneAdjustmentInputSchema>
export type MemoryGenerationInput = z.infer<typeof MemoryGenerationInputSchema>
export type BlockSuggestionInput = z.infer<typeof BlockSuggestionInputSchema>
export type AnalysisInput = z.infer<typeof AnalysisInputSchema>

