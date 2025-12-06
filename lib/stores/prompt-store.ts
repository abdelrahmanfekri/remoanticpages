import { create } from 'zustand'
import { getCurrentSubscription } from '@/lib/actions/subscriptions'
import type { Tier } from '@/lib/tiers'

export interface MediaPreferences {
  music: boolean
  photos: boolean
  videos: boolean
}

interface PromptStoreState {
  // Step management
  currentStep: 1 | 2
  isGenerating: boolean
  
  // Form data
  occasion: string | null
  prompt: string
  recipientName: string | null
  mediaPreferences: MediaPreferences
  
  // User data
  userTier: Tier
  
  // Status
  isLoading: boolean
  error: string | null
}

interface PromptStoreActions {
  // Step management
  setCurrentStep: (step: 1 | 2) => void
  nextStep: () => void
  previousStep: () => void
  
  // Form data
  setOccasion: (occasion: string | null) => void
  setPrompt: (prompt: string) => void
  setRecipientName: (name: string | null) => void
  setMediaPreferences: (preferences: MediaPreferences) => void
  updateMediaPreference: (key: keyof MediaPreferences, value: boolean) => void
  
  // Generation
  startGeneration: () => void
  stopGeneration: () => void
  
  // User data
  loadUserTier: () => Promise<void>
  
  // Reset
  reset: () => void
  resetForm: () => void
}

type PromptStore = PromptStoreState & PromptStoreActions

const initialState: PromptStoreState = {
  currentStep: 1,
  isGenerating: false,
  occasion: null,
  prompt: '',
  recipientName: null,
  mediaPreferences: {
    music: false,
    photos: false,
    videos: false,
  },
  userTier: 'free',
  isLoading: false,
  error: null,
}

export const usePromptStore = create<PromptStore>((set, get) => ({
  ...initialState,

  // Step management
  setCurrentStep: (step) => {
    set({ currentStep: step })
  },

  nextStep: () => {
    const { currentStep } = get()
    if (currentStep < 2) {
      set({ currentStep: (currentStep + 1) as 1 | 2 })
    }
  },

  previousStep: () => {
    const { currentStep } = get()
    if (currentStep > 1) {
      set({ currentStep: (currentStep - 1) as 1 | 2 })
      if (currentStep === 2) {
        // Clear prompt when going back from step 2
        set({ prompt: '' })
      }
    }
  },

  // Form data
  setOccasion: (occasion) => {
    set({ occasion })
    // Auto-advance to next step after selecting occasion
    setTimeout(() => {
      get().nextStep()
    }, 300)
  },

  setPrompt: (prompt) => {
    set({ prompt })
  },

  setRecipientName: (name) => {
    set({ recipientName: name })
  },

  setMediaPreferences: (preferences) => {
    set({ mediaPreferences: preferences })
  },

  updateMediaPreference: (key, value) => {
    const { mediaPreferences } = get()
    set({
      mediaPreferences: {
        ...mediaPreferences,
        [key]: value,
      },
    })
  },

  // Generation
  startGeneration: () => {
    set({ isGenerating: true })
  },

  stopGeneration: () => {
    set({ isGenerating: false })
  },

  // User data
  loadUserTier: async () => {
    set({ isLoading: true, error: null })
    try {
      const subscription = await getCurrentSubscription()
      set({ userTier: subscription.tier || 'free', isLoading: false })
    } catch (error) {
      console.error('Failed to load user tier:', error)
      set({ error: 'Failed to load user data', isLoading: false })
    }
  },

  // Reset
  reset: () => {
    set(initialState)
  },

  resetForm: () => {
    set({
      currentStep: 1,
      occasion: null,
      prompt: '',
      recipientName: null,
      mediaPreferences: {
        music: false,
        photos: false,
        videos: false,
      },
      isGenerating: false,
      error: null,
    })
  },
}))

