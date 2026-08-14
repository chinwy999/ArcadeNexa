const GM_API = 'https://api.gamemonetize.com/gamefeed.php'
const GM_KEY = process.env.GAMEMONETIZE_KEY || 'demo'
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
  date: string
}

export interface GameMonetizePage {
  items: GameMonetizeItem[]
  page: number
  nextPage: number | null
}

export async function fetchGMGamesPage(
  page = 1,
  amount = 50
): Promise<GameMonetizePage> {
  const url = new URL(GM_API)
  url.searchParams.set('key', GM_KEY)
  url.searchParams.set('amount', String(amount))
  url.searchParams.set('page', String(page))
  url.searchParams.set('format', 'json')

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
      nextPage: items.length === amount ? page + 1 : null,
    }
  } finally {
    clearTimeout(timeout)
  }
}
