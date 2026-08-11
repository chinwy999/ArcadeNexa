import { getAllGames } from '@/lib/gamesStore'
import GameCard from '@/components/GameCard'

export const dynamic = 'force-dynamic'

export default async function GamesPage() {
  const games = await getAllGames()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-white">Games Arena</h1>
        <p className="text-gray-400">{games.length} HTML5 Games - Instant Play</p>
      </div>
      
      {games.length === 0 ? (
        <div className="text-center py-20 bg-elevated rounded-lg border border-white/5">
          <p className="text-6xl mb-4">Loading...</p>
          <p className="text-xl text-gray-400">Games are being fetched from GamePix</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      )}
    </div>
  )
}
