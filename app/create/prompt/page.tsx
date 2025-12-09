'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CreationSteps } from '@/components/ai/prompt/CreationSteps'
import { GenerationFlow } from '@/components/ai/generation'
import { usePromptStore } from '@/lib/stores/prompt-store'
import { Loader2 } from 'lucide-react'

export default function PromptPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const { isGenerating, prompt, occasion, mediaPreferences, stopGeneration, resetForm } = usePromptStore()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login?redirect=/create/prompt')
          return
        }

        setIsAuthenticated(true)
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login?redirect=/create/prompt')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, supabase])


  const handleCancel = () => {
    stopGeneration()
    resetForm()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-rose-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (isGenerating) {
    return (
      <>
        <GenerationFlow
          prompt={prompt}
          occasion={occasion || undefined}
          mediaPreferences={mediaPreferences}
          onCancel={handleCancel}
          onComplete={() => {
            resetForm()
          }}
        />
      </>
    )
  }

  return <CreationSteps onComplete={handleComplete} />
}
