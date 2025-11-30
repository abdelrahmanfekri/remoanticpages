'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BlockEditor } from '@/components/editor/BlockEditor'
import { getPageById, updatePage } from '@/lib/actions/pages'
import { updateBlock } from '@/lib/actions/blocks'
import { getCurrentSubscription } from '@/lib/actions/subscriptions'
import type { Tier } from '@/lib/tiers'
import type { PageWithRelations } from '@/types'

export default function EditPageFlow({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [userTier, setUserTier] = useState<Tier>('free')
  const [loading, setLoading] = useState(true)
  const [pageId, setPageId] = useState<string>('')
  const [pageData, setPageData] = useState<PageWithRelations | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedParams = await params
        setPageId(resolvedParams.id)

        const [subscriptionData, pageResult] = await Promise.all([
          getCurrentSubscription(),
          getPageById(resolvedParams.id),
        ])

        setUserTier(subscriptionData.tier || 'free')

        if (pageResult.error || !pageResult.page) {
          router.push('/dashboard')
          return
        }

        setPageData(pageResult.page)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params, router])

  const handleSave = async (data: any) => {
    if (!pageId) return

    try {
      // Update page
      const result = await updatePage(pageId, {
        title: data.title,
        recipientName: data.recipientName,
        theme: data.theme,
        settings: data.settings,
        password: data.password,
      })

      if (result.error) {
        throw new Error(result.error)
      }

      // Update blocks - simplified for now
      // In production, you'd want proper sync (add/update/delete)
      for (const block of data.blocks) {
        if (block.id.startsWith('block-')) {
          // This is a new block, use createBlock action
          // For now, skip as this is a simplified version
        } else {
          await updateBlock(block.id, {
            content: block.content,
            settings: block.settings,
            order: block.order,
          })
        }
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Save failed:', error)
      throw error
    }
  }

  const handleCancel = () => {
    router.push('/dashboard')
  }

  if (loading || !pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Convert page data to editor format
  const initialBlocks = pageData.blocks.map(b => ({
    id: b.id,
    type: b.type as any,
    content: b.content as any,
    settings: b.settings as any,
    order: b.display_order,
  }))

  return (
    <BlockEditor
      pageId={pageId}
      initialData={{
        title: pageData.title,
        recipientName: pageData.recipient_name || '',
        theme: pageData.theme as any,
        settings: pageData.settings as any,
        blocks: initialBlocks,
        memories: pageData.memories || [],
        media: pageData.media || [],
      }}
      onSave={handleSave}
      onCancel={handleCancel}
      userTier={userTier}
    />
  )
}
