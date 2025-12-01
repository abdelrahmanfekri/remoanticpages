'use client'

import { useEffect } from 'react'

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: {
    ctrl?: boolean
    cmd?: boolean
    shift?: boolean
    alt?: boolean
    enabled?: boolean
  } = {}
) {
  const { ctrl = false, cmd = false, shift = false, alt = false, enabled = true } = options

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const cmdOrCtrl = isMac ? cmd : ctrl

      const modifierMatch =
        (cmdOrCtrl ? (isMac ? event.metaKey : event.ctrlKey) : true) &&
        (shift ? event.shiftKey : !event.shiftKey) &&
        (alt ? event.altKey : !event.altKey)

      if (event.key.toLowerCase() === key.toLowerCase() && modifierMatch) {
        event.preventDefault()
        callback()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [key, callback, ctrl, cmd, shift, alt, enabled])
}

