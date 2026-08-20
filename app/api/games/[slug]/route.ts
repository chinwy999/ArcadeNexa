import { NextResponse } from 'next/server'
import { getGameBySlugFast } from '@/lib/games'

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const game = await getGameBySlugFast(params.slug)

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(game)
  } catch (error) {
    console.error('[API] Failed to load favorite game:', error)

    return NextResponse.json(
      { error: 'Failed to load game' },
      { status: 500 }
    )
  }
}
