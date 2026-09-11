import type { Metadata } from 'next'
import GameCard from '@/components/GameCard'
import Link from 'next/link'
import { categoryContent } from '@/lib/category-content'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { genre?: string; page?: string }
}): Promise<Metadata> {
  const selectedGenre = searchParams.genre || ''
  const selectedCategoryContent = selectedGenre
    ? categoryContent[selectedGenre]
    : undefined

  const parsedPage = Number.parseInt(searchParams.page || '1', 10)
  const currentPage = Number.isFinite(parsedPage)
    ? Math.max(1, parsedPage)
    : 1

  const titleBase = selectedCategoryContent
    ? selectedCategoryContent.title
    : 'Free HTML5 Games - Play Online Games'

  const title =
    currentPage > 1
      ? `${titleBase} | Page ${currentPage} | ArcadeNexa`
      : `${titleBase} | ArcadeNexa`

  const description = selectedCategoryContent
    ? selectedCategoryContent.metaDescription
    : 'Play 15,000+ free HTML5 games online on ArcadeNexa. Discover action, puzzle, racing, sports, strategy and casual games instantly with no download or registration.'

  const params = new URLSearchParams()

  if (selectedGenre) {
    params.set('genre', selectedGenre)
  }

  if (currentPage > 1) {
    params.set('page', String(currentPage))
  }

  const query = params.toString()
  const canonical = `/games${query ? `?${query}` : ''}`

  return {
    title,
    description,
    keywords: [
      'free HTML5 games',
      'free online games',
      'browser games',
      'instant play games',
      'arcade games',
      'ArcadeNexa',
    ],
    alternates: {
      canonical,
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
      siteName: 'ArcadeNexa',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export const revalidate = 300

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
  const selectedCategoryContent = selectedGenre
    ? categoryContent[selectedGenre]
    : undefined

  const parsedPage = Number.parseInt(searchParams.page || '1', 10)
  const currentPage = Number.isFinite(parsedPage)
    ? Math.max(1, parsedPage)
    : 1

  let games: Game[] = []
  let totalPages: number | null = null
  let hasMore = false

  try {
    const { getGamesPage } = await import('@/lib/games')

    if (selectedGenre) {
      /*
       * Category pages:
       * Use provider-side pagination instead of loading the
       * complete catalog.
       *
       * GamePix supports category filtering directly.
       * GameMonetize is filtered independently inside getGamesPage().
       */
      const result = await getGamesPage(
        currentPage,
        GAMES_PER_PAGE,
        selectedGenre
      )

      games = result.games as unknown as Game[]
      hasMore = result.hasMore

      /*
       * Provider pagination does not expose a reliable total
       * number of category pages, so use hasMore rather than
       * inventing a total.
       */
      totalPages = null
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
  const canGoNext = hasMore

  return (
    <div className="container mx-auto px-4 py-8">

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-[color:var(--text-primary)] capitalize">
          {selectedCategoryContent?.title ||
            (selectedGenre
              ? `${selectedGenre.replace(/-/g, ' ')} Games`
              : 'Games Arena')}
        </h1>

        <p className="text-[color:var(--text-secondary)]">
          {games.length} HTML5 Games — Page {currentPage}
          {totalPages ? ` of ${totalPages}` : ''}
        </p>

        {selectedGenre && (
          <Link
            href="/games"
            className="text-nexa-emerald text-sm mt-2 inline-block hover:underline"
          >
            ← Back to All Games
          </Link>
        )}

        {selectedCategoryContent && (
          <section
            aria-labelledby="category-description"
            className="mt-6 rounded-2xl border border-[color:var(--white-10)] bg-[color:var(--nexa-surface)] p-5 sm:p-7"
          >
            <h2
              id="category-description"
              className="text-xl sm:text-2xl font-bold text-[color:var(--text-primary)] mb-4"
            >
              About {selectedCategoryContent.title}
            </h2>

            <div className="space-y-4 text-sm sm:text-base leading-7 text-[color:var(--text-secondary)]">
              {selectedCategoryContent.description
                .trim()
                .split(/\n\s*\n/)
                .map((paragraph, index) => (
                  <p key={index}>{paragraph.trim()}</p>
                ))}
            </div>
          </section>
        )}
      </div>

      {sortedGames.length === 0 ? (
        <div className="text-center py-20 bg-nexa-surface rounded-lg border border-[color:var(--white-05)]">
          <p className="text-6xl mb-4">🎮</p>

          <p className="text-xl text-[color:var(--text-secondary)]">
            No games found
            {selectedGenre ? ' in this category' : ''}
          </p>

          <Link
            href="/games"
            className="inline-block mt-6 px-6 py-3 rounded-xl bg-nexa-violet text-[color:var(--text-primary)] font-bold"
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
                  className="px-5 py-3 rounded-xl border border-[color:var(--white-10)] text-[color:var(--text-primary)] hover:bg-[color:var(--white-10)] transition font-bold"
                >
                  ← Prev
                </Link>
              )}

              <span className="px-5 py-3 rounded-xl bg-[color:var(--white-05)] border border-[color:var(--white-10)] text-[color:var(--text-secondary)] font-bold">
                Page {currentPage}
              </span>

              {canGoNext && (
                <Link
                  href={buildUrl(currentPage + 1)}
                  className="px-5 py-3 rounded-xl border border-[color:var(--white-10)] text-[color:var(--text-primary)] hover:bg-[color:var(--white-10)] transition font-bold"
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
