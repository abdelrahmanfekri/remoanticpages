'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAllTemplates, createBlocksFromTemplate } from '@/lib/blocks'
import { BlockEditor } from '@/components/editor/BlockEditor'
import { createPage } from '@/lib/actions/pages'
import { getCurrentSubscription } from '@/lib/actions/subscriptions'
import type { Tier } from '@/lib/tiers'

export default function CreatePageFlow() {
  const router = useRouter()
  const [userTier, setUserTier] = useState<Tier>('free')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTier = async () => {
      try {
        const subscriptionData = await getCurrentSubscription()
        setUserTier(subscriptionData.tier || 'free')
      } catch (error) {
        console.error('Failed to fetch tier:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTier()
  }, [])

  const handleSave = async (data: any) => {
    try {
      const result = await createPage({
        title: data.title,
        recipientName: data.recipientName,
        templateId: selectedTemplate || undefined,
        theme: data.theme,
        settings: data.settings,
        blocks: data.blocks,
        memories: data.memories,
        media: data.media,
        password: data.password,
      })

      if (result.error) {
        throw new Error(result.error)
      }

      if (result.page) {
        router.push(`/p/${result.page.slug}`)
      }
    } catch (error) {
      console.error('Save failed:', error)
      throw error
    }
  }

  const handleCancel = () => {
    router.push('/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show template selection
  if (!selectedTemplate) {
    const templates = getAllTemplates()
    const freeTemplates = templates.filter(t => !t.isPremium)
    const premiumTemplates = templates.filter(t => t.isPremium)

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose a Template</h1>
            <p className="text-lg text-gray-600">Select a starting point for your page</p>
          </div>

          {/* Free Templates */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Free Templates</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {freeTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition text-left"
                >
                  <div className="h-40 bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 uppercase">{template.category}</span>
                    <span className="text-rose-600 font-medium">Select →</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Premium Templates */}
          {premiumTemplates.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">
                Premium Templates
                {userTier === 'free' && (
                  <span className="text-sm text-gray-500 ml-2">(Upgrade to unlock)</span>
                )}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {premiumTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      if (userTier === 'free') {
                        router.push('/pricing')
                      } else {
                        setSelectedTemplate(template.id)
                      }
                    }}
                    className={`bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition text-left relative ${
                      userTier === 'free' ? 'opacity-75' : ''
                    }`}
                  >
                    {userTier === 'free' && (
                      <div className="absolute top-4 right-4 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        Premium
                      </div>
                    )}
                    <div className="h-40 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 uppercase">{template.category}</span>
                      <span className="text-rose-600 font-medium">
                        {userTier === 'free' ? 'Upgrade →' : 'Select →'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={handleCancel}
              className="text-gray-600 hover:text-gray-900 transition"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show editor with selected template
  const template = getAllTemplates().find(t => t.id === selectedTemplate)
  const blocks = template ? createBlocksFromTemplate(template.id) : []

  return (
    <BlockEditor
      initialData={{
        title: '',
        recipientName: '',
        theme: template?.theme,
        blocks: blocks,
      }}
      onSave={handleSave}
      onCancel={() => setSelectedTemplate(null)}
      userTier={userTier}
    />
  )
}
