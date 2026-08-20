'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SafeImage from '@/components/SafeImage'
import { Heart, Trash2, X } from 'lucide-react'

const STORAGE_KEY = 'arcadenexa-favorites'

interface FavoriteGame {
  slug: string
  title: string
  thumbnail: string
  gradient: string
  initials: string
  rating?: number
  genre?: string
}

function getFavoriteSlugs(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []

    if (!Array.isArray(parsed)) return []

    return parsed.filter(
      (item): item is string => typeof item === 'string'
    )
  } catch {
    return []
  }
}

export default function FavoritesClient() {
  const [games, setGames] = useState<FavoriteGame[]>([])
  const [loading, setLoading] = useState(true)

  async function loadFavorites() {
    setLoading(true)

    const slugs = getFavoriteSlugs()

    if (slugs.length === 0) {
      setGames([])
      setLoading(false)
      return
    }

    const results = await Promise.all(
      slugs.map(async (slug) => {
        try {
          const response = await fetch(
            `/api/games/${encodeURIComponent(slug)}`
          )

          if (!response.ok) return null

          return (await response.json()) as FavoriteGame
        } catch {
          return null
        }
      })
    )

    setGames(
      results.filter(
        (game): game is FavoriteGame => game !== null
      )
    )

    setLoading(false)
  }

  useEffect(() => {
    loadFavorites()

    const update = () => {
      loadFavorites()
    }

    window.addEventListener(
      'arcadenexa-favorites-changed',
      update
    )

    return () => {
      window.removeEventListener(
        'arcadenexa-favorites-changed',
        update
      )
    }
  }, [])

  function removeFavorite(slug: string) {
    const favorites = getFavoriteSlugs()
    const next = favorites.filter((item) => item !== slug)

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(next)
    )

    setGames((current) =>
      current.filter((game) => game.slug !== slug)
    )

    window.dispatchEvent(
      new CustomEvent('arcadenexa-favorites-changed')
    )
  }

  function clearAll() {
    localStorage.removeItem(STORAGE_KEY)
    setGames([])

    window.dispatchEvent(
      new CustomEvent('arcadenexa-favorites-changed')
    )
  }

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-pink-400">
              Your Collection
            </p>

            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
              ♥ Favorite Games
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Games you saved to play later.
            </p>
          </div>

          {games.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-sm font-bold text-red-300 transition hover:border-red-400/40 hover:bg-red-400/20"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400" />

            <p className="mt-4 text-sm text-gray-500">
              Loading your favorites...
            </p>
          </div>
        ) : games.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-20 text-center">
            <Heart className="mx-auto h-12 w-12 text-gray-600" />

            <h2 className="mt-5 text-xl font-bold text-white">
              No favorite games yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Tap “Add to Favorites” on any game to save it here.
            </p>

            <Link
              href="/games"
              className="mt-6 inline-flex rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-cyan-400"
            >
              Browse Games
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {games.map((game) => (
              <div
                key={game.slug}
                className="group overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] transition hover:-translate-y-1 hover:border-pink-400/30"
              >
                <Link
                  href={`/games/${game.slug}`}
                  className="block"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <SafeImage
                      src={game.thumbnail}
                      alt={`${game.title} thumbnail`}
                      gradient={game.gradient}
                      initials={game.initials}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />
                  </div>
                </Link>

                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/games/${game.slug}`}
                      className="min-w-0"
                    >
                      <h2 className="truncate text-sm font-bold text-white transition group-hover:text-cyan-300">
                        {game.title}
                      </h2>

                      {game.genre && (
                        <p className="mt-1 truncate text-xs text-gray-500">
                          {game.genre}
                        </p>
                      )}

                      {typeof game.rating === 'number' && (
                        <p className="mt-1 text-xs text-yellow-400">
                          ★ {game.rating.toFixed(1)}
                        </p>
                      )}
                    </Link>

                    <button
                      type="button"
                      onClick={() => removeFavorite(game.slug)}
                      aria-label={`Remove ${game.title} from favorites`}
                      title="Remove from favorites"
                      className="shrink-0 rounded-lg p-2 text-gray-500 transition hover:bg-red-400/10 hover:text-red-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
