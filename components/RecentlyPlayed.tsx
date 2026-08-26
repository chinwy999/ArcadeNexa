'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SafeImage from './SafeImage'

const STORAGE_KEY = 'arcadenexa-recently-played'
const MAX_ITEMS = 8

export interface RecentGame {
  slug: string
  title: string
  thumbnail: string
  gradient: string
  initials: string
}

function getRecentGames(): RecentGame[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []

    if (!Array.isArray(parsed)) return []

    return parsed.slice(0, MAX_ITEMS)
  } catch {
    return []
  }
}

export function saveRecentlyPlayed(game: RecentGame) {
  try {
    const current = getRecentGames()

    const next = [
      game,
      ...current.filter((item) => item.slug !== game.slug),
    ].slice(0, MAX_ITEMS)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))

    window.dispatchEvent(
      new CustomEvent('arcadenexa-recent-changed')
    )
  } catch {
    // Ignore storage errors.
  }
}

export default function RecentlyPlayed() {
  const [games, setGames] = useState<RecentGame[]>([])

  useEffect(() => {
    const update = () => {
      setGames(getRecentGames())
    }

    update()

    window.addEventListener(
      'arcadenexa-recent-changed',
      update
    )

    return () => {
      window.removeEventListener(
        'arcadenexa-recent-changed',
        update
      )
    }
  }, [])

  if (games.length === 0) {
    return null
  }

  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-nexa-cyan">
              Continue
            </p>

            <h2 className="mt-1 text-2xl font-black text-[color:var(--text-primary)] sm:text-3xl">
              ↻ Recently Played
            </h2>
          </div>

          <span className="text-xs text-[color:var(--text-muted)]">
            Your last games
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {games.map((game) => (
            <Link
              key={game.slug}
              href={`/games/${game.slug}`}
              className="group min-w-0 overflow-hidden rounded-xl border border-[color:var(--white-05)] bg-nexa-surface transition hover:-translate-y-1 hover:border-nexa-cyan/30"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <SafeImage
                  src={game.thumbnail}
                  alt={`${game.title} thumbnail`}
                  gradient={game.gradient}
                  initials={game.initials}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 12vw"
                />
              </div>

              <div className="p-2.5">
                <p className="truncate text-xs font-bold text-[color:var(--text-primary)] group-hover:text-nexa-cyan">
                  {game.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
