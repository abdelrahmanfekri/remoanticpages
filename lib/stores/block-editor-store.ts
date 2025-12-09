import { create } from 'zustand'
import type { BlockData, PageTheme, PageSettings, Memory, Media } from '@/types'
import type { Tier } from '@/lib/tiers'

type ViewMode = 'edit' | 'preview'
type DeviceView = 'desktop' | 'tablet' | 'mobile'

interface AITarget {
  blockId: string
  field: string
  fieldType: 'text' | 'longtext'
  position: { x: number; y: number }
}

interface UpgradeModal {
  isOpen: boolean
  feature: string
  requiredTier: Tier
}

interface BlockEditorState {
  // Page Data
  pageId: string | null
  title: string
  recipientName: string
  theme: PageTheme
  settings: Partial<PageSettings>
  
  // Blocks
  blocks: BlockData[]
  selectedBlockId: string | null
  
  // Memories & Media
  memories: Memory[]
  media: Media[]
  
  // View States
  viewMode: ViewMode
  deviceView: DeviceView
  
  // UI Panels
  showBlockLibrary: boolean
  showBlockSettings: boolean
  showThemePanel: boolean
  showMediaPanel: boolean
  showMusicPanel: boolean
  showPrivacyModal: boolean
  
  // AI States
  showAIAssistant: boolean
  aiTarget: AITarget | null
  
  // Status
  isSaving: boolean
  hasUnsavedChanges: boolean
  
  // Upgrade Modal
  upgradeModal: UpgradeModal
  
  // History (for undo/redo)
  history: BlockData[][]
  historyIndex: number
}

interface BlockEditorActions {
  // Initialization
  initializeEditor: (data: {
    pageId?: string
    title?: string
    recipientName?: string
    theme?: PageTheme
    settings?: Partial<PageSettings>
    blocks?: BlockData[]
    memories?: Memory[]
    media?: Media[]
  }) => void
  reset: () => void
  
  // Page Actions
  setTitle: (title: string) => void
  setRecipientName: (name: string) => void
  setTheme: (theme: Partial<PageTheme>) => void
  setSettings: (settings: Partial<PageSettings>) => void
  
  // Block Actions
  addBlock: (block: Omit<BlockData, 'id' | 'order'>) => void
  updateBlock: (blockId: string, updates: Partial<BlockData>) => void
  deleteBlock: (blockId: string) => void
  duplicateBlock: (blockId: string) => void
  moveBlock: (blockId: string, direction: 'up' | 'down') => void
  reorderBlocks: (blockIds: string[]) => void
  setBlocks: (blocks: BlockData[]) => void
  selectBlock: (blockId: string | null) => void
  
  // Memory Actions
  addMemory: (memory: Omit<Memory, 'id'>) => void
  updateMemory: (memoryId: string, updates: Partial<Memory>) => void
  deleteMemory: (memoryId: string) => void
  
  // Media Actions
  addMedia: (mediaItem: Media) => void
  updateMedia: (mediaId: string, updates: Partial<Media>) => void
  deleteMedia: (mediaId: string) => void
  setMedia: (media: Media[]) => void
  
  // View Actions
  setViewMode: (mode: ViewMode) => void
  setDeviceView: (view: DeviceView) => void
  
  // UI Actions
  toggleBlockLibrary: () => void
  toggleBlockSettings: () => void
  toggleThemePanel: () => void
  toggleMediaPanel: () => void
  toggleMusicPanel: () => void
  setShowPrivacyModal: (show: boolean) => void
  
  // AI Actions
  setShowAIAssistant: (show: boolean) => void
  setAITarget: (target: AITarget | null) => void
  applyAIEnhancement: (blockId: string, field: string, value: string) => void
  
  // Status Actions
  setIsSaving: (saving: boolean) => void
  markAsChanged: () => void
  markAsSaved: () => void
  
  // Upgrade Modal
  openUpgradeModal: (feature: string, tier: Tier) => void
  closeUpgradeModal: () => void
  
  // History Actions (undo/redo)
  undo: () => void
  redo: () => void
  saveToHistory: () => void
}

const DEFAULT_THEME: PageTheme = {
  primaryColor: '#f43f5e',
  secondaryColor: '#ec4899',
  fontFamily: 'serif',
  backgroundColor: '#ffffff',
}

const DEFAULT_SETTINGS: Partial<PageSettings> = {
  musicUrl: null,
  isPublic: false,
  animations: {
    enabled: true,
    style: 'smooth',
  },
}

export const useBlockEditorStore = create<BlockEditorState & BlockEditorActions>((set, get) => ({
  // Initial State
  pageId: null,
  title: '',
  recipientName: '',
  theme: DEFAULT_THEME,
  settings: DEFAULT_SETTINGS,
  blocks: [],
  selectedBlockId: null,
  memories: [],
  media: [],
  viewMode: 'edit',
  deviceView: 'desktop',
  showBlockLibrary: false,
  showBlockSettings: false,
  showThemePanel: false,
  showMediaPanel: false,
  showMusicPanel: false,
  showPrivacyModal: false,
  showAIAssistant: false,
  aiTarget: null,
  isSaving: false,
  hasUnsavedChanges: false,
  upgradeModal: { isOpen: false, feature: '', requiredTier: 'free' },
  history: [],
  historyIndex: -1,

  // Initialization
  initializeEditor: (data) => {
    set({
      pageId: data.pageId || null,
      title: data.title || '',
      recipientName: data.recipientName || '',
      theme: data.theme || DEFAULT_THEME,
      settings: data.settings || DEFAULT_SETTINGS,
      blocks: data.blocks || [],
      memories: data.memories || [],
      media: data.media || [],
      hasUnsavedChanges: false,
      history: [data.blocks || []],
      historyIndex: 0,
    })
  },

  reset: () => {
    set({
      pageId: null,
      title: '',
      recipientName: '',
      theme: DEFAULT_THEME,
      settings: DEFAULT_SETTINGS,
      blocks: [],
      selectedBlockId: null,
      memories: [],
      media: [],
      viewMode: 'edit',
      hasUnsavedChanges: false,
      history: [],
      historyIndex: -1,
    })
  },

  // Page Actions
  setTitle: (title) => {
    set({ title, hasUnsavedChanges: true })
  },

  setRecipientName: (recipientName) => {
    set({ recipientName, hasUnsavedChanges: true })
  },

  setTheme: (themeUpdate) => {
    set((state) => ({
      theme: { ...state.theme, ...themeUpdate },
      hasUnsavedChanges: true,
    }))
  },

  setSettings: (settingsUpdate) => {
    set((state) => ({
      settings: { ...state.settings, ...settingsUpdate },
      hasUnsavedChanges: true,
    }))
  },

  // Block Actions
  addBlock: (block) => {
    const newBlock: BlockData = {
      ...block,
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order: get().blocks.length,
    }
    set((state) => ({
      blocks: [...state.blocks, newBlock],
      hasUnsavedChanges: true,
    }))
    get().saveToHistory()
  },

  updateBlock: (blockId, updates) => {
    set((state) => ({
      blocks: state.blocks.map((block) =>
        block.id === blockId ? { ...block, ...updates } : block
      ),
      hasUnsavedChanges: true,
    }))
    get().saveToHistory()
  },

  deleteBlock: (blockId) => {
    set((state) => ({
      blocks: state.blocks.filter((block) => block.id !== blockId),
      selectedBlockId: state.selectedBlockId === blockId ? null : state.selectedBlockId,
      hasUnsavedChanges: true,
    }))
    get().saveToHistory()
  },

  duplicateBlock: (blockId) => {
    const block = get().blocks.find((b) => b.id === blockId)
    if (block) {
      const newBlock: BlockData = {
        ...block,
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        order: get().blocks.length,
      }
      set((state) => ({
        blocks: [...state.blocks, newBlock],
        hasUnsavedChanges: true,
      }))
      get().saveToHistory()
    }
  },

  moveBlock: (blockId, direction) => {
    const blocks = get().blocks
    const index = blocks.findIndex((b) => b.id === blockId)
    
    if (index === -1) return
    
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= blocks.length) return
    
    const newBlocks = [...blocks]
    const temp = newBlocks[index]
    newBlocks[index] = newBlocks[targetIndex]
    newBlocks[targetIndex] = temp
    
    // Update orders
    newBlocks.forEach((block, i) => {
      block.order = i
    })
    
    set({ blocks: newBlocks, hasUnsavedChanges: true })
    get().saveToHistory()
  },

  reorderBlocks: (blockIds) => {
    const blocksMap = new Map(get().blocks.map((b) => [b.id, b]))
    const newBlocks = blockIds
      .map((id) => blocksMap.get(id))
      .filter((b): b is BlockData => b !== undefined)
      .map((block, index) => ({ ...block, order: index }))
    
    set({ blocks: newBlocks, hasUnsavedChanges: true })
    get().saveToHistory()
  },

  setBlocks: (newBlocks) => {
    const normalizedBlocks = newBlocks.map((block, index) => ({
      ...block,
      id: block.id || `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order: block.order !== undefined ? block.order : index,
      content: block.content || {},
      settings: block.settings || {},
    }))
    set({ blocks: normalizedBlocks, hasUnsavedChanges: true })
    get().saveToHistory()
  },

  selectBlock: (blockId) => {
    set({ selectedBlockId: blockId })
  },

  // Memory Actions
  addMemory: (memory) => {
    const newMemory: Memory = {
      ...memory,
      id: `memory-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    set((state) => ({
      memories: [...state.memories, newMemory],
      hasUnsavedChanges: true,
    }))
  },

  updateMemory: (memoryId, updates) => {
    set((state) => ({
      memories: state.memories.map((memory) =>
        memory.id === memoryId ? { ...memory, ...updates } : memory
      ),
      hasUnsavedChanges: true,
    }))
  },

  deleteMemory: (memoryId) => {
    set((state) => ({
      memories: state.memories.filter((memory) => memory.id !== memoryId),
      hasUnsavedChanges: true,
    }))
  },

  // Media Actions
  addMedia: (mediaItem) => {
    set((state) => ({
      media: [...state.media, mediaItem],
      hasUnsavedChanges: true,
    }))
  },

  updateMedia: (mediaId, updates) => {
    set((state) => ({
      media: state.media.map((item) =>
        item.id === mediaId ? { ...item, ...updates } : item
      ),
      hasUnsavedChanges: true,
    }))
  },

  deleteMedia: (mediaId) => {
    set((state) => ({
      media: state.media.filter((item) => item.id !== mediaId),
      hasUnsavedChanges: true,
    }))
  },

  setMedia: (media) => {
    set({ media, hasUnsavedChanges: true })
  },

  // View Actions
  setViewMode: (mode) => set({ viewMode: mode }),
  setDeviceView: (view) => set({ deviceView: view }),

  // UI Actions
  toggleBlockLibrary: () => set((state) => ({ showBlockLibrary: !state.showBlockLibrary })),
  toggleBlockSettings: () => set((state) => ({ showBlockSettings: !state.showBlockSettings })),
  toggleThemePanel: () => set((state) => ({ showThemePanel: !state.showThemePanel })),
  toggleMediaPanel: () => set((state) => ({ showMediaPanel: !state.showMediaPanel })),
  toggleMusicPanel: () => set((state) => ({ showMusicPanel: !state.showMusicPanel })),
  setShowPrivacyModal: (show) => set({ showPrivacyModal: show }),

  // AI Actions
  setShowAIAssistant: (show) => set({ showAIAssistant: show }),
  setAITarget: (target) => set({ aiTarget: target }),
  
  applyAIEnhancement: (blockId, field, value) => {
    set((state) => ({
      blocks: state.blocks.map((block) =>
        block.id === blockId
          ? { ...block, content: { ...block.content, [field]: value } }
          : block
      ),
      showAIAssistant: false,
      aiTarget: null,
      hasUnsavedChanges: true,
    }))
  },

  // Status Actions
  setIsSaving: (saving) => set({ isSaving: saving }),
  markAsChanged: () => set({ hasUnsavedChanges: true }),
  markAsSaved: () => set({ hasUnsavedChanges: false }),

  // Upgrade Modal
  openUpgradeModal: (feature, tier) =>
    set({ upgradeModal: { isOpen: true, feature, requiredTier: tier } }),
  closeUpgradeModal: () =>
    set({ upgradeModal: { isOpen: false, feature: '', requiredTier: 'free' } }),

  // History Actions
  saveToHistory: () => {
    const { blocks, history, historyIndex } = get()
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push([...blocks])
    
    // Keep only last 50 states
    if (newHistory.length > 50) {
      newHistory.shift()
    }
    
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    })
  },

  undo: () => {
    const { history, historyIndex } = get()
    if (historyIndex > 0) {
      set({
        blocks: [...history[historyIndex - 1]],
        historyIndex: historyIndex - 1,
        hasUnsavedChanges: true,
      })
    }
  },

  redo: () => {
    const { history, historyIndex } = get()
    if (historyIndex < history.length - 1) {
      set({
        blocks: [...history[historyIndex + 1]],
        historyIndex: historyIndex + 1,
        hasUnsavedChanges: true,
      })
    }
  },
}))

