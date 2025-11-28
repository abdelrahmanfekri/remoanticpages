
export type AnimationType =
  | 'fade'
  | 'slide'
  | 'scale'
  | 'rotate'
  | 'bounce'
  | 'pulse'
  | 'shake'
  | 'flip'
  | 'zoom'
  | 'swing'
  | 'wobble'
  | 'heartbeat'
  | 'float'
  | 'glow'
  | 'wave'

export type AnimationDirection = 'up' | 'down' | 'left' | 'right' | 'center'

export type AnimationTiming = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce' | 'elastic'

export interface AnimationConfig {
  id: string
  type: AnimationType
  direction?: AnimationDirection
  duration: number 
  delay: number 
  timing: AnimationTiming
  iterations: number | 'infinite'
  intensity: number 
}

export interface InteractiveElement {
  id: string
  elementType: 'button' | 'image' | 'text' | 'card'
  hoverAnimation?: AnimationConfig
  clickAnimation?: AnimationConfig
  scrollAnimation?: AnimationConfig
}

export interface CustomTransition {
  id: string
  name: string
  fromSection: string
  toSection: string
  animation: AnimationConfig
}

export const ANIMATION_PRESETS: Record<string, Partial<AnimationConfig>> = {
  fadeIn: {
    type: 'fade',
    duration: 1000,
    delay: 0,
    timing: 'ease-in',
    iterations: 1,
    intensity: 100,
  },
  slideInLeft: {
    type: 'slide',
    direction: 'left',
    duration: 800,
    delay: 0,
    timing: 'ease-out',
    iterations: 1,
    intensity: 100,
  },
  slideInRight: {
    type: 'slide',
    direction: 'right',
    duration: 800,
    delay: 0,
    timing: 'ease-out',
    iterations: 1,
    intensity: 100,
  },
  slideInUp: {
    type: 'slide',
    direction: 'up',
    duration: 800,
    delay: 0,
    timing: 'ease-out',
    iterations: 1,
    intensity: 100,
  },
  slideInDown: {
    type: 'slide',
    direction: 'down',
    duration: 800,
    delay: 0,
    timing: 'ease-out',
    iterations: 1,
    intensity: 100,
  },
  scaleIn: {
    type: 'scale',
    duration: 600,
    delay: 0,
    timing: 'ease-out',
    iterations: 1,
    intensity: 100,
  },
  rotateIn: {
    type: 'rotate',
    duration: 1000,
    delay: 0,
    timing: 'ease-out',
    iterations: 1,
    intensity: 100,
  },
  bounceIn: {
    type: 'bounce',
    duration: 1000,
    delay: 0,
    timing: 'bounce',
    iterations: 1,
    intensity: 100,
  },
  zoomIn: {
    type: 'zoom',
    duration: 800,
    delay: 0,
    timing: 'ease-out',
    iterations: 1,
    intensity: 100,
  },
  flipIn: {
    type: 'flip',
    duration: 1000,
    delay: 0,
    timing: 'ease-out',
    iterations: 1,
    intensity: 100,
  },

  // Continuous Animations
  pulse: {
    type: 'pulse',
    duration: 2000,
    delay: 0,
    timing: 'ease-in-out',
    iterations: 'infinite',
    intensity: 50,
  },
  heartbeat: {
    type: 'heartbeat',
    duration: 1500,
    delay: 0,
    timing: 'ease-in-out',
    iterations: 'infinite',
    intensity: 50,
  },
  float: {
    type: 'float',
    duration: 3000,
    delay: 0,
    timing: 'ease-in-out',
    iterations: 'infinite',
    intensity: 30,
  },
  glow: {
    type: 'glow',
    duration: 2000,
    delay: 0,
    timing: 'ease-in-out',
    iterations: 'infinite',
    intensity: 60,
  },
  shake: {
    type: 'shake',
    duration: 500,
    delay: 0,
    timing: 'ease-in-out',
    iterations: 'infinite',
    intensity: 30,
  },
  wobble: {
    type: 'wobble',
    duration: 1000,
    delay: 0,
    timing: 'ease-in-out',
    iterations: 'infinite',
    intensity: 40,
  },
  swing: {
    type: 'swing',
    duration: 2000,
    delay: 0,
    timing: 'ease-in-out',
    iterations: 'infinite',
    intensity: 50,
  },
  wave: {
    type: 'wave',
    duration: 2500,
    delay: 0,
    timing: 'ease-in-out',
    iterations: 'infinite',
    intensity: 40,
  },
}

export function generateAnimationCSS(config: AnimationConfig): string {
  const { type, direction, duration, delay, timing, iterations, intensity } = config

  const animationName = `${type}${direction ? `-${direction}` : ''}-${config.id}`
  const iterationCount = iterations === 'infinite' ? 'infinite' : iterations

  let keyframes = ''

  switch (type) {
    case 'fade':
      keyframes = `
        @keyframes ${animationName} {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `
      break

    case 'slide':
      const slideDistance = `${intensity}px`
      const slideFrom = direction === 'left' ? `-${slideDistance}` : direction === 'right' ? slideDistance : direction === 'up' ? `0, -${slideDistance}` : `0, ${slideDistance}`
      keyframes = `
        @keyframes ${animationName} {
          from { transform: translate(${slideFrom}); opacity: 0; }
          to { transform: translate(0, 0); opacity: 1; }
        }
      `
      break

    case 'scale':
      const scaleFrom = 1 - intensity / 100
      keyframes = `
        @keyframes ${animationName} {
          from { transform: scale(${scaleFrom}); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `
      break

    case 'rotate':
      const rotateDeg = (intensity / 100) * 360
      keyframes = `
        @keyframes ${animationName} {
          from { transform: rotate(${rotateDeg}deg); opacity: 0; }
          to { transform: rotate(0deg); opacity: 1; }
        }
      `
      break

    case 'bounce':
      keyframes = `
        @keyframes ${animationName} {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-${intensity / 2}px); }
          50% { transform: translateY(0); }
          75% { transform: translateY(-${intensity / 4}px); }
        }
      `
      break

    case 'pulse':
      const pulseScale = 1 + intensity / 200
      keyframes = `
        @keyframes ${animationName} {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(${pulseScale}); }
        }
      `
      break

    case 'shake':
      const shakeAmount = intensity / 10
      keyframes = `
        @keyframes ${animationName} {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-${shakeAmount}px); }
          75% { transform: translateX(${shakeAmount}px); }
        }
      `
      break

    case 'flip':
      keyframes = `
        @keyframes ${animationName} {
          from { transform: perspective(400px) rotateY(90deg); opacity: 0; }
          to { transform: perspective(400px) rotateY(0deg); opacity: 1; }
        }
      `
      break

    case 'zoom':
      const zoomScale = 1 + intensity / 50
      keyframes = `
        @keyframes ${animationName} {
          from { transform: scale(${zoomScale}); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `
      break

    case 'swing':
      const swingDeg = intensity / 2
      keyframes = `
        @keyframes ${animationName} {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(${swingDeg}deg); }
          75% { transform: rotate(-${swingDeg}deg); }
        }
      `
      break

    case 'wobble':
      const wobbleDeg = intensity / 3
      keyframes = `
        @keyframes ${animationName} {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-${intensity / 10}px) rotate(-${wobbleDeg}deg); }
          50% { transform: translateX(${intensity / 10}px) rotate(${wobbleDeg}deg); }
          75% { transform: translateX(-${intensity / 10}px) rotate(-${wobbleDeg}deg); }
        }
      `
      break

    case 'heartbeat':
      keyframes = `
        @keyframes ${animationName} {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(${1 + intensity / 200}); }
          28% { transform: scale(1); }
          42% { transform: scale(${1 + intensity / 200}); }
          70% { transform: scale(1); }
        }
      `
      break

    case 'float':
      keyframes = `
        @keyframes ${animationName} {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-${intensity / 2}px); }
        }
      `
      break

    case 'glow':
      const glowIntensity = intensity / 100
      keyframes = `
        @keyframes ${animationName} {
          0%, 100% { box-shadow: 0 0 5px rgba(255, 255, 255, ${glowIntensity * 0.5}); }
          50% { box-shadow: 0 0 20px rgba(255, 255, 255, ${glowIntensity}), 0 0 30px rgba(255, 255, 255, ${glowIntensity * 0.7}); }
        }
      `
      break

    case 'wave':
      keyframes = `
        @keyframes ${animationName} {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-${intensity / 4}px) rotate(${intensity / 20}deg); }
          50% { transform: translateY(0) rotate(0deg); }
          75% { transform: translateY(${intensity / 4}px) rotate(-${intensity / 20}deg); }
        }
      `
      break
  }

  const animationCSS = `
    ${keyframes}
    .animation-${config.id} {
      animation: ${animationName} ${duration}ms ${timing} ${delay}ms ${iterationCount};
    }
  `

  return animationCSS
}

export function applyAnimation(elementId: string, config: AnimationConfig): void {
  const element = document.getElementById(elementId)
  if (!element) return

  const css = generateAnimationCSS(config)
  const styleId = `animation-style-${config.id}`

  const existingStyle = document.getElementById(styleId)
  if (existingStyle) {
    existingStyle.remove()
  }

  const style = document.createElement('style')
  style.id = styleId
  style.textContent = css
  document.head.appendChild(style)

  element.classList.add(`animation-${config.id}`)
}

export function removeAnimation(elementId: string, animationId: string): void {
  const element = document.getElementById(elementId)
  if (!element) return

  element.classList.remove(`animation-${animationId}`)

  const styleId = `animation-style-${animationId}`
  const style = document.getElementById(styleId)
  if (style) {
    style.remove()
  }
}

