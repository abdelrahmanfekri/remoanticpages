'use client'

import React from 'react'
import { X, Crown } from 'lucide-react'
import { getAllBlocks } from '@/lib/blocks'
import type { BlockData } from '@/types'
import type { Tier } from '@/lib/tiers'

interface BlockLibraryPanelProps {
  onAddBlock: (block: Omit<BlockData, 'id' | 'order'>) => void
  onClose: () => void
  userTier: Tier
  onUpgradeRequired: (feature: string, tier: Tier) => void
}

export function BlockLibraryPanel({
  onAddBlock,
  onClose,
  userTier,
  onUpgradeRequired,
}: BlockLibraryPanelProps) {
  const blocks = getAllBlocks()

  const handleAddBlock = (blockDef: any) => {
    if (blockDef.isPremium && userTier === 'free') {
      onUpgradeRequired(`${blockDef.label} block`, 'pro')
      return
    }

    onAddBlock({
      type: blockDef.type,
      content: blockDef.defaultContent,
      settings: blockDef.defaultSettings,
    })
  }

  const categories = [
    { id: 'content', label: 'Content' },
    { id: 'media', label: 'Media' },
    { id: 'layout', label: 'Layout' },
    { id: 'interactive', label: 'Interactive' },
  ]

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Add Block</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X size={20} />
        </button>
      </div>

      <div className="p-4">
        {categories.map((category) => {
          const categoryBlocks = blocks.filter((b) => b.category === category.id)
          
          if (categoryBlocks.length === 0) return null

          return (
            <div key={category.id} className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                {category.label}
              </h3>
              
              <div className="space-y-2">
                {categoryBlocks.map((block) => (
                  <button
                    key={block.type}
                    onClick={() => handleAddBlock(block)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-rose-500 hover:bg-rose-50 transition text-left"
                  >
                    <span className="text-2xl">{block.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold flex items-center gap-2">
                        {block.label}
                        {block.isPremium && <Crown size={14} className="text-yellow-500" />}
                      </div>
                      <p className="text-xs text-gray-500">{block.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

