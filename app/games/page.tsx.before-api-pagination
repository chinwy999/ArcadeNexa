import { getGames } from '@/lib/games'
import GameCard from '@/components/GameCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const GAMES_PER_PAGE = 48

export default async function GamesPage({
  searchParams,
}: {
  searchParams: { genre?: string, page?: string }
}) {
  const games = await getGames()
  const selectedGenre = searchParams.genre || ''
  const currentPage = Math.max(1, parseInt(searchParams.page || '1'))

  // تصفية حسب الفئة
  const filteredGames = selectedGenre
    ? games.filter(g =>
        g.genreFilter?.toLowerCase() === selectedGenre.toLowerCase() ||
        g.category?.toLowerCase() === selectedGenre.toLowerCase()
      )
    : games

  // ترتيب حسب الجودة (الأعلى تقييماً أولاً)
  const sortedGames = [...filteredGames].sort((a, b) => b.rating - a.rating)

  const totalPages = Math.ceil(sortedGames.length / GAMES_PER_PAGE)
  const paginatedGames = sortedGames.slice(
    (currentPage - 1) * GAMES_PER_PAGE,
    currentPage * GAMES_PER_PAGE
  )

  const buildUrl = (page: number) => {
    const params = new URLSearchParams()
    if (selectedGenre) params.set('genre', selectedGenre)
    if (page > 1) params.set('page', String(page))
    return `/games${params.toString() ? '?' + params.toString() : ''}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-white">
          {selectedGenre ? `${selectedGenre} Games` : 'Games Arena'}
        </h1>
        <p className="text-gray-400">
          {filteredGames.length} HTML5 Games — Page {currentPage} of {totalPages}
        </p>
        {selectedGenre && (
          <a href="/games" className="text-neon-green text-sm mt-2 inline-block hover:underline">
            ← Back to All Games
          </a>
        )}
      </div>

      {paginatedGames.length === 0 ? (
        <div className="text-center py-20 bg-elevated rounded-lg border border-white/5">
          <p className="text-6xl mb-4">🎮</p>
          <p className="text-xl text-gray-400">No games found in this category</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {paginatedGames.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {currentPage > 1 && (
                <Link href={buildUrl(currentPage - 1)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-white hover:bg-white/10 transition font-bold">
                  ← Prev
                </Link>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                .map((page, idx, arr) => (
                  <span key={page}>
                    {idx > 0 && arr[idx - 1] !== page - 1 && (
                      <span className="text-gray-500 px-2">...</span>
                    )}
                    <Link
                      href={buildUrl(page)}
                      className={`w-10 h-10 rounded-xl inline-flex items-center justify-center font-bold transition ${
                        page === currentPage
                          ? 'bg-electric-violet text-white'
                          : 'border border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      {page}
                    </Link>
                  </span>
                ))
              }

              {currentPage < totalPages && (
                <Link href={buildUrl(currentPage + 1)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-white hover:bg-white/10 transition font-bold">
                  Next →
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
