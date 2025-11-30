import { BlockType, BlockData, PageTheme } from '@/types'
import { BLOCK_DEFINITIONS } from './definitions'

export interface TemplateConfig {
  id: string
  name: string
  description: string
  category: 'birthday' | 'anniversary' | 'wedding' | 'romance' | 'seasonal' | 'general'
  isPremium: boolean
  thumbnail?: string
  theme: PageTheme
  blocks: Array<{
    type: BlockType
    content?: Record<string, any>
    settings?: Record<string, any>
  }>
}

export const TEMPLATES: Record<string, TemplateConfig> = {
  'romantic-birthday': {
    id: 'romantic-birthday',
    name: 'Romantic Birthday',
    description: 'Warm and heartfelt birthday celebration',
    category: 'birthday',
    isPremium: false,
    theme: {
      primaryColor: '#f43f5e',
      secondaryColor: '#ec4899',
      fontFamily: 'serif',
      backgroundColor: '#ffffff',
    },
    blocks: [
      {
        type: 'hero',
        content: {
          title: 'Happy Birthday',
          subtitle: 'To Someone Special',
          showImage: true,
        },
        settings: {
          alignment: 'center',
          height: 'large',
          showDecorativeElements: true,
        },
      },
      {
        type: 'intro',
        content: {
          text: 'Today we celebrate you and all the joy you bring into our lives...',
        },
      },
      {
        type: 'gallery',
        content: {
          title: 'Memories Together',
          showTitle: true,
        },
        settings: {
          columns: '3',
          aspectRatio: 'square',
        },
      },
      {
        type: 'memories',
        content: {
          title: 'Special Moments',
          showTitle: true,
        },
      },
      {
        type: 'final-message',
        content: {
          message: 'Wishing you all the happiness in the world!',
          signature: 'With love',
          showIcon: true,
        },
      },
    ],
  },

  'modern-anniversary': {
    id: 'modern-anniversary',
    name: 'Modern Anniversary',
    description: 'Celebrate years together',
    category: 'anniversary',
    isPremium: false,
    theme: {
      primaryColor: '#a855f7',
      secondaryColor: '#ec4899',
      fontFamily: 'serif',
      backgroundColor: '#ffffff',
    },
    blocks: [
      {
        type: 'hero',
        content: {
          title: 'Happy Anniversary',
          subtitle: 'Together Forever',
        },
      },
      {
        type: 'quote',
        content: {
          text: 'In all the world, there is no heart for me like yours...',
          author: 'Maya Angelou',
        },
      },
      {
        type: 'timeline',
        content: {
          title: 'Our Journey Together',
          showTitle: true,
        },
      },
      {
        type: 'gallery',
        content: {
          title: 'Our Story in Pictures',
        },
      },
      {
        type: 'final-message',
        content: {
          message: 'Here\'s to many more years together!',
        },
      },
    ],
  },

  'elegant-wedding': {
    id: 'elegant-wedding',
    name: 'Elegant Wedding',
    description: 'Beautiful wedding announcement',
    category: 'wedding',
    isPremium: true,
    theme: {
      primaryColor: '#d97706',
      secondaryColor: '#f43f5e',
      fontFamily: 'serif',
      backgroundColor: '#ffffff',
    },
    blocks: [
      {
        type: 'hero',
        content: {
          title: 'We\'re Getting Married',
          subtitle: 'Two Hearts, One Love',
        },
        settings: {
          height: 'fullscreen',
        },
      },
      {
        type: 'intro',
        content: {
          text: 'Join us as we begin our forever...',
        },
      },
      {
        type: 'two-column',
        content: {
          leftContent: 'Our love story began...',
          rightContent: 'And now we\'re ready to say "I do"...',
        },
      },
      {
        type: 'countdown',
        content: {
          title: 'Counting Down to Forever',
          targetDate: '2024-12-31',
        },
      },
      {
        type: 'map',
        content: {
          title: 'Ceremony Location',
          address: 'Enter your venue address',
        },
      },
      {
        type: 'final-message',
        content: {
          message: 'We can\'t wait to celebrate with you!',
        },
      },
    ],
  },

  'valentines-special': {
    id: 'valentines-special',
    name: 'Valentine\'s Day',
    description: 'Share your love',
    category: 'romance',
    isPremium: false,
    theme: {
      primaryColor: '#dc2626',
      secondaryColor: '#ec4899',
      fontFamily: 'sans-serif',
      backgroundColor: '#ffffff',
    },
    blocks: [
      {
        type: 'hero',
        content: {
          title: 'Happy Valentine\'s Day',
          subtitle: 'To My Love',
        },
      },
      {
        type: 'intro',
        content: {
          text: 'Every moment with you is a treasure...',
        },
      },
      {
        type: 'memories',
        content: {
          title: 'Reasons I Love You',
          showTitle: true,
        },
      },
      {
        type: 'gallery',
        content: {
          title: 'Our Love Story',
        },
      },
      {
        type: 'final-message',
        content: {
          message: 'I love you more each day!',
          signature: 'Forever Yours',
        },
      },
    ],
  },

  'christmas-special': {
    id: 'christmas-special',
    name: 'Christmas Special',
    description: 'Holiday greetings',
    category: 'seasonal',
    isPremium: false,
    theme: {
      primaryColor: '#dc2626',
      secondaryColor: '#16a34a',
      fontFamily: 'sans-serif',
      backgroundColor: '#ffffff',
    },
    blocks: [
      {
        type: 'hero',
        content: {
          title: 'Merry Christmas',
          subtitle: 'Season\'s Greetings',
        },
      },
      {
        type: 'intro',
        content: {
          text: 'Wishing you joy and warmth this holiday season...',
        },
      },
      {
        type: 'memories',
        content: {
          title: 'Holiday Memories',
        },
      },
      {
        type: 'gallery',
        content: {
          title: 'Festive Moments',
        },
      },
      {
        type: 'final-message',
        content: {
          message: 'May your days be merry and bright!',
          signature: 'Happy Holidays',
        },
      },
    ],
  },

  'galaxy-birthday': {
    id: 'galaxy-birthday',
    name: 'Galaxy Birthday',
    description: 'Space-themed celebration',
    category: 'birthday',
    isPremium: true,
    theme: {
      primaryColor: '#22d3ee',
      secondaryColor: '#a855f7',
      fontFamily: 'sans-serif',
      backgroundColor: '#0f172a',
    },
    blocks: [
      {
        type: 'hero',
        content: {
          title: 'Happy Birthday',
          subtitle: 'To Infinity & Beyond',
        },
        settings: {
          height: 'fullscreen',
        },
      },
      {
        type: 'intro',
        content: {
          text: 'Celebrating your cosmic journey through another year...',
        },
      },
      {
        type: 'memories',
        content: {
          title: 'Stellar Moments',
        },
      },
      {
        type: 'gallery',
        content: {
          title: 'Galaxy Gallery',
        },
      },
      {
        type: 'final-message',
        content: {
          message: 'To the stars and back!',
        },
      },
    ],
  },

  'neon-love': {
    id: 'neon-love',
    name: 'Neon Love',
    description: 'Bold and electric romance',
    category: 'romance',
    isPremium: true,
    theme: {
      primaryColor: '#ff00ff',
      secondaryColor: '#00ffff',
      fontFamily: 'sans-serif',
      backgroundColor: '#1a1a2e',
    },
    blocks: [
      {
        type: 'hero',
        content: {
          title: 'My Love',
          subtitle: 'Forever Electric',
        },
      },
      {
        type: 'quote',
        content: {
          text: 'You electrify my world...',
        },
      },
      {
        type: 'memories',
        content: {
          title: 'Memorable Moments',
        },
      },
      {
        type: 'gallery',
      },
      {
        type: 'final-message',
        content: {
          message: 'Forever yours in neon lights!',
        },
      },
    ],
  },

  'golden-luxury': {
    id: 'golden-luxury',
    name: 'Golden Luxury',
    description: 'Elegant and luxurious',
    category: 'general',
    isPremium: true,
    theme: {
      primaryColor: '#fbbf24',
      secondaryColor: '#f59e0b',
      fontFamily: 'serif',
      backgroundColor: '#ffffff',
    },
    blocks: [
      {
        type: 'hero',
        content: {
          title: 'Special Celebration',
          subtitle: 'In Luxury & Style',
        },
      },
      {
        type: 'intro',
        content: {
          text: 'A golden moment to remember...',
        },
      },
      {
        type: 'timeline',
        content: {
          title: 'Precious Memories',
        },
      },
      {
        type: 'gallery',
      },
      {
        type: 'final-message',
        content: {
          message: 'Forever luxurious!',
        },
      },
    ],
  },

  blank: {
    id: 'blank',
    name: 'Start Blank',
    description: 'Build from scratch',
    category: 'general',
    isPremium: false,
    theme: {
      primaryColor: '#f43f5e',
      secondaryColor: '#ec4899',
      fontFamily: 'serif',
      backgroundColor: '#ffffff',
    },
    blocks: [
      {
        type: 'hero',
        content: {
          title: 'Your Page Title',
          subtitle: 'Your subtitle',
        },
      },
      {
        type: 'intro',
        content: {
          text: 'Start writing your story...',
        },
      },
    ],
  },
}

export function getTemplate(id: string): TemplateConfig | null {
  return TEMPLATES[id] || null
}

export function getAllTemplates(): TemplateConfig[] {
  return Object.values(TEMPLATES)
}

export function getTemplatesByCategory(category: TemplateConfig['category']): TemplateConfig[] {
  return Object.values(TEMPLATES).filter((template) => template.category === category)
}

export function getFreeTemplates(): TemplateConfig[] {
  return Object.values(TEMPLATES).filter((template) => !template.isPremium)
}

export function getPremiumTemplates(): TemplateConfig[] {
  return Object.values(TEMPLATES).filter((template) => template.isPremium)
}

export function createBlocksFromTemplate(templateId: string): BlockData[] {
  const template = getTemplate(templateId)
  if (!template) return []

  return template.blocks.map((block, index) => {
    const definition = BLOCK_DEFINITIONS[block.type]
    return {
      id: `${block.type}-${Date.now()}-${index}`,
      type: block.type,
      content: {
        ...definition.defaultContent,
        ...block.content,
      },
      settings: {
        ...definition.defaultSettings,
        ...block.settings,
      },
      order: index,
    }
  })
}

