'use client'

import { useState, useEffect } from 'react'
import { Sparkles, MousePointer, Hand, Eye } from 'lucide-react'
import { AnimationConfig, applyAnimation, removeAnimation } from '@/lib/animations'

interface InteractiveElementProps {
  id: string
  children: React.ReactNode
  hoverAnimation?: AnimationConfig
  clickAnimation?: AnimationConfig
  scrollAnimation?: AnimationConfig
  className?: string
}

export function InteractiveElement({
  id,
  children,
  hoverAnimation,
  clickAnimation,
  scrollAnimation,
  className = '',
}: InteractiveElementProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  // Handle scroll animation
  useEffect(() => {
    if (!scrollAnimation) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true)
          applyAnimation(id, scrollAnimation)
        }
      },
      { threshold: 0.2 }
    )

    const element = document.getElementById(id)
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [id, scrollAnimation, isInView])

  const handleMouseEnter = () => {
    if (hoverAnimation && !isHovered) {
      setIsHovered(true)
      applyAnimation(id, hoverAnimation)
    }
  }

  const handleMouseLeave = () => {
    if (hoverAnimation && isHovered) {
      setIsHovered(false)
      removeAnimation(id, hoverAnimation.id)
    }
  }

  const handleClick = () => {
    if (clickAnimation) {
      setIsClicked(true)
      applyAnimation(id, clickAnimation)

      setTimeout(() => {
        setIsClicked(false)
        removeAnimation(id, clickAnimation.id)
      }, clickAnimation.duration + clickAnimation.delay)
    }
  }

  return (
    <div
      id={id}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ cursor: clickAnimation && !isClicked ? 'pointer' : 'default' }}
    >
      {children}
    </div>
  )
}

interface InteractiveCardProps {
  children: React.ReactNode
  className?: string
  enableHover?: boolean
  enableClick?: boolean
}

export function InteractiveCard({
  children,
  className = '',
  enableHover = true,
  enableClick = false,
}: InteractiveCardProps) {
  const cardId = `interactive-card-${Math.random().toString(36).substr(2, 9)}`

  const hoverAnimation: AnimationConfig = {
    id: `hover-${cardId}`,
    type: 'scale',
    duration: 300,
    delay: 0,
    timing: 'ease-out',
    iterations: 1,
    intensity: 105,
  }

  const clickAnimation: AnimationConfig = {
    id: `click-${cardId}`,
    type: 'pulse',
    duration: 500,
    delay: 0,
    timing: 'ease-in-out',
    iterations: 1,
    intensity: 110,
  }

  return (
    <InteractiveElement
      id={cardId}
      hoverAnimation={enableHover ? hoverAnimation : undefined}
      clickAnimation={enableClick ? clickAnimation : undefined}
      className={className}
    >
      {children}
    </InteractiveElement>
  )
}

interface InteractiveButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
}

export function InteractiveButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
}: InteractiveButtonProps) {
  const buttonId = `interactive-button-${Math.random().toString(36).substr(2, 9)}`

  const hoverAnimation: AnimationConfig = {
    id: `hover-${buttonId}`,
    type: 'float',
    duration: 500,
    delay: 0,
    timing: 'ease-in-out',
    iterations: 1,
    intensity: 10,
  }

  const clickAnimation: AnimationConfig = {
    id: `click-${buttonId}`,
    type: 'bounce',
    duration: 600,
    delay: 0,
    timing: 'bounce',
    iterations: 1,
    intensity: 20,
  }

  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  }

  return (
    <InteractiveElement
      id={buttonId}
      hoverAnimation={hoverAnimation}
      clickAnimation={clickAnimation}
      className={`px-6 py-3 rounded-lg font-semibold transition-all ${variantClasses[variant]} ${className}`}
    >
      <button onClick={onClick} className="w-full h-full">
        {children}
      </button>
    </InteractiveElement>
  )
}

interface InteractiveImageProps {
  src: string
  alt: string
  className?: string
}

export function InteractiveImage({ src, alt, className = '' }: InteractiveImageProps) {
  const imageId = `interactive-image-${Math.random().toString(36).substr(2, 9)}`

  const scrollAnimation: AnimationConfig = {
    id: `scroll-${imageId}`,
    type: 'fade',
    duration: 1000,
    delay: 0,
    timing: 'ease-out',
    iterations: 1,
    intensity: 100,
  }

  const hoverAnimation: AnimationConfig = {
    id: `hover-${imageId}`,
    type: 'zoom',
    duration: 400,
    delay: 0,
    timing: 'ease-out',
    iterations: 1,
    intensity: 110,
  }

  return (
    <InteractiveElement
      id={imageId}
      scrollAnimation={scrollAnimation}
      hoverAnimation={hoverAnimation}
      className={`overflow-hidden rounded-lg ${className}`}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover transition-transform" />
    </InteractiveElement>
  )
}

interface TransitionManagerProps {
  children: React.ReactNode
  transitions: CustomTransition[]
}

interface CustomTransition {
  id: string
  name: string
  fromSection: string
  toSection: string
  animation: AnimationConfig
}

export function TransitionManager({ children, transitions }: TransitionManagerProps) {
  useEffect(() => {
    transitions.forEach((transition) => {
      const fromElement = document.getElementById(transition.fromSection)
      const toElement = document.getElementById(transition.toSection)

      if (fromElement && toElement) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              applyAnimation(transition.toSection, transition.animation)
            }
          },
          { threshold: 0.5 }
        )

        observer.observe(fromElement)

        return () => {
          observer.unobserve(fromElement)
        }
      }
    })
  }, [transitions])

  return <>{children}</>
}

export function AnimationShowcase() {
  const animations = [
    { name: 'Fade In', type: 'fade' },
    { name: 'Slide Up', type: 'slide' },
    { name: 'Scale', type: 'scale' },
    { name: 'Rotate', type: 'rotate' },
    { name: 'Bounce', type: 'bounce' },
    { name: 'Pulse', type: 'pulse' },
    { name: 'Shake', type: 'shake' },
    { name: 'Float', type: 'float' },
    { name: 'Glow', type: 'glow' },
  ]

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="text-purple-600" size={32} />
        <h2 className="text-3xl font-bold text-gray-800">Interactive Elements</h2>
        <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-full">
          PRO
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <MousePointer className="text-purple-600" size={24} />
            <h3 className="text-lg font-semibold">Hover Effects</h3>
          </div>
          <InteractiveCard enableHover={true} className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg text-white text-center">
            <p className="font-semibold">Hover over me!</p>
          </InteractiveCard>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Hand className="text-pink-600" size={24} />
            <h3 className="text-lg font-semibold">Click Effects</h3>
          </div>
          <InteractiveCard enableClick={true} className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 rounded-lg text-white text-center">
            <p className="font-semibold">Click me!</p>
          </InteractiveCard>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="text-blue-600" size={24} />
            <h3 className="text-lg font-semibold">Scroll Effects</h3>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-lg text-white text-center">
            <p className="font-semibold">Scroll to animate!</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Available Animations</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {animations.map((anim) => (
            <div
              key={anim.name}
              className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg text-center text-sm font-medium text-gray-700"
            >
              {anim.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

