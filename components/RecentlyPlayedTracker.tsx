'use client'

import { useEffect } from 'react'
import { saveRecentlyPlayed } from './RecentlyPlayed'

interface RecentlyPlayedTrackerProps {
  slug: string
  title: string
  thumbnail: string
  gradient: string
  initials: string
}

export default function RecentlyPlayedTracker({
  slug,
  title,
  thumbnail,
  gradient,
  initials,
}: RecentlyPlayedTrackerProps) {
  useEffect(() => {
    saveRecentlyPlayed({
      slug,
      title,
      thumbnail,
      gradient,
      initials,
    })
  }, [slug, title, thumbnail, gradient, initials])

  return null
}
