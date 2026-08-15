const GM_API = 'https://gamemonetize.com/feed.php'

const REQUEST_TIMEOUT = 20000
const MAX_RETRIES = 5

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

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function fetchGMGamesPage(
  page = 1,
  amount = 200
): Promise<GameMonetizePage> {
  const safePage = Math.max(1, Math.floor(page))
  const safeAmount = Math.min(200, Math.max(1, Math.floor(amount)))

  const url = new URL(GM_API)

  url.searchParams.set('format', '0')
  url.searchParams.set('num', String(safeAmount))
  url.searchParams.set('page', String(safePage))

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

    try {
      const response = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'ArcadeNexa/1.0',
        },
        next: {
          revalidate: 21600,
        },
      })

      if (response.status === 429) {
        const retryAfter = Number(response.headers.get('retry-after'))
        const delay = Number.isFinite(retryAfter)
          ? retryAfter * 1000
          : Math.min(30000, 3000 * attempt)

        console.warn(
          `[ArcadeNexa] GameMonetize rate limit on page ${safePage}. Retry ${attempt}/${MAX_RETRIES} in ${delay}ms`
        )

        clearTimeout(timeout)

        if (attempt < MAX_RETRIES) {
          await sleep(delay)
          continue
        }

        throw new Error(`GameMonetize HTTP 429 after ${MAX_RETRIES} retries`)
      }

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
        nextPage:
          items.length >= safeAmount
            ? safePage + 1
            : null,
      }
    } catch (error) {
      clearTimeout(timeout)

      if (attempt >= MAX_RETRIES) {
        throw error
      }

      const delay = Math.min(30000, 2000 * attempt)

      console.warn(
        `[ArcadeNexa] GameMonetize page ${safePage} failed. Retry ${attempt}/${MAX_RETRIES} in ${delay}ms`
      )

      await sleep(delay)
    } finally {
      clearTimeout(timeout)
    }
  }

  throw new Error(`GameMonetize page ${safePage} failed`)
}
