'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Star, Play } from 'lucide-react'
import type { Game } from '@/lib/games'

interface Props {
  game: Game
  onPlay: () => void
}

export default function GameCard({ game, onPlay }: Props) {
  return (
    <div 
      className="group relative glass rounded-2xl overflow-hidden transition-all duration-300 hover:border-electric-violet/50 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] border border-white/5 flex flex-col justify-between"
      data-url={game.iframeUrl}
      data-title={game.name}
      data-id={game.slug}
      data-category={game.genreFilter}
    >
      <div>
        <Link href={`/games/${game.slug}`} className="block h-48 relative overflow-hidden hover:opacity-90 transition-opacity" aria-label={`View ${game.name} details`}>
          {/* Thumbnail Image with fallback gradient */}
          <div className={`absolute inset-0 ${game.gradient}`} />
          <Image
            src={game.thumbnail}
            alt={`${game.name} thumbnail`}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-space-black/80 via-transparent to-transparent" />
          <span className="absolute bottom-3 left-3 text-4xl font-black text-white/30 select-none drop-shadow-lg">{game.initials}</span>
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-neon-green/20 backdrop-blur text-neon-green text-[10px] font-bold px-2.5 py-1 rounded-full border border-neon-green/30">HTML5 • INSTANT</span>
          </div>
          <div className="absolute top-3 right-3 bg-space-black/70 backdrop-blur px-2.5 py-1 rounded-full text-xs text-white/90 border border-white/10">{game.platform}</div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
            <div className="w-14 h-14 rounded-full bg-white/90 text-space-black flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
              <Play className="w-6 h-6 fill-space-black ml-0.5" />
            </div>
          </div>
        </Link>

        <div className="p-5 space-y-3">
          <Link href={`/games/${game.slug}`}>
            <h3 className="text-white font-black text-lg tracking-wide hover:text-electric-violet transition-colors line-clamp-1">{game.name}</h3>
          </Link>
          <div className="flex flex-wrap gap-2">
            {game.genre.map(g => (
              <span key={g} className="text-[11px] bg-white/5 text-text-secondary px-2.5 py-1 rounded-full border border-white/5">{g}</span>
            ))}
          </div>
          <div className="flex items-center gap-1">
            {game.rating != null ? (
              <>
                {[1,2,3,4,5].map(n => (
                  <Star key={n} className={`w-4 h-4 ${n <= game.rating! ? 'text-gold fill-gold' : 'text-white/10'}`} />
                ))}
                <span className="text-text-secondary text-xs ml-1">({game.rating.toFixed(1)})</span>
              </>
            ) : (
              <span className="text-text-secondary text-xs">No rating yet</span>
            )}
          </div>
          <p className="text-text-secondary text-xs line-clamp-2 leading-relaxed min-h-[32px]">{game.description}</p>
        </div>
      </div>

      <div className="p-5 pt-0 flex gap-2">
        <Link href={`/games/${game.slug}`} className="flex-1 text-center py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition">
          Details
        </Link>
        <button 
          data-action="play"
          onClick={onPlay} 
          className="flex-[1.5] flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-electric-violet to-violet-600 hover:from-violet-600 hover:to-electric-violet text-white transition-all duration-300 text-sm font-bold shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:scale-[1.02]"
          aria-label={`Play ${game.name} now`}
        >
          <Play className="w-4 h-4 fill-white" /> PLAY
        </button>
      </div>
    </div>
  )
}
