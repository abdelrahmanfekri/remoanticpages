'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
import { deletePage } from '@/lib/actions/pages'

interface DeletePageButtonProps {
  pageId: string
  pageTitle: string
}

export function DeletePageButton({ pageId, pageTitle }: DeletePageButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    if (!showConfirm) {
      setShowConfirm(true)
      return
    }

    startTransition(async () => {
      try {
        const result = await deletePage(pageId)

        if (result.error) {
          throw new Error(result.error)
        }

        // Refresh the page to show updated list
        router.refresh()
      } catch (error) {
        console.error('Delete failed:', error)
        alert(error instanceof Error ? error.message : 'Failed to delete page')
        setShowConfirm(false)
      }
    })
  }

  const handleCancel = () => {
    setShowConfirm(false)
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleCancel}
          disabled={isPending}
          className="px-3 py-2 text-xs text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 touch-manipulation"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="flex items-center justify-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 active:bg-red-700 transition-colors text-sm font-medium touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px]"
        >
          {isPending ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span className="hidden sm:inline">Deleting...</span>
            </>
          ) : (
            <>
              <Trash2 size={14} />
              <span className="hidden sm:inline">Confirm</span>
            </>
          )}
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="flex items-center justify-center gap-1.5 bg-red-100 text-red-600 px-3 py-2.5 sm:py-2 rounded-lg hover:bg-red-200 active:bg-red-300 transition-colors text-sm font-medium touch-manipulation disabled:opacity-50"
      title="Delete page"
      aria-label="Delete page"
    >
      <Trash2 size={16} />
      <span className="hidden sm:inline">Delete</span>
    </button>
  )
}

