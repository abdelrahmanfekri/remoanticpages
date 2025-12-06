'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function CreateBlankPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const createBlankPage = async () => {
      try {
        // Check authentication
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login?redirect=/dashboard/create')
          return
        }

        // Create a blank page with a minimal hero block
        const defaultTitle = 'Untitled Page'
        const baseSlug = defaultTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .substring(0, 50)

        // Generate unique slug
        let slug = baseSlug
        let counter = 1
        let slugExists = true

        while (slugExists) {
          const { data: existing } = await supabase
            .from('pages')
            .select('id')
            .eq('slug', slug)
            .single()

          if (!existing) {
            slugExists = false
          } else {
            slug = `${baseSlug}-${counter}`
            counter++
          }
        }

        // Create page with minimal data
        const { data: page, error: pageError } = await supabase
          .from('pages')
          .insert({
            user_id: user.id,
            slug,
            title: defaultTitle,
            recipient_name: null,
            template_id: null,
            theme: {
              primaryColor: '#f43f5e',
              secondaryColor: '#ec4899',
              fontFamily: 'serif',
              backgroundColor: '#ffffff',
            },
            settings: {
              musicUrl: null,
              isPublic: false,
              animations: {
                enabled: true,
                style: 'smooth',
              },
            },
            tier_used: 'free',
          })
          .select()
          .single()

        if (pageError) {
          throw new Error(pageError.message)
        }

        // Create a minimal hero block
        const { error: blockError } = await supabase
          .from('page_blocks')
          .insert({
            page_id: page.id,
            type: 'hero',
            content: {
              headline: 'Welcome',
              subheadline: 'Start building your page',
            },
            display_order: 0,
          })

        if (blockError) {
          console.error('Block creation error:', blockError)
          // Continue anyway - page is created, user can add blocks in editor
        }

        // Redirect to editor
        router.push(`/dashboard/edit/${page.id}`)
      } catch (err: any) {
        console.error('Error creating blank page:', err)
        setError(err.message || 'Failed to create page')
        setLoading(false)
      }
    }

    createBlankPage()
  }, [router, supabase])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/create')}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <div className="text-center">
        <Loader2 className="animate-spin h-12 w-12 text-rose-500 mx-auto mb-4" />
        <p className="text-gray-600">Creating your blank page...</p>
      </div>
    </div>
  )
}

