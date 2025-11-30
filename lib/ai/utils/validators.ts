import { z } from 'zod'

export function validateInput<T>(schema: z.Schema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`)
      return { success: false, error: messages.join(', ') }
    }
    return { success: false, error: 'Validation failed' }
  }
}

export function sanitizePrompt(prompt: string): string {
  return prompt
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 1000)
}

export function validateHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color)
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidBlockType(type: string): boolean {
  const validTypes = [
    'hero',
    'intro',
    'text',
    'quote',
    'gallery',
    'video',
    'timeline',
    'memories',
    'countdown',
    'two-column',
    'testimonials',
    'map',
    'divider',
    'spacer',
    'button',
    'social-links',
    'final-message',
  ]
  return validTypes.includes(type)
}

export function validateContentLength(content: string, min: number, max: number): { valid: boolean; error?: string } {
  const length = content.length
  
  if (length < min) {
    return { valid: false, error: `Content too short (minimum ${min} characters)` }
  }
  
  if (length > max) {
    return { valid: false, error: `Content too long (maximum ${max} characters)` }
  }
  
  return { valid: true }
}

export function validateJSON(json: string): { valid: boolean; data?: any; error?: string } {
  try {
    const data = JSON.parse(json)
    return { valid: true, data }
  } catch (error) {
    return { valid: false, error: 'Invalid JSON' }
  }
}

export function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

export function ensureString(value: unknown): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return ''
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function truncate(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - suffix.length) + suffix
}

