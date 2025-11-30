import { Database } from './database'

export type Page = Database['public']['Tables']['pages']['Row']
export type PageBlock = Database['public']['Tables']['page_blocks']['Row']
export type Memory = Database['public']['Tables']['memories']['Row']
export type Media = Database['public']['Tables']['media']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type Purchase = Database['public']['Tables']['purchases']['Row']
export type PageAnalytics = Database['public']['Tables']['page_analytics']['Row']
export type AISuggestion = Database['public']['Tables']['ai_suggestions']['Row']

export interface PageTheme {
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  backgroundColor?: string
}

export interface PageSettings {
  musicUrl?: string | null
  isPublic: boolean
  passwordHash?: string | null
  animations?: {
    enabled: boolean
    style: 'smooth' | 'bouncy' | 'none'
  }
}

export interface PageWithRelations extends Page {
  blocks: PageBlock[]
  memories: Memory[]
  media: Media[]
}

export interface PageWithAnalytics extends PageWithRelations {
  analytics: PageAnalytics[]
}

export type BlockType =
  | 'hero'
  | 'intro'
  | 'text'
  | 'quote'
  | 'gallery'
  | 'video'
  | 'timeline'
  | 'memories'
  | 'countdown'
  | 'two-column'
  | 'testimonials'
  | 'map'
  | 'divider'
  | 'spacer'
  | 'button'
  | 'social-links'
  | 'final-message'

export interface BlockContent {
  [key: string]: any
}

export interface BlockSettings {
  [key: string]: any
}

export interface BlockData {
  id: string
  type: BlockType
  content: BlockContent
  settings: BlockSettings
  order: number
}

export type AISuggestionType =
  | 'block_suggestion'
  | 'text_enhancement'
  | 'design_improvement'
  | 'layout_optimization'
  | 'color_palette'
  | 'content_generation'
