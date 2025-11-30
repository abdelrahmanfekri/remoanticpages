'use client'

import React from 'react'
import type { PageWithRelations } from '@/types'

interface MapLocationSectionProps {
  page: PageWithRelations
  variant?: 'default' | 'embedded' | 'minimal'
  theme?: {
    primaryColor?: string
    backgroundColor?: string
  }
  settings?: {
    showTitle?: boolean
    title?: string
    lat?: number
    lng?: number
    address?: string
  }
  defaultContent?: Record<string, any>
}

export function MapLocationSection({ 
  page, 
  variant = 'default',
  theme = {},
  settings = {},
  defaultContent = {}
}: MapLocationSectionProps) {
  const {
    primaryColor = '#f43f5e',
    backgroundColor = 'bg-white'
  } = theme

  const {
    showTitle = true,
    title = 'Location',
    lat = 0,
    lng = 0,
    address = ''
  } = settings

  const latitude = lat || defaultContent.lat || 0
  const longitude = lng || defaultContent.lng || 0
  const locationAddress = address || defaultContent.address || ''

  const isEditMode = (defaultContent as any)?.viewMode === 'edit'
  if ((!latitude || !longitude) && !isEditMode) return null

  // Generate Google Maps embed URL
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${latitude},${longitude}`

  // Fallback to OpenStreetMap if no API key
  const openStreetMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {showTitle && (
          <h2 className="text-4xl md:text-5xl font-serif text-center mb-16" style={{ color: primaryColor }}>
            {title}
          </h2>
        )}
        <div className={`${backgroundColor} rounded-2xl shadow-xl overflow-hidden`}>
          <div className="relative w-full aspect-video">
            <iframe
              src={openStreetMapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={title}
            />
          </div>
          {locationAddress && (
            <div className="p-6 text-center">
              <p className="text-lg font-semibold" style={{ color: primaryColor }}>
                {locationAddress}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

