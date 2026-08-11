import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch(
      'https://feeds.gamepix.com/v2/json?sid=DXXR1&pagination=96&page=1'
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: 'API returned ' + response.status },
        { status: response.status }
      )
    }

    const data = await response.json()

    if (!data.items || !Array.isArray(data.items)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 500 }
      )
    }

    const games = data.items.map((game: any) => ({
      id: game.id || '',
      name: game.title || 'Unknown',
      genre: game.category ? [game.category] : ['Unknown'],
      genreFilter: game.category || 'Unknown',
      platform: game.orientation === 'all' ? 'Multi' : 
                 game.orientation === 'landscape' ? 'PC' : 'Mobile',
      rating: Math.round((game.quality_score || 0) * 5),
      tags: [],
      imageUrl: game.banner_image || game.image || '',
      gameUrl: game.url || ''
    }))

    return NextResponse.json(games)
  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    )
  }
}
