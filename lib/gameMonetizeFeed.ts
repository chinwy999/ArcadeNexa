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
 * ---------------------------------------------------------
 * PAGE CACHE
 * ---------------------------------------------------------
 *
 * GameMonetize aggressively rate-limits repeated requests.
 *
 * Successful provider pages are cached for 6 hours.
 * Simultaneous requests for the same page are deduplicated.
 */

type GMPageCacheEntry = {
  result: GameMonetizePage
  expiresAt: number
}

const GM_PAGE_CACHE_TTL =
  6 * 60 * 60 * 1000

const gmPageCache =
  new Map<string, GMPageCacheEntry>()

const gmPageInflight =
  new Map<string, Promise<GameMonetizePage>>()


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

  const cacheKey =
    `${safePage}:${safeAmount}`

  const now = Date.now()

  /*
   * ---------------------------------------------------------
   * PAGE CACHE
   * ---------------------------------------------------------
   *
   * GameMonetize aggressively rate-limits repeated requests.
   * Reuse successful provider pages for 6 hours.
   */
  const cached = gmPageCache.get(cacheKey)

  if (
    cached &&
    cached.expiresAt > now
  ) {
    console.log(
      `[ArcadeNexa] GM page cache HIT: ` +
      `page=${safePage}, amount=${safeAmount}`
    )

    return cached.result
  }

  /*
   * ---------------------------------------------------------
   * INFLIGHT DEDUPLICATION
   * ---------------------------------------------------------
   *
   * If several server requests ask for the same provider page
   * simultaneously, make only one network request.
   */
  const existing =
    gmPageInflight.get(cacheKey)

  if (existing) {
    console.log(
      `[ArcadeNexa] GM page inflight JOIN: ` +
      `page=${safePage}, amount=${safeAmount}`
    )

    return existing
  }

  const request = (async () => {
    const url = new URL(GM_API)

    url.searchParams.set(
      'format',
      '0'
    )

    url.searchParams.set(
      'num',
      String(safeAmount)
    )

    url.searchParams.set(
      'page',
      String(safePage)
    )

    for (
      let attempt = 1;
      attempt <= MAX_RETRIES;
      attempt++
    ) {
      const controller =
        new AbortController()

      const timeout = setTimeout(
        () => controller.abort(),
        REQUEST_TIMEOUT
      )

      try {
        const response =
          await fetch(
            url.toString(),
            {
              signal: controller.signal,
              headers: {
                Accept: 'application/json',
                'User-Agent':
                  'ArcadeNexa/1.0',
              },
              next: {
                revalidate: 21600,
              },
            }
          )

        /*
         * 429:
         * Do not retry.
         *
         * Cache the empty result briefly so repeated page
         * requests do not immediately hit GameMonetize again.
         */
        if (
          response.status === 429
        ) {
          console.warn(
            `[ArcadeNexa] GameMonetize HTTP 429 ` +
            `on page ${safePage} - temporary cooldown`
          )

          const result: GameMonetizePage = {
            items: [],
            page: safePage,
            nextPage: null,
          }

          gmPageCache.set(
            cacheKey,
            {
              result,
              expiresAt:
                Date.now() + 5 * 60 * 1000,
            }
          )

          return result
        }

        /*
         * Retry temporary 5xx errors only.
         */
        if (!response.ok) {
          if (
            response.status >= 500
          ) {
            throw new Error(
              `GameMonetize HTTP ` +
              `${response.status} ` +
              `on page ${safePage}`
            )
          }

          throw new Error(
            `GameMonetize HTTP ` +
            `${response.status} ` +
            `on page ${safePage} ` +
            `(non-retryable)`
          )
        }

        const items =
          await parseGMResponse(
            response,
            `page ${safePage}`
          )

        const result: GameMonetizePage = {
          items,
          page: safePage,
          nextPage:
            items.length >= safeAmount
              ? safePage + 1
              : null,
        }

        /*
         * Successful pages stay cached for 6 hours.
         */
        gmPageCache.set(
          cacheKey,
          {
            result,
            expiresAt:
              Date.now() +
              GM_PAGE_CACHE_TTL,
          }
        )

        console.log(
          `[ArcadeNexa] GM page cached: ` +
          `page=${safePage}, ` +
          `items=${items.length}`
        )

        return result
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : String(error)

        /*
         * XML/HTML and invalid JSON are provider-format
         * problems, not transient network errors.
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
            `[ArcadeNexa] GameMonetize ` +
            `page ${safePage} failed:`,
            message
          )

          throw error
        }

        const delay =
          Math.min(
            5000,
            1000 * attempt
          )

        console.warn(
          `[ArcadeNexa] GameMonetize ` +
          `page ${safePage} failed. ` +
          `Retry ${attempt}/${MAX_RETRIES} ` +
          `in ${delay}ms`
        )

        await sleep(delay)
      } finally {
        clearTimeout(timeout)
      }
    }

    throw new Error(
      `GameMonetize page ` +
      `${safePage} failed`
    )
  })()

  gmPageInflight.set(
    cacheKey,
    request
  )

  try {
    return await request
  } finally {
    gmPageInflight.delete(
      cacheKey
    )
  }
}
