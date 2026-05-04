'use client'

import { useEffect } from 'react'

/**
 * Imperative hash <-> <details> sync.
 *
 * - On mount: reads window.location.hash, opens the matching <details>
 *   element (and its parent <details> if nested), and scrolls into view.
 * - On user toggle: writes the open <details>' id back to the URL with
 *   replaceState (no history pollution; only lesson clicks should push).
 *
 * Renders nothing. Single instance per page.
 */
export function HashOpener() {
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (!hash) return
    const el = document.getElementById(hash)
    if (el && el.tagName === 'DETAILS') {
      el.setAttribute('open', '')
      const parent = el.parentElement?.closest('details')
      if (parent) parent.setAttribute('open', '')
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      const details = e.target as HTMLDetailsElement
      if (details.tagName !== 'DETAILS' || !details.id) return
      if (details.open) {
        history.replaceState(null, '', `#${details.id}`)
      }
    }
    document.addEventListener('toggle', handler, true)
    return () => document.removeEventListener('toggle', handler, true)
  }, [])

  return null
}
