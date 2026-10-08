import type { Metadata } from 'next'
import GameCard from '@/components/GameCard'
import Link from 'next/link'
import { categoryContent } from '@/lib/category-content'
import { getCategoryTranslation } from '@/lib/category-translations'
import { getLocale } from '@/lib/i18n/server'
import { getTranslations } from '@/lib/i18n'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { genre?: string; page?: string }
}) {
  const locale = getLocale()
  const t = getTranslations(locale)
  const isArabic = locale === 'ar'

  const selectedGenre = searchParams.genre || ''
  const params = new URLSearchParams()

  if (selectedGenre) {
    params.set('genre', selectedGenre)
  }

  if (searchParams.page && searchParams.page !== '1') {
    params.set('page', searchParams.page)
  }

  const query = params.toString()
  const canonicalPath = `/games${query ? `?${query}` : ''}`
  const canonical = isArabic
    ? `/ar${canonicalPath}`
    : canonicalPath

  return {
    title: selectedGenre
      ? `${selectedGenre.replace(/-/g, ' ')} ${t.games.categorySuffix} - Arcadlo`
      : t.games.metadataTitle,
    description: t.games.metadataDescription,
    keywords: [
      'free HTML5 games',
      'free online games',
      'browser games',
      'instant play games',
      'arcade games',
    ],
    alternates: {
      canonical,
    },
    openGraph: {
      title: selectedGenre
        ? `${selectedGenre.replace(/-/g, ' ')} ${t.games.categorySuffix} - Arcadlo`
        : t.games.metadataTitle,
      description: t.games.metadataDescription,
      url: canonical,
      siteName: 'Arcadlo',
      type: 'website',
    },
  }
}


export const revalidate = 300

const GAMES_PER_PAGE = 48

const popularCategorySlugs = [
  'action',
  'adventure',
  'arcade',
  'puzzle',
  'racing',
  'sports',
  'shooter',
  'strategy',
  'casual',
  'fighting',
  'rpg',
  'simulation',
] as const

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
  const locale = getLocale()
  const t = getTranslations(locale)
  const isArabic = locale === 'ar'
  const prefix = isArabic ? '/ar' : ''

  const selectedGenre = searchParams.genre || ''
  const selectedCategoryContent = selectedGenre
    ? categoryContent[selectedGenre]
    : undefined

  const selectedCategoryTranslation = selectedGenre
    ? getCategoryTranslation(selectedGenre, locale)
    : undefined

  const selectedCategoryTitle =
    selectedCategoryTranslation?.name ||
    selectedCategoryContent?.title ||
    (selectedGenre
      ? `${selectedGenre.replace(/-/g, ' ')} ${t.games.categorySuffix}`
      : t.games.arena)

  const selectedCategoryDescription =
    selectedCategoryTranslation?.description ||
    selectedCategoryContent?.description ||
    ''

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

    return `${prefix}/games${query ? `?${query}` : ''}`
  }

  const canGoPrev = currentPage > 1
  const canGoNext = hasMore

  return (
    <div className="container mx-auto px-4 py-8">

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-[color:var(--text-primary)] capitalize">
          {selectedCategoryTitle}
        </h1>

        <p className="text-[color:var(--text-secondary)]">
          {games.length} {t.games.html5Games} — {t.games.page} {currentPage}
          {totalPages ? ` of ${totalPages}` : ''}
        </p>

        {selectedGenre && (
          <Link
            href={`${prefix}/games`}
            className="text-nexa-emerald text-sm mt-2 inline-block hover:underline"
          >
            ← {t.games.backToAllGames}
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
              {t.games.about} {selectedCategoryTitle}
            </h2>

            <div className="space-y-4 text-sm sm:text-base leading-7 text-[color:var(--text-secondary)]">
              {selectedCategoryDescription
                .trim()
                .split(/\n\s*\n/)
                .map((paragraph, index) => (
                  <p key={index}>{paragraph.trim()}</p>
                ))}
            </div>
          </section>
        )}
      </div>

      {!selectedGenre && (
        <section
          aria-labelledby="popular-categories"
          className="mb-10"
        >
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <h2
                id="popular-categories"
                className="text-2xl font-bold text-[color:var(--text-primary)]"
              >
                {t.games.popularCategories}
              </h2>
              <p className="mt-1 text-sm text-[color:var(--text-secondary)]">
                {t.games.exploreByCategory}
              </p>
            </div>

            <Link
              href={`${prefix}/categories`}
              className="shrink-0 text-sm font-bold text-nexa-emerald hover:underline"
            >
              {t.games.allCategories} →
            </Link>
          </div>

          <nav
            aria-label={t.games.ariaPopularCategories}
            className="flex flex-wrap gap-2"
          >
            {popularCategorySlugs.map((slug) => {
              const category = getCategoryTranslation(slug, locale)
              const fallbackName = slug.replace(/-/g, ' ')

              return (
                <Link
                  key={slug}
                  href={`${prefix}/games?genre=${slug}`}
                  className="rounded-xl border border-[color:var(--white-10)] bg-[color:var(--nexa-surface)] px-4 py-2.5 text-sm font-semibold text-[color:var(--text-primary)] transition hover:border-[color:var(--nexa-emerald)] hover:text-nexa-emerald"
                >
                  {category?.name || fallbackName}
                </Link>
              )
            })}
          </nav>
        </section>
      )}

      {sortedGames.length === 0 ? (
        <div className="text-center py-20 bg-nexa-surface rounded-lg border border-[color:var(--white-05)]">
          <p className="text-6xl mb-4">🎮</p>

          <p className="text-xl text-[color:var(--text-secondary)]">
            {t.games.noGamesFound}
            {selectedGenre ? ` ${t.games.inThisCategory}` : ''}
          </p>

          <Link
            href={`${prefix}/games`}
            className="inline-block mt-6 px-6 py-3 rounded-xl bg-nexa-violet text-[color:var(--text-primary)] font-bold"
          >
            {t.games.viewAllGames}
          </Link>
        </div>
      ) : (
        <>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {sortedGames.map((game) => (
              <GameCard
                key={game.slug}
                game={game as any}
                genre={selectedGenre}
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
                  ← {t.games.previous}
                </Link>
              )}

              <span className="px-5 py-3 rounded-xl bg-[color:var(--white-05)] border border-[color:var(--white-10)] text-[color:var(--text-secondary)] font-bold">
                {t.games.page} {currentPage}
              </span>

              {canGoNext && (
                <Link
                  href={buildUrl(currentPage + 1)}
                  className="px-5 py-3 rounded-xl border border-[color:var(--white-10)] text-[color:var(--text-primary)] hover:bg-[color:var(--white-10)] transition font-bold"
                >
                  {t.games.next} →
                </Link>
              )}

            </div>
          )}
        </>
      )}
    </div>
  )
}
