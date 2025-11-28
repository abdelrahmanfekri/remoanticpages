'use client'

import React, { useState } from 'react'
import { Plus, Edit3, Trash2 } from 'lucide-react'
import { getTemplateSchema, type TemplateName } from '@/lib/template-schemas'
import { AIInlineAssistant } from '@/components/AIInlineAssistant'
import { UpgradeModal } from '@/components/UpgradeModal'
import type { MediaItem } from '@/components/MediaUploader'
import type { Tier } from '@/lib/tiers'
import { getTierLimits } from '@/lib/tiers'

// Import new modular components
import { QuickSetupScreen } from '@/components/editor/QuickSetupScreen'
import { EditorTopBar } from '@/components/editor/EditorTopBar'
import { EditorSidebar } from '@/components/editor/EditorSidebar'
import { ShareModal } from '@/components/editor/ShareModal'
import { InlineComponentEditor } from '@/components/editor/InlineComponentEditor'
import { ComponentPreview } from '@/components/editor/ComponentPreview'

interface VisualTemplateEditorProps {
  templateId: string
  initialData?: Record<string, unknown>
  onSave: (data: Record<string, unknown>) => void
  onCancel: () => void
  userTier?: Tier
  pageId?: string
}

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

export function VisualTemplateEditor({
  templateId,
  initialData,
  onSave,
  onCancel,
  userTier = 'free',
  pageId,
}: VisualTemplateEditorProps) {
  const schema = getTemplateSchema(templateId as TemplateName)
  
  // Core States
  const [setupStep, setSetupStep] = useState<QuickSetupStep>(initialData ? 'editor' : 'basics')
  const [viewMode, setViewMode] = useState<ViewMode>('edit')
  const [deviceView, setDeviceView] = useState<DeviceView>('desktop')
  const [pageData, setPageData] = useState(initialData || schema?.defaultContent || {})
  const [activeComponents, setActiveComponents] = useState<string[]>(
    schema?.components.filter((c) => c.required).map((c) => c.id) || []
  )
  
  // Quick Setup Data
  const [recipientName, setRecipientName] = useState('')
  const [mainMessage, setMainMessage] = useState('')
  
  // AI & Enhancement States
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [aiTarget, setAITarget] = useState<{ componentId: string; field: string; position: { x: number; y: number } } | null>(null)
  const [editingComponent, setEditingComponent] = useState<string | null>(null)
  
  // Media States
  const [media, setMedia] = useState<MediaItem[]>([])
  const [musicUrl, setMusicUrl] = useState<string | null>(null)
  
  // Style States
  const [customTheme, setCustomTheme] = useState(schema?.theme || { primaryColor: '#f43f5e', secondaryColor: '#ec4899', fontFamily: 'serif' })
  
  // UI States
  const [showStylePanel, setShowStylePanel] = useState(false)
  const [showMediaPanel, setShowMediaPanel] = useState(false)
  const [showComponentsPanel, setShowComponentsPanel] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  
  // Upgrade Modal
  const [upgradeModal, setUpgradeModal] = useState<{
    isOpen: boolean
    feature: string
    requiredTier: Tier
  }>({ isOpen: false, feature: '', requiredTier: 'premium' })
  
  // Memories Management
  const [memories, setMemories] = useState<Memory[]>([])

  const tierLimits = getTierLimits(userTier)

  if (!schema) {
    return <div>Template not found</div>
  }

  // Quick Setup - Get Started
  const handleQuickSetup = () => {
    const heroContent = schema.defaultContent.hero as Record<string, unknown> || {}
    updateComponentData('hero', {
      title: heroContent.title || 'Happy Birthday',
      subtitle: recipientName || 'My Dearest Friend',
    })
    updateComponentData('intro', {
      text: mainMessage || 'Today we celebrate you...',
    })
    setSetupStep('editor')
  }

  const updateComponentData = (componentId: string, data: Record<string, unknown>) => {
    setPageData({
      ...pageData,
      [componentId]: {
        ...(typeof pageData[componentId] === 'object' && pageData[componentId] !== null ? pageData[componentId] as Record<string, unknown> : {}),
        ...data,
      },
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    const finalData = {
      templateId,
      components: activeComponents,
      content: pageData,
      theme: customTheme,
      media,
      musicUrl,
      memories,
    }
    
    try {
      await onSave(finalData)
      setShareUrl(`${window.location.origin}/p/${pageId || 'new-page'}`)
      setShowShareModal(true)
    } catch (error) {
      console.error('Save failed:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const openAIEnhancement = (componentId: string, field: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.bottom + 10,
    }
    setAITarget({ componentId, field, position })
    setShowAIAssistant(true)
  }

  const applyAIEnhancement = (enhancedText: string) => {
    if (aiTarget) {
      updateComponentData(aiTarget.componentId, {
        [aiTarget.field]: enhancedText,
      })
      setShowAIAssistant(false)
    }
  }

  const handleUpgradeRequired = (feature: string, tier: Tier) => {
    setUpgradeModal({ isOpen: true, feature, requiredTier: tier })
  }

  const toggleComponent = (componentId: string) => {
    if (activeComponents.includes(componentId)) {
      const component = schema.components.find((c) => c.id === componentId)
      if (!component?.required) {
        setActiveComponents(activeComponents.filter((id) => id !== componentId))
      }
    } else {
      setActiveComponents([...activeComponents, componentId])
    }
  }

  const addMemory = () => {
    const newMemory: Memory = {
      id: `memory-${Date.now()}`,
      title: '',
      date: '',
      description: '',
      order: memories.length,
    }
    setMemories([...memories, newMemory])
  }

  const updateMemory = (index: number, data: Partial<Memory>) => {
    const updated = [...memories]
    updated[index] = { ...updated[index], ...data }
    setMemories(updated)
  }

  const deleteMemory = (index: number) => {
    setMemories(memories.filter((_, i) => i !== index))
  }

  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl)
  }

  // Device view widths
  const deviceWidths = {
    desktop: 'w-full',
    tablet: 'max-w-3xl',
    mobile: 'max-w-sm',
  }

  // Quick Setup Screen
  if (setupStep === 'basics') {
    return (
      <QuickSetupScreen
        templateName={schema.templateName}
        recipientName={recipientName}
        mainMessage={mainMessage}
        onRecipientNameChange={setRecipientName}
        onMainMessageChange={setMainMessage}
        onCancel={onCancel}
        onContinue={handleQuickSetup}
      />
    )
  }

  // Main Editor View
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Toolbar */}
      <EditorTopBar
        templateName={schema.templateName}
        recipientName={recipientName}
        viewMode={viewMode}
        deviceView={deviceView}
        isSaving={isSaving}
        onBack={onCancel}
        onViewModeChange={setViewMode}
        onDeviceViewChange={setDeviceView}
        onSave={handleSave}
      />

      <div className="flex">
        {/* Left Sidebar - Edit Tools (Only in Edit Mode) */}
        {viewMode === 'edit' && (
          <EditorSidebar
            components={schema.components}
            activeComponents={activeComponents}
            showComponentsPanel={showComponentsPanel}
            showMediaPanel={showMediaPanel}
            showStylePanel={showStylePanel}
            editingComponent={editingComponent}
            customTheme={customTheme}
            media={media}
            musicUrl={musicUrl}
            userTier={userTier}
            tierLimits={tierLimits}
            pageId={pageId}
            onToggleComponentsPanel={() => setShowComponentsPanel(!showComponentsPanel)}
            onToggleMediaPanel={() => setShowMediaPanel(!showMediaPanel)}
            onToggleStylePanel={() => setShowStylePanel(!showStylePanel)}
            onToggleComponent={toggleComponent}
            onEditComponent={setEditingComponent}
            onThemeChange={setCustomTheme}
            onMediaChange={setMedia}
            onMusicChange={setMusicUrl}
            onUpgradeRequired={handleUpgradeRequired}
          />
        )}

        {/* Main Canvas */}
        <div className="flex-1 overflow-y-auto h-[calc(100vh-73px)]">
          <div className="flex justify-center p-4 sm:p-6">
            <div
              className={`transition-all duration-300 ${deviceWidths[deviceView]} ${
                viewMode === 'preview' ? 'shadow-2xl' : ''
              }`}
            >
              <div className="bg-white rounded-lg overflow-hidden">
                {/* Render Components */}
                <div style={{ fontFamily: customTheme.fontFamily }}>
                  {activeComponents
                    .sort(
                      (a, b) =>
                        (schema.components.find((c) => c.id === a)?.order || 0) -
                        (schema.components.find((c) => c.id === b)?.order || 0)
                    )
                    .map((componentId) => {
                      const component = schema.components.find((c) => c.id === componentId)
                      if (!component) return null

                      return (
                        <div
                          key={componentId}
                          id={`component-${componentId}`}
                          className={`relative group ${
                            viewMode === 'edit' ? 'hover:ring-2 hover:ring-rose-400' : ''
                          }`}
                        >
                          {/* Edit Overlay */}
                          {viewMode === 'edit' && (
                            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg p-2">
                                <button
                                  onClick={() => setEditingComponent(componentId)}
                                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit3 size={16} />
                                </button>
                                {!component.required && (
                                  <button
                                    onClick={() => toggleComponent(componentId)}
                                    className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                    title="Remove"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Render Component with Inline Editing */}
                          {viewMode === 'edit' && editingComponent === componentId ? (
                            <InlineComponentEditor
                              component={component}
                              data={pageData[componentId] as Record<string, unknown>}
                              onUpdate={(data) => updateComponentData(componentId, data)}
                              onAIEnhance={(field, event) =>
                                openAIEnhancement(componentId, field, event)
                              }
                              theme={customTheme}
                              memories={memories}
                              onAddMemory={addMemory}
                              onUpdateMemory={updateMemory}
                              onDeleteMemory={deleteMemory}
                              onClose={() => setEditingComponent(null)}
                            />
                          ) : (
                            <ComponentPreview
                              component={component}
                              data={pageData[componentId] as Record<string, unknown>}
                              theme={customTheme}
                              media={media}
                              memories={memories}
                              musicUrl={musicUrl}
                            />
                          )}
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      {viewMode === 'edit' && (
        <button
          onClick={() => setShowComponentsPanel(!showComponentsPanel)}
          className="lg:hidden fixed bottom-6 right-6 z-40 bg-gradient-to-r from-rose-500 to-pink-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
        >
          <Plus size={24} />
        </button>
      )}

      {/* AI Inline Assistant */}
      {showAIAssistant && aiTarget && (
        <AIInlineAssistant
          text={(pageData[aiTarget.componentId] as Record<string, unknown>)?.[aiTarget.field] as string || ''}
          onApply={applyAIEnhancement}
          onClose={() => setShowAIAssistant(false)}
          position={aiTarget.position}
          recipientName={recipientName}
          occasion={schema.category}
        />
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModal.isOpen}
        onClose={() => setUpgradeModal({ ...upgradeModal, isOpen: false })}
        feature={upgradeModal.feature}
        requiredTier={upgradeModal.requiredTier}
        currentTier={userTier}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        shareUrl={shareUrl}
        onClose={() => setShowShareModal(false)}
        onCopyUrl={copyShareUrl}
      />
    </div>
  )
}
