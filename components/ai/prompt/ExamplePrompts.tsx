'use client'

import { Lightbulb } from 'lucide-react'

interface ExamplePrompt {
  text: string
  occasion: string
}

const examples: ExamplePrompt[] = [
  {
    occasion: 'birthday',
    text: 'Create a fun birthday page for my best friend Sarah who loves traveling and adventure. Include our favorite memories from our trips together.',
  },
  {
    occasion: 'anniversary',
    text: 'A romantic anniversary page for my wife celebrating 5 years together. Highlight our journey from meeting in college to building a life together.',
  },
  {
    occasion: 'wedding',
    text: 'An elegant wedding announcement page with our story of how we met at a coffee shop and fell in love over books and lattes.',
  },
  {
    occasion: 'valentines',
    text: 'A sweet Valentine\'s Day page for my girlfriend with reasons why I love her and our favorite moments from this past year.',
  },
  {
    occasion: 'romance',
    text: 'Create a romantic surprise page telling my partner how much they mean to me, including our special memories and inside jokes.',
  },
  {
    occasion: 'christmas',
    text: 'A festive Christmas page for my family with holiday memories, traditions we love, and warm wishes for the season.',
  },
]

interface ExamplePromptsProps {
  onSelect: (text: string) => void
  occasionFilter?: string | null
}

export function ExamplePrompts({ onSelect, occasionFilter }: ExamplePromptsProps) {
  const filteredExamples = occasionFilter
    ? examples.filter((ex) => ex.occasion === occasionFilter)
    : examples.slice(0, 3)

  if (filteredExamples.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Lightbulb size={18} className="text-yellow-500" />
        <label className="text-sm md:text-base font-semibold text-gray-700">
          Example prompts
        </label>
      </div>
      <div className="space-y-2">
        {filteredExamples.map((example, index) => (
          <button
            key={index}
            onClick={() => onSelect(example.text)}
            className="w-full text-left px-4 py-3 rounded-lg bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100 text-sm md:text-base text-gray-700 hover:border-rose-300 hover:shadow-md transition-all duration-200 touch-manipulation active:scale-[0.98]"
          >
            "{example.text}"
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 text-center">
        Click an example to use it as a starting point
      </p>
    </div>
  )
}

