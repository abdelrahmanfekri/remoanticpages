'use client'

import { useState } from 'react'
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Save,
  Trash2,
  Eye,
  EyeOff,
  Zap,
} from 'lucide-react'
import {
  AnimationConfig,
  AnimationType,
  AnimationTiming,
  ANIMATION_PRESETS,
  generateAnimationCSS,
  applyAnimation,
  removeAnimation,
} from '@/lib/animations'

interface AnimationEditorProps {
  elementId: string
  onSave: (config: AnimationConfig) => void
  initialConfig?: AnimationConfig
}

export function AnimationEditor({
  elementId,
  onSave,
  initialConfig,
}: AnimationEditorProps) {
  const [config, setConfig] = useState<AnimationConfig>(
    initialConfig || {
      id: `anim-${Date.now()}`,
      type: 'fade',
      duration: 1000,
      delay: 0,
      timing: 'ease-in-out',
      iterations: 1,
      intensity: 100,
    }
  )

  const [isPlaying, setIsPlaying] = useState(false)
  const [showPreview, setShowPreview] = useState(true)

  const animationTypes: AnimationType[] = [
    'fade',
    'slide',
    'scale',
    'rotate',
    'bounce',
    'pulse',
    'shake',
    'flip',
    'zoom',
    'swing',
    'wobble',
    'heartbeat',
    'float',
    'glow',
    'wave',
  ]

  const timingOptions: AnimationTiming[] = [
    'linear',
    'ease',
    'ease-in',
    'ease-out',
    'ease-in-out',
    'bounce',
    'elastic',
  ]

  const handlePresetSelect = (presetName: string) => {
    const preset = ANIMATION_PRESETS[presetName]
    if (preset) {
      setConfig({
        ...config,
        ...preset,
        id: `anim-${Date.now()}`,
      } as AnimationConfig)
    }
  }

  const handlePlayAnimation = () => {
    if (isPlaying) {
      removeAnimation(elementId, config.id)
      setIsPlaying(false)
    } else {
      applyAnimation(elementId, config)
      setIsPlaying(true)

      // Auto-stop after one iteration if not infinite
      if (config.iterations !== 'infinite') {
        setTimeout(() => {
          setIsPlaying(false)
        }, config.duration * config.iterations + config.delay)
      }
    }
  }

  const handleReset = () => {
    removeAnimation(elementId, config.id)
    setIsPlaying(false)
    setConfig({
      id: `anim-${Date.now()}`,
      type: 'fade',
      duration: 1000,
      delay: 0,
      timing: 'ease-in-out',
      iterations: 1,
      intensity: 100,
    })
  }

  const handleSave = () => {
    onSave(config)
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Sparkles className="text-purple-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">Animation Editor</h2>
          <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-full">
            PRO
          </span>
        </div>

        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          {showPreview ? (
            <>
              <Eye size={20} />
              <span>Preview On</span>
            </>
          ) : (
            <>
              <EyeOff size={20} />
              <span>Preview Off</span>
            </>
          )}
        </button>
      </div>

      {/* Preset Animations */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Quick Presets</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {Object.keys(ANIMATION_PRESETS).map((presetName) => (
            <button
              key={presetName}
              onClick={() => handlePresetSelect(presetName)}
              className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm font-medium rounded-lg transition-all transform hover:scale-105"
            >
              {presetName}
            </button>
          ))}
        </div>
      </div>

      {/* Animation Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Animation Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Animation Type
          </label>
          <select
            value={config.type}
            onChange={(e) =>
              setConfig({ ...config, type: e.target.value as AnimationType })
            }
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
          >
            {animationTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Timing Function */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Timing Function
          </label>
          <select
            value={config.timing}
            onChange={(e) =>
              setConfig({ ...config, timing: e.target.value as AnimationTiming })
            }
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
          >
            {timingOptions.map((timing) => (
              <option key={timing} value={timing}>
                {timing}
              </option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Duration: {config.duration}ms
          </label>
          <input
            type="range"
            min="100"
            max="5000"
            step="100"
            value={config.duration}
            onChange={(e) =>
              setConfig({ ...config, duration: parseInt(e.target.value) })
            }
            className="w-full"
          />
        </div>

        {/* Delay */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Delay: {config.delay}ms
          </label>
          <input
            type="range"
            min="0"
            max="3000"
            step="100"
            value={config.delay}
            onChange={(e) =>
              setConfig({ ...config, delay: parseInt(e.target.value) })
            }
            className="w-full"
          />
        </div>

        {/* Iterations */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Iterations
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max="10"
              value={config.iterations === 'infinite' ? 1 : config.iterations}
              onChange={(e) =>
                setConfig({ ...config, iterations: parseInt(e.target.value) })
              }
              disabled={config.iterations === 'infinite'}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none disabled:bg-gray-100"
            />
            <button
              onClick={() =>
                setConfig({
                  ...config,
                  iterations: config.iterations === 'infinite' ? 1 : 'infinite',
                })
              }
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                config.iterations === 'infinite'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ∞
            </button>
          </div>
        </div>

        {/* Intensity */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Intensity: {config.intensity}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={config.intensity}
            onChange={(e) =>
              setConfig({ ...config, intensity: parseInt(e.target.value) })
            }
            className="w-full"
          />
        </div>
      </div>

      {/* Preview Box */}
      {showPreview && (
        <div className="mb-6 p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
          <div className="flex items-center justify-center">
            <div
              id={elementId}
              className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg flex items-center justify-center"
            >
              <Zap className="text-white" size={48} />
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handlePlayAnimation}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
        >
          {isPlaying ? (
            <>
              <Pause size={20} />
              <span>Stop</span>
            </>
          ) : (
            <>
              <Play size={20} />
              <span>Play Preview</span>
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
        >
          <RotateCcw size={20} />
          <span>Reset</span>
        </button>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
        >
          <Save size={20} />
          <span>Save Animation</span>
        </button>

        <button
          onClick={() => removeAnimation(elementId, config.id)}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
        >
          <Trash2 size={20} />
          <span>Clear</span>
        </button>
      </div>

      {/* CSS Output */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Generated CSS
        </h3>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
          {generateAnimationCSS(config)}
        </pre>
      </div>
    </div>
  )
}

