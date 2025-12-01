'use client'

import React, { useState } from 'react'
import { X, Trash2, Copy, ArrowUp, ArrowDown } from 'lucide-react'
import { getBlockDefinition } from '@/lib/blocks'
import { InlineAIEnhancer } from './InlineAIEnhancer'
import { QuickAIActions } from './QuickAIActions'
import { AIBlockAssistant } from '@/components/ai/core'
import type { BlockData } from '@/types'

interface BlockSettingsPanelProps {
  block: BlockData
  onUpdate: (updates: Partial<BlockData>) => void
  onDelete: () => void
  onDuplicate: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onClose: () => void
  context?: {
    pageTitle?: string
    recipientName?: string
    occasion?: string
    tone?: 'formal' | 'casual' | 'romantic' | 'playful'
  }
}

export function BlockSettingsPanel({
  block,
  onUpdate,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onClose,
  context,
}: BlockSettingsPanelProps) {
  const definition = getBlockDefinition(block.type)
  const [aiEnhanceField, setAiEnhanceField] = useState<string | null>(null)

  if (!definition) return null

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{definition.label}</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X size={20} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onMoveUp}
            className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex items-center justify-center gap-2"
          >
            <ArrowUp size={16} />
            Move Up
          </button>
          <button
            onClick={onMoveDown}
            className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex items-center justify-center gap-2"
          >
            <ArrowDown size={16} />
            Move Down
          </button>
        </div>

        <button
          onClick={onDuplicate}
          className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex items-center justify-center gap-2"
        >
          <Copy size={16} />
          Duplicate Block
        </button>

        <button
          onClick={onDelete}
          className="w-full px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-sm flex items-center justify-center gap-2"
        >
          <Trash2 size={16} />
          Delete Block
        </button>

        {/* Content Fields */}
        <div className="pt-4 border-t">
          <h3 className="font-semibold mb-3">Content</h3>
          
          {Object.entries(definition.contentSchema).map(([key, schema]) => {
            const isEnhanceable = schema.aiEnhanceable && 
              (schema.type === 'text' || schema.type === 'longtext')
            const currentValue = block.content[key]

            return (
              <div key={key} className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">
                    {schema.label}
                    {schema.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {isEnhanceable && currentValue && (
                    <InlineAIEnhancer 
                      onEnhance={() => setAiEnhanceField(key)}
                    />
                  )}
                </div>

                {isEnhanceable && currentValue && (
                  <QuickAIActions
                    content={currentValue as string}
                    recipientName={context?.recipientName}
                    onApply={(enhanced) => {
                      onUpdate({ 
                        content: { ...block.content, [key]: enhanced } 
                      })
                    }}
                    className="mb-2"
                  />
                )}
                
                {schema.type === 'text' && (
                  <input
                    type="text"
                    value={(currentValue as string) || ''}
                    onChange={(e) => onUpdate({ 
                      content: { ...block.content, [key]: e.target.value } 
                    })}
                    placeholder={schema.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                )}
                
                {schema.type === 'longtext' && (
                  <textarea
                    value={(currentValue as string) || ''}
                    onChange={(e) => onUpdate({ 
                      content: { ...block.content, [key]: e.target.value } 
                    })}
                    placeholder={schema.placeholder}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                )}

                {schema.type === 'boolean' && (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={(currentValue as boolean) || false}
                      onChange={(e) => onUpdate({ 
                        content: { ...block.content, [key]: e.target.checked } 
                      })}
                      className="w-5 h-5 rounded"
                    />
                    <span className="text-sm">Enable</span>
                  </label>
                )}

                {schema.type === 'number' && (
                  <input
                    type="number"
                    value={(currentValue as number) || 0}
                    onChange={(e) => onUpdate({ 
                      content: { ...block.content, [key]: parseInt(e.target.value) } 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                )}

                {schema.type === 'date' && (
                  <input
                    type="date"
                    value={(currentValue as string) || ''}
                    onChange={(e) => onUpdate({ 
                      content: { ...block.content, [key]: e.target.value } 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Settings */}
        <div className="pt-4 border-t">
          <h3 className="font-semibold mb-3">Settings</h3>
          
          {Object.entries(definition.settingsSchema).map(([key, schema]) => (
            <div key={key} className="mb-4">
              <label className="block text-sm font-medium mb-2">{schema.label}</label>
              
              {schema.type === 'select' && (
                <select
                  value={block.settings[key] || schema.default}
                  onChange={(e) => onUpdate({ settings: { ...block.settings, [key]: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {schema.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
              
              {schema.type === 'color' && (
                <input
                  type="color"
                  value={block.settings[key] || schema.default}
                  onChange={(e) => onUpdate({ settings: { ...block.settings, [key]: e.target.value } })}
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              )}
              
              {schema.type === 'boolean' && (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={block.settings[key] !== undefined ? block.settings[key] : schema.default}
                    onChange={(e) => onUpdate({ settings: { ...block.settings, [key]: e.target.checked } })}
                    className="w-5 h-5 rounded"
                  />
                  <span className="text-sm">Enable</span>
                </label>
              )}
              
              {schema.type === 'number' && (
                <input
                  type="number"
                  value={block.settings[key] || schema.default}
                  onChange={(e) => onUpdate({ settings: { ...block.settings, [key]: parseInt(e.target.value) } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* AI Enhancement Modal */}
      {aiEnhanceField && (
        <AIBlockAssistant
          blockType={block.type}
          field={aiEnhanceField}
          currentContent={block.content[aiEnhanceField] as string}
          context={context}
          onApply={(enhanced) => {
            onUpdate({ 
              content: { ...block.content, [aiEnhanceField]: enhanced } 
            })
            setAiEnhanceField(null)
          }}
          onClose={() => setAiEnhanceField(null)}
        />
      )}
    </div>
  )
}

