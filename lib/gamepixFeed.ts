const API_BASE = 'https://feeds.gamepix.com/v2/json'
const SITE_ID = process.env.GAMEPIX_SID || 'DXXR1'
const DEFAULT_PAGE_SIZE = 48
const MAX_PAGE_SIZE = 96
const REQUEST_TIMEOUT = 15000

export interface GamePixItem {
  id: string
  namespace: string
  title: string
  description: string
  category: string
  quality_score: number
  date_published: string
  date_modified?: string
  url: string
  banner_image: string
  image?: string
  width: number
  height: number
  orientation?: string
}

export interface GamePixPage {
  items: GamePixItem[]
  page: number
  pagination: number
  nextPage: number | null
  totalPages: number | null
}

export async function fetchGamesPage(
  page = 1,
  pagination = DEFAULT_PAGE_SIZE,
  order = 'quality'
): Promise<GamePixPage> {
  const safePage = Math.max(1, Number(page) || 1)
  const safePagination = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number(pagination) || DEFAULT_PAGE_SIZE)
  )

  const url = new URL(API_BASE)
  url.searchParams.set('sid', SITE_ID)
  url.searchParams.set('pagination', String(safePagination))
  url.searchParams.set('page', String(safePage))
  url.searchParams.set('order', order)

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
      throw new Error(`GamePix HTTP ${response.status}`)
    }

    const data = await response.json()

    const items: GamePixItem[] = Array.isArray(data?.items)
      ? data.items
      : []

    let totalPages: number | null = null

    if (typeof data?.last_page_url === 'string') {
      try {
        const lastUrl = new URL(data.last_page_url)
        const parsed = Number(lastUrl.searchParams.get('page'))
        if (Number.isFinite(parsed) && parsed > 0) {
          totalPages = parsed
        }
      } catch {
        // Ignore malformed last_page_url
      }
    }

    let nextPage: number | null = null

    if (data?.next_url) {
      try {
        const nextUrl = new URL(data.next_url)
        const parsed = Number(nextUrl.searchParams.get('page'))

        if (Number.isFinite(parsed) && parsed > safePage) {
          nextPage = parsed
        }
      } catch {
        nextPage = null
      }
    }

    return {
      items,
      page: safePage,
      pagination: safePagination,
      nextPage,
      totalPages,
    }
  } finally {
    clearTimeout(timeout)
  }
}

/*
 * IMPORTANT:
 * Do not fetch the entire GamePix catalog during every request.
 * The previous implementation walked hundreds of pages sequentially,
 * which could cause Vercel/Next.js requests to timeout.
 *
 * getGames() only loads a fast initial catalog.
 * Pagination is handled by fetchGamesPage().
 */
export async function fetchAllGames(): Promise<GamePixItem[]> {
  const firstPage = await fetchGamesPage(1, DEFAULT_PAGE_SIZE, 'quality')
  return firstPage.items
}
