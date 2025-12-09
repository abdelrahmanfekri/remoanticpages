import { BlockType, BlockContent, BlockSettings } from '@/types'
import { Tier } from '../tiers'

export interface BlockDefinition {
  type: BlockType
  label: string
  description: string
  icon: string
  category: 'content' | 'media' | 'layout' | 'interactive'
  isPremium: boolean
  defaultContent: BlockContent
  defaultSettings: BlockSettings
  contentSchema: {
    [key: string]: {
      type: 'text' | 'longtext' | 'image' | 'date' | 'number' | 'boolean' | 'array' | 'object'
      label: string
      required: boolean
      aiEnhanceable?: boolean
      placeholder?: string
    }
  }
  settingsSchema: {
    [key: string]: {
      type: 'select' | 'color' | 'number' | 'boolean' | 'text'
      label: string
      options?: Array<{ value: string; label: string }>
      default?: any
    }
  }
}

export const BLOCK_DEFINITIONS: Record<BlockType, BlockDefinition> = {
  hero: {
    type: 'hero',
    label: 'Hero Section',
    description: 'Large header with title and subtitle',
    icon: '🎯',
    category: 'content',
    isPremium: false,
    defaultContent: {
      title: 'Welcome',
      subtitle: 'Your special moment',
      showImage: false,
      imageUrl: null,
    },
    defaultSettings: {
      alignment: 'center',
      height: 'large',
      showDecorativeElements: true,
    },
    contentSchema: {
      title: {
        type: 'text',
        label: 'Title',
        required: true,
        aiEnhanceable: true,
        placeholder: 'Enter your title',
      },
      subtitle: {
        type: 'text',
        label: 'Subtitle',
        required: false,
        aiEnhanceable: true,
        placeholder: 'Enter your subtitle',
      },
      showImage: {
        type: 'boolean',
        label: 'Show Image',
        required: false,
      },
      imageUrl: {
        type: 'image',
        label: 'Background Image',
        required: false,
      },
    },
    settingsSchema: {
      alignment: {
        type: 'select',
        label: 'Alignment',
        options: [
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
        ],
        default: 'center',
      },
      height: {
        type: 'select',
        label: 'Height',
        options: [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' },
          { value: 'fullscreen', label: 'Full Screen' },
        ],
        default: 'large',
      },
      showDecorativeElements: {
        type: 'boolean',
        label: 'Show Decorative Elements',
        default: true,
      },
    },
  },

  intro: {
    type: 'intro',
    label: 'Introduction Text',
    description: 'Paragraph or introduction section',
    icon: '📝',
    category: 'content',
    isPremium: false,
    defaultContent: {
      text: 'Write your introduction here...',
      showIcon: false,
    },
    defaultSettings: {
      style: 'default',
      centered: true,
    },
    contentSchema: {
      text: {
        type: 'longtext',
        label: 'Text',
        required: true,
        aiEnhanceable: true,
        placeholder: 'Write your text...',
      },
      showIcon: {
        type: 'boolean',
        label: 'Show Icon',
        required: false,
      },
    },
    settingsSchema: {
      style: {
        type: 'select',
        label: 'Style',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'card', label: 'Card' },
          { value: 'bordered', label: 'Bordered' },
        ],
        default: 'default',
      },
      centered: {
        type: 'boolean',
        label: 'Center Text',
        default: true,
      },
    },
  },

  text: {
    type: 'text',
    label: 'Text Block',
    description: 'Simple text content',
    icon: '📄',
    category: 'content',
    isPremium: false,
    defaultContent: {
      text: 'Your text here...',
    },
    defaultSettings: {
      fontSize: 'medium',
      centered: false,
    },
    contentSchema: {
      text: {
        type: 'longtext',
        label: 'Text',
        required: true,
        aiEnhanceable: true,
        placeholder: 'Write your text...',
      },
    },
    settingsSchema: {
      fontSize: {
        type: 'select',
        label: 'Font Size',
        options: [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' },
        ],
        default: 'medium',
      },
      centered: {
        type: 'boolean',
        label: 'Center Text',
        default: false,
      },
    },
  },

  quote: {
    type: 'quote',
    label: 'Quote',
    description: 'Inspirational quote or message',
    icon: '💬',
    category: 'content',
    isPremium: false,
    defaultContent: {
      text: 'Your quote here...',
      author: '',
    },
    defaultSettings: {
      style: 'default',
      showIcon: true,
    },
    contentSchema: {
      text: {
        type: 'longtext',
        label: 'Quote',
        required: true,
        aiEnhanceable: true,
        placeholder: 'Enter your quote...',
      },
      author: {
        type: 'text',
        label: 'Author',
        required: false,
        placeholder: 'Quote author',
      },
    },
    settingsSchema: {
      style: {
        type: 'select',
        label: 'Style',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'elegant', label: 'Elegant' },
          { value: 'bold', label: 'Bold' },
        ],
        default: 'default',
      },
      showIcon: {
        type: 'boolean',
        label: 'Show Quote Icon',
        default: true,
      },
    },
  },

  gallery: {
    type: 'gallery',
    label: 'Photo Gallery',
    description: 'Grid of images',
    icon: '🖼️',
    category: 'media',
    isPremium: false,
    defaultContent: {
      title: 'Gallery',
      showTitle: true,
    },
    defaultSettings: {
      columns: 3,
      aspectRatio: 'square',
      gap: 'medium',
    },
    contentSchema: {
      title: {
        type: 'text',
        label: 'Gallery Title',
        required: false,
        aiEnhanceable: true,
      },
      showTitle: {
        type: 'boolean',
        label: 'Show Title',
        required: false,
      },
    },
    settingsSchema: {
      columns: {
        type: 'select',
        label: 'Columns',
        options: [
          { value: '2', label: '2 Columns' },
          { value: '3', label: '3 Columns' },
          { value: '4', label: '4 Columns' },
        ],
        default: '3',
      },
      aspectRatio: {
        type: 'select',
        label: 'Image Ratio',
        options: [
          { value: 'square', label: 'Square' },
          { value: 'landscape', label: 'Landscape' },
          { value: 'portrait', label: 'Portrait' },
        ],
        default: 'square',
      },
      gap: {
        type: 'select',
        label: 'Gap Size',
        options: [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' },
        ],
        default: 'medium',
      },
    },
  },

  video: {
    type: 'video',
    label: 'Video',
    description: 'Embedded video player',
    icon: '🎥',
    category: 'media',
    isPremium: true,
    defaultContent: {
      videoUrl: '',
      title: 'Video',
      showTitle: true,
    },
    defaultSettings: {
      autoplay: false,
      controls: true,
    },
    contentSchema: {
      videoUrl: {
        type: 'text',
        label: 'Video URL',
        required: true,
        placeholder: 'YouTube or direct video URL',
      },
      title: {
        type: 'text',
        label: 'Title',
        required: false,
        aiEnhanceable: true,
      },
      showTitle: {
        type: 'boolean',
        label: 'Show Title',
        required: false,
      },
    },
    settingsSchema: {
      autoplay: {
        type: 'boolean',
        label: 'Autoplay',
        default: false,
      },
      controls: {
        type: 'boolean',
        label: 'Show Controls',
        default: true,
      },
    },
  },

  timeline: {
    type: 'timeline',
    label: 'Timeline',
    description: 'Chronological events',
    icon: '📅',
    category: 'content',
    isPremium: false,
    defaultContent: {
      title: 'Our Journey',
      showTitle: true,
    },
    defaultSettings: {
      layout: 'vertical',
      showDates: true,
    },
    contentSchema: {
      title: {
        type: 'text',
        label: 'Timeline Title',
        required: false,
        aiEnhanceable: true,
      },
      showTitle: {
        type: 'boolean',
        label: 'Show Title',
        required: false,
      },
    },
    settingsSchema: {
      layout: {
        type: 'select',
        label: 'Layout',
        options: [
          { value: 'vertical', label: 'Vertical' },
          { value: 'horizontal', label: 'Horizontal' },
          { value: 'alternating', label: 'Alternating' },
        ],
        default: 'vertical',
      },
      showDates: {
        type: 'boolean',
        label: 'Show Dates',
        default: true,
      },
    },
  },

  memories: {
    type: 'memories',
    label: 'Memories Grid',
    description: 'Grid of special moments',
    icon: '⭐',
    category: 'content',
    isPremium: false,
    defaultContent: {
      title: 'Precious Memories',
      showTitle: true,
    },
    defaultSettings: {
      layout: 'grid',
      columns: 2,
    },
    contentSchema: {
      title: {
        type: 'text',
        label: 'Section Title',
        required: false,
        aiEnhanceable: true,
      },
      showTitle: {
        type: 'boolean',
        label: 'Show Title',
        required: false,
      },
    },
    settingsSchema: {
      layout: {
        type: 'select',
        label: 'Layout',
        options: [
          { value: 'grid', label: 'Grid' },
          { value: 'list', label: 'List' },
          { value: 'masonry', label: 'Masonry' },
        ],
        default: 'grid',
      },
      columns: {
        type: 'select',
        label: 'Columns',
        options: [
          { value: '1', label: '1 Column' },
          { value: '2', label: '2 Columns' },
          { value: '3', label: '3 Columns' },
        ],
        default: '2',
      },
    },
  },

  countdown: {
    type: 'countdown',
    label: 'Countdown Timer',
    description: 'Count down to a special date',
    icon: '⏰',
    category: 'interactive',
    isPremium: false,
    defaultContent: {
      title: 'Counting Down',
      targetDate: '',
      message: '',
    },
    defaultSettings: {
      showDays: true,
      showHours: true,
    },
    contentSchema: {
      title: {
        type: 'text',
        label: 'Title',
        required: true,
        aiEnhanceable: true,
      },
      targetDate: {
        type: 'date',
        label: 'Target Date',
        required: true,
      },
      message: {
        type: 'text',
        label: 'Completion Message',
        required: false,
        aiEnhanceable: true,
      },
    },
    settingsSchema: {
      showDays: {
        type: 'boolean',
        label: 'Show Days',
        default: true,
      },
      showHours: {
        type: 'boolean',
        label: 'Show Hours',
        default: true,
      },
    },
  },

  'two-column': {
    type: 'two-column',
    label: 'Two Columns',
    description: 'Side-by-side content',
    icon: '📊',
    category: 'layout',
    isPremium: false,
    defaultContent: {
      leftContent: '',
      rightContent: '',
    },
    defaultSettings: {
      split: '50-50',
      gap: 'medium',
    },
    contentSchema: {
      leftContent: {
        type: 'longtext',
        label: 'Left Content',
        required: true,
        aiEnhanceable: true,
      },
      rightContent: {
        type: 'longtext',
        label: 'Right Content',
        required: true,
        aiEnhanceable: true,
      },
    },
    settingsSchema: {
      split: {
        type: 'select',
        label: 'Column Split',
        options: [
          { value: '30-70', label: '30% - 70%' },
          { value: '50-50', label: '50% - 50%' },
          { value: '70-30', label: '70% - 30%' },
        ],
        default: '50-50',
      },
      gap: {
        type: 'select',
        label: 'Gap Size',
        options: [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' },
        ],
        default: 'medium',
      },
    },
  },

  testimonials: {
    type: 'testimonials',
    label: 'Testimonials',
    description: 'Quotes from others',
    icon: '💭',
    category: 'content',
    isPremium: true,
    defaultContent: {
      title: 'What Others Say',
      showTitle: true,
      testimonials: [],
    },
    defaultSettings: {
      layout: 'carousel',
      showImages: true,
    },
    contentSchema: {
      title: {
        type: 'text',
        label: 'Section Title',
        required: false,
        aiEnhanceable: true,
      },
      showTitle: {
        type: 'boolean',
        label: 'Show Title',
        required: false,
      },
      testimonials: {
        type: 'array',
        label: 'Testimonials',
        required: false,
      },
    },
    settingsSchema: {
      layout: {
        type: 'select',
        label: 'Layout',
        options: [
          { value: 'grid', label: 'Grid' },
          { value: 'carousel', label: 'Carousel' },
          { value: 'list', label: 'List' },
        ],
        default: 'carousel',
      },
      showImages: {
        type: 'boolean',
        label: 'Show Images',
        default: true,
      },
    },
  },

  map: {
    type: 'map',
    label: 'Location Map',
    description: 'Show a location on map',
    icon: '📍',
    category: 'interactive',
    isPremium: true,
    defaultContent: {
      title: 'Location',
      address: '',
      lat: 0,
      lng: 0,
    },
    defaultSettings: {
      zoom: 15,
      showMarker: true,
    },
    contentSchema: {
      title: {
        type: 'text',
        label: 'Title',
        required: false,
        aiEnhanceable: true,
      },
      address: {
        type: 'text',
        label: 'Address',
        required: false,
      },
      lat: {
        type: 'number',
        label: 'Latitude',
        required: true,
      },
      lng: {
        type: 'number',
        label: 'Longitude',
        required: true,
      },
    },
    settingsSchema: {
      zoom: {
        type: 'number',
        label: 'Zoom Level',
        default: 15,
      },
      showMarker: {
        type: 'boolean',
        label: 'Show Marker',
        default: true,
      },
    },
  },

  divider: {
    type: 'divider',
    label: 'Divider',
    description: 'Visual separator',
    icon: '➖',
    category: 'layout',
    isPremium: false,
    defaultContent: {},
    defaultSettings: {
      style: 'solid',
      thickness: 'thin',
    },
    contentSchema: {},
    settingsSchema: {
      style: {
        type: 'select',
        label: 'Style',
        options: [
          { value: 'solid', label: 'Solid' },
          { value: 'dashed', label: 'Dashed' },
          { value: 'dotted', label: 'Dotted' },
        ],
        default: 'solid',
      },
      thickness: {
        type: 'select',
        label: 'Thickness',
        options: [
          { value: 'thin', label: 'Thin' },
          { value: 'medium', label: 'Medium' },
          { value: 'thick', label: 'Thick' },
        ],
        default: 'thin',
      },
    },
  },

  spacer: {
    type: 'spacer',
    label: 'Spacer',
    description: 'Add vertical space',
    icon: '⬇️',
    category: 'layout',
    isPremium: false,
    defaultContent: {},
    defaultSettings: {
      height: 'medium',
    },
    contentSchema: {},
    settingsSchema: {
      height: {
        type: 'select',
        label: 'Height',
        options: [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' },
          { value: 'xlarge', label: 'Extra Large' },
        ],
        default: 'medium',
      },
    },
  },

  button: {
    type: 'button',
    label: 'Button',
    description: 'Call-to-action button',
    icon: '🔘',
    category: 'interactive',
    isPremium: false,
    defaultContent: {
      text: 'Click Me',
      url: '',
    },
    defaultSettings: {
      style: 'primary',
      size: 'medium',
      alignment: 'center',
    },
    contentSchema: {
      text: {
        type: 'text',
        label: 'Button Text',
        required: true,
        aiEnhanceable: true,
      },
      url: {
        type: 'text',
        label: 'Link URL',
        required: true,
        placeholder: 'https://',
      },
    },
    settingsSchema: {
      style: {
        type: 'select',
        label: 'Style',
        options: [
          { value: 'primary', label: 'Primary' },
          { value: 'secondary', label: 'Secondary' },
          { value: 'outline', label: 'Outline' },
        ],
        default: 'primary',
      },
      size: {
        type: 'select',
        label: 'Size',
        options: [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' },
        ],
        default: 'medium',
      },
      alignment: {
        type: 'select',
        label: 'Alignment',
        options: [
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
        ],
        default: 'center',
      },
    },
  },

  'social-links': {
    type: 'social-links',
    label: 'Social Links',
    description: 'Social media links',
    icon: '🔗',
    category: 'interactive',
    isPremium: false,
    defaultContent: {
      links: [],
    },
    defaultSettings: {
      style: 'icons',
      size: 'medium',
    },
    contentSchema: {
      links: {
        type: 'array',
        label: 'Social Links',
        required: false,
      },
    },
    settingsSchema: {
      style: {
        type: 'select',
        label: 'Style',
        options: [
          { value: 'icons', label: 'Icons Only' },
          { value: 'buttons', label: 'Buttons' },
          { value: 'text', label: 'Text Links' },
        ],
        default: 'icons',
      },
      size: {
        type: 'select',
        label: 'Size',
        options: [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' },
        ],
        default: 'medium',
      },
    },
  },

  'final-message': {
    type: 'final-message',
    label: 'Final Message',
    description: 'Closing message or signature',
    icon: '💕',
    category: 'content',
    isPremium: false,
    defaultContent: {
      message: 'Thank you!',
      signature: '',
      showIcon: true,
    },
    defaultSettings: {
      style: 'elegant',
      centered: true,
    },
    contentSchema: {
      message: {
        type: 'longtext',
        label: 'Message',
        required: true,
        aiEnhanceable: true,
        placeholder: 'Your closing message...',
      },
      signature: {
        type: 'text',
        label: 'Signature',
        required: false,
        aiEnhanceable: true,
        placeholder: 'Your name',
      },
      showIcon: {
        type: 'boolean',
        label: 'Show Icon',
        required: false,
      },
    },
    settingsSchema: {
      style: {
        type: 'select',
        label: 'Style',
        options: [
          { value: 'simple', label: 'Simple' },
          { value: 'elegant', label: 'Elegant' },
          { value: 'bold', label: 'Bold' },
        ],
        default: 'elegant',
      },
      centered: {
        type: 'boolean',
        label: 'Center Content',
        default: true,
      },
    },
  },
}

export function getBlockDefinition(type: BlockType): BlockDefinition | null {
  return BLOCK_DEFINITIONS[type] || null
}

export function getBlocksByCategory(category: BlockDefinition['category']): BlockDefinition[] {
  return Object.values(BLOCK_DEFINITIONS).filter((block) => block.category === category)
}

export function getAllBlocks(): BlockDefinition[] {
  return Object.values(BLOCK_DEFINITIONS)
}

export function getFreeBlocks(): BlockDefinition[] {
  return Object.values(BLOCK_DEFINITIONS).filter((block) => !block.isPremium)
}

export function getPremiumBlocks(): BlockDefinition[] {
  return Object.values(BLOCK_DEFINITIONS).filter((block) => block.isPremium)
}

export function getTierBlock(tier: Tier): BlockDefinition[]{
  if (tier == 'free') {
    return getFreeBlocks()
  } else if (tier == 'pro') {
    return getPremiumBlocks()
  } else if (tier == 'lifetime') {
    return getAllBlocks()
  }
  return []
}

