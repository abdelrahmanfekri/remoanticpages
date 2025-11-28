'use client'

import { Settings, ImageIcon, Palette, Wand2, ChevronRight, Check } from 'lucide-react'
import { MediaUploader, type MediaItem } from '@/components/MediaUploader'
import { MusicUploader } from '@/components/MusicUploader'
import type { TemplateComponent } from '@/lib/template-schemas'
import type { Tier } from '@/lib/tiers'

interface EditorSidebarProps {
  components: TemplateComponent[]
  activeComponents: string[]
  showComponentsPanel: boolean
  showMediaPanel: boolean
  showStylePanel: boolean
  editingComponent: string | null
  customTheme: { primaryColor: string; secondaryColor: string; fontFamily: string }
  media: MediaItem[]
  musicUrl: string | null
  userTier: Tier
  tierLimits: {
    maxImagesPerPage: number
    maxVideosPerPage: number
    canUseMusic: boolean
  }
  pageId?: string
  onToggleComponentsPanel: () => void
  onToggleMediaPanel: () => void
  onToggleStylePanel: () => void
  onToggleComponent: (componentId: string) => void
  onEditComponent: (componentId: string) => void
  onThemeChange: (theme: { primaryColor: string; secondaryColor: string; fontFamily: string }) => void
  onMediaChange: (media: MediaItem[]) => void
  onMusicChange: (url: string | null) => void
  onUpgradeRequired: (feature: string, tier: Tier) => void
}

export function EditorSidebar({
  components,
  activeComponents,
  showComponentsPanel,
  showMediaPanel,
  showStylePanel,
  editingComponent,
  customTheme,
  media,
  musicUrl,
  userTier,
  tierLimits,
  pageId,
  onToggleComponentsPanel,
  onToggleMediaPanel,
  onToggleStylePanel,
  onToggleComponent,
  onEditComponent,
  onThemeChange,
  onMediaChange,
  onMusicChange,
  onUpgradeRequired,
}: EditorSidebarProps) {
  return (
    <div className="hidden lg:block w-80 bg-white border-r h-[calc(100vh-73px)] overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Quick Actions */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Wand2 size={16} />
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button
              onClick={onToggleComponentsPanel}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg hover:shadow-md transition-all text-left"
            >
              <Settings size={18} className="text-purple-600" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900">Components</div>
                <div className="text-xs text-gray-600">Add/remove sections</div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>

            <button
              onClick={onToggleMediaPanel}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg hover:shadow-md transition-all text-left"
            >
              <ImageIcon size={18} className="text-blue-600" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900">Media</div>
                <div className="text-xs text-gray-600">Photos & music</div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>

            <button
              onClick={onToggleStylePanel}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg hover:shadow-md transition-all text-left"
            >
              <Palette size={18} className="text-orange-600" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900">Style</div>
                <div className="text-xs text-gray-600">Colors & fonts</div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Components Panel */}
        {showComponentsPanel && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Available Sections</h3>
            <div className="space-y-2">
              {components
                .sort((a, b) => a.order - b.order)
                .map((component) => {
                  const isActive = activeComponents.includes(component.id)
                  return (
                    <button
                      key={component.id}
                      onClick={() => onToggleComponent(component.id)}
                      disabled={component.required && isActive}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left text-sm ${
                        isActive
                          ? 'bg-rose-50 border border-rose-300'
                          : 'bg-gray-50 border border-gray-200 hover:border-rose-200'
                      } ${component.required && isActive ? 'opacity-60' : ''}`}
                    >
                      <span className="text-xl">{component.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {component.label}
                        </div>
                        {component.required && (
                          <div className="text-xs text-gray-500">Required</div>
                        )}
                      </div>
                      {isActive && <Check size={14} className="text-green-600" />}
                    </button>
                  )
                })}
            </div>
          </div>
        )}

        {/* Media Panel */}
        {showMediaPanel && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Media Library</h3>
            <div className="space-y-4">
              <MediaUploader
                pageId={pageId}
                media={media}
                onChange={onMediaChange}
                userTier={userTier}
                maxImages={tierLimits.maxImagesPerPage}
                maxVideos={tierLimits.maxVideosPerPage}
                onUpgradeRequired={onUpgradeRequired}
              />
              <MusicUploader
                pageId={pageId}
                musicUrl={musicUrl}
                onChange={onMusicChange}
                userTier={userTier}
                canUseMusic={tierLimits.canUseMusic}
                onUpgradeRequired={onUpgradeRequired}
              />
            </div>
          </div>
        )}

        {/* Style Panel */}
        {showStylePanel && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Theme Customization</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customTheme.primaryColor}
                    onChange={(e) =>
                      onThemeChange({ ...customTheme, primaryColor: e.target.value })
                    }
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customTheme.primaryColor}
                    onChange={(e) =>
                      onThemeChange({ ...customTheme, primaryColor: e.target.value })
                    }
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customTheme.secondaryColor}
                    onChange={(e) =>
                      onThemeChange({ ...customTheme, secondaryColor: e.target.value })
                    }
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customTheme.secondaryColor}
                    onChange={(e) =>
                      onThemeChange({ ...customTheme, secondaryColor: e.target.value })
                    }
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Font Style
                </label>
                <select
                  value={customTheme.fontFamily}
                  onChange={(e) =>
                    onThemeChange({ ...customTheme, fontFamily: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none"
                >
                  <option value="serif">Serif (Classic)</option>
                  <option value="sans-serif">Sans-serif (Modern)</option>
                  <option value="cursive">Cursive (Romantic)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Active Components List */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Page Structure</h3>
          <div className="space-y-1">
            {activeComponents
              .map((componentId) => {
                const component = components.find((c) => c.id === componentId)
                if (!component) return null
                return (
                  <button
                    key={componentId}
                    onClick={() => {
                      onEditComponent(componentId)
                      document.getElementById(`component-${componentId}`)?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                      })
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-all ${
                      editingComponent === componentId
                        ? 'bg-rose-100 border border-rose-300'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{component.icon}</span>
                    <span className="flex-1 font-medium text-gray-700">
                      {component.label}
                    </span>
                  </button>
                )
              })
              .filter(Boolean)}
          </div>
        </div>
      </div>
    </div>
  )
}

