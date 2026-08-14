'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
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
  const featuredGames = games
    .filter((game) => game.playable && game.thumbnail && game.slug)
    .slice(0, 10)

  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const total = featuredGames.length

  const nextSlide = useCallback(() => {
    if (total <= 1) return
    setCurrent((prev) => (prev + 1) % total)
  }, [total])

  const previousSlide = useCallback(() => {
    if (total <= 1) return
    setCurrent((prev) => (prev - 1 + total) % total)
  }, [total])

  const goToSlide = useCallback((index: number) => {
    setCurrent(index)
  }, [])

  useEffect(() => {
    if (total <= 1 || paused) return

    const timer = window.setInterval(() => {
      nextSlide()
    }, autoPlayMs)

    return () => window.clearInterval(timer)
  }, [nextSlide, autoPlayMs, paused, total])

  useEffect(() => {
    if (current >= total && total > 0) {
      setCurrent(0)
    }
  }, [current, total])

  if (!total) {
    return null
  }

  const game = featuredGames[current]

  return (
    <section
      className="relative w-full mb-10"
      aria-label="Featured games"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-electric-violet" />

            <h2 className="text-xl sm:text-2xl font-black text-white">
              Featured Games
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Discover your next favorite game
          </p>
        </div>

        <div className="text-xs text-text-secondary">
          {current + 1} / {total}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-electric-violet/30 bg-[#080812] shadow-[0_0_50px_rgba(124,58,237,0.18)]">
        <div className="relative aspect-[16/8] sm:aspect-[16/6.5] min-h-[300px] sm:min-h-[360px]">
          <Image
            key={game.thumbnail}
            src={game.thumbnail}
            alt={game.title}
            fill
            priority={current === 0}
            sizes="(max-width: 640px) 100vw, 1200px"
            className="object-cover transition-transform duration-700"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/10" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          <div className="absolute inset-0 flex items-center">
            <div className="w-full px-6 sm:px-10 md:px-14 py-8">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-electric-violet/20 border border-electric-violet/40 text-electric-violet text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Featured
                </div>

                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-3 drop-shadow-lg">
                  {game.title}
                </h3>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-1 text-yellow-400 text-sm font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    {Number(game.rating || 0).toFixed(1)}
                  </span>

                  <span className="w-1 h-1 rounded-full bg-gray-500" />

                  <span className="text-gray-300 text-sm capitalize">
                    {game.category || 'Arcade'}
                  </span>

                  <span className="w-1 h-1 rounded-full bg-gray-500" />

                  <span className="text-neon-green text-sm font-medium">
                    {game.provider || 'ArcadeNexa'}
                  </span>
                </div>

                <p className="hidden sm:block text-gray-300 text-sm md:text-base leading-relaxed max-w-lg mb-6 line-clamp-2">
                  {game.description ||
                    'Play this exciting HTML5 game instantly in your browser.'}
                </p>

                <Link
                  href={`/games/${game.slug}`}
                  className="inline-flex items-center gap-2 px-5 sm:px-7 py-3 rounded-xl bg-electric-violet hover:bg-violet-600 text-white font-black text-sm transition-all duration-200 hover:scale-105 shadow-[0_0_25px_rgba(124,58,237,0.45)]"
                >
                  <Play className="w-4 h-4 fill-current" />
                  PLAY NOW
                </Link>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={previousSlide}
            disabled={total <= 1}
            aria-label="Previous featured game"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-electric-violet/80 transition disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            disabled={total <= 1}
            aria-label="Next featured game"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-electric-violet/80 transition disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
            {featuredGames.map((item, index) => (
              <button
                key={`${item.slug}-${index}`}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`Go to ${item.title}`}
                aria-current={index === current ? 'true' : undefined}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === current
                    ? 'w-7 bg-electric-violet'
                    : 'w-1.5 bg-white/40 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
