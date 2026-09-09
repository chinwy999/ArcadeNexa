'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Clock } from 'lucide-react'
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
    <section className="px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/15 to-blue-500/10 shadow-[0_8px_25px_rgba(34,211,238,0.08)]">
              <Clock size={18} className="text-nexa-cyan" />
              <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5" />
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-nexa-cyan">
                Continue
              </p>

              <h2 className="mt-0.5 text-lg font-black tracking-tight text-[color:var(--text-primary)] sm:text-xl">
                Recently Played
              </h2>
            </div>
          </div>

          <span className="hidden shrink-0 text-[10px] font-semibold text-[color:var(--text-muted)] sm:block">
            Your last games
          </span>
        </div>

        <div className="mb-4 h-px bg-gradient-to-r from-nexa-cyan/35 via-[color:var(--white-10)] to-transparent" />

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-8">
          {games.map((game) => (
            <Link
              key={game.slug}
              href={`/games/${game.slug}`}
              className="group min-w-0 overflow-hidden rounded-xl border border-[color:var(--white-08)] bg-[color:var(--nexa-surface)] shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-nexa-cyan/30 hover:shadow-[0_14px_30px_rgba(0,0,0,0.28)]"
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

              <div className="border-t border-[color:var(--white-05)] px-2.5 py-2.5">
                <p className="truncate text-[11px] font-extrabold text-[color:var(--text-primary)] transition-colors group-hover:text-nexa-cyan">
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
