'use client'

import { X, Sparkles, Plus, Trash2 } from 'lucide-react'
import type { TemplateComponent } from '@/lib/template-schemas'

interface Memory {
  id?: string
  title: string
  date?: string
  description: string
  order: number
}

interface InlineComponentEditorProps {
  component: TemplateComponent
  data: Record<string, unknown>
  onUpdate: (data: Record<string, unknown>) => void
  onAIEnhance: (field: string, event: React.MouseEvent) => void
  theme: { primaryColor: string; secondaryColor: string; fontFamily: string }
  memories: Memory[]
  onAddMemory: () => void
  onUpdateMemory: (index: number, data: Partial<Memory>) => void
  onDeleteMemory: (index: number) => void
  onClose: () => void
}

export function InlineComponentEditor({
  component,
  data,
  onUpdate,
  onAIEnhance,
  theme,
  memories,
  onAddMemory,
  onUpdateMemory,
  onDeleteMemory,
  onClose,
}: InlineComponentEditorProps) {
  const renderField = (field: string, label: string, type: 'text' | 'textarea' = 'text', placeholder?: string) => {
    const value = (data?.[field] as string) || ''
    
    return (
      <div className="relative group">
        <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
        {type === 'textarea' ? (
          <textarea
            value={value}
            onChange={(e) => onUpdate({ [field]: e.target.value })}
            placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
            className="w-full min-h-[100px] p-3 text-base border-2 border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none resize-none"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onUpdate({ [field]: e.target.value })}
            placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
            className="w-full p-3 text-base border-2 border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none"
          />
        )}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAIEnhance(field, e)
          }}
          className="absolute -right-3 top-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-all z-10"
          title="Enhance with AI"
        >
          <Sparkles size={16} />
        </button>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-6 border-4 border-rose-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{component.icon}</span>
          <h3 className="text-lg font-bold text-gray-900">Edit {component.label}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4 bg-white p-4 rounded-lg">
        {component.type === 'hero' && (
          <>
            {renderField('title', 'Main Title', 'text', 'e.g., Happy Birthday!')}
            {renderField('subtitle', 'Subtitle', 'text', 'e.g., My Dearest Friend')}
          </>
        )}

        {(component.type === 'intro' || component.type === 'text-block') && (
          <>{renderField('text', 'Text Content', 'textarea', 'Write your heartfelt message...')}</>
        )}

        {component.type === 'final-message' && (
          <>
            {renderField('message', 'Final Message', 'textarea', 'Your closing words...')}
            {renderField('signature', 'Signature', 'text', 'e.g., Forever Yours')}
          </>
        )}

        {component.type === 'quote' && (
          <>
            {renderField('text', 'Quote', 'textarea', 'A meaningful quote...')}
            {renderField('author', 'Author', 'text', 'Quote author (optional)')}
          </>
        )}

        {(component.type === 'timeline' || component.type === 'memories-grid') && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-700">Memories</label>
              <button
                onClick={onAddMemory}
                className="flex items-center gap-1 px-3 py-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors text-sm font-semibold"
              >
                <Plus size={14} />
                Add
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {memories.map((memory, index) => (
                <div key={memory.id || index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-600">#{index + 1}</span>
                    <button
                      onClick={() => onDeleteMemory(index)}
                      className="p-1 hover:bg-red-100 text-red-600 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={memory.title}
                      onChange={(e) => onUpdateMemory(index, { title: e.target.value })}
                      placeholder="Title..."
                      className="w-full p-2 text-sm border border-gray-300 rounded focus:border-rose-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={memory.date || ''}
                      onChange={(e) => onUpdateMemory(index, { date: e.target.value })}
                      placeholder="Date (optional)..."
                      className="w-full p-2 text-sm border border-gray-300 rounded focus:border-rose-500 focus:outline-none"
                    />
                    <textarea
                      value={memory.description}
                      onChange={(e) => onUpdateMemory(index, { description: e.target.value })}
                      placeholder="Description..."
                      className="w-full min-h-[60px] p-2 text-sm border border-gray-300 rounded focus:border-rose-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {component.type === 'countdown' && (
          <>
            {renderField('title', 'Countdown Title', 'text')}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Target Date</label>
              <input
                type="datetime-local"
                value={(data?.targetDate as string) || ''}
                onChange={(e) => onUpdate({ targetDate: e.target.value })}
                className="w-full p-3 text-base border-2 border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none"
              />
            </div>
          </>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:scale-105 transition-transform"
        >
          Done Editing
        </button>
      </div>
    </div>
  )
}

