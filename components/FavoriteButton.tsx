'use client'

import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'

const STORAGE_KEY = 'arcadenexa-favorites'

function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function FavoriteButton({
  slug,
  title,
}: {
  slug: string
  title: string
}) {
  const [favorite, setFavorite] = useState(false)

  useEffect(() => {
    setFavorite(getFavorites().includes(slug))
  }, [slug])

  function toggleFavorite() {
    const favorites = getFavorites()
    const exists = favorites.includes(slug)

    const next = exists
      ? favorites.filter((item) => item !== slug)
      : [...favorites, slug]

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      setFavorite(!exists)

      window.dispatchEvent(
        new CustomEvent('arcadenexa-favorites-changed')
      )
    } catch {
      // Ignore storage errors.
    }
  }

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      aria-label={
        favorite
          ? `Remove ${title} from favorites`
          : `Add ${title} to favorites`
      }
      aria-pressed={favorite}
      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
        favorite
          ? 'border-pink-400/40 bg-pink-400/10 text-pink-300'
          : 'border-white/10 bg-white/5 text-gray-300 hover:border-pink-400/30 hover:text-pink-300'
      }`}
    >
      <Heart
        className="h-4 w-4"
        fill={favorite ? 'currentColor' : 'none'}
      />

      {favorite ? 'In Favorites' : 'Add to Favorites'}
    </button>
  )
}
