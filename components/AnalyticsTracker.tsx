'use client'

import { useEffect } from 'react'

interface AnalyticsTrackerProps {
  pageId: string
  eventType: 'view' | 'share'
}

export function AnalyticsTracker({ pageId, eventType }: AnalyticsTrackerProps) {
  useEffect(() => {
    const trackEvent = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pageId,
            eventType,
          }),
        })
      } catch (error) {
        console.error('Analytics tracking failed:', error)
      }
    }

    if (eventType === 'view' || eventType === 'share') {
      trackEvent()
    }
  }, [pageId, eventType])

  return null
}

