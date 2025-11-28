'use client'

import { ArrowLeft, Edit3, Eye, Save, Monitor, Tablet, Smartphone, Loader2 } from 'lucide-react'

type ViewMode = 'edit' | 'preview'
type DeviceView = 'desktop' | 'tablet' | 'mobile'

interface EditorTopBarProps {
  templateName: string
  recipientName: string
  viewMode: ViewMode
  deviceView: DeviceView
  isSaving: boolean
  onBack: () => void
  onViewModeChange: (mode: ViewMode) => void
  onDeviceViewChange: (device: DeviceView) => void
  onSave: () => void
}

export function EditorTopBar({
  templateName,
  recipientName,
  viewMode,
  deviceView,
  isSaving,
  onBack,
  onViewModeChange,
  onDeviceViewChange,
  onSave,
}: EditorTopBarProps) {
  return (
    <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Back & Template Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold text-gray-900">{templateName}</div>
              <div className="text-xs text-gray-500">
                {recipientName || 'Untitled Page'}
              </div>
            </div>
          </div>

          {/* Center: View Mode Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('edit')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-sm font-medium ${
                  viewMode === 'edit'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Edit3 size={16} />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button
                onClick={() => onViewModeChange('preview')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-sm font-medium ${
                  viewMode === 'preview'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Eye size={16} />
                <span className="hidden sm:inline">Preview</span>
              </button>
            </div>

            {/* Device View Toggle - Only in Preview */}
            {viewMode === 'preview' && (
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => onDeviceViewChange('desktop')}
                  className={`p-2 rounded-md transition-all ${
                    deviceView === 'desktop' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                  title="Desktop View"
                >
                  <Monitor size={16} />
                </button>
                <button
                  onClick={() => onDeviceViewChange('tablet')}
                  className={`p-2 rounded-md transition-all ${
                    deviceView === 'tablet' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                  title="Tablet View"
                >
                  <Tablet size={16} />
                </button>
                <button
                  onClick={() => onDeviceViewChange('mobile')}
                  className={`p-2 rounded-md transition-all ${
                    deviceView === 'mobile' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                  title="Mobile View"
                >
                  <Smartphone size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Right: Save Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span className="hidden sm:inline">Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span className="hidden sm:inline">Save & Publish</span>
                  <span className="sm:hidden">Save</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

