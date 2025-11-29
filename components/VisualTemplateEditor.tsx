'use client'

import React, { useEffect } from 'react'
import { Plus, Edit3, Trash2, X, Image as ImageIcon, Music } from 'lucide-react'
import { getTemplateSchema, type TemplateName } from '@/lib/template-schemas'
import { AIInlineAssistant } from '@/components/AIInlineAssistant'
import { UpgradeModal } from '@/components/UpgradeModal'
import { MediaUploader } from '@/components/MediaUploader'
import { MusicUploader } from '@/components/MusicUploader'
import type { Tier } from '@/lib/tiers'
import { getTierLimits } from '@/lib/tiers'
import { useEditorStore } from '@/lib/stores/editor-store'

// Import editor components
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

export function VisualTemplateEditor({
  templateId,
  initialData,
  onSave,
  onCancel,
  userTier = 'free',
  pageId,
}: VisualTemplateEditorProps) {
  const schema = getTemplateSchema(templateId as TemplateName)
  const tierLimits = getTierLimits(userTier)

  const {
    // Core States
    setupStep,
    viewMode,
    deviceView,
    pageData,
    activeComponents,
    recipientName,
    mainMessage,
    showAIAssistant,
    aiTarget,
    editingComponent,
    editingField,
    media,
    musicUrl,
    customTheme,
    showStylePanel,
    showMediaPanel,
    showMusicPanel,
    showComponentsPanel,
    isSaving,
    showShareModal,
    shareUrl,
    upgradeModal,
    memories,
    // Actions
    setSetupStep,
    setViewMode,
    setDeviceView,
    setPageData,
    setActiveComponents,
    setRecipientName,
    setMainMessage,
    setShowAIAssistant,
    setAITarget,
    setEditingComponent,
    setEditingField,
    applyAIEnhancement,
    setMedia,
    setMusicUrl,
    setCustomTheme,
    setShowStylePanel,
    setShowMediaPanel,
    setShowMusicPanel,
    setShowComponentsPanel,
    setIsSaving,
    setShowShareModal,
    setShareUrl,
    openUpgradeModal,
    closeUpgradeModal,
    addMemory,
    updateMemory,
    deleteMemory,
    toggleComponent: toggleComponentStore,
    initializeEditor,
    updateComponentData,
  } = useEditorStore()

  // Initialize editor on mount
  useEffect(() => {
    if (schema) {
      const defaultActiveComponents = schema.components
        .filter((c) => c.required)
        .map((c) => c.id)

      const initData = {
        pageData: initialData || {},
        activeComponents: defaultActiveComponents,
        customTheme: {
          primaryColor: '#f43f5e',
          secondaryColor: '#ec4899',
          fontFamily: 'serif',
        },
        media: [],
        musicUrl: null,
        memories: [],
        recipientName: '',
        mainMessage: '',
      }

      initializeEditor(initData)
    }
  }, [schema, initialData, initializeEditor])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const saveData = {
        templateId,
        components: schema?.components
          .filter((c) => activeComponents.includes(c.id))
          .map((c, index) => ({
            id: c.id,
            type: c.type,
            order: index,
            settings: c.settings,
          })),
        content: pageData,
        theme: customTheme,
        media,
        musicUrl,
        memories,
      }

      await onSave(saveData)
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleInlineEdit = (componentId: string, field: string) => {
    setEditingField({ componentId, field })
  }

  const handleInlineSave = (componentId: string, field: string, value: string) => {
    updateComponentData(componentId, { [field]: value })
    setEditingField(null)
  }

  const openAIEnhancement = (
    field: string,
    componentType: string,
    fieldType: 'title' | 'message' | 'text',
    event: React.MouseEvent
  ) => {
    const componentId = editingComponent || activeComponents[0] || ''
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    setAITarget({
      componentId,
      field,
      componentType,
      fieldType,
      position: { x: rect.left + rect.width / 2, y: rect.bottom + 10 },
    })
    setShowAIAssistant(true)
  }

  const handleUpgradeRequired = (feature: string, tier: Tier) => {
    openUpgradeModal(feature, tier)
  }

  const toggleComponent = (componentId: string) => {
    const component = schema?.components.find((c) => c.id === componentId)
    toggleComponentStore(componentId, component?.required || false)
  }

  if (!schema) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Template not found</p>
        </div>
      </div>
    )
  }

  // Show quick setup screen if in basics step
  if (setupStep === 'basics') {
    return (
      <QuickSetupScreen
        templateName={schema.templateName}
        recipientName={recipientName}
        mainMessage={mainMessage}
        onRecipientNameChange={setRecipientName}
        onMainMessageChange={setMainMessage}
        onCancel={onCancel}
        onContinue={() => setSetupStep('editor')}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
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

      <div className="flex flex-col lg:flex-row">
        {/* Left Sidebar - Edit Tools (Only in Edit Mode) */}
        {viewMode === 'edit' && (
          <EditorSidebar
            components={schema.components}
            activeComponents={activeComponents}
            showComponentsPanel={showComponentsPanel}
            showMediaPanel={showMediaPanel}
            showMusicPanel={showMusicPanel}
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
            onToggleMusicPanel={() => setShowMusicPanel(!showMusicPanel)}
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
              className={`transition-all duration-300 ${
                viewMode === 'preview' && deviceView === 'mobile'
                  ? 'max-w-sm'
                  : viewMode === 'preview' && deviceView === 'tablet'
                  ? 'max-w-3xl'
                  : 'w-full'
              } ${viewMode === 'preview' ? 'shadow-2xl' : ''}`}
            >
              <div className="bg-white rounded-lg overflow-hidden">
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
                                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
                                  title="Edit"
                                >
                                  <Edit3 size={16} />
                                </button>
                                {!component.required && (
                                  <button
                                    onClick={() => toggleComponent(componentId)}
                                    className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors touch-manipulation"
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
                              key={`editor-${componentId}`}
                              component={component}
                              data={{ ...(pageData[componentId] as Record<string, unknown> || {}) }}
                              onUpdate={(data) => {
                                updateComponentData(componentId, data)
                              }}
                              onAIEnhance={openAIEnhancement}
                              theme={customTheme}
                              memories={memories}
                              onAddMemory={addMemory}
                              onUpdateMemory={updateMemory}
                              onDeleteMemory={deleteMemory}
                              onClose={() => setEditingComponent(null)}
                            />
                          ) : (
                            <ComponentPreview
                              key={`preview-${componentId}`}
                              component={component}
                              data={{ ...(pageData[componentId] as Record<string, unknown> || {}) }}
                              theme={customTheme}
                              media={media}
                              memories={memories}
                              musicUrl={musicUrl}
                              viewMode={viewMode}
                              editingField={editingField}
                              onInlineEdit={handleInlineEdit}
                              onInlineSave={handleInlineSave}
                              onOpenMediaPanel={component.type === 'photo-gallery' ? () => setShowMediaPanel(true) : undefined}
                              onMediaChange={component.type === 'photo-gallery' ? setMedia : undefined}
                              pageId={component.type === 'photo-gallery' ? pageId : undefined}
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

      {/* Mobile Floating Action Buttons */}
      {viewMode === 'edit' && (
        <div className="lg:hidden fixed bottom-6 right-6 z-40 flex flex-col gap-3">
          <button
            onClick={() => {
              setShowMediaPanel(false)
              setShowMusicPanel(false)
              setShowStylePanel(false)
              setShowComponentsPanel(!showComponentsPanel)
            }}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white p-4 rounded-full shadow-2xl active:scale-95 transition-transform touch-manipulation"
            aria-label="Toggle components"
          >
            <Plus size={24} />
          </button>
          
          {!showComponentsPanel && !showMediaPanel && !showMusicPanel && !showStylePanel && (
            <>
              <button
                onClick={() => {
                  setShowComponentsPanel(false)
                  setShowMusicPanel(false)
                  setShowStylePanel(false)
                  setShowMediaPanel(true)
                }}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-full shadow-xl active:scale-95 transition-transform touch-manipulation"
                aria-label="Upload photos"
                title="Photos & Videos"
              >
                <ImageIcon size={20} />
              </button>
              <button
                onClick={() => {
                  setShowComponentsPanel(false)
                  setShowMediaPanel(false)
                  setShowStylePanel(false)
                  setShowMusicPanel(true)
                }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full shadow-xl active:scale-95 transition-transform touch-manipulation"
                aria-label="Upload music"
                title="Background Music"
              >
                <Music size={20} />
              </button>
            </>
          )}
          
          {(showComponentsPanel || showMediaPanel || showMusicPanel || showStylePanel) && (
            <button
              onClick={() => {
                setShowComponentsPanel(false)
                setShowMediaPanel(false)
                setShowMusicPanel(false)
                setShowStylePanel(false)
              }}
              className="bg-gray-600 text-white p-3 rounded-full shadow-xl active:scale-95 transition-transform touch-manipulation"
              aria-label="Close panels"
            >
              <X size={20} />
            </button>
          )}
        </div>
      )}

      {/* Mobile Bottom Sheet for Panels */}
      {viewMode === 'edit' && (showComponentsPanel || showMediaPanel || showMusicPanel || showStylePanel) && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-white border-t-2 border-gray-200 rounded-t-3xl shadow-2xl max-h-[70vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
            <h3 className="text-lg font-bold text-gray-900">
              {showComponentsPanel && 'Components'}
              {showMediaPanel && 'Photos & Videos'}
              {showMusicPanel && 'Background Music'}
              {showStylePanel && 'Style'}
            </h3>
            <button
              onClick={() => {
                setShowComponentsPanel(false)
                setShowMediaPanel(false)
                setShowMusicPanel(false)
                setShowStylePanel(false)
              }}
              className="p-2 hover:bg-gray-100 rounded-full touch-manipulation"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-4">
            {showComponentsPanel && (
              <div className="space-y-4 pb-4">
                {schema.components.map((component) => {
                  const isActive = activeComponents.includes(component.id)
                  return (
                    <button
                      key={component.id}
                      onClick={() => toggleComponent(component.id)}
                      disabled={component.required}
                      className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all touch-manipulation ${
                        isActive
                          ? 'border-rose-500 bg-rose-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      } ${component.required ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isActive ? 'border-rose-500 bg-rose-500' : 'border-gray-300'
                          }`}
                        >
                          {isActive && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">{component.label || component.id}</div>
                          <div className="text-sm text-gray-500">Component: {component.type}</div>
                        </div>
                      </div>
                      {component.required && (
                        <span className="text-xs text-gray-400">Required</span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
            {showMediaPanel && (
              <div className="space-y-4 pb-4">
                <MediaUploader
                  pageId={pageId}
                  media={media}
                  onChange={setMedia}
                  userTier={userTier}
                  maxImages={tierLimits.maxImagesPerPage}
                  maxVideos={tierLimits.maxVideosPerPage}
                  onUpgradeRequired={handleUpgradeRequired}
                />
              </div>
            )}
            {showMusicPanel && (
              <div className="space-y-4 pb-4">
                <MusicUploader
                  pageId={pageId}
                  musicUrl={musicUrl}
                  onChange={setMusicUrl}
                  userTier={userTier}
                  canUseMusic={tierLimits.canUseMusic}
                  onUpgradeRequired={handleUpgradeRequired}
                />
              </div>
            )}
            {showStylePanel && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customTheme.primaryColor}
                      onChange={(e) =>
                        setCustomTheme({ ...customTheme, primaryColor: e.target.value })
                      }
                      className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer touch-manipulation"
                    />
                    <input
                      type="text"
                      value={customTheme.primaryColor}
                      onChange={(e) =>
                        setCustomTheme({ ...customTheme, primaryColor: e.target.value })
                      }
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customTheme.secondaryColor}
                      onChange={(e) =>
                        setCustomTheme({ ...customTheme, secondaryColor: e.target.value })
                      }
                      className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer touch-manipulation"
                    />
                    <input
                      type="text"
                      value={customTheme.secondaryColor}
                      onChange={(e) =>
                        setCustomTheme({ ...customTheme, secondaryColor: e.target.value })
                      }
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Assistant */}
      {showAIAssistant && aiTarget && (
        <AIInlineAssistant
          text={(pageData[aiTarget.componentId] as Record<string, unknown>)?.[aiTarget.field] as string || ''}
          onApply={applyAIEnhancement}
          onClose={() => setShowAIAssistant(false)}
          position={aiTarget.position}
          recipientName={recipientName}
          componentType={aiTarget.componentType}
          fieldType={aiTarget.fieldType}
        />
      )}

      {/* Upgrade Modal */}
      {upgradeModal.isOpen && (
        <UpgradeModal
          isOpen={upgradeModal.isOpen}
          feature={upgradeModal.feature}
          requiredTier={upgradeModal.requiredTier}
          currentTier={userTier}
          onClose={closeUpgradeModal}
        />
      )}

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          shareUrl={shareUrl}
          onClose={() => setShowShareModal(false)}
          onCopyUrl={() => {
            navigator.clipboard.writeText(shareUrl)
          }}
        />
      )}
    </div>
  )
}

