'use client'

import { useEffect } from 'react'

interface AnalyticsTrackerProps {
  pageId: string
  eventType: 'view' | 'share' | 'click'
  metadata?: Record<string, string | number | boolean>
}

export function AnalyticsTracker({ pageId, eventType, metadata }: AnalyticsTrackerProps) {
  useEffect(() => {
    const trackEvent = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pageId,
            eventType,
            metadata,
          }),
        })
      } catch (error) {
        console.error('Analytics tracking failed:', error)
      }
    }

    if (eventType === 'view') {
      trackEvent()
    }
  }, [pageId, eventType, metadata])

  return null
}

