'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Star,
  Sparkles,
} from 'lucide-react'
import type { Game } from '@/lib/games'

interface FeaturedGamesSliderProps {
  games: Game[]
  autoPlayMs?: number
}

export default function FeaturedGamesSlider({
  games,
  autoPlayMs = 5000,
}: FeaturedGamesSliderProps) {
  const featuredGames = [...games]
    .filter((game) => game.playable && game.thumbnail && game.slug)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 8)

  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const total = featuredGames.length

  const nextSlide = useCallback(() => {
    if (total < 2) return
    setCurrent((prev) => (prev + 1) % total)
  }, [total])

  const previousSlide = useCallback(() => {
    if (total < 2) return
    setCurrent((prev) => (prev - 1 + total) % total)
  }, [total])

  const selectSlide = useCallback((index: number) => {
    setCurrent(index)
  }, [])

  useEffect(() => {
    if (total < 2 || paused) return

    const timer = window.setInterval(nextSlide, autoPlayMs)

    return () => window.clearInterval(timer)
  }, [nextSlide, autoPlayMs, paused, total])

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
    touchEndX.current = null
    setPaused(true)
  }

  const handleTouchMove = (event: React.TouchEvent) => {
    touchEndX.current = event.touches[0]?.clientX ?? null
  }

  const handleTouchEnd = () => {
    if (
      touchStartX.current !== null &&
      touchEndX.current !== null
    ) {
      const distance = touchStartX.current - touchEndX.current

      if (Math.abs(distance) > 50) {
        if (distance > 0) {
          nextSlide()
        } else {
          previousSlide()
        }
      }
    }

    touchStartX.current = null
    touchEndX.current = null
    setPaused(false)
  }

  if (total === 0) {
    return null
  }

  const game = featuredGames[current]

  return (
    <section
      className="relative w-full"
      aria-label="Featured games"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header */}

      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-electric-violet" />

            <h2 className="text-2xl font-black text-white sm:text-3xl">
              Featured Games
            </h2>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Hand-picked games worth playing right now
          </p>
        </div>

        <div className="hidden text-xs font-bold text-gray-500 sm:block">
          {current + 1} / {total}
        </div>
      </div>

      {/* Main Hero */}

      <div
        className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#080812] shadow-2xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative min-h-[420px] overflow-hidden sm:min-h-[460px] lg:min-h-[500px]">

          <Image
            key={game.slug}
            src={game.thumbnailLarge || game.thumbnail}
            alt={game.title}
            fill
            priority={current === 0}
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover transition-all duration-700"
          />

          {/* Cinematic overlays */}

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/10" />

          {/* Hero content */}

          <div className="absolute inset-0 flex items-center">
            <div className="w-full px-6 py-10 sm:px-10 lg:px-14">

              <div className="max-w-2xl">

                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-electric-violet/40 bg-electric-violet/15 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-electric-violet backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" />
                  Featured
                </div>

                <h3 className="max-w-xl text-4xl font-black leading-[0.95] tracking-tight text-white drop-shadow-2xl sm:text-5xl lg:text-6xl">
                  {game.title}
                </h3>

                <div className="mt-5 flex flex-wrap items-center gap-3">

                  <span className="inline-flex items-center gap-1 rounded-lg bg-black/40 px-3 py-1.5 text-sm font-black text-yellow-400 backdrop-blur">
                    <Star className="h-4 w-4 fill-current" />
                    {Number(game.rating || 0).toFixed(1)}
                  </span>

                  <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-300 backdrop-blur">
                    {game.category || 'Arcade'}
                  </span>

                  <span className="rounded-lg border border-neon-green/20 bg-neon-green/5 px-3 py-1.5 text-sm font-bold text-neon-green backdrop-blur">
                    ArcadeNexa
                  </span>

                </div>

                <p className="mt-5 hidden max-w-xl text-sm leading-6 text-gray-300 sm:block lg:text-base">
                  {game.description ||
                    'Play instantly in your browser. No downloads required.'}
                </p>

                <div className="mt-7">

                  <Link
                    href={`/games/${game.slug}`}
                    className="group inline-flex items-center gap-2 rounded-xl bg-neon-green px-6 py-3.5 text-sm font-black text-space-black shadow-[0_0_30px_rgba(34,197,94,0.25)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(34,197,94,0.4)]"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    PLAY NOW
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>

                </div>

              </div>

            </div>
          </div>

          {/* Navigation */}

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous featured game"
                className="absolute left-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur-md transition hover:bg-electric-violet sm:left-5"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next featured game"
                className="absolute right-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur-md transition hover:bg-electric-violet sm:right-5"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Progress */}

          <div className="absolute bottom-4 left-6 right-6 z-30 sm:left-10 sm:right-10">

            <div className="mb-2 h-0.5 overflow-hidden rounded-full bg-white/10">
              <div
                key={`${current}-${paused}`}
                className={`h-full bg-neon-green ${
                  paused ? '' : 'animate-[sliderProgress_5s_linear]'
                }`}
                style={{
                  width: paused ? '35%' : '100%',
                  transformOrigin: 'left',
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <span>ArcadeNexa Featured</span>
              <span>
                {current + 1} / {total}
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* Game thumbnails */}

      {total > 1 && (
        <div className="relative mt-4">

          <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">

            {featuredGames.map((item, index) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => selectSlide(index)}
                aria-label={`Show ${item.title}`}
                aria-current={index === current}
                className={`group relative min-w-[145px] snap-start overflow-hidden rounded-xl border text-left transition-all duration-300 sm:min-w-[180px] lg:min-w-[190px] ${
                  index === current
                    ? 'border-neon-green/70 shadow-[0_0_20px_rgba(34,197,94,0.18)]'
                    : 'border-white/10 opacity-70 hover:border-white/30 hover:opacity-100'
                }`}
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-black">

                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    sizes="190px"
                    className={`object-cover transition duration-500 ${
                      index === current
                        ? 'scale-105'
                        : 'group-hover:scale-105'
                    }`}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="truncate text-xs font-black text-white">
                      {item.title}
                    </p>

                    <div className="mt-1 flex items-center gap-1 text-[10px] text-yellow-400">
                      <Star className="h-3 w-3 fill-current" />
                      {Number(item.rating || 0).toFixed(1)}
                    </div>
                  </div>

                  {index === current && (
                    <div className="absolute left-2 top-2 rounded-full bg-neon-green px-2 py-0.5 text-[9px] font-black text-space-black">
                      PLAYING
                    </div>
                  )}

                </div>
              </button>
            ))}

          </div>
        </div>
      )}

      {/* Mobile swipe hint */}

      {total > 1 && (
        <p className="mt-2 text-center text-[10px] font-medium text-gray-600 sm:hidden">
          Swipe left or right to browse games
        </p>
      )}

    </section>
  )
}
