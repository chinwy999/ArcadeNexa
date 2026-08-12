import { getGames } from '@/lib/games'
import GameCard from '@/components/GameCard'

export const dynamic = 'force-dynamic'

export default async function GamesPage({
  searchParams,
}: {
  searchParams: { genre?: string }
}) {
  const games = await getGames()
  const selectedGenre = searchParams.genre || ''

  const filteredGames = selectedGenre
    ? games.filter(g =>
        g.genreFilter?.toLowerCase() === selectedGenre.toLowerCase() ||
        g.category?.toLowerCase() === selectedGenre.toLowerCase()
      )
    : games

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-white">
          {selectedGenre ? `${selectedGenre} Games` : 'Games Arena'}
        </h1>
        <p className="text-gray-400">{filteredGames.length} HTML5 Games - Instant Play</p>
        {selectedGenre && (
          <a href="/games" className="text-neon-green text-sm mt-2 inline-block hover:underline">
            ← Back to All Games
          </a>
        )}
      </div>

      {filteredGames.length === 0 ? (
        <div className="text-center py-20 bg-elevated rounded-lg border border-white/5">
          <p className="text-6xl mb-4">🎮</p>
          <p className="text-xl text-gray-400">No games found in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      )}
    </div>
  )
}
