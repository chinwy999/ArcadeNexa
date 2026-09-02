'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Play, Star, Sparkles, Zap } from 'lucide-react'
import type { Game } from '@/lib/games'

interface FeaturedGamesSliderProps {
  games: Game[]
  autoPlayMs?: number
}

export default function FeaturedGamesSlider({
  games,
}: FeaturedGamesSliderProps) {
  const featuredGames = [...games]
    .filter((g) => g.playable && g.thumbnail && g.slug)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 8)

  if (featuredGames.length === 0) return null

  /*
   * Three identical sets create a seamless infinite track.
   * We animate exactly one set width, so the third set replaces
   * the first without a visible jump.
   */
  const trackGames = [
    ...featuredGames,
    ...featuredGames,
    ...featuredGames,
  ]

  return (
    <section
      className="relative w-full select-none overflow-hidden"
      aria-label="Featured games"
    >
      <style>{`
        @keyframes featuredInfiniteScroll {
          from {
            transform: translate3d(0, 0, 0);
          }

          to {
            transform: translate3d(-33.333333%, 0, 0);
          }
        }

        .featured-infinite-track {
          animation: featuredInfiniteScroll 52s linear infinite;
          width: max-content;
          will-change: transform;
        }

        .featured-infinite-track:hover {
          animation-play-state: running;
        }

        @media (max-width: 640px) {
          .featured-infinite-track {
            animation-duration: 42s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .featured-infinite-track {
            animation-duration: 80s;
          }
        }
      `}</style>

      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-nexa-violet/20">
            <Sparkles className="h-4 w-4 text-nexa-violet" />
          </div>

          <div>
            <h2 className="text-xl font-black text-[color:var(--text-primary)] sm:text-2xl">
              Featured Games
            </h2>

            <p className="text-[11px] text-[color:var(--text-muted)]">
              Hand-picked · Updated daily
            </p>
          </div>
        </div>

        <Link
          href="/games"
          className="group inline-flex items-center gap-2 rounded-full border border-[color:var(--white-10)] bg-[color:var(--white-05)] px-4 py-2 text-xs font-bold text-[color:var(--text-secondary)] transition-all hover:border-nexa-violet/50 hover:bg-nexa-violet/10 hover:text-[color:var(--text-primary)]"
        >
          View All
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>

      {/* Edge fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 top-[4.5rem] z-20 w-12 bg-gradient-to-r from-[var(--nexa-black)] via-[var(--nexa-black)]/70 to-transparent sm:w-24" />

      <div className="pointer-events-none absolute bottom-0 right-0 top-[4.5rem] z-20 w-12 bg-gradient-to-l from-[var(--nexa-black)] via-[var(--nexa-black)]/70 to-transparent sm:w-24" />

      {/* Infinite continuous track */}
      <div className="relative overflow-hidden py-2">
        <div className="featured-infinite-track flex gap-3 sm:gap-4">
          {trackGames.map((game, index) => (
            <Link
              key={`${game.slug}-${index}`}
              href={`/games/${game.slug}`}
              aria-label={`Play ${game.title}`}
              className="group relative w-[205px] shrink-0 overflow-hidden rounded-2xl border border-[color:var(--white-10)] bg-[color:var(--nexa-surface)] shadow-[0_14px_40px_rgba(0,0,0,0.32)] transition-all duration-300 hover:-translate-y-1 hover:border-nexa-violet/50 hover:shadow-[0_18px_45px_rgba(0,0,0,0.42)] sm:w-[245px] md:w-[275px]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={game.thumbnailLarge || game.thumbnail}
                  alt={game.title}
                  fill
                  sizes="260px"
                  loading="lazy"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />

                {/* Featured badge */}
                <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full border border-nexa-violet/30 bg-black/45 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-nexa-violet backdrop-blur-md">
                  <Sparkles className="h-3 w-3" />
                  Featured
                </div>

                {/* Play button */}
                <div className="absolute right-3 top-3 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full bg-nexa-emerald text-nexa-black opacity-0 shadow-[0_0_22px_rgba(34,197,94,0.35)] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <Play className="ml-0.5 h-4 w-4 fill-current" />
                </div>

                {/* Rating */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-lg bg-black/55 px-2 py-1 text-[10px] font-black text-nexa-gold backdrop-blur-md">
                  <Star className="h-3 w-3 fill-current" />
                  {Number(game.rating || 0).toFixed(1)}
                </div>

                {/* Instant play */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg bg-nexa-emerald/15 px-2 py-1 text-[9px] font-black text-nexa-emerald backdrop-blur-md">
                  <Zap className="h-3 w-3 fill-current" />
                  PLAY
                </div>
              </div>

              {/* Title */}
              <div className="flex min-h-[58px] items-center px-3 py-3">
                <h3 className="line-clamp-2 text-sm font-black leading-tight text-[color:var(--text-primary)] transition-colors duration-200 group-hover:text-nexa-violet">
                  {game.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
