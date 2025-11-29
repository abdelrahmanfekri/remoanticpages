'use client'

import { useEffect } from 'react'
import { trackAnalytics } from '@/lib/actions/analytics'

interface AnalyticsTrackerProps {
  pageId: string
  eventType: 'view' | 'share'
}

export function AnalyticsTracker({ pageId, eventType }: AnalyticsTrackerProps) {
  useEffect(() => {
    const trackEvent = async () => {
      try {
        await trackAnalytics(pageId, eventType)
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

