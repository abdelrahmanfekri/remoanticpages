'use client'

import React from 'react'
import { Save, X, Eye, Edit3, Monitor, Tablet, Smartphone } from 'lucide-react'

interface EditorTopBarProps {
  title: string
  onTitleChange: (title: string) => void
  viewMode: 'edit' | 'preview'
  deviceView: 'desktop' | 'tablet' | 'mobile'
  isSaving: boolean
  hasUnsavedChanges: boolean
  onViewModeChange: (mode: 'edit' | 'preview') => void
  onDeviceViewChange: (view: 'desktop' | 'tablet' | 'mobile') => void
  onSave: () => void
  onCancel: () => void
}

export function EditorTopBar({
  title,
  onTitleChange,
  viewMode,
  deviceView,
  isSaving,
  hasUnsavedChanges,
  onViewModeChange,
  onDeviceViewChange,
  onSave,
  onCancel,
}: EditorTopBarProps) {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          title="Back"
        >
          <X size={20} />
        </button>
        
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Page Title"
          className="text-lg font-semibold border-none outline-none focus:ring-2 focus:ring-rose-500 rounded px-2"
        />
        
        {hasUnsavedChanges && (
          <span className="text-xs text-gray-500">● Unsaved changes</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* View Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('edit')}
            className={`px-3 py-1 rounded-md transition flex items-center gap-2 ${
              viewMode === 'edit' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Edit3 size={16} />
            Edit
          </button>
          <button
            onClick={() => onViewModeChange('preview')}
            className={`px-3 py-1 rounded-md transition flex items-center gap-2 ${
              viewMode === 'preview' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Eye size={16} />
            Preview
          </button>
        </div>

        {/* Device View Toggle */}
        {viewMode === 'preview' && (
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onDeviceViewChange('desktop')}
              className={`p-2 rounded-md transition ${
                deviceView === 'desktop' ? 'bg-white shadow-sm' : ''
              }`}
              title="Desktop"
            >
              <Monitor size={16} />
            </button>
            <button
              onClick={() => onDeviceViewChange('tablet')}
              className={`p-2 rounded-md transition ${
                deviceView === 'tablet' ? 'bg-white shadow-sm' : ''
              }`}
              title="Tablet"
            >
              <Tablet size={16} />
            </button>
            <button
              onClick={() => onDeviceViewChange('mobile')}
              className={`p-2 rounded-md transition ${
                deviceView === 'mobile' ? 'bg-white shadow-sm' : ''
              }`}
              title="Mobile"
            >
              <Smartphone size={16} />
            </button>
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={16} />
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}
