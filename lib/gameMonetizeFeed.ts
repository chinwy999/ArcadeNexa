const GM_API = 'https://gamemonetize.com/feed.php'

const REQUEST_TIMEOUT = 20000
const MAX_RETRIES = 3

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


type GMDirectCacheEntry = {
  item: GameMonetizeItem | null
  expiresAt: number
}

const GM_DIRECT_CACHE_TTL = 6 * 60 * 60 * 1000

const gmDirectCache =
  new Map<string, GMDirectCacheEntry>()

const gmDirectInflight =
  new Map<string, Promise<GameMonetizeItem | null>>()

export async function fetchGMGameById(
  id: string
): Promise<GameMonetizeItem | null> {
  const safeId = String(id || '').trim()

  if (!safeId) return null

  const now = Date.now()

  const cached = gmDirectCache.get(safeId)

  if (cached && cached.expiresAt > now) {
    console.log(
      `[ArcadeNexa] GM direct cache HIT: ${safeId}`
    )

    return cached.item
  }

  const existing = gmDirectInflight.get(safeId)

  if (existing) {
    console.log(
      `[ArcadeNexa] GM direct request JOIN: ${safeId}`
    )

    return existing
  }

  const request = (async () => {
    const url = new URL(GM_API)

    url.searchParams.set('format', 'json')
    url.searchParams.set('id', safeId)

    const controller = new AbortController()

    const timeout = setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT
    )

    try {
      console.log(
        `[ArcadeNexa] GM direct API request: ${safeId}`
      )

      const response = await fetch(url.toString(), {
        signal: controller.signal,
        cache: 'no-store',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'ArcadeNexa/1.0',
        },
      })

      if (!response.ok) {
        throw new Error(
          `GameMonetize HTTP ${response.status} for id ${safeId}`
        )
      }

      const data = await response.json()

      const items: GameMonetizeItem[] =
        Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
            ? data.items
            : []

      const item =
        items.find(
          game =>
            String(game.id || '').trim() === safeId
        ) || null

      gmDirectCache.set(safeId, {
        item,
        expiresAt: Date.now() + GM_DIRECT_CACHE_TTL,
      })

      return item
    } finally {
      clearTimeout(timeout)
    }
  })()

  gmDirectInflight.set(safeId, request)

  try {
    return await request
  } finally {
    gmDirectInflight.delete(safeId)
  }
}


export async function fetchGMGamesPage(
  page = 1,
  amount = 200
): Promise<GameMonetizePage> {
  const safePage = Math.max(1, Math.floor(page))
  const safeAmount = Math.min(200, Math.max(1, Math.floor(amount)))

  const url = new URL(GM_API)

  url.searchParams.set('format', 'json')
  url.searchParams.set('num', String(safeAmount))
  url.searchParams.set('page', String(safePage))

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController()

    const timeout = setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT
    )

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

      /*
       * IMPORTANT:
       *
       * Do not wait 60 seconds and retry repeatedly when
       * GameMonetize rate-limits us.
       *
       * The caller can safely treat this page as unavailable.
       */
      if (response.status === 429) {
        console.warn(
          `[ArcadeNexa] GameMonetize rate limit on page ${safePage}`
        )

        throw new Error(
          `GameMonetize HTTP 429 on page ${safePage}`
        )
      }

      if (!response.ok) {
        throw new Error(
          `GameMonetize HTTP ${response.status}`
        )
      }

      const data = await response.json()

      const items: GameMonetizeItem[] =
        Array.isArray(data)
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
      if (attempt >= MAX_RETRIES) {
        throw error
      }

      const delay = Math.min(
        5000,
        1000 * attempt
      )

      console.warn(
        `[ArcadeNexa] GameMonetize page ${safePage} failed. ` +
        `Retry ${attempt}/${MAX_RETRIES} in ${delay}ms`
      )

      await sleep(delay)
    } finally {
      clearTimeout(timeout)
    }
  }

  throw new Error(
    `GameMonetize page ${safePage} failed`
  )
}
