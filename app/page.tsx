import { getAllGames } from '@/lib/gamesStore'
import GameCard from '@/components/GameCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const games = await getAllGames()
  const featuredGames = games.slice(0, 8)
  
  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-neon-green to-cyan-400 bg-clip-text text-transparent">
            ARCADENEXA
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Professional HTML5 Gaming Platform - {games.length} Games
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/games" className="bg-neon-green text-space-black px-8 py-4 rounded-lg font-bold hover:opacity-90 transition-opacity">
              PLAY NOW
            </Link>
          </div>
        </div>
      </section>
      
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Featured Games</h2>
            <Link href="/games" className="text-neon-green hover:underline">
              View All ({games.length})
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGames.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
