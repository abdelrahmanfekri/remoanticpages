'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Sparkles } from 'lucide-react'

interface EditableTextProps {
  value: string
  onSave: (value: string) => void
  onAIEnhance?: (event: React.MouseEvent) => void
  className?: string
  style?: React.CSSProperties
  placeholder?: string
  multiline?: boolean
  fieldType?: 'title' | 'message' | 'text'
  isEditing?: boolean
  onStartEdit?: () => void
  viewMode?: 'edit' | 'preview'
}

export function EditableText({
  value,
  onSave,
  onAIEnhance,
  className = '',
  style,
  placeholder = 'Click to edit...',
  multiline = false,
  fieldType = 'text',
  isEditing = false,
  onStartEdit,
  viewMode = 'preview',
}: EditableTextProps) {
  const [isLocalEditing, setIsLocalEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const isActuallyEditing = isEditing || isLocalEditing

  useEffect(() => {
    setEditValue(value)
  }, [value])

  useEffect(() => {
    if (isActuallyEditing && inputRef.current) {
      inputRef.current.focus()
      if (inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.setSelectionRange(editValue.length, editValue.length)
      } else {
        inputRef.current.setSelectionRange(editValue.length, editValue.length)
      }
    }
  }, [isActuallyEditing, editValue.length])

  const handleClick = () => {
    if (viewMode === 'edit' && !isActuallyEditing) {
      setIsLocalEditing(true)
      onStartEdit?.()
    }
  }

  const handleBlur = () => {
    if (editValue !== value) {
      onSave(editValue)
    }
    setIsLocalEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
      if (editValue !== value) {
        onSave(editValue)
      }
      setIsLocalEditing(false)
    } else if (e.key === 'Escape') {
      setEditValue(value)
      setIsLocalEditing(false)
    } else if (e.key === 'Enter' && e.metaKey && multiline) {
      // Cmd/Ctrl + Enter to save in textarea
      e.preventDefault()
      if (editValue !== value) {
        onSave(editValue)
      }
      setIsLocalEditing(false)
    }
  }

  if (isActuallyEditing) {
    const InputComponent = multiline ? 'textarea' : 'input'
    return (
      <div className="relative group">
        <InputComponent
          ref={inputRef as any}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`${className} border-2 border-rose-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300 ${
            multiline ? 'min-h-[100px] resize-y' : ''
          }`}
          style={style}
        />
        {onAIEnhance && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAIEnhance(e)
            }}
            className="absolute -right-3 top-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-all z-10 touch-manipulation"
            title="Enhance with AI"
          >
            <Sparkles size={14} />
          </button>
        )}
      </div>
    )
  }

  return (
    <div
      onClick={handleClick}
      className={`relative group ${viewMode === 'edit' ? 'cursor-text hover:bg-rose-50/50 rounded-lg px-2 py-1 -mx-2 -my-1 transition-colors' : ''} ${className}`}
      style={style}
    >
      {value || placeholder ? (
        <span className={!value ? 'text-gray-400 italic' : ''}>
          {value || placeholder}
        </span>
      ) : (
        <span className="text-gray-400 italic">{placeholder}</span>
      )}
      {viewMode === 'edit' && (
        <div className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          {onAIEnhance && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAIEnhance(e)
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-1.5 rounded-full shadow-md hover:scale-110 transition-all z-10 touch-manipulation"
              title="Enhance with AI"
            >
              <Sparkles size={12} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

