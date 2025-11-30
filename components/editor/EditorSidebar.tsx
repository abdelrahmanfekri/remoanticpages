'use client'

import React from 'react'
import { Plus, Palette, Image, Music } from 'lucide-react'

interface EditorSidebarProps {
  onToggleBlockLibrary: () => void
  onToggleTheme: () => void
  onToggleMedia: () => void
  onToggleMusic: () => void
  showBlockLibrary: boolean
  showThemePanel: boolean
  showMediaPanel: boolean
  showMusicPanel: boolean
}

export function EditorSidebar({
  onToggleBlockLibrary,
  onToggleTheme,
  onToggleMedia,
  onToggleMusic,
  showBlockLibrary,
  showThemePanel,
  showMediaPanel,
  showMusicPanel,
}: EditorSidebarProps) {
  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-2">
      <button
        onClick={onToggleBlockLibrary}
        className={`p-3 rounded-lg transition ${
          showBlockLibrary ? 'bg-rose-100 text-rose-600' : 'hover:bg-gray-100'
        }`}
        title="Add Block"
      >
        <Plus size={24} />
      </button>
      
      <button
        onClick={onToggleTheme}
        className={`p-3 rounded-lg transition ${
          showThemePanel ? 'bg-rose-100 text-rose-600' : 'hover:bg-gray-100'
        }`}
        title="Theme"
      >
        <Palette size={24} />
      </button>
      
      <button
        onClick={onToggleMedia}
        className={`p-3 rounded-lg transition ${
          showMediaPanel ? 'bg-rose-100 text-rose-600' : 'hover:bg-gray-100'
        }`}
        title="Media"
      >
        <Image size={24} />
      </button>
      
      <button
        onClick={onToggleMusic}
        className={`p-3 rounded-lg transition ${
          showMusicPanel ? 'bg-rose-100 text-rose-600' : 'hover:bg-gray-100'
        }`}
        title="Music"
      >
        <Music size={24} />
      </button>
    </div>
  )
}
