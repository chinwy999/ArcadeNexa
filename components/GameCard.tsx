import Link from 'next/link'
import { Play } from 'lucide-react'
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
  }
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <div className="bg-elevated rounded-xl overflow-hidden border border-white/5 hover:border-neon-green/30 transition-all duration-300 hover:shadow-lg hover:shadow-neon-green/10 group">
      <Link href={`/games/${game.slug}`} className="block h-48 relative overflow-hidden hover:opacity-90 transition-opacity" aria-label={`View ${game.name} details`}>
        {/* استخدام SafeImage بدلاً من Image مباشرة */}
        <SafeImage
          src={game.thumbnail}
          alt={`${game.name} thumbnail`}
          gradient={game.gradient}
          initials={game.initials}
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-space-black/80 via-transparent to-transparent pointer-events-none" />
        <span className="absolute bottom-3 left-3 text-4xl font-black text-white/30 select-none drop-shadow-lg pointer-events-none">{game.initials}</span>
        <div className="absolute top-3 left-3 flex gap-2 pointer-events-none">
          <span className="bg-neon-green/20 backdrop-blur text-neon-green text-[10px] font-bold px-2.5 py-1 rounded-full border border-neon-green/30">HTML5 • INSTANT</span>
        </div>
        <div className="absolute top-3 right-3 bg-space-black/70 backdrop-blur px-2.5 py-1 rounded-full text-xs text-white/90 border border-white/10 pointer-events-none">{game.platform}</div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-white/90 text-space-black flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 fill-space-black ml-0.5" />
          </div>
        </div>
      </Link>
      <div className="p-4">
        <h3 className="font-bold text-white group-hover:text-neon-green transition-colors line-clamp-1 mb-2">{game.name}</h3>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>HTML5</span>
          <span className="text-yellow-400">★ {(game as any).rating || 8.5}</span>
        </div>
      </div>
    </div>
  )
}
