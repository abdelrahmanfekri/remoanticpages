'use client'

import { Check, Copy, ExternalLink } from 'lucide-react'

interface ShareModalProps {
  isOpen: boolean
  shareUrl: string
  onClose: () => void
  onCopyUrl: () => void
}

export function ShareModal({ isOpen, shareUrl, onClose, onCopyUrl }: ShareModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Page Published! 🎉
          </h3>
          <p className="text-gray-600">
            Your romantic page is live and ready to share
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            Share URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg"
            />
            <button
              onClick={onCopyUrl}
              className="p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors"
              title="Copy URL"
            >
              <Copy size={18} />
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            <ExternalLink size={18} />
            View Page
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  )
}

