'use client'

import { Lightbulb, Sparkles, ArrowRight } from 'lucide-react'

interface ExamplePrompt {
  text: string
  occasion: string
  description?: string
}

const examples: ExamplePrompt[] = [
  {
    occasion: 'birthday',
    text: 'Create a fun birthday page for my best friend Madison who loves traveling and adventure. Include our favorite memories from our trips together.',
    description: 'Adventure & Memories',
  },
  {
    occasion: 'birthday',
    text: 'A joyful birthday celebration page for my mom with family photos and heartfelt messages from all her children.',
    description: 'Family Celebration',
  },
  {
    occasion: 'anniversary',
    text: 'A romantic anniversary page for my wife celebrating 5 years together. Highlight our journey from meeting in college to building a life together.',
    description: '5 Year Journey',
  },
  {
    occasion: 'anniversary',
    text: 'An elegant anniversary page celebrating our first year together, showcasing our favorite moments and milestones.',
    description: 'First Year Milestone',
  },
  {
    occasion: 'wedding',
    text: 'An elegant wedding announcement page with our story of how we met at a coffee shop and fell in love over books and lattes.',
    description: 'Love Story',
  },
  {
    occasion: 'wedding',
    text: 'A beautiful wedding invitation page with ceremony details, venue information, and our journey together.',
    description: 'Wedding Invitation',
  },
  {
    occasion: 'valentines',
    text: 'A sweet Valentine\'s Day page for my girlfriend with reasons why I love her and our favorite moments from this past year.',
    description: 'Love Reasons',
  },
  {
    occasion: 'valentines',
    text: 'A romantic Valentine\'s surprise page with our relationship timeline and promises for the future.',
    description: 'Romantic Surprise',
  },
  {
    occasion: 'romance',
    text: 'Create a romantic surprise page telling my partner how much they mean to me, including our special memories and inside jokes.',
    description: 'Special Memories',
  },
  {
    occasion: 'christmas',
    text: 'A festive Christmas page for my family with holiday memories, traditions we love, and warm wishes for the season.',
    description: 'Holiday Traditions',
  },
  {
    occasion: 'celebration',
    text: 'A celebration page for my friend\'s graduation with congratulations messages and highlights of their achievements.',
    description: 'Achievement Celebration',
  },
]

interface ExamplePromptsProps {
  onSelect: (text: string) => void
  occasionFilter?: string | null
}

export function ExamplePrompts({ onSelect, occasionFilter }: ExamplePromptsProps) {
  const filteredExamples = occasionFilter
    ? examples.filter((ex) => ex.occasion === occasionFilter)
    : examples.slice(0, 4)

  if (filteredExamples.length === 0) {
    return null
  }

  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
            <Lightbulb size={24} className="text-yellow-600" />
          </div>
          <label className="text-xl md:text-2xl font-bold text-gray-900">
            Need Inspiration?
          </label>
        </div>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
          Click any example below to use it instantly, or use them as inspiration for your own unique prompt
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredExamples.map((example, index) => (
          <button
            key={index}
            onClick={() => onSelect(example.text)}
            className="group relative text-left p-5 md:p-6 rounded-xl bg-gradient-to-br from-rose-50 via-pink-50 to-rose-50 border-2 border-rose-100 hover:border-rose-400 hover:shadow-xl transition-all duration-300 touch-manipulation active:scale-[0.98]"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-white rounded-lg group-hover:scale-110 transition-transform shadow-sm">
                <Sparkles size={18} className="text-rose-500" />
              </div>
              {example.description && (
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wide bg-white px-3 py-1 rounded-full">
                  {example.description}
                </span>
              )}
            </div>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
              "{example.text}"
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Click to use this</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
