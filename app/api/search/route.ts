import { NextRequest, NextResponse } from 'next/server'
import { searchPersistentGamePixGames } from '@/lib/games'

export const dynamic = 'force-dynamic'

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
    const results = searchPersistentGamePixGames(q, 48)

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
