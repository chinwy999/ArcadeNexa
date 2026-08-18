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

/*
 * GameMonetize occasionally returns XML/HTML instead of JSON.
 *
 * Never call response.json() blindly.
 * Read the response as text first, inspect the content,
 * and only then parse JSON.
 */
async function parseGMResponse(
  response: Response,
  context: string
): Promise<GameMonetizeItem[]> {
  const contentType =
    response.headers.get('content-type') || ''

  const text = await response.text()
  const trimmed = text.trim()

  if (!trimmed) {
    throw new Error(
      `GameMonetize empty response (${context})`
    )
  }

  /*
   * XML / HTML responses normally begin with "<".
   * This is a provider response problem, not a JSON problem,
   * so callers should not repeatedly retry it.
   */
  if (
    trimmed.startsWith('<') ||
    /^(<\?xml|<!doctype|<html\b)/i.test(trimmed)
  ) {
    throw new Error(
      `GameMonetize returned XML/HTML instead of JSON ` +
      `(${context}, content-type: ${contentType || 'unknown'})`
    )
  }

  let data: unknown

  try {
    data = JSON.parse(trimmed)
  } catch {
    throw new Error(
      `GameMonetize returned invalid JSON ` +
      `(${context}, content-type: ${contentType || 'unknown'})`
    )
  }

  if (Array.isArray(data)) {
    return data as GameMonetizeItem[]
  }

  if (
    typeof data === 'object' &&
    data !== null &&
    Array.isArray(
      (data as { items?: unknown }).items
    )
  ) {
    return (
      (data as { items: GameMonetizeItem[] }).items
    )
  }

  return []
}

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

    url.searchParams.set('format', '0')
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

      const items = await parseGMResponse(
        response,
        `id ${safeId}`
      )

      const item =
        items.find(
          game =>
            String(game.id || '').trim() === safeId
        ) || null

      gmDirectCache.set(safeId, {
        item,
        expiresAt:
          Date.now() + GM_DIRECT_CACHE_TTL,
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
  const safePage = Math.max(
    1,
    Math.floor(page)
  )

  const safeAmount = Math.min(
    200,
    Math.max(1, Math.floor(amount))
  )

  const url = new URL(GM_API)

  url.searchParams.set('format', '0')
  url.searchParams.set('num', String(safeAmount))
  url.searchParams.set('page', String(safePage))

  for (
    let attempt = 1;
    attempt <= MAX_RETRIES;
    attempt++
  ) {
    const controller = new AbortController()

    const timeout = setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT
    )

    try {
      const response = await fetch(
        url.toString(),
        {
          signal: controller.signal,
          headers: {
            Accept: 'application/json',
            'User-Agent': 'ArcadeNexa/1.0',
          },
          next: {
            revalidate: 21600,
          },
        }
      )

      /*
       * 429 means GameMonetize is rate-limiting us.
       *
       * IMPORTANT:
       * Do NOT retry 429 responses.
       * Retrying immediately only increases provider pressure
       * and makes the build slower.
       *
       * The caller can safely treat this page as temporarily unavailable.
       */
      if (response.status === 429) {
        console.warn(
          `[ArcadeNexa] GameMonetize HTTP 429 on page ${safePage} - skipping without retry`
        )

        return {
          items: [],
          page: safePage,
          nextPage: null,
        }
      }

      /*
       * Retry temporary server errors.
       * Do not retry 4xx errors unnecessarily.
       */
      if (!response.ok) {
        if (response.status >= 500) {
          throw new Error(
            `GameMonetize HTTP ${response.status} ` +
            `on page ${safePage}`
          )
        }

        throw new Error(
          `GameMonetize HTTP ${response.status} ` +
          `on page ${safePage} (non-retryable)`
        )
      }

      /*
       * IMPORTANT:
       * parseGMResponse() reads text first and detects
       * XML/HTML before attempting JSON.parse().
       *
       * XML/HTML is treated as a provider-format error
       * and is NOT retried.
       */
      const items = await parseGMResponse(
        response,
        `page ${safePage}`
      )

      return {
        items,
        page: safePage,
        nextPage:
          items.length >= safeAmount
            ? safePage + 1
            : null,
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : String(error)

      /*
       * XML/HTML and invalid JSON are not transient
       * network failures. Retrying them only wastes
       * build time and can increase provider pressure.
       */
      const nonRetryable =
        message.includes(
          'returned XML/HTML instead of JSON'
        ) ||
        message.includes(
          'returned invalid JSON'
        ) ||
        message.includes(
          '(non-retryable)'
        )

      if (
        nonRetryable ||
        attempt >= MAX_RETRIES
      ) {
        console.error(
          `[ArcadeNexa] GameMonetize page ${safePage} failed:`,
          message
        )

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
