'use client'

import { Heart, Cake, Gift, Calendar, Sparkles, PartyPopper, Crown, Star } from 'lucide-react'
import { useState } from 'react'

interface Occasion {
  id: string
  label: string
  icon: React.ReactNode
  color: string
}

const occasions: Occasion[] = [
  { id: 'birthday', label: 'Birthday', icon: <Cake size={18} />, color: 'from-rose-500 to-pink-500' },
  { id: 'anniversary', label: 'Anniversary', icon: <Heart size={18} />, color: 'from-purple-500 to-pink-500' },
  { id: 'wedding', label: 'Wedding', icon: <Crown size={18} />, color: 'from-yellow-500 to-orange-500' },
  { id: 'valentines', label: 'Valentine\'s', icon: <Heart size={18} />, color: 'from-red-500 to-pink-500' },
  { id: 'christmas', label: 'Christmas', icon: <PartyPopper size={18} />, color: 'from-green-600 to-red-600' },
  { id: 'romance', label: 'Romance', icon: <Sparkles size={18} />, color: 'from-pink-500 to-rose-500' },
  { id: 'celebration', label: 'Celebration', icon: <Star size={18} />, color: 'from-blue-500 to-purple-500' },
  { id: 'other', label: 'Other', icon: <Gift size={18} />, color: 'from-gray-500 to-gray-700' },
]

interface OccasionSelectorProps {
  selected: string | null
  onSelect: (id: string) => void
}

export function OccasionSelector({ selected, onSelect }: OccasionSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm md:text-base font-semibold text-gray-700">
        What's the occasion?
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        {occasions.map((occasion) => (
          <button
            key={occasion.id}
            onClick={() => onSelect(occasion.id)}
            className={`
              relative px-3 py-3 md:px-4 md:py-4 rounded-xl font-medium text-sm md:text-base
              transition-all duration-200 touch-manipulation active:scale-95
              ${
                selected === occasion.id
                  ? `bg-gradient-to-r ${occasion.color} text-white shadow-lg scale-105`
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-rose-300 hover:shadow-md'
              }
            `}
          >
            <span className="flex items-center justify-center gap-2">
              {occasion.icon}
              <span className="hidden sm:inline">{occasion.label}</span>
              <span className="sm:hidden">{occasion.label.split(' ')[0]}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

