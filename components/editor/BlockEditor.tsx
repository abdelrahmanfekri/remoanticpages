'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBlockEditorStore } from '@/lib/stores/block-editor-store'
import { BlockRenderer } from '@/components/blocks'
import type { Tier } from '@/lib/tiers'
import type { BlockData, PageTheme, PageSettings } from '@/types'

// Sub-components
import { EditorTopBar } from './EditorTopBar'
import { EditorSidebar } from './EditorSidebar'
import { BlockLibraryPanel } from './BlockLibraryPanel'
import { BlockSettingsPanel } from './BlockSettingsPanel'
import { ThemePanel } from './ThemePanel'
import { MediaPanel, MusicPanel } from './MediaPanels'
import { PrivacyModal } from '@/components/PrivacyModal'
import { UpgradeModal } from '@/components/UpgradeModal'
import { AIInlineAssistant } from '@/components/AIInlineAssistant'

interface BlockEditorProps {
  pageId?: string
  initialData?: {
    title?: string
    recipientName?: string
    theme?: PageTheme
    settings?: Partial<PageSettings>
    blocks?: BlockData[]
    memories?: Array<any>
    media?: Array<any>
  }
  onSave: (data: any) => Promise<void>
  onCancel: () => void
  userTier?: Tier
}

export function BlockEditor({
  pageId,
  initialData,
  onSave,
  onCancel,
  userTier = 'free',
}: BlockEditorProps) {
  const router = useRouter()
  
  const {
    // State
    title,
    recipientName,
    theme,
    settings,
    blocks,
    memories,
    media,
    viewMode,
    deviceView,
    selectedBlockId,
    showBlockLibrary,
    showBlockSettings,
    showThemePanel,
    showMediaPanel,
    showMusicPanel,
    showPrivacyModal,
    showAIAssistant,
    aiTarget,
    isSaving,
    hasUnsavedChanges,
    upgradeModal,
    
    // Actions
    initializeEditor,
    setTitle,
    setRecipientName,
    setTheme,
    setSettings,
    addBlock,
    updateBlock,
    deleteBlock,
    duplicateBlock,
    moveBlock,
    selectBlock,
    setViewMode,
    setDeviceView,
    toggleBlockLibrary,
    toggleBlockSettings,
    toggleThemePanel,
    toggleMediaPanel,
    toggleMusicPanel,
    setShowPrivacyModal,
    setShowAIAssistant,
    setAITarget,
    applyAIEnhancement,
    setIsSaving,
    markAsSaved,
    openUpgradeModal,
    closeUpgradeModal,
  } = useBlockEditorStore()

  // Initialize editor
  useEffect(() => {
    initializeEditor({
      pageId,
      ...initialData,
    })
  }, [pageId, initialData, initializeEditor])

  // Save handler
  const handleSave = async () => {
    setShowPrivacyModal(true)
  }

  const handlePrivacyConfirm = async (isPrivate: boolean, password: string) => {
    setShowPrivacyModal(false)
    setIsSaving(true)
    
    try {
      await onSave({
        title,
        recipientName,
        theme,
        settings: {
          ...settings,
          isPublic: !isPrivate,
        },
        blocks,
        memories,
        media,
        password: isPrivate ? password : null,
      })
      
      markAsSaved()
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save page')
    } finally {
      setIsSaving(false)
    }
  }

  // Create mock page data for BlockRenderer
  const mockPage = {
    id: pageId || 'temp',
    user_id: 'temp',
    slug: 'temp',
    title: title || 'Untitled',
    recipient_name: recipientName,
    template_id: null,
    theme,
    settings,
    tier_used: userTier,
    view_count: 0,
    share_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    blocks: blocks.map(b => ({
      id: b.id,
      page_id: pageId || 'temp',
      type: b.type,
      display_order: b.order,
      content: b.content,
      settings: b.settings,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })),
    memories: memories.map(m => ({
      ...m,
      page_id: pageId || 'temp',
      metadata: {},
      created_at: new Date().toISOString(),
    })),
    media: media.map(m => ({
      ...m,
      page_id: pageId || 'temp',
      metadata: {},
      created_at: new Date().toISOString(),
    })),
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <EditorTopBar
        title={title}
        onTitleChange={setTitle}
        viewMode={viewMode}
        deviceView={deviceView}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        onViewModeChange={setViewMode}
        onDeviceViewChange={setDeviceView}
        onSave={handleSave}
        onCancel={onCancel}
      />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar - Only in Edit Mode */}
        {viewMode === 'edit' && (
          <EditorSidebar
            onToggleBlockLibrary={toggleBlockLibrary}
            onToggleTheme={toggleThemePanel}
            onToggleMedia={toggleMediaPanel}
            onToggleMusic={toggleMusicPanel}
            showBlockLibrary={showBlockLibrary}
            showThemePanel={showThemePanel}
            showMediaPanel={showMediaPanel}
            showMusicPanel={showMusicPanel}
          />
        )}

        {/* Main Canvas */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex justify-center p-6">
            <div
              className={`transition-all duration-300 ${
                deviceView === 'mobile' ? 'max-w-sm' :
                deviceView === 'tablet' ? 'max-w-3xl' :
                'w-full max-w-5xl'
              }`}
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                <BlockRenderer
                  page={mockPage as any}
                  editable={viewMode === 'edit'}
                  onBlockClick={(blockId) => {
                    selectBlock(blockId)
                    toggleBlockSettings()
                  }}
                  onBlockUpdate={(blockId, content, settings) => {
                    updateBlock(blockId, { content: content as any, settings: settings as any })
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panels */}
        {viewMode === 'edit' && (
          <>
            {showBlockLibrary && (
              <BlockLibraryPanel
                onAddBlock={(block) => {
                  addBlock(block)
                  toggleBlockLibrary()
                }}
                onClose={toggleBlockLibrary}
                userTier={userTier}
                onUpgradeRequired={openUpgradeModal}
              />
            )}
            
            {showBlockSettings && selectedBlockId && (
              <BlockSettingsPanel
                block={blocks.find(b => b.id === selectedBlockId)!}
                onUpdate={(updates) => updateBlock(selectedBlockId, updates)}
                onDelete={() => {
                  deleteBlock(selectedBlockId)
                  toggleBlockSettings()
                }}
                onDuplicate={() => duplicateBlock(selectedBlockId)}
                onMoveUp={() => moveBlock(selectedBlockId, 'up')}
                onMoveDown={() => moveBlock(selectedBlockId, 'down')}
                onClose={toggleBlockSettings}
              />
            )}
            
            {showThemePanel && (
              <ThemePanel
                theme={theme}
                onUpdate={setTheme}
                onClose={toggleThemePanel}
              />
            )}
            
            {showMediaPanel && (
              <MediaPanel
                media={media}
                onUpdate={setSettings}
                onClose={toggleMediaPanel}
                userTier={userTier}
                pageId={pageId}
              />
            )}
            
            {showMusicPanel && (
              <MusicPanel
                musicUrl={settings.musicUrl || null}
                onUpdate={(url) => setSettings({ musicUrl: url })}
                onClose={toggleMusicPanel}
                userTier={userTier}
                pageId={pageId}
              />
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showPrivacyModal && (
        <PrivacyModal
          isOpen={showPrivacyModal}
          onClose={() => setShowPrivacyModal(false)}
          onConfirm={handlePrivacyConfirm}
          defaultIsPrivate={!settings.isPublic}
        />
      )}

      {upgradeModal.isOpen && (
        <UpgradeModal
          isOpen={upgradeModal.isOpen}
          feature={upgradeModal.feature}
          requiredTier={upgradeModal.requiredTier}
          currentTier={userTier}
          onClose={closeUpgradeModal}
        />
      )}

      {showAIAssistant && aiTarget && (
        <AIInlineAssistant
          text={(() => {
            const block = blocks.find(b => b.id === aiTarget.blockId)
            return block?.content[aiTarget.field] as string || ''
          })()}
          onApply={(enhanced) => {
            applyAIEnhancement(aiTarget.blockId, aiTarget.field, enhanced)
          }}
          onClose={() => setShowAIAssistant(false)}
          position={aiTarget.position}
          recipientName={recipientName}
          componentType="block"
          fieldType={aiTarget.fieldType === 'longtext' ? 'text' : aiTarget.fieldType}
        />
      )}
    </div>
  )
}

