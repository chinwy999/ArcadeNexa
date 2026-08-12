const API_BASE = 'https://feeds.gamepix.com/v2/json'
const SITE_ID = 'DXXR1'
const ITEMS_PER_PAGE = 96
const SAFETY_MAX_PAGES = 200

export interface GamePixItem {
  id: string
  title: string
  namespace: string
  description: string
  category: string
  orientation: string
  quality_score: number
  width: number
  height: number
  date_modified: string
  date_published: string
  banner_image: string
  image: string
  url: string
}

export async function fetchPage(page: number): Promise<GamePixItem[]> {
  try {
    const url =
      `${API_BASE}?sid=${SITE_ID}` +
      `&pagination=${ITEMS_PER_PAGE}` +
      `&page=${page}` +
      `&order=quality`

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        next: { revalidate: 3600 }
      })

      if (!response.ok) {
        console.error(`[GamePix] HTTP ${response.status} on page ${page}`)
        return []
      }

      const data = await response.json()

      if (!data || !Array.isArray(data.items)) {
        console.warn(`[GamePix] Invalid response on page ${page}`)
        return []
      }

      return data.items as GamePixItem[]
    } finally {
      clearTimeout(timeout)
    }
  } catch (error) {
    console.error(`[GamePix] Error page ${page}:`, error)
    return []
  }
}

export async function fetchAllGames(): Promise<GamePixItem[]> {
  const uniqueGames = new Map<string, GamePixItem>()

  for (let page = 1; page <= SAFETY_MAX_PAGES; page++) {
    const games = await fetchPage(page)

    if (games.length === 0) {
      console.log(`[GamePix] End of feed reached at page ${page}`)
      break
    }

    let newGames = 0

    for (const game of games) {
      const key =
        String(game.id || '').trim() ||
        String(game.namespace || '').trim() ||
        String(game.url || '').trim()

      if (!key) continue

      if (!uniqueGames.has(key)) {
        uniqueGames.set(key, game)
        newGames++
      }
    }

    console.log(
      `[GamePix] Page ${page}: ${games.length} received, ${newGames} new, ${uniqueGames.size} total`
    )

    if (newGames === 0) {
      console.log(`[GamePix] No new games found. Stopping.`)
      break
    }

    if (games.length < ITEMS_PER_PAGE) {
      console.log(`[GamePix] Last partial page detected.`)
      break
    }
  }

  const result = Array.from(uniqueGames.values())

  console.log(`[GamePix] Finished. Total unique games: ${result.length}`)

  return result
}
