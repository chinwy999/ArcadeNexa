'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sword, Play, Flame, ChevronRight } from 'lucide-react'
import GameCard from '@/components/GameCard'
import InstantPlayModal from '@/components/InstantPlayModal'
import AdBanner from '@/components/AdBanner'
import { games, type Game } from '@/lib/games'

const stats = (n: number) => [
  { label: 'Games', value: `${n}+` },
  { label: 'Providers', value: '1' },
  { label: 'Play Mode', value: '100%' },
]

function Counter({ value, label, delay = 0 }: { value: string, label: string, delay?: number }) {
  const [count, setCount] = useState(0)
  const num = parseInt(value.replace(/[^0-9]/g, ''))
  const suffix = value.replace(/[0-9]/g, '')

  useEffect(() => {
    const timer = setTimeout(() => {
      const increment = num / 60
      let current = 0
      const interval = setInterval(() => {
        current += increment
        if (current >= num) { setCount(num); clearInterval(interval) }
        else setCount(Math.floor(current))
      }, 2000 / 60)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timer)
  }, [num, delay])

  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-black text-white">{count.toLocaleString()}{suffix}</div>
      <div className="text-text-secondary text-sm uppercase tracking-wider mt-1">{label}</div>
    </div>
  )
}

export default function HomePage() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const featured = games.slice(0, 8)
  const heroStats = stats(games.length)

  return (
    <div className="animate-fade-in">
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-violet/20 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-green/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#050510_70%)]" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-electric-violet to-neon-green flex items-center justify-center transform rotate-45 shadow-[0_0_40px_rgba(124,58,237,0.4)]">
              <span className="text-space-black font-black text-3xl transform -rotate-45">A</span>
            </div>
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight mb-4">
            <span className="text-white">ARCADE</span><span className="gradient-text">NEXA</span>
          </h1>
          <p className="text-xl sm:text-2xl text-text-secondary font-light tracking-wide mb-4">Professional HTML5 Gaming Platform</p>
          <p className="text-sm text-text-secondary/70 max-w-2xl mx-auto mb-10">{games.length} GamePix games — instant browser play with official game artwork and responsive fullscreen support.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/games" className="group flex items-center gap-2 bg-electric-violet hover:bg-violet-600 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 neon-glow hover:scale-105">
              <Play className="w-5 h-5 fill-white" /> PLAY NOW
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {heroStats.map((s, i) => (
              <Counter key={s.label} value={s.value} label={s.label} delay={i * 200} />
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AdBanner />
      </div>

      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">FEATURED GAMES</h2>
          <p className="text-text-secondary">Professional GamePix titles - play instantly in same page, never leave site</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featured.map(g => (
            <GameCard key={g.slug} game={g} onPlay={() => setSelectedGame(g)} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/games" className="inline-flex items-center gap-2 text-electric-violet hover:text-white font-semibold transition-colors">
            View All {games.length} Games <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto glass rounded-3xl p-8 sm:p-12 text-center border border-electric-violet/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-electric-violet via-neon-green to-hot-pink" />
          <Flame className="w-12 h-12 text-hot-pink mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to Play?</h2>
          <p className="text-text-secondary mb-8 max-w-lg mx-auto">10 GamePix games with official thumbnails and descriptions. Play instantly in the browser with responsive fullscreen support.</p>
          <Link href="/games" className="inline-flex items-center gap-2 bg-gradient-to-r from-electric-violet to-violet-600 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 neon-glow hover:scale-105">
            <Sword className="w-5 h-5" /> EXPLORE GAMES
          </Link>
        </div>
      </section>

      {selectedGame && (
        <InstantPlayModal
          url={selectedGame.iframeUrl}
          title={selectedGame.name}
          width={selectedGame.width}
          height={selectedGame.height}
          aspectRatio={selectedGame.aspectRatio}
          provider={selectedGame.provider}
          onClose={() => setSelectedGame(null)}
        />
      )}

    </div>
  )
}
