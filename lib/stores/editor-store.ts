import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { MediaItem } from '@/components/MediaUploader'
import type { Tier } from '@/lib/tiers'

type ViewMode = 'edit' | 'preview'
type DeviceView = 'desktop' | 'tablet' | 'mobile'
type QuickSetupStep = 'basics' | 'editor'

interface Memory {
  id?: string
  title: string
  date?: string
  description: string
  order: number
}

interface AITarget {
  componentId: string
  field: string
  componentType: string
  fieldType: 'title' | 'message' | 'text'
  position: { x: number; y: number }
}

interface UpgradeModal {
  isOpen: boolean
  feature: string
  requiredTier: Tier
}

interface EditorState {
  // Core States
  setupStep: QuickSetupStep
  viewMode: ViewMode
  deviceView: DeviceView
  pageData: Record<string, unknown>
  activeComponents: string[]
  
  // Quick Setup Data
  recipientName: string
  mainMessage: string
  
  // AI & Enhancement States
  showAIAssistant: boolean
  aiTarget: AITarget | null
  editingComponent: string | null
  editingField: { componentId: string; field: string } | null
  
  // Media States
  media: MediaItem[]
  musicUrl: string | null
  
  // Style States
  customTheme: {
    primaryColor: string
    secondaryColor: string
    fontFamily: string
  }
  
  // UI States
  showStylePanel: boolean
  showMediaPanel: boolean
  showMusicPanel: boolean
  showComponentsPanel: boolean
  isSaving: boolean
  showShareModal: boolean
  shareUrl: string
  showPrivacyModal: boolean
  
  // Upgrade Modal
  upgradeModal: UpgradeModal
  
  // Memories Management
  memories: Memory[]
}

interface EditorActions {
  // Core Actions
  setSetupStep: (step: QuickSetupStep) => void
  setViewMode: (mode: ViewMode) => void
  setDeviceView: (view: DeviceView) => void
  setPageData: (data: Record<string, unknown>) => void
  setActiveComponents: (components: string[]) => void
  updateComponentData: (componentId: string, data: Record<string, unknown>) => void
  
  // Quick Setup Actions
  setRecipientName: (name: string) => void
  setMainMessage: (message: string) => void
  
  // AI & Enhancement Actions
  setShowAIAssistant: (show: boolean) => void
  setAITarget: (target: AITarget | null) => void
  setEditingComponent: (componentId: string | null) => void
  setEditingField: (field: { componentId: string; field: string } | null) => void
  applyAIEnhancement: (enhancedText: string) => void
  
  // Media Actions
  setMedia: (media: MediaItem[]) => void
  setMusicUrl: (url: string | null) => void
  
  // Style Actions
  setCustomTheme: (theme: { primaryColor: string; secondaryColor: string; fontFamily: string }) => void
  
  // UI Actions
  setShowStylePanel: (show: boolean) => void
  setShowMediaPanel: (show: boolean) => void
  setShowMusicPanel: (show: boolean) => void
  setShowComponentsPanel: (show: boolean) => void
  setIsSaving: (saving: boolean) => void
  setShowShareModal: (show: boolean) => void
  setShareUrl: (url: string) => void
  setShowPrivacyModal: (show: boolean) => void
  
  // Upgrade Modal Actions
  setUpgradeModal: (modal: UpgradeModal) => void
  openUpgradeModal: (feature: string, tier: Tier) => void
  closeUpgradeModal: () => void
  
  // Memories Actions
  setMemories: (memories: Memory[]) => void
  addMemory: () => void
  updateMemory: (index: number, data: Partial<Memory>) => void
  deleteMemory: (index: number) => void
  
  // Component Actions
  toggleComponent: (componentId: string, required: boolean) => void
  
  // Reset/Initialize
  initializeEditor: (initialData: {
    pageData?: Record<string, unknown>
    activeComponents?: string[]
    customTheme?: { primaryColor: string; secondaryColor: string; fontFamily: string }
    media?: MediaItem[]
    musicUrl?: string | null
    memories?: Memory[]
    recipientName?: string
    mainMessage?: string
  }) => void
  resetEditor: () => void
}

type EditorStore = EditorState & EditorActions

const defaultTheme = {
  primaryColor: '#f43f5e',
  secondaryColor: '#ec4899',
  fontFamily: 'serif',
}

const initialState: EditorState = {
  // Core States
  setupStep: 'basics',
  viewMode: 'edit',
  deviceView: 'desktop',
  pageData: {},
  activeComponents: [],
  
  // Quick Setup Data
  recipientName: '',
  mainMessage: '',
  
  // AI & Enhancement States
  showAIAssistant: false,
  aiTarget: null,
  editingComponent: null,
  editingField: null,
  
  // Media States
  media: [],
  musicUrl: null,
  
  // Style States
  customTheme: defaultTheme,
  
  // UI States
  showStylePanel: false,
  showMediaPanel: false,
  showMusicPanel: false,
  showComponentsPanel: false,
  isSaving: false,
  showShareModal: false,
  shareUrl: '',
  showPrivacyModal: false,
  
  // Upgrade Modal
  upgradeModal: {
    isOpen: false,
    feature: '',
    requiredTier: 'premium',
  },
  
  // Memories Management
  memories: [],
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      ...initialState,

  // Core Actions
  setSetupStep: (step) => set({ setupStep: step }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setDeviceView: (view) => set({ deviceView: view }),
  setPageData: (data) => set({ pageData: data }),
  setActiveComponents: (components) => set({ activeComponents: components }),
  
  updateComponentData: (componentId, data) => {
    set((state) => ({
      pageData: {
        ...state.pageData,
        [componentId]: {
          ...(typeof state.pageData[componentId] === 'object' && state.pageData[componentId] !== null
            ? (state.pageData[componentId] as Record<string, unknown>)
            : {}),
          ...data,
        },
      },
    }))
  },

  // Quick Setup Actions
  setRecipientName: (name) => set({ recipientName: name }),
  setMainMessage: (message) => set({ mainMessage: message }),

  // AI & Enhancement Actions
  setShowAIAssistant: (show) => set({ showAIAssistant: show }),
  setAITarget: (target) => set({ aiTarget: target }),
  setEditingComponent: (componentId) => set({ editingComponent: componentId }),
  setEditingField: (field) => set({ editingField: field }),
  
  applyAIEnhancement: (enhancedText) => {
    const { aiTarget, updateComponentData, setShowAIAssistant, memories } = get()
    if (!aiTarget) return

    // Check if this is a memory field (format: memory-{index}-{fieldName})
    const memoryMatch = aiTarget.field.match(/^memory-(\d+)-(title|description)$/)
    
    if (memoryMatch) {
      // Handle memory field update
      const memoryIndex = parseInt(memoryMatch[1], 10)
      const fieldName = memoryMatch[2] as 'title' | 'description'
      const updated = [...memories]
      if (updated[memoryIndex]) {
        updated[memoryIndex] = {
          ...updated[memoryIndex],
          [fieldName]: enhancedText,
        }
        set({ memories: updated })
      }
      setShowAIAssistant(false)
    } else {
      // Handle regular component field update
      updateComponentData(aiTarget.componentId, {
        [aiTarget.field]: enhancedText,
      })
      setShowAIAssistant(false)
    }
  },

  // Media Actions
  setMedia: (media) => set({ media }),
  setMusicUrl: (url) => set({ musicUrl: url }),

  // Style Actions
  setCustomTheme: (theme) => set({ customTheme: theme }),

  // UI Actions
  setShowStylePanel: (show) => set({ showStylePanel: show }),
  setShowMediaPanel: (show) => set({ showMediaPanel: show }),
  setShowMusicPanel: (show) => set({ showMusicPanel: show }),
  setShowComponentsPanel: (show) => set({ showComponentsPanel: show }),
  setIsSaving: (saving) => set({ isSaving: saving }),
  setShowShareModal: (show) => set({ showShareModal: show }),
  setShareUrl: (url) => set({ shareUrl: url }),
  setShowPrivacyModal: (show) => set({ showPrivacyModal: show }),

  // Upgrade Modal Actions
  setUpgradeModal: (modal) => set({ upgradeModal: modal }),
  openUpgradeModal: (feature, tier) =>
    set({
      upgradeModal: {
        isOpen: true,
        feature,
        requiredTier: tier,
      },
    }),
  closeUpgradeModal: () =>
    set({
      upgradeModal: {
        isOpen: false,
        feature: '',
        requiredTier: 'premium',
      },
    }),

  // Memories Actions
  setMemories: (memories) => set({ memories }),
  addMemory: () => {
    const { memories } = get()
    const newMemory: Memory = {
      id: `memory-${Date.now()}`,
      title: '',
      date: '',
      description: '',
      order: memories.length,
    }
    set({ memories: [...memories, newMemory] })
  },
  updateMemory: (index, data) => {
    const { memories } = get()
    const updated = [...memories]
    updated[index] = { ...updated[index], ...data }
    set({ memories: updated })
  },
  deleteMemory: (index) => {
    const { memories } = get()
    set({ memories: memories.filter((_, i) => i !== index) })
  },

  // Component Actions
  toggleComponent: (componentId, required) => {
    const { activeComponents } = get()
    if (activeComponents.includes(componentId)) {
      if (!required) {
        set({
          activeComponents: activeComponents.filter((id) => id !== componentId),
        })
      }
    } else {
      set({ activeComponents: [...activeComponents, componentId] })
    }
  },

  // Reset/Initialize
  initializeEditor: (initialData) => {
    set({
      pageData: initialData.pageData || {},
      activeComponents: initialData.activeComponents || [],
      customTheme: initialData.customTheme || defaultTheme,
      media: initialData.media || [],
      musicUrl: initialData.musicUrl || null,
      memories: initialData.memories || [],
      recipientName: initialData.recipientName || '',
      mainMessage: initialData.mainMessage || '',
      setupStep: initialData.pageData ? 'editor' : 'basics',
    })
  },
  
  resetEditor: () => {
    set(initialState)
  },
    }),
    {
      name: 'romantic-story-editor-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist the important data, not UI states like modals
      partialize: (state) => ({
        // Core States
        pageData: state.pageData,
        activeComponents: state.activeComponents,
        viewMode: state.viewMode,
        deviceView: state.deviceView,
        setupStep: state.setupStep,
        
        // Quick Setup Data
        recipientName: state.recipientName,
        mainMessage: state.mainMessage,
        
        // Media States
        media: state.media,
        musicUrl: state.musicUrl,
        
        // Style States
        customTheme: state.customTheme,
        
        // Memories Management
        memories: state.memories,
        
        // Don't persist UI states (modals, panels, etc.) - they should reset on page load
        // showAIAssistant: false,
        // aiTarget: null,
        // editingComponent: null,
        // editingField: null,
        // showStylePanel: false,
        // showMediaPanel: false,
        // showMusicPanel: false,
        // showComponentsPanel: false,
        // isSaving: false,
        // showShareModal: false,
        // shareUrl: '',
        // showPrivacyModal: false,
        // upgradeModal: { isOpen: false, feature: '', requiredTier: 'premium' },
      }),
    }
  )
)

