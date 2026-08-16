'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Play, Star, Sparkles, ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import type { Game } from '@/lib/games'

interface FeaturedGamesSliderProps {
  games: Game[]
  autoPlayMs?: number
}

export default function FeaturedGamesSlider({
  games,
  autoPlayMs = 6000,
}: FeaturedGamesSliderProps) {
  const featuredGames = [...games]
    .filter((g) => g.playable && g.thumbnail && g.slug)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 8)

  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [animating, setAnimating] = useState(false)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const total = featuredGames.length

  const goTo = useCallback((index: number, dir: 'next' | 'prev') => {
    if (animating || index === current) return
    setDirection(dir)
    setPrev(current)
    setAnimating(true)
    setCurrent(index)
    setProgress(0)
    setTimeout(() => {
      setPrev(null)
      setAnimating(false)
    }, 600)
  }, [animating, current])

  const nextSlide = useCallback(() => {
    if (total < 2) return
    goTo((current + 1) % total, 'next')
  }, [total, current, goTo])

  const previousSlide = useCallback(() => {
    if (total < 2) return
    goTo((current - 1 + total) % total, 'prev')
  }, [total, current, goTo])

  useEffect(() => {
    if (total < 2 || paused) return
    const tick = 50
    const steps = autoPlayMs / tick
    let step = 0
    progressRef.current = setInterval(() => {
      step++
      setProgress(Math.min((step / steps) * 100, 100))
      if (step >= steps) {
        step = 0
        nextSlide()
      }
    }, tick)
    return () => { if (progressRef.current) clearInterval(progressRef.current) }
  }, [nextSlide, autoPlayMs, paused, total, current])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null
    touchEndX.current = null
    setPaused(true)
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0]?.clientX ?? null
  }
  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const d = touchStartX.current - touchEndX.current
      if (Math.abs(d) > 50) d > 0 ? nextSlide() : previousSlide()
    }
    touchStartX.current = null
    touchEndX.current = null
    setPaused(false)
  }

  if (total === 0) return null

  const game = featuredGames[current]
  const prevGame = prev !== null ? featuredGames[prev] : null

  const slideIn = direction === 'next'
    ? 'animate-[slideInRight_0.6s_cubic-bezier(0.22,1,0.36,1)_forwards]'
    : 'animate-[slideInLeft_0.6s_cubic-bezier(0.22,1,0.36,1)_forwards]'
  const slideOut = direction === 'next'
    ? 'animate-[slideOutLeft_0.6s_cubic-bezier(0.22,1,0.36,1)_forwards]'
    : 'animate-[slideOutRight_0.6s_cubic-bezier(0.22,1,0.36,1)_forwards]'

  return (
    <section
      className="relative w-full select-none"
      aria-label="Featured games"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%) scale(0.96); opacity: 0; }
          to   { transform: translateX(0) scale(1);      opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%) scale(0.96); opacity: 0; }
          to   { transform: translateX(0) scale(1);        opacity: 1; }
        }
        @keyframes slideOutLeft {
          from { transform: translateX(0) scale(1);      opacity: 1; }
          to   { transform: translateX(-100%) scale(0.96); opacity: 0; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0) scale(1);       opacity: 1; }
          to   { transform: translateX(100%) scale(0.96); opacity: 0; }
        }
        @keyframes fadeUpIn {
          from { transform: translateY(24px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .fade-up { animation: fadeUpIn 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.13s; }
        .fade-up-3 { animation-delay: 0.21s; }
        .fade-up-4 { animation-delay: 0.29s; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-electric-violet/20">
            <Sparkles className="h-4 w-4 text-electric-violet" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white sm:text-2xl">Featured Games</h2>
            <p className="text-[11px] text-gray-500">Hand-picked · Updated daily</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={previousSlide}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-electric-violet/60 hover:bg-electric-violet/20"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[40px] text-center text-xs font-bold text-gray-400">
            {current + 1} / {total}
          </span>
          <button
            type="button"
            onClick={nextSlide}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-electric-violet/60 hover:bg-electric-violet/20"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Hero */}
      <div
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
        style={{ minHeight: 400 }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides */}
        <div className="relative w-full" style={{ minHeight: 400 }}>

          {/* Outgoing slide */}
          {animating && prevGame && (
            <div className={`absolute inset-0 ${slideOut}`} style={{ zIndex: 1 }}>
              <Image
                src={prevGame.thumbnailLarge || prevGame.thumbnail}
                alt={prevGame.title}
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            </div>
          )}

          {/* Incoming slide */}
          <div
            key={game.slug}
            className={`absolute inset-0 ${animating ? slideIn : ''}`}
            style={{ zIndex: 2 }}
          >
            <Image
              src={game.thumbnailLarge || game.thumbnail}
              alt={game.title}
              fill
              priority={current === 0}
              sizes="100vw"
              className="object-cover"
            />
            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

            {/* Content */}
            <div className="absolute inset-0 flex items-end sm:items-center pb-16 sm:pb-0">
              <div className="w-full max-w-xl px-6 py-8 sm:px-10">

                <div key={`badge-${game.slug}`} className="fade-up fade-up-1 mb-4 inline-flex items-center gap-1.5 rounded-full border border-electric-violet/40 bg-electric-violet/15 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-electric-violet backdrop-blur">
                  <Sparkles className="h-3 w-3" />
                  Featured
                </div>

                <h3 key={`title-${game.slug}`} className="fade-up fade-up-2 text-3xl font-black leading-tight tracking-tight text-white drop-shadow-2xl sm:text-4xl lg:text-5xl">
                  {game.title}
                </h3>

                <div key={`meta-${game.slug}`} className="fade-up fade-up-3 mt-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-yellow-400/15 px-3 py-1 text-sm font-black text-yellow-400">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {Number(game.rating || 0).toFixed(1)}
                  </span>
                  <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm capitalize text-gray-300 backdrop-blur">
                    {game.category || 'Arcade'}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg border border-neon-green/20 bg-neon-green/10 px-3 py-1 text-sm font-bold text-neon-green">
                    <Zap className="h-3 w-3 fill-current" />
                    Instant Play
                  </span>
                </div>

                <p key={`desc-${game.slug}`} className="fade-up fade-up-3 mt-3 hidden max-w-md text-sm leading-relaxed text-gray-400 sm:block">
                  {game.description || 'Play instantly in your browser. No downloads required.'}
                </p>

                <div key={`btn-${game.slug}`} className="fade-up fade-up-4 mt-6 flex items-center gap-3">
                  <Link
                    href={`/games/${game.slug}`}
                    className="group inline-flex items-center gap-2 rounded-xl bg-neon-green px-6 py-3 text-sm font-black text-black shadow-[0_0_24px_rgba(34,197,94,0.3)] transition-all duration-200 hover:scale-105 hover:shadow-[0_0_36px_rgba(34,197,94,0.5)]"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    PLAY NOW
                    <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Progress bar dots */}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center gap-1.5 px-6 pb-4 sm:px-10">
          {featuredGames.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i, i > current ? 'next' : 'prev')}
              className="relative h-1 overflow-hidden rounded-full transition-all duration-300"
              style={{ width: i === current ? 40 : 16, background: 'rgba(255,255,255,0.15)' }}
              aria-label={`Go to slide ${i + 1}`}
            >
              {i === current && (
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-neon-green transition-none"
                  style={{ width: `${progress}%` }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Thumbnails strip */}
      {total > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory">
          {featuredGames.map((item, index) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => goTo(index, index > current ? 'next' : 'prev')}
              className={`group relative min-w-[130px] snap-start overflow-hidden rounded-xl border transition-all duration-300 sm:min-w-[160px] ${
                index === current
                  ? 'border-neon-green/60 shadow-[0_0_16px_rgba(34,197,94,0.2)]'
                  : 'border-white/8 opacity-60 hover:opacity-90 hover:border-white/25'
              }`}
            >
              <div className="relative aspect-video overflow-hidden bg-black">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  sizes="160px"
                  className={`object-cover transition-transform duration-500 ${index === current ? 'scale-105' : 'group-hover:scale-105'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                {index === current && (
                  <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-neon-green px-2 py-0.5 text-[9px] font-black text-black">
                    <Play className="h-2.5 w-2.5 fill-current" />
                    NOW
                  </div>
                )}
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="truncate text-[11px] font-black text-white">{item.title}</p>
                  <div className="mt-0.5 flex items-center gap-1 text-[10px] text-yellow-400">
                    <Star className="h-2.5 w-2.5 fill-current" />
                    {Number(item.rating || 0).toFixed(1)}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
