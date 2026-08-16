import GameCard from '@/components/GameCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const GAMES_PER_PAGE = 48

type Game = {
  slug: string
  name: string
  title: string
  rating: number
  category?: string
  genreFilter?: string
  [key: string]: unknown
}

export default async function GamesPage({
  searchParams,
}: {
  searchParams: { genre?: string; page?: string }
}) {
  const selectedGenre = searchParams.genre || ''

  const parsedPage = Number.parseInt(searchParams.page || '1', 10)
  const currentPage = Number.isFinite(parsedPage)
    ? Math.max(1, parsedPage)
    : 1

  let games: Game[] = []
  let totalPages: number | null = null
  let hasMore = false

  try {
    const { getGames, getGamesPage } = await import('@/lib/games')

    if (selectedGenre) {
      /*
       * Category pages:
       * We need the complete catalog to know how many games
       * belong to the selected category.
       */
      const allGames = await getGames()

      const normalizedGenre = selectedGenre.trim().toLowerCase()

      const categoryGames = allGames
        .filter(
          (g: any) =>
            g.category?.toLowerCase() === normalizedGenre ||
            g.genreFilter?.toLowerCase() === normalizedGenre
        )
        .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))

      totalPages = Math.max(
        1,
        Math.ceil(categoryGames.length / GAMES_PER_PAGE)
      )

      const start = (currentPage - 1) * GAMES_PER_PAGE

      games = categoryGames.slice(
        start,
        start + GAMES_PER_PAGE
      ) as unknown as Game[]

      hasMore = currentPage < totalPages
    } else {
      /*
       * All games:
       * Use source pagination directly.
       *
       * IMPORTANT:
       * We intentionally do not use a fake total such as 612.
       * getGamesPage() gives us hasMore, which is the reliable
       * information available from the feeds.
       */
      const result = await getGamesPage(
        currentPage,
        GAMES_PER_PAGE,
        ''
      )

      games = result.games as unknown as Game[]
      hasMore = result.hasMore
      totalPages = null
    }
  } catch (error) {
    console.error('[Games Page] failed:', error)
  }

  const sortedGames = selectedGenre
    ? games
    : [...games].sort(
        (a, b) => (b.rating || 0) - (a.rating || 0)
      )

  const buildUrl = (page: number) => {
    const params = new URLSearchParams()

    if (selectedGenre) {
      params.set('genre', selectedGenre)
    }

    if (page > 1) {
      params.set('page', String(page))
    }

    const query = params.toString()

    return `/games${query ? `?${query}` : ''}`
  }

  const canGoPrev = currentPage > 1
  const canGoNext = selectedGenre
    ? currentPage < (totalPages || 1)
    : hasMore

  return (
    <div className="container mx-auto px-4 py-8">

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-white capitalize">
          {selectedGenre
            ? `${selectedGenre.replace(/-/g, ' ')} Games`
            : 'Games Arena'}
        </h1>

        <p className="text-gray-400">
          {games.length} HTML5 Games — Page {currentPage}
          {totalPages ? ` of ${totalPages}` : ''}
        </p>

        {selectedGenre && (
          <Link
            href="/games"
            className="text-neon-green text-sm mt-2 inline-block hover:underline"
          >
            ← Back to All Games
          </Link>
        )}
      </div>

      {sortedGames.length === 0 ? (
        <div className="text-center py-20 bg-elevated rounded-lg border border-white/5">
          <p className="text-6xl mb-4">🎮</p>

          <p className="text-xl text-gray-400">
            No games found
            {selectedGenre ? ' in this category' : ''}
          </p>

          <Link
            href="/games"
            className="inline-block mt-6 px-6 py-3 rounded-xl bg-electric-violet text-white font-bold"
          >
            View All Games
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {sortedGames.map((game) => (
              <GameCard
                key={game.slug}
                game={game as any}
              />
            ))}
          </div>

          {(canGoPrev || canGoNext) && (
            <div className="flex items-center justify-center gap-3">

              {canGoPrev && (
                <Link
                  href={buildUrl(currentPage - 1)}
                  className="px-5 py-3 rounded-xl border border-white/10 text-white hover:bg-white/10 transition font-bold"
                >
                  ← Prev
                </Link>
              )}

              <span className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-bold">
                Page {currentPage}
              </span>

              {canGoNext && (
                <Link
                  href={buildUrl(currentPage + 1)}
                  className="px-5 py-3 rounded-xl border border-white/10 text-white hover:bg-white/10 transition font-bold"
                >
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
