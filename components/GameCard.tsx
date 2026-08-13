import Link from 'next/link'
import { Play, Zap } from 'lucide-react'
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
    <article className="group min-w-0 overflow-hidden rounded-xl border border-white/5 bg-elevated transition-all duration-300 hover:border-neon-green/30 hover:shadow-lg hover:shadow-neon-green/10">

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
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-space-black/80 via-transparent to-transparent" />

        <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1 rounded-full border border-neon-green/30 bg-neon-green/20 px-2.5 py-1 text-[10px] font-bold text-neon-green backdrop-blur">
          <Zap className="h-3 w-3 fill-current" />
          Instant
        </div>

        <div className="pointer-events-none absolute right-3 top-3 rounded-full border border-white/10 bg-space-black/70 px-2.5 py-1 text-xs text-white/90 backdrop-blur">
          {game.platform}
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-space-black shadow-xl transition-transform duration-300 group-hover:scale-100 scale-90">
            <Play className="ml-0.5 h-6 w-6 fill-current" />
          </div>
        </div>
      </Link>

      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h3 className="min-w-0 truncate font-bold text-white transition-colors group-hover:text-neon-green">
            {game.name}
          </h3>

          <span className="shrink-0 text-xs text-yellow-400">
            ★ {rating.toFixed(1)}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>HTML5</span>

          {onPlay && (
            <button
              type="button"
              onClick={onPlay}
              className="rounded-md px-2 py-1 font-semibold text-neon-green transition-colors hover:bg-neon-green/10"
              aria-label={`Instant play ${game.name}`}
            >
              PLAY
            </button>
          )}
        </div>
      </div>

    </article>
  )
}
