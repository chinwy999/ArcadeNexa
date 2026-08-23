import { NextRequest, NextResponse } from 'next/server'
import { getGamesPage } from '@/lib/games'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const page = Math.max(
      1,
      Number(searchParams.get('page') || '1')
    )

    const pagination = Math.min(
      48,
      Math.max(
        1,
        Number(
          searchParams.get('limit') ||
          searchParams.get('pagination') ||
          '48'
        )
      )
    )

    const genre = searchParams.get('genre') || ''

    const result = await getGamesPage(
      page,
      pagination,
      genre
    )

    return NextResponse.json(
      {
        games: result.games,
        hasMore: result.hasMore,
      },
      {
        headers: {
          'Cache-Control':
            'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    )
  } catch (error) {
    console.error('[API /games]', error)

    return NextResponse.json(
      {
        ok: false,
        error: 'Unable to load games',
        games: [],
        hasMore: false,
      },
      { status: 502 }
    )
  }
}
