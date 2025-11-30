'use client'

import React from 'react'
import { X } from 'lucide-react'
import type { PageTheme } from '@/types'

interface ThemePanelProps {
  theme: PageTheme
  onUpdate: (theme: Partial<PageTheme>) => void
  onClose: () => void
}

const FONT_FAMILIES = [
  { value: 'serif', label: 'Serif' },
  { value: 'sans-serif', label: 'Sans Serif' },
  { value: 'monospace', label: 'Monospace' },
]

const PRESET_PALETTES = [
  { name: 'Romantic', primary: '#f43f5e', secondary: '#ec4899' },
  { name: 'Ocean', primary: '#0ea5e9', secondary: '#06b6d4' },
  { name: 'Forest', primary: '#10b981', secondary: '#22c55e' },
  { name: 'Sunset', primary: '#f59e0b', secondary: '#f97316' },
  { name: 'Purple', primary: '#a855f7', secondary: '#ec4899' },
  { name: 'Dark', primary: '#1f2937', secondary: '#4b5563' },
]

export function ThemePanel({ theme, onUpdate, onClose }: ThemePanelProps) {
  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Theme</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X size={20} />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Preset Palettes */}
        <div>
          <h3 className="font-semibold mb-3">Color Palettes</h3>
          <div className="grid grid-cols-2 gap-2">
            {PRESET_PALETTES.map((palette) => (
              <button
                key={palette.name}
                onClick={() => onUpdate({ primaryColor: palette.primary, secondaryColor: palette.secondary })}
                className="p-3 rounded-lg border-2 border-gray-200 hover:border-rose-500 transition"
              >
                <div className="flex gap-1 mb-2">
                  <div className="flex-1 h-8 rounded" style={{ backgroundColor: palette.primary }} />
                  <div className="flex-1 h-8 rounded" style={{ backgroundColor: palette.secondary }} />
                </div>
                <p className="text-xs text-center">{palette.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div>
          <h3 className="font-semibold mb-3">Custom Colors</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2">Primary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => onUpdate({ primaryColor: e.target.value })}
                  className="w-16 h-10 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.primaryColor}
                  onChange={(e) => onUpdate({ primaryColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Secondary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.secondaryColor}
                  onChange={(e) => onUpdate({ secondaryColor: e.target.value })}
                  className="w-16 h-10 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.secondaryColor}
                  onChange={(e) => onUpdate({ secondaryColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Font Family */}
        <div>
          <h3 className="font-semibold mb-3">Typography</h3>
          <label className="block text-sm font-medium mb-2">Font Family</label>
          <select
            value={theme.fontFamily}
            onChange={(e) => onUpdate({ fontFamily: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            {FONT_FAMILIES.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

