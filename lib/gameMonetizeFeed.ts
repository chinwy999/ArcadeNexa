const GM_API = 'https://rss.gamemonetize.com/rssfeed.php'
const REQUEST_TIMEOUT = 15000

export interface GameMonetizeItem {
  id: string
  title: string
  description: string
  instructions: string
  url: string
  category: string
  tags: string
  thumb: string
  width: string
  height: string
}

export interface GameMonetizePage {
  items: GameMonetizeItem[]
  page: number
  nextPage: number | null
}

export async function fetchGMGamesPage(
  page = 1,
  amount = 100
): Promise<GameMonetizePage> {
  const url = new URL(GM_API)
  url.searchParams.set('format', 'json')
  url.searchParams.set('category', 'All')
  url.searchParams.set('type', 'html5')
  url.searchParams.set('popularity', 'newest')
  url.searchParams.set('amount', String(amount))

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error(`GameMonetize HTTP ${response.status}`)
    }

    const data = await response.json()
    const items: GameMonetizeItem[] = Array.isArray(data) ? data : []

    return {
      items,
      page,
      nextPage: null,
    }
  } finally {
    clearTimeout(timeout)
  }
}
