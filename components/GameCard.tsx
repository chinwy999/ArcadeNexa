import Link from 'next/link'
import { Play, Star, Zap } from 'lucide-react'
import SafeImage from './SafeImage'

interface GameCardProps {
  game: {
    slug: string
    name: string
    title: string
    initials: string
    gradient: string
    platform: string
    thumbnail: string
    rating?: number
  }
  onPlay?: () => void
}

export default function GameCard({ game, onPlay }: GameCardProps) {
  const rating =
    typeof game.rating === 'number' ? game.rating : 8.5

  return (
    <article className="group relative min-w-0 overflow-hidden rounded-2xl border border-[color:var(--nexa-card-line)] bg-gradient-to-b from-[color:var(--nexa-glass-top)] to-[color:var(--nexa-glass-bottom)] shadow-[0_16px_50px_rgba(0,0,0,0.22)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[color:var(--nexa-card-line-hover)] hover:shadow-[0_24px_70px_rgba(0,0,0,0.34),0_0_42px_var(--nexa-card-glow)]">

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <Link
        href={`/games/${game.slug}`}
        className="relative block aspect-[16/10] overflow-hidden"
        aria-label={`Play ${game.name}`}
      >
        <SafeImage
          src={game.thumbnail}
          alt={`${game.name} thumbnail`}
          gradient={game.gradient}
          initials={game.initials}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-nexa-black/95 via-nexa-black/10 to-transparent" />

        <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-nexa-navy/75 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-300 shadow-lg backdrop-blur-md">
          <Zap className="h-3 w-3 fill-current" />
          Instant
        </div>

        <div className="pointer-events-none absolute right-3 top-3 rounded-full border border-[color:var(--white-10)] bg-nexa-black/75 px-2.5 py-1 text-[10px] font-semibold text-[color:var(--text-primary)]/80 backdrop-blur-md">
          {game.platform}
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-nexa-black/35 opacity-0 transition-all duration-500 group-hover:opacity-100">
          <div className="flex h-16 w-16 scale-75 items-center justify-center rounded-full border border-[color:var(--white-20)] bg-[color:var(--text-primary)] text-nexa-black shadow-2xl transition-transform duration-500 group-hover:scale-100">
            <Play className="ml-1 h-7 w-7 fill-current" />
          </div>
        </div>
      </Link>

      <div className="relative p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="min-w-0 flex-1 line-clamp-2 text-sm font-bold leading-snug tracking-tight text-[color:var(--text-primary)] transition-colors duration-300 group-hover:text-nexa-cyan sm:text-base">
            {game.name}
          </h3>

          <span
            className="flex shrink-0 items-center gap-1 self-start rounded-full border border-nexa-gold/10 bg-nexa-gold/[0.06] px-2 py-0.5 text-[10px] font-bold text-nexa-gold"
            title="ArcadeNexa Score"
            aria-label={`ArcadeNexa Score ${rating.toFixed(1)} out of 10`}
          >
            <Star className="h-3 w-3 fill-current" />
            {rating.toFixed(1)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--text-muted)]">
            HTML5 Game
          </span>

          {onPlay ? (
            <button
              type="button"
              onClick={onPlay}
              className="rounded-lg border border-nexa-cyan/15 bg-nexa-cyan/[0.07] px-3 py-1.5 text-[10px] font-black tracking-wider text-nexa-cyan transition-all hover:border-nexa-cyan/35 hover:bg-nexa-cyan/[0.13]"
              aria-label={`Instant play ${game.name}`}
            >
              PLAY NOW
            </button>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400/80">
              <Play className="h-3 w-3 fill-current" />
              Ready
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
