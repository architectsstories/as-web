'use client'

import { useEffect, useRef } from 'react'

// Fires once per real page load (client-side, after hydration) so a view
// only counts when an actual visitor opens the page — not on every
// server-side re-render or ISR revalidation.
export default function TrackProjectView({ slug }) {
  const firedRef = useRef(false)

  useEffect(() => {
    if (!slug || firedRef.current) return
    firedRef.current = true
    fetch('/api/track-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    }).catch(() => {})
  }, [slug])

  return null
}
