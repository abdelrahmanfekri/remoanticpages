export type ComponentType =
  | 'hero'
  | 'intro'
  | 'timeline'
  | 'photo-gallery'
  | 'video-section'
  | 'quote'
  | 'memories-grid'
  | 'final-message'
  | 'countdown'
  | 'music-player'
  | 'text-block'
  | 'two-column'
  | 'testimonials'
  | 'map-location'

// Templates enum

export type TemplateName = 'RomanticBirthday' | 'ModernAnniversary' | 'ElegantWedding' | 'ValentinesDay' | 'Christmas' | 'GalaxyBirthday' | 'NeonLove' | 'GoldenLuxury'

export interface TemplateComponent {
  id: string
  type: ComponentType
  order: number
  label: string
  icon: string
  required: boolean
  settings: {
      showSubtitle?: boolean
      showImage?: boolean
      showDecorativeElements?: boolean
      centered?: boolean
      showIcon?: boolean
      style?: string
      columns?: number
      aspectRatio?: string
      showTitle?: boolean
      title?: string
      layout?: string
      showDates?: boolean
      memoriesCount?: number
      hasMemories?: boolean
      mediaCount?: number
      hasMedia?: boolean
      elegantFrame?: boolean
      showSignature?: boolean
      signature?: string
      [key: string]: unknown
  }
}

export interface TemplateSchema {
  templateId: string
  templateName: string
  category: string
  components: TemplateComponent[]
  defaultContent: {
    [componentId: string]: unknown
  }
  theme: {
    primaryColor: string
    secondaryColor: string
    fontFamily: string
  }
}

export const TEMPLATE_SCHEMAS: Record<TemplateName, TemplateSchema> = {
  RomanticBirthday: {
    templateId: 'RomanticBirthday',
    templateName: 'Romantic Birthday',
    category: 'birthday',
    components: [
      {
        id: 'hero',
        type: 'hero',
        order: 0,
        label: 'Hero Section',
        icon: '🎂',
        required: true,
        settings: {
          showSubtitle: true,
          showImage: true,
          showDecorativeElements: true,
          title: 'Happy Birthday',
          subtitle: 'My Dearest Friend',
        },
      },
      {
        id: 'intro',
        type: 'intro',
        order: 1,
        label: 'Introduction',
        icon: '📝',
        required: false,
        settings: {
          style: 'card',
          centered: true,
          showIcon: true,
        },
      },
      {
        id: 'timeline',
        type: 'timeline',
        order: 2,
        label: 'Memories Timeline',
        icon: '📅',
        required: false,
        settings: {
          layout: 'vertical',
          showDates: true,
          showTitle: true,
          title: 'Our Memories',
        },
      },
      {
        id: 'gallery',
        type: 'photo-gallery',
        order: 3,
        label: 'Photo Gallery',
        icon: '🖼️',
        required: false,
        settings: {
          columns: 4,
          aspectRatio: 'square',
          showTitle: true,
          title: 'Gallery',
        },
      },
      {
        id: 'final',
        type: 'final-message',
        order: 4,
        label: 'Final Message',
        icon: '💕',
        required: true,
        settings: {
          style: 'centered',
          showSignature: true,
          showIcon: true,
        },
      },
    ],
    defaultContent: {
      hero: {
        title: 'Happy Birthday',
        subtitle: 'My Dearest Friend',
        image: '',
      },
      intro: {
        text: 'Today we celebrate you...',
      },
      timeline: {
        events: [],
      },
      gallery: {
        images: [],
      },
      final: {
        message: 'Wishing you all the best!',
        signature: '',
      },
    },
    theme: {
      primaryColor: '#f43f5e',
      secondaryColor: '#ec4899',
      fontFamily: 'serif',
    },
  },

  GalaxyBirthday: {
    templateId: 'GalaxyBirthday',
    templateName: 'Galaxy Birthday',
    category: 'birthday',
    components: [
      {
        id: 'hero',
        type: 'hero',
        order: 0,
        label: 'Cosmic Hero',
        icon: '🚀',
        required: true,
        settings: {
          showStars: true,
          showRocket: true,
          showSubtitle: true,
          showImage: true,
          title: 'Happy Birthday',
          subtitle: 'To Infinity & Beyond',
        },
      },
      {
        id: 'intro',
        type: 'intro',
        order: 1,
        label: 'Space Message',
        icon: '🌌',
        required: false,
        settings: {
          style: 'glass',
          centered: true,
          showIcon: true,
        },
      },
      {
        id: 'memories',
        type: 'memories-grid',
        order: 2,
        label: 'Cosmic Memories',
        icon: '⭐',
        required: false,
        settings: {
          layout: 'grid',
          columns: 2,
          showTitle: true,
          title: 'Our Adventure',
        },
      },
      {
        id: 'gallery',
        type: 'photo-gallery',
        order: 3,
        label: 'Galaxy Photos',
        icon: '🖼️',
        required: false,
        settings: {
          columns: 4,
          aspectRatio: 'cover',
          glowEffect: true,
          showTitle: true,
          title: 'Galaxy Gallery',
        },
      },
      {
        id: 'final',
        type: 'final-message',
        order: 4,
        label: 'Final Transmission',
        icon: '💫',
        required: true,
        settings: {
          style: 'cosmic',
          showSignature: true,
          showIcon: true,
        },
      },
    ],
    defaultContent: {
      hero: {
        title: 'Happy Birthday',
        subtitle: 'To Infinity & Beyond',
        image: '',
      },
      intro: {
        text: 'Celebrating your cosmic journey...',
      },
      memories: {
        events: [],
      },
      gallery: {
        images: [],
      },
      final: {
        message: 'To the stars and back!',
        signature: '',
      },
    },
    theme: {
      primaryColor: '#22d3ee',
      secondaryColor: '#a855f7',
      fontFamily: 'sans-serif',
    },
  },

  NeonLove: {
    templateId: 'NeonLove',
    templateName: 'Neon Love',
    category: 'romance',
    components: [
      {
        id: 'hero',
        type: 'hero',
        order: 0,
        label: 'Neon Hero',
        icon: '⚡',
        required: true,
        settings: {
          neonEffect: true,
          gridBackground: true,
          showSubtitle: true,
          showImage: true,
          showDecorativeElements: true,
          title: 'My Love',
          subtitle: 'Forever Electric',
        },
      },
      {
        id: 'quote',
        type: 'quote',
        order: 1,
        label: 'Love Quote',
        icon: '💖',
        required: false,
        settings: {
          style: 'neon-box',
          showIcon: true,
        },
      },
      {
        id: 'memories',
        type: 'memories-grid',
        order: 2,
        label: 'Electric Memories',
        icon: '⚡',
        required: false,
        settings: {
          layout: 'stacked',
          showTitle: true,
          title: 'Memorable Moments',
        },
      },
      {
        id: 'gallery',
        type: 'photo-gallery',
        order: 3,
        label: 'Neon Gallery',
        icon: '🖼️',
        required: false,
        settings: {
          columns: 4,
          neonBorder: true,
          showTitle: true,
          aspectRatio: 'square',
          title: 'Gallery',
        },
      },
      {
        id: 'final',
        type: 'final-message',
        order: 4,
        label: 'Forever Electric',
        icon: '💕',
        required: true,
        settings: {
          style: 'neon',
          showSignature: true,
          showIcon: true,
        },
      },
    ],
    defaultContent: {
      hero: {
        title: 'My Love',
        subtitle: 'Forever Electric',
      },
      quote: {
        text: 'You electrify my world...',
      },
      memories: {
        events: [],
      },
      gallery: {
        images: [],
      },
      final: {
        message: 'Forever yours in neon lights!',
        signature: '',
      },
    },
    theme: {
      primaryColor: '#ff00ff',
      secondaryColor: '#00ffff',
      fontFamily: 'sans-serif',
    },
  },

  GoldenLuxury: {
    templateId: 'GoldenLuxury',
    templateName: 'Golden Luxury',
    category: 'general',
    components: [
      {
        id: 'hero',
        type: 'hero',
        order: 0,
        label: 'Luxury Hero',
        icon: '👑',
        required: true,
        settings: {
          showCrown: true,
          goldenParticles: true,
          showSubtitle: true,
          showImage: true,
          title: 'Special Celebration',
          subtitle: 'In Luxury & Style',
        },
      },
      {
        id: 'intro',
        type: 'intro',
        order: 1,
        label: 'Golden Message',
        icon: '✨',
        required: false,
        settings: {
          style: 'golden-box',
          centered: true,
          showIcon: true,
        },
      },
      {
        id: 'timeline',
        type: 'timeline',
        order: 2,
        label: 'Golden Memories',
        icon: '💎',
        required: false,
        settings: {
          layout: 'luxury',
          showTitle: true,
          title: 'Memories',
        },
      },
      {
        id: 'gallery',
        type: 'photo-gallery',
        order: 3,
        label: 'Luxury Gallery',
        icon: '🖼️',
        required: false,
        settings: {
          columns: 4,
          goldenFrame: true,
          aspectRatio: 'square',
          showTitle: true,
          title: 'Gallery',
        },
      },
      {
        id: 'final',
        type: 'final-message',
        order: 4,
        label: 'Luxurious Finale',
        icon: '👑',
        required: true,
        settings: {
          style: 'luxury',
          showSignature: true,
          showIcon: true,
        },
      },
    ],
    defaultContent: {
      hero: {
        title: 'Special Celebration',
        subtitle: 'In Luxury & Style',
      },
      intro: {
        text: 'A golden moment to remember...',
      },
      timeline: {
        events: [],
      },
      gallery: {
        images: [],
      },
      final: {
        message: 'Forever luxurious!',
        signature: '',
      },
    },
    theme: {
      primaryColor: '#fbbf24',
      secondaryColor: '#f59e0b',
      fontFamily: 'serif',
    },
  },

  ModernAnniversary: {
    templateId: 'ModernAnniversary',
    templateName: 'Modern Anniversary',
    category: 'anniversary',
    components: [
      {
        id: 'hero',
        type: 'hero',
        order: 0,
        label: 'Anniversary Hero',
        icon: '💍',
        required: true,
        settings: {
          showHearts: true,
          showSubtitle: true,
          showImage: true,
          title: 'Happy Anniversary',
          subtitle: 'Together Forever',
        },
      },
      {
        id: 'intro',
        type: 'intro',
        order: 1,
        label: 'Love Story',
        icon: '💕',
        required: false,
        settings: {
          style: 'glass-dark',
          centered: true,
          showIcon: true,
        },
      },
      {
        id: 'timeline',
        type: 'timeline',
        order: 2,
        label: 'Our Journey',
        icon: '📅',
        required: false,
        settings: {
          layout: 'alternating',
          showTitle: true,
          title: 'Journey Together',
        },
      },
      {
        id: 'gallery',
        type: 'photo-gallery',
        order: 3,
        label: 'Our Memories',
        icon: '🖼️',
        required: false,
        settings: {
          columns: 4,
          aspectRatio: 'square',
          showTitle: true,
          title: 'Gallery',
        },
      },
      {
        id: 'final',
        type: 'final-message',
        order: 4,
        label: 'Forever & Always',
        icon: '💖',
        required: true,
        settings: {
          style: 'romantic',
          showSignature: true,
          showIcon: true,
        },
      },
    ],
    defaultContent: {
      hero: {
        title: 'Happy Anniversary',
        subtitle: 'Together Forever',
      },
      intro: {
        text: 'Another year of love...',
      },
      timeline: {
        events: [],
      },
      gallery: {
        images: [],
      },
      final: {
        message: 'Forever and always, my love!',
        signature: '',
      },
    },
    theme: {
      primaryColor: '#a855f7',
      secondaryColor: '#ec4899',
      fontFamily: 'serif',
    },
  },

  ElegantWedding: {
    templateId: 'ElegantWedding',
    templateName: 'Elegant Wedding',
    category: 'wedding',
    components: [
      {
        id: 'hero',
        type: 'hero',
        order: 0,
        label: 'Wedding Hero',
        icon: '💒',
        required: true,
        settings: {
          showRings: true,
          elegant: true,
          showSubtitle: true,
          showImage: true,
          title: 'Our Wedding',
          subtitle: 'Two Hearts, One Love',
        },
      },
      {
        id: 'intro',
        type: 'intro',
        order: 1,
        label: 'Our Story',
        icon: '💕',
        required: false,
        settings: {
          style: 'elegant-box',
          centered: true,
          showIcon: true,
        },
      },
      {
        id: 'timeline',
        type: 'timeline',
        order: 2,
        label: 'Love Timeline',
        icon: '💍',
        required: false,
        settings: {
          layout: 'vertical-elegant',
          showTitle: true,
          title: 'Our Love Story',
        },
      },
      {
        id: 'gallery',
        type: 'photo-gallery',
        order: 3,
        label: 'Wedding Photos',
        icon: '📸',
        required: false,
        settings: {
          columns: 4,
          elegantFrame: true,
          aspectRatio: 'square',
          showTitle: true,
          title: 'Gallery',
        },
      },
      {
        id: 'final',
        type: 'final-message',
        order: 4,
        label: 'Forever Together',
        icon: '💑',
        required: true,
        settings: {
          style: 'wedding',
          showSignature: true,
          showIcon: true,
        },
      },
    ],
    defaultContent: {
      hero: {
        title: 'Our Wedding',
        subtitle: 'Two Hearts, One Love',
      },
      intro: {
        text: 'Today we begin forever...',
      },
      timeline: {
        events: [],
      },
      gallery: {
        images: [],
      },
      final: {
        message: 'Forever starts today!',
        signature: '',
      },
    },
    theme: {
      primaryColor: '#d97706',
      secondaryColor: '#f43f5e',
      fontFamily: 'serif',
    },
  },
  ValentinesDay: {
    templateId: 'ValentinesDay',
    templateName: "Valentine's Day",
    category: 'romance',
    components: [
      {
        id: 'hero',
        type: 'hero',
        order: 0,
        label: 'Valentine Hero',
        icon: '❤️',
        required: true,
        settings: {
          showHearts: true,
          showSubtitle: true,
          showImage: true,
          showDecorativeElements: true,
          title: "Happy Valentine's Day",
          subtitle: 'To My Love',
        },
      },
      {
        id: 'intro',
        type: 'intro',
        order: 1,
        label: 'Love Message',
        icon: '💕',
        required: false,
        settings: {
          style: 'card',
          centered: true,
          showIcon: true,
        },
      },
      {
        id: 'memories',
        type: 'memories-grid',
        order: 2,
        label: 'Love Memories',
        icon: '💖',
        required: false,
        settings: {
          layout: 'grid',
          showDates: true,
          showTitle: true,
          title: 'Reasons I Love You ❤️',
        },
      },
      {
        id: 'gallery',
        type: 'photo-gallery',
        order: 3,
        label: 'Love Gallery',
        icon: '🖼️',
        required: false,
        settings: {
          columns: 4,
          aspectRatio: 'square',
          showTitle: true,
          title: 'Our Love Story 💕',
        },
      },
      {
        id: 'final',
        type: 'final-message',
        order: 4,
        label: 'Forever Yours',
        icon: '💝',
        required: true,
        settings: {
          style: 'centered',
          showSignature: true,
          showIcon: true,
          signature: 'Forever Yours',
        },
      },
    ],
    defaultContent: {
      hero: {
        title: "Happy Valentine's Day",
        subtitle: 'To My Love',
      },
      intro: {
        text: 'Every moment with you is a treasure.',
      },
      memories: {
        events: [],
      },
      gallery: {
        images: [],
      },
      final: {
        message: 'I love you more each day! 💕',
        signature: 'Forever Yours',
      },
    },
    theme: {
      primaryColor: '#dc2626',
      secondaryColor: '#ec4899',
      fontFamily: 'sans-serif',
    },
  },
  Christmas: {
    templateId: 'Christmas',
    templateName: 'Christmas Special',
    category: 'seasonal',
    components: [
      {
        id: 'hero',
        type: 'hero',
        order: 0,
        label: 'Christmas Hero',
        icon: '🎄',
        required: true,
        settings: {
          showSnowflakes: true,
          showSubtitle: true,
          showImage: true,
          showDecorativeElements: true,
          title: 'Merry Christmas',
          subtitle: "Season's Greetings",
        },
      },
      {
        id: 'intro',
        type: 'intro',
        order: 1,
        label: 'Holiday Message',
        icon: '❄️',
        required: false,
        settings: {
          style: 'card',
          centered: true,
          showIcon: true,
        },
      },
      {
        id: 'memories',
        type: 'memories-grid',
        order: 2,
        label: 'Christmas Memories',
        icon: '🎁',
        required: false,
        settings: {
          layout: 'grid',
          showDates: true,
          showTitle: true,
          title: '🎄 Christmas Memories 🎄',
        },
      },
      {
        id: 'gallery',
        type: 'photo-gallery',
        order: 3,
        label: 'Holiday Gallery',
        icon: '📸',
        required: false,
        settings: {
          columns: 3,
          aspectRatio: 'square',
          showTitle: true,
          title: '❄️ Holiday Moments ❄️',
        },
      },
      {
        id: 'final',
        type: 'final-message',
        order: 4,
        label: 'Holiday Wishes',
        icon: '🎅',
        required: true,
        settings: {
          style: 'centered',
          showSignature: true,
          showIcon: true,
          signature: 'Merry Christmas!',
        },
      },
    ],
    defaultContent: {
      hero: {
        title: 'Merry Christmas',
        subtitle: "Season's Greetings",
      },
      intro: {
        text: 'Wishing you joy and warmth this holiday season.',
      },
      memories: {
        events: [],
      },
      gallery: {
        images: [],
      },
      final: {
        message: 'May your days be merry and bright! 🎄✨',
        signature: 'Merry Christmas!',
      },
    },
    theme: {
      primaryColor: '#dc2626',
      secondaryColor: '#16a34a',
      fontFamily: 'sans-serif',
    },
  },
}

export const DEFAULT_COMPONENT_SETTINGS: Record<ComponentType, Record<string, any>> = {
  hero: {
    showSubtitle: true,
    showImage: false,
    showDecorativeElements: false,
    title: '',
    subtitle: ''
  },
  intro: {
    centered: true,
    showIcon: false,
    style: ''
  },
  timeline: {
    layout: 'vertical',
    showDates: true,
    showTitle: true,
    title: 'Timeline',
    events: []
  },
  'photo-gallery': {
    columns: 3,
    aspectRatio: 'square',
    showTitle: true,
    title: 'Gallery',
    images: []
  },
  'video-section': {
    showTitle: true,
    title: 'Videos'
  },
  quote: {
    showIcon: false,
    style: 'simple',
    quote: '',
    author: ''
  },
  'memories-grid': {
    layout: 'grid',
    showDates: true,
    showTitle: true,
    title: 'Memories',
    memoriesCount: 0,
    hasMemories: false
  },
  'final-message': {
    showIcon: true,
    showSignature: false,
    signature: '',
    message: ''
  },
  countdown: {
    showTitle: true,
    title: 'Countdown',
    targetDate: ''
  },
  'music-player': {
    showTitle: true,
    title: 'Music',
    playlist: []
  },
  'text-block': {
    centered: false,
    showIcon: false,
    style: ''
  },
  'two-column': {
    columns: 2,
    showTitle: true,
    title: 'Two Column Section'
  },
  testimonials: {
    showTitle: true,
    title: 'Testimonials',
    testimonials: []
  },
  'map-location': {
    showTitle: true,
    title: 'Location',
    lat: 0,
    lng: 0
  }
}


export function getTemplateSchema(templateName: TemplateName): TemplateSchema | null {
  return TEMPLATE_SCHEMAS[templateName] || null
}

export function getTemplateIdByDisplayName(displayName: string): TemplateName | 'custom' | null {
  // Handle custom pages
  if (displayName === 'Custom' || displayName === 'custom') {
    return 'custom'
  }
  
  // Search by display name
  for (const [templateId, schema] of Object.entries(TEMPLATE_SCHEMAS)) {
    if (schema.templateName === displayName) {
      return templateId as TemplateName
    }
  }
  
  // Also check if it's already a template ID
  if (displayName in TEMPLATE_SCHEMAS) {
    return displayName as TemplateName
  }
  
  return null
}

export function getComponent(
  templateName: TemplateName,
  componentId: string
): TemplateComponent | null {
  const schema = getTemplateSchema(templateName)
  if (!schema) return null
  return schema.components.find((c) => c.id === componentId) || null
}

/**
 * Convert template schema to TemplateConfig format for page storage
 */
export function schemaToConfig(schema: TemplateSchema): {
  components: Array<{
    id: string
    type: ComponentType
    variant?: string
    order: number
    theme?: Record<string, any>
    settings?: Record<string, any>
  }>
  theme: {
    primaryColor?: string
    secondaryColor?: string
    backgroundGradient?: string
    fontFamily?: string
  }
  background?: {
    type?: 'gradient' | 'solid' | 'pattern'
    value?: string
  }
} {
  return {
    components: schema.components.map((comp) => ({
      id: comp.id,
      type: comp.type,
      order: comp.order,
      settings: comp.settings,
    })),
    theme: {
      primaryColor: schema.theme.primaryColor,
      secondaryColor: schema.theme.secondaryColor,
      fontFamily: schema.theme.fontFamily,
    },
    background: {
      type: 'gradient',
      value: `from-[${schema.theme.primaryColor}]20 via-white to-[${schema.theme.secondaryColor}]20`,
    },
  }
}

/**
 * Get default config for custom pages
 */
export function getDefaultConfig() {
  return {
    components: [
      {
        id: 'hero',
        type: 'hero' as ComponentType,
        order: 0,
        settings: {
          showSubtitle: true,
          showImage: true,
          showDecorativeElements: true,
        },
      },
      {
        id: 'intro',
        type: 'intro' as ComponentType,
        order: 1,
        settings: {
          style: 'card',
          centered: true,
        },
      },
      {
        id: 'final',
        type: 'final-message' as ComponentType,
        order: 2,
        settings: {
          style: 'centered',
          showSignature: true,
        },
      },
    ],
    theme: {
      primaryColor: '#f43f5e',
      secondaryColor: '#ec4899',
      fontFamily: 'serif',
    },
    background: {
      type: 'gradient' as const,
      value: 'from-pink-50 via-white to-rose-50',
    },
  }
}

