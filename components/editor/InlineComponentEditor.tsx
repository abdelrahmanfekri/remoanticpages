'use client'

import React from 'react'
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
  onAIEnhance: (field: string, componentType: string, fieldType: 'title' | 'message' | 'text', event: React.MouseEvent) => void
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
  const renderField = (
    field: string,
    label: string,
    type: 'text' | 'textarea' = 'text',
    placeholder?: string,
    fieldType: 'title' | 'message' | 'text' = 'text'
  ) => {
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
            onAIEnhance(field, component.type, fieldType, e)
          }}
          className="absolute -right-2 top-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2.5 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all z-10 touch-manipulation border-2 border-white group"
          title="✨ AI Assistant - Click to generate or enhance text"
          aria-label="AI Assistant"
        >
          <Sparkles size={18} className="group-hover:rotate-180 transition-transform duration-500" />
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
          <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 rounded-full">
            <Sparkles size={12} className="text-purple-600" />
            <span className="text-xs font-semibold text-purple-700">AI Available</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white rounded-lg transition-colors touch-manipulation"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4 bg-white p-4 rounded-lg">
        {component.type === 'hero' && (
          <>
            {renderField('title', 'Main Title', 'text', 'e.g., Happy Birthday!', 'title')}
            {renderField('subtitle', 'Subtitle', 'text', 'e.g., My Dearest Friend', 'title')}
          </>
        )}

        {(component.type === 'intro' || component.type === 'text-block') && (
          <>{renderField('text', 'Text Content', 'textarea', 'Write your heartfelt message...', 'message')}</>
        )}

        {component.type === 'final-message' && (
          <>
            {renderField('message', 'Final Message', 'textarea', 'Your closing words...', 'message')}
            {renderField('signature', 'Signature', 'text', 'e.g., Forever Yours', 'title')}
          </>
        )}

        {component.type === 'quote' && (
          <>
            {renderField('text', 'Quote', 'textarea', 'A meaningful quote...', 'message')}
            {renderField('author', 'Author', 'text', 'Quote author (optional)', 'title')}
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
                    <div className="relative">
                      <input
                        type="text"
                        value={memory.title}
                        onChange={(e) => onUpdateMemory(index, { title: e.target.value })}
                        placeholder="Title..."
                        className="w-full p-2 pr-10 text-sm border border-gray-300 rounded focus:border-rose-500 focus:outline-none touch-manipulation"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onAIEnhance(`memory-${index}-title`, 'memories-grid', 'title', e)
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-1.5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all z-10 touch-manipulation border-2 border-white group"
                        title="✨ AI Assistant - Generate or enhance title"
                        aria-label="AI Assistant"
                      >
                        <Sparkles size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={memory.date || ''}
                      onChange={(e) => onUpdateMemory(index, { date: e.target.value })}
                      placeholder="Date (optional)..."
                      className="w-full p-2 text-sm border border-gray-300 rounded focus:border-rose-500 focus:outline-none touch-manipulation"
                    />
                    <div className="relative">
                      <textarea
                        value={memory.description}
                        onChange={(e) => onUpdateMemory(index, { description: e.target.value })}
                        placeholder="Description..."
                        className="w-full min-h-[60px] p-2 pr-10 text-sm border border-gray-300 rounded focus:border-rose-500 focus:outline-none resize-none touch-manipulation"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onAIEnhance(`memory-${index}-description`, 'memories-grid', 'message', e)
                        }}
                        className="absolute right-2 top-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-1.5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all z-10 touch-manipulation border-2 border-white group"
                        title="✨ AI Assistant - Generate or enhance description"
                        aria-label="AI Assistant"
                      >
                        <Sparkles size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {component.type === 'countdown' && (
          <>
            {renderField('title', 'Countdown Title', 'text', undefined, 'title')}
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

        {/* Add fields for other component types */}
        {component.type === 'two-column' && (
          <>
            {renderField('title', 'Section Title', 'text', undefined, 'title')}
            {renderField('leftText', 'Left Column', 'textarea', 'Content for left column...', 'message')}
            {renderField('rightText', 'Right Column', 'textarea', 'Content for right column...', 'message')}
          </>
        )}

        {component.type === 'testimonials' && (
          <>
            {renderField('title', 'Section Title', 'text', undefined, 'title')}
            {renderField('testimonial', 'Testimonial', 'textarea', 'Write a testimonial...', 'message')}
            {renderField('author', 'Author Name', 'text', 'Author name (optional)', 'title')}
          </>
        )}

        {component.type === 'video-section' && (
          <>
            {renderField('title', 'Section Title', 'text', undefined, 'title')}
            {renderField('description', 'Description', 'textarea', 'Describe the video...', 'message')}
          </>
        )}

        {component.type === 'map-location' && (
          <>
            {renderField('title', 'Location Title', 'text', undefined, 'title')}
            {renderField('description', 'Location Description', 'textarea', 'Describe the location...', 'message')}
          </>
        )}

        {/* Default fallback for any component type without specific fields */}
        {!['hero', 'intro', 'text-block', 'final-message', 'quote', 'timeline', 'memories-grid', 'countdown', 'two-column', 'testimonials', 'video-section', 'map-location'].includes(component.type) && (
          <>
            {renderField('title', 'Title', 'text', 'Enter a title...', 'title')}
            {renderField('text', 'Content', 'textarea', 'Enter content...', 'message')}
          </>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:scale-105 transition-transform touch-manipulation"
        >
          Done Editing
        </button>
      </div>
    </div>
  )
}

