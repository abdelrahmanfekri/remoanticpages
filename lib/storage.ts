import { createClient } from '@/lib/supabase/client'

export const STORAGE_BUCKETS = {
  MEDIA: 'media',
  MUSIC: 'music',
} as const

export const FILE_LIMITS = {
  IMAGE: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  },
  VIDEO: {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    allowedExtensions: ['.mp4', '.webm', '.mov'],
  },
  AUDIO: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'],
    allowedExtensions: ['.mp3', '.wav', '.ogg'],
  },
}

export interface UploadResult {
  url: string
  path: string
  size: number
  type: string
}

export interface ValidationError {
  field: string
  message: string
}

export function validateFile(
  file: File,
  type: 'image' | 'video' | 'audio'
): { valid: boolean; error?: string } {
  const limits = type === 'image' ? FILE_LIMITS.IMAGE : type === 'video' ? FILE_LIMITS.VIDEO : FILE_LIMITS.AUDIO

  if (file.size > limits.maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${limits.maxSize / (1024 * 1024)}MB limit`,
    }
  }

  if (!limits.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${limits.allowedExtensions.join(', ')}`,
    }
  }

  const extension = '.' + file.name.split('.').pop()?.toLowerCase()
  if (!limits.allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `File extension ${extension} is not allowed`,
    }
  }

  return { valid: true }
}

export function generateFilePath(userId: string, fileName: string, type: 'media' | 'music'): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const sanitizedName = fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .substring(0, 50)
  
  return `${type}/${userId}/${timestamp}_${randomString}_${sanitizedName}`
}

export async function uploadFile(
  file: File,
  bucket: string,
  path: string,
  _onProgress?: (progress: number) => void
): Promise<UploadResult> {
  const supabase = createClient()

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  // Get public URL
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)

  return {
    url: urlData.publicUrl,
    path: data.path,
    size: file.size,
    type: file.type,
  }
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFile(bucket: string, path: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.storage.from(bucket).remove([path])

  if (error) {
    throw new Error(`Delete failed: ${error.message}`)
  }
}

/**
 * Get file URL from path
 */
export function getFileUrl(bucket: string, path: string): string {
  const supabase = createClient()
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Validate multiple files
 */
export function validateFiles(
  files: File[],
  type: 'image' | 'video' | 'audio',
  maxCount?: number
): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = []

  if (maxCount && files.length > maxCount) {
    errors.push({
      field: 'count',
      message: `Maximum ${maxCount} files allowed`,
    })
  }

  files.forEach((file, index) => {
    const validation = validateFile(file, type)
    if (!validation.valid) {
      errors.push({
        field: `file_${index}`,
        message: validation.error || 'Invalid file',
      })
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Get file type from URL or filename
 */
export function getFileType(urlOrFilename: string): 'image' | 'video' | 'audio' | 'unknown' {
  const extension = urlOrFilename.split('.').pop()?.toLowerCase()
  
  if (FILE_LIMITS.IMAGE.allowedExtensions.includes(`.${extension}`)) {
    return 'image'
  }
  if (FILE_LIMITS.VIDEO.allowedExtensions.includes(`.${extension}`)) {
    return 'video'
  }
  if (FILE_LIMITS.AUDIO.allowedExtensions.includes(`.${extension}`)) {
    return 'audio'
  }
  
  return 'unknown'
}

