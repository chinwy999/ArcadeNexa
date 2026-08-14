const GM_API = 'https://gamemonetize.com/feed.php'
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
  amount = 50
): Promise<GameMonetizePage> {
  const safePage = Math.max(1, Math.floor(page))
  const safeAmount = Math.min(200, Math.max(1, Math.floor(amount)))

  const url = new URL(GM_API)

  url.searchParams.set('format', '0')
  url.searchParams.set('num', String(safeAmount))
  url.searchParams.set('page', String(safePage))

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
      next: {
        revalidate: 3600,
      },
    })

    if (!response.ok) {
      throw new Error(`GameMonetize HTTP ${response.status}`)
    }

    const data = await response.json()

    const items: GameMonetizeItem[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.items)
        ? data.items
        : []

    return {
      items,
      page: safePage,
      nextPage: items.length >= safeAmount ? safePage + 1 : null,
    }
  } finally {
    clearTimeout(timeout)
  }
}
