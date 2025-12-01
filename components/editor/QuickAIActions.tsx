'use client'

import { useState } from 'react'
import { Wand2, Loader2 } from 'lucide-react'
import { 
  improveClarity, 
  expandContent, 
  makeMorePersonal, 
  adjustTone 
} from '@/lib/actions/ai/enhance-block'

interface QuickAIActionsProps {
  content: string
  recipientName?: string
  onApply: (enhanced: string) => void
  className?: string
}

type QuickAction = 'clarity' | 'expand' | 'personal' | 'tone-casual' | 'tone-romantic' | 'tone-playful'

export function QuickAIActions({ 
  content, 
  recipientName,
  onApply,
  className = ''
}: QuickAIActionsProps) {
  const [loading, setLoading] = useState<QuickAction | null>(null)

  const handleQuickAction = async (action: QuickAction) => {
    setLoading(action)
    
    try {
      let result
      
      switch (action) {
        case 'clarity':
          result = await improveClarity(content)
          break
        case 'expand':
          result = await expandContent(content, 'medium')
          break
        case 'personal':
          if (!recipientName) {
            alert('Please set a recipient name first')
            return
          }
          result = await makeMorePersonal(content, recipientName)
          break
        case 'tone-casual':
          result = await adjustTone(content, 'casual')
          break
        case 'tone-romantic':
          result = await adjustTone(content, 'romantic')
          break
        case 'tone-playful':
          result = await adjustTone(content, 'playful')
          break
      }
      
      if (result?.suggestions?.[0]) {
        onApply(result.suggestions[0])
      } else if (result?.error) {
        alert(result.error)
      }
    } catch (error) {
      alert('Failed to enhance content')
    } finally {
      setLoading(null)
    }
  }

  const actions = [
    { id: 'clarity' as QuickAction, label: 'Improve Clarity', icon: '✨' },
    { id: 'expand' as QuickAction, label: 'Expand', icon: '📝' },
    { id: 'personal' as QuickAction, label: 'Make Personal', icon: '💝', disabled: !recipientName },
    { id: 'tone-romantic' as QuickAction, label: 'Romantic', icon: '💕' },
    { id: 'tone-playful' as QuickAction, label: 'Playful', icon: '🎉' },
    { id: 'tone-casual' as QuickAction, label: 'Casual', icon: '😊' },
  ]

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => handleQuickAction(action.id)}
          disabled={loading !== null || action.disabled}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          title={action.label}
        >
          {loading === action.id ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <span>{action.icon}</span>
          )}
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  )
}

