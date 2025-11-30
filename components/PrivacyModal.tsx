'use client'

import React, { useState } from 'react'
import { X, Lock, Globe, Eye, EyeOff } from 'lucide-react'

interface PrivacyModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (isPrivate: boolean, password: string) => void
  defaultIsPrivate?: boolean
}

export function PrivacyModal({
  isOpen,
  onClose,
  onConfirm,
  defaultIsPrivate = false,
}: PrivacyModalProps) {
  const [isPrivate, setIsPrivate] = useState(defaultIsPrivate)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (isPrivate) {
      if (!password || password.trim().length === 0) {
        setError('Please enter a password for your private page')
        return
      }
      if (password.length < 4) {
        setError('Password must be at least 4 characters')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        return
      }
    }

    onConfirm(isPrivate, password)
    // Reset form
    setPassword('')
    setConfirmPassword('')
    setError('')
  }

  const handleClose = () => {
    setPassword('')
    setConfirmPassword('')
    setError('')
    setIsPrivate(defaultIsPrivate)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative animate-fade-up">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-serif text-rose-600 mb-2">
            Page Privacy
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Choose who can view your page
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Privacy Options */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => {
                setIsPrivate(false)
                setError('')
              }}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                !isPrivate
                  ? 'border-rose-500 bg-rose-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              } touch-manipulation`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    !isPrivate ? 'border-rose-500 bg-rose-500' : 'border-gray-300'
                  }`}
                >
                  {!isPrivate && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <Globe size={20} className={!isPrivate ? 'text-rose-500' : 'text-gray-400'} />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Public</div>
                  <div className="text-sm text-gray-500">
                    Anyone with the link can view
                  </div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsPrivate(true)
                setError('')
              }}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                isPrivate
                  ? 'border-rose-500 bg-rose-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              } touch-manipulation`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isPrivate ? 'border-rose-500 bg-rose-500' : 'border-gray-300'
                  }`}
                >
                  {isPrivate && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <Lock size={20} className={isPrivate ? 'text-rose-500' : 'text-gray-400'} />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Private</div>
                  <div className="text-sm text-gray-500">
                    Password required to view
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Password Fields (only show if private) */}
          {isPrivate && (
            <div className="space-y-4 pt-2 border-t border-gray-200">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError('')
                    }}
                    placeholder="Enter a password"
                    className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none"
                    required={isPrivate}
                    minLength={4}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 touch-manipulation"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      setError('')
                    }}
                    placeholder="Confirm password"
                    className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none"
                    required={isPrivate}
                    minLength={4}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 touch-manipulation"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors touch-manipulation"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-semibold hover:scale-105 transition-transform touch-manipulation"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

