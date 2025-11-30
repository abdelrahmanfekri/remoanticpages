'use client'

import React, { useState, useEffect } from 'react'
import type { PageWithRelations } from '@/types'

interface CountdownSectionProps {
  page: PageWithRelations
  variant?: 'default' | 'elegant' | 'minimal' | 'cards'
  theme?: {
    primaryColor?: string
    backgroundColor?: string
    textColor?: string
  }
  settings?: {
    showTitle?: boolean
    title?: string
    targetDate?: string
  }
  defaultContent?: Record<string, any>
}

export function CountdownSection({ 
  page, 
  variant = 'default',
  theme = {},
  settings = {},
  defaultContent = {}
}: CountdownSectionProps) {
  const {
    primaryColor = '#f43f5e',
    backgroundColor = 'bg-white',
    textColor = 'text-gray-700'
  } = theme

  const {
    showTitle = true,
    title = 'Countdown',
    targetDate = ''
  } = settings

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  const target = targetDate || defaultContent.targetDate || ''

  useEffect(() => {
    if (!target) return

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const targetTime = new Date(target).getTime()
      const difference = targetTime - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [target])

  const isEditMode = (defaultContent as any)?.viewMode === 'edit'
  if (!target && !isEditMode) return null

  if (variant === 'cards') {
    return (
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          {showTitle && (
            <h2 className="text-4xl md:text-5xl font-serif text-center mb-16" style={{ color: primaryColor }}>
              {title}
            </h2>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds }
            ].map((item, index) => (
              <div
                key={index}
                className={`${backgroundColor} p-6 md:p-8 rounded-2xl shadow-xl text-center border-2`}
                style={{ borderColor: primaryColor }}
              >
                <div className="text-4xl md:text-6xl font-bold mb-2" style={{ color: primaryColor }}>
                  {item.value.toString().padStart(2, '0')}
                </div>
                <div className={`text-sm md:text-lg font-semibold ${textColor}`}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'minimal') {
    return (
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {showTitle && (
            <h2 className="text-4xl md:text-5xl font-serif mb-16" style={{ color: primaryColor }}>
              {title}
            </h2>
          )}
          <div className="flex items-center justify-center gap-4 md:gap-8 text-4xl md:text-6xl font-bold" style={{ color: primaryColor }}>
            <span>{timeLeft.days.toString().padStart(2, '0')}</span>
            <span>:</span>
            <span>{timeLeft.hours.toString().padStart(2, '0')}</span>
            <span>:</span>
            <span>{timeLeft.minutes.toString().padStart(2, '0')}</span>
            <span>:</span>
            <span>{timeLeft.seconds.toString().padStart(2, '0')}</span>
          </div>
        </div>
      </section>
    )
  }

  // Default elegant style
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {showTitle && (
          <h2 className="text-4xl md:text-5xl font-serif text-center mb-16" style={{ color: primaryColor }}>
            {title}
          </h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Minutes', value: timeLeft.minutes },
            { label: 'Seconds', value: timeLeft.seconds }
          ].map((item, index) => (
            <div
              key={index}
              className={`${backgroundColor} p-8 rounded-2xl shadow-xl text-center`}
            >
              <div className="text-5xl md:text-7xl font-bold mb-3" style={{ color: primaryColor }}>
                {item.value.toString().padStart(2, '0')}
              </div>
              <div className={`text-lg font-semibold ${textColor}`}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

