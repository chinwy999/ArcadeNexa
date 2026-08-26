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
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-nexa-violet">
              Your Collection
            </p>

            <h1 className="mt-2 text-3xl font-black text-nexa-text-primary sm:text-4xl">
              ♥ Favorite Games
            </h1>

            <p className="mt-2 text-sm text-nexa-text-secondary">
              Games you saved to play later.
            </p>
          </div>

          {games.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-nexa-violet/20 bg-nexa-violet/10 px-4 py-2.5 text-sm font-bold text-nexa-violet transition hover:border-nexa-violet/40 hover:bg-nexa-violet/20"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400" />

            <p className="mt-4 text-sm text-nexa-text-muted">
              Loading your favorites...
            </p>
          </div>
        ) : games.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-20 text-center">
            <Heart className="mx-auto h-12 w-12 text-nexa-text-muted" />

            <h2 className="mt-5 text-xl font-bold text-nexa-text-primary">
              No favorite games yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-nexa-text-muted">
              Tap “Add to Favorites” on any game to save it here.
            </p>

            <Link
              href="/games"
              className="mt-6 inline-flex rounded-xl bg-nexa-cyan px-5 py-3 text-sm font-bold text-nexa-black transition hover:bg-nexa-cyan"
            >
              Browse Games
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {games.map((game) => (
              <div
                key={game.slug}
                className="group overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] transition hover:-translate-y-1 hover:border-nexa-violet/30"
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
                      <h2 className="truncate text-sm font-bold text-nexa-text-primary transition group-hover:text-nexa-cyan">
                        {game.title}
                      </h2>

                      {game.genre && (
                        <p className="mt-1 truncate text-xs text-nexa-text-muted">
                          {game.genre}
                        </p>
                      )}

                      {typeof game.rating === 'number' && (
                        <p className="mt-1 text-xs text-nexa-gold">
                          ★ {game.rating.toFixed(1)}
                        </p>
                      )}
                    </Link>

                    <button
                      type="button"
                      onClick={() => removeFavorite(game.slug)}
                      aria-label={`Remove ${game.title} from favorites`}
                      title="Remove from favorites"
                      className="shrink-0 rounded-lg p-2 text-nexa-text-muted transition hover:bg-nexa-violet/10 hover:text-nexa-violet"
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
