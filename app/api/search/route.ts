import { NextRequest, NextResponse } from 'next/server'
import { getGamesPage } from '@/lib/games'

export const dynamic = 'force-dynamic'

function normalize(value: unknown) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[-_]+/g, ' ')
    .trim()
}

const SEARCH_PAGES = 5
const SEARCH_PAGE_SIZE = 48
const SEARCH_LIMIT = 48

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim() || ''

  if (!q) {
    return NextResponse.json(
      { games: [], total: 0 },
      {
        headers: {
          'Cache-Control':
            'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    )
  }

  try {
    const terms = q
      .toLowerCase()
      .split(/\s+/)
      .map(normalize)
      .filter(Boolean)

    const allGames = []

    /*
     * Search only the first few ArcadeNexa pages.
     *
     * This avoids loading the entire provider catalog
     * for every search request.
     */
    for (let page = 1; page <= SEARCH_PAGES; page++) {
      const result = await getGamesPage(
        page,
        SEARCH_PAGE_SIZE
      )

      allGames.push(...result.games)

      if (!result.hasMore) {
        break
      }
    }

    /*
     * Remove duplicates.
     */
    const uniqueGames = Array.from(
      new Map(
        allGames.map((game) => [game.slug, game])
      ).values()
    )

    const results = uniqueGames
      .map((g) => {
        const searchable = [
          g.name,
          g.title,
          g.description,
          g.longDescription,
          g.category,
          g.genre,
          g.genreFilter,
          g.platform,
          g.provider,
          g.instructions,
          g.tags,
        ]
          .flatMap((value) =>
            Array.isArray(value) ? value : [value]
          )
          .map(normalize)
          .join(' ')

        const matches = terms.every((term) =>
          searchable.includes(term)
        )

        if (!matches) {
          return null
        }

        let score = 0

        const name = normalize(g.name)
        const title = normalize(g.title)
        const category = normalize(g.category)
        const genre = normalize(g.genre)

        for (const term of terms) {
          if (
            name === term ||
            title === term
          ) {
            score += 100
          } else if (
            name.includes(term) ||
            title.includes(term)
          ) {
            score += 50
          } else if (
            category.includes(term)
          ) {
            score += 30
          } else if (
            genre.includes(term)
          ) {
            score += 20
          } else {
            score += 10
          }
        }

        return {
          game: g,
          score,
        }
      })
      .filter(
        (
          item
        ): item is {
          game: (typeof uniqueGames)[number]
          score: number
        } => item !== null
      )
      .sort(
        (a, b) => b.score - a.score
      )
      .slice(0, SEARCH_LIMIT)
      .map((item) => item.game)

    return NextResponse.json(
      {
        games: results,
        total: results.length,
      },
      {
        headers: {
          'Cache-Control':
            'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    )
  } catch (error) {
    console.error(
      '[ArcadeNexa] Search API failed:',
      error
    )

    return NextResponse.json(
      {
        games: [],
        total: 0,
        error: 'Search temporarily unavailable',
      },
      { status: 500 }
    )
  }
}
