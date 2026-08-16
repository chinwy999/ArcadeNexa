import { fetchGMGamesPage, GameMonetizeItem } from './gameMonetizeFeed'
import { fetchGamesPage, GamePixItem } from './gamepixFeed'

export interface Game {
  id: string
  slug: string
  title: string
  name: string
  initials: string
  gradient: string
  genre: string[]
  genreFilter: string
  rating: number
  platform: 'PC' | 'Multi'
  description: string
  longDescription: string
  instructions: string
  tags: string[]
  officialUrl: string
  iframeUrl: string
  thumbnail: string
  thumbnailLarge: string
  thumbnailSizes: Record<string, string>
  releaseYear: number
  provider: string
  providerGameId: string
  width: number
  height: number
  aspectRatio: string
  playable: boolean
  category: string
}

const GRADIENTS = [
  'bg-gradient-to-br from-purple-500/30 to-blue-500/30',
  'bg-gradient-to-br from-emerald-500/30 to-cyan-500/30',
  'bg-gradient-to-br from-orange-500/30 to-red-500/30',
  'bg-gradient-to-br from-pink-500/30 to-purple-500/30',
  'bg-gradient-to-br from-blue-500/30 to-indigo-500/30',
]

function getInitials(title: string): string {
  const words = title.split(' ').filter(Boolean)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return title.slice(0, 3).toUpperCase()
}

function getGradient(slug: string): string {
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash)
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length]
}

function getAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)
  const safeWidth = width > 0 ? width : 800
  const safeHeight = height > 0 ? height : 600
  const divisor = gcd(safeWidth, safeHeight)
  return `${safeWidth / divisor} / ${safeHeight / divisor}`
}

export function convertGame(item: GamePixItem): Game {
  const quality = Number(item.quality_score) || 0
  const rating = Math.max(1, Math.min(10, Math.round(quality * 10)))
  const publishedDate = new Date(item.date_published)
  const releaseYear = Number.isNaN(publishedDate.getTime())
    ? new Date().getFullYear()
    : publishedDate.getFullYear()
  const category = item.category || 'arcade'

  return {
    id: `gamepix-${item.namespace || item.id}`,
    slug: item.namespace || item.id,
    title: item.title || 'Untitled Game',
    name: item.title || 'Untitled Game',
    initials: getInitials(item.title || 'Game'),
    gradient: getGradient(item.namespace || item.id),
    genre: [category, 'HTML5'],
    genreFilter: category,
    rating,
    platform: 'Multi',
    description: item.description || 'Play this game instantly in your browser.',
    longDescription: item.description || 'Play this game instantly in your browser.',
    instructions: 'Use mouse or touch controls to play.',
    tags: [category, 'html5', 'browser'],
    officialUrl: item.url,
    iframeUrl: `https://play.gamepix.com/${item.namespace}/embed?sid=DXXR1`,
    thumbnail: item.banner_image || item.image || '',
    thumbnailLarge: item.banner_image || item.image || '',
    thumbnailSizes: { '512x384': item.banner_image || item.image || '' },
    releaseYear,
    provider: 'GamePix',
    providerGameId: item.id,
    width: item.width || 800,
    height: item.height || 600,
    aspectRatio: getAspectRatio(item.width || 800, item.height || 600),
    playable: Boolean(item.url),
    category,
  }
}

// جلب 20 صفحة × 96 لعبة = ~1920 لعبة
const SERVER_PAGES = 20
const PAGE_SIZE = 96
// كاش 6 ساعات
const CACHE_DURATION = 6 * 60 * 60 * 1000

let cachedGames: Game[] | null = null
let cacheTimestamp = 0
let loadingPromise: Promise<Game[]> | null = null

async function loadGames(): Promise<Game[]> {
  const now = Date.now()

  if (cachedGames && now - cacheTimestamp < CACHE_DURATION) {
    return cachedGames
  }

  if (loadingPromise) return loadingPromise

  loadingPromise = (async () => {
    console.log('[ArcadeNexa] Loading GamePix catalog...')
    const allItems: GamePixItem[] = []
    const seen = new Set<string>()

    for (let page = 1; page <= SERVER_PAGES; page++) {
      try {
        const result = await fetchGamesPage(page, PAGE_SIZE)

        for (const item of result.items) {
          const key = String(item.namespace || item.id || '').trim()
          if (key && !seen.has(key)) {
            seen.add(key)
            allItems.push(item)
          }
        }

        if (!result.nextPage) break

      } catch (error) {
        console.error(`[ArcadeNexa] Failed page ${page}:`, error)
        break
      }
    }

    const gmGames = await loadGMGames()
    const gpGames = allItems.map(convertGame)
    const seenSlugs = new Set<string>()
    const merged: Game[] = []
    for (const g of [...gmGames, ...gpGames]) {
      if (!seenSlugs.has(g.slug)) {
        seenSlugs.add(g.slug)
        merged.push(g)
      }
    }
    cachedGames = merged
    cacheTimestamp = Date.now()
    loadingPromise = null

    console.log(`[ArcadeNexa] Loaded ${cachedGames.length} games`)
    return cachedGames
  })()

  return loadingPromise
}

export async function getGames(): Promise<Game[]> {
  return loadGames()
}

/**
 * ألعاب الصفحة الرئيسية.
 *
 * لا تستخدم الكتالوج الكامل حتى لا تنتظر آلاف طلبات
 * GamePix / GameMonetize عند فتح الصفحة الرئيسية.
 */
export async function getHomeGames(): Promise<Game[]> {
  try {
    console.log('[ArcadeNexa] Loading fast home catalog...')

    const [gpResult, gmResult] = await Promise.all([
      fetchGamesPage(1, 96, 'quality'),
      fetchGMGamesPage(1, 200),
    ])

    const gpGames = gpResult.items.map(convertGame)
    const gmGames = gmResult.items.map(convertGMGame)

    const seen = new Set<string>()
    const merged: Game[] = []

    for (const game of [...gmGames, ...gpGames]) {
      if (!seen.has(game.slug)) {
        seen.add(game.slug)
        merged.push(game)
      }
    }

    const result = merged
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 32)

    console.log(`[ArcadeNexa] Home catalog ready: ${result.length} games`)

    return result
  } catch (error) {
    console.error('[ArcadeNexa] Fast home catalog failed:', error)

    // Fallback إلى الكاش/الكتالوج الكامل إذا كان متاحًا.
    try {
      const allGames = await loadGames()
      return allGames.slice(0, 32)
    } catch {
      return []
    }
  }
}


export async function getGamesPage(
  page = 1,
  pageSize = 48,
  genre = ''
): Promise<{ games: Game[]; hasMore: boolean }> {
  const safePage = Math.max(1, Math.floor(page))
  const safeSize = Math.min(48, Math.max(1, Math.floor(pageSize)))

  try {
    /*
     * مهم:
     * لا نستعمل getGames() هنا.
     * كل طلب يجلب جزءًا صغيرًا فقط من الكتالوج.
     */

    const gpPage = Math.max(
      1,
      Math.ceil((safePage * safeSize) / 96)
    )

    const [gpResult, gmResult] = await Promise.all([
      fetchGamesPage(gpPage, 96, 'quality'),
      fetchGMGamesPage(safePage, 200),
    ])

    const gpGames = gpResult.items.map(convertGame)
    const gmGames = gmResult.items.map(convertGMGame)

    const seen = new Set<string>()
    let merged: Game[] = []

    for (const game of [...gmGames, ...gpGames]) {
      if (!seen.has(game.slug)) {
        seen.add(game.slug)
        merged.push(game)
      }
    }

    if (genre.trim()) {
      const normalizedGenre = genre.trim().toLowerCase()

      merged = merged.filter(game =>
        game.category?.toLowerCase() === normalizedGenre ||
        game.genreFilter?.toLowerCase() === normalizedGenre
      )
    }

    merged.sort((a, b) => b.rating - a.rating)

    const games = merged.slice(0, safeSize)

    const hasMore =
      gpResult.nextPage !== null ||
      gmResult.nextPage !== null ||
      merged.length >= safeSize

    console.log(
      `[ArcadeNexa] Page ${safePage}: ${games.length} games`
    )

    return {
      games,
      hasMore,
    }
  } catch (error) {
    console.error(
      `[ArcadeNexa] Failed games page ${safePage}:`,
      error
    )

    return {
      games: [],
      hasMore: false,
    }
  }
}

export async function getGameBySlug(slug: string): Promise<Game | null> {
  const allGames = await loadGames()
  return allGames.find(game => game.slug === slug) || null
}

export async function getAllGenreFilters(): Promise<string[]> {
  const allGames = await loadGames()
  const categories = new Set<string>()
  allGames.forEach(game => {
    if (game.category) categories.add(game.category)
    if (game.genreFilter) categories.add(game.genreFilter)
  })
  return Array.from(categories).sort()
}

export async function getGameCount(): Promise<number> {
  const games = await loadGames()
  return games.length
}

export const games: Game[] = []


export function convertGMGame(item: GameMonetizeItem): Game {
  const slug = `gm-${item.id}`
  const category = item.category?.toLowerCase() || 'arcade'
  const w = Number(item.width) || 800
  const h = Number(item.height) || 600

  return {
    id: `gamemonetize-${item.id}`,
    slug,
    title: item.title || 'Untitled Game',
    name: item.title || 'Untitled Game',
    initials: getInitials(item.title || 'Game'),
    gradient: getGradient(slug),
    genre: [category, 'HTML5'],
    genreFilter: category,
    rating: 8,
    platform: 'Multi',
    description: item.description || item.instructions || 'Play instantly in your browser.',
    longDescription: item.description || item.instructions || 'Play instantly in your browser.',
    instructions: item.instructions || 'Use mouse or touch controls to play.',
    tags: item.tags ? item.tags.split(',').map(t => t.trim()) : [category, 'html5'],
    officialUrl: item.url,
    iframeUrl: `https://play.gamepix.com/${item.namespace}/embed?sid=DXXR1`,
    thumbnail: item.thumb || '',
    thumbnailLarge: item.thumb || '',
    thumbnailSizes: { '512x384': item.thumb || '' },
    releaseYear: new Date().getFullYear(),
    provider: 'GameMonetize',
    providerGameId: item.id,
    width: w,
    height: h,
    aspectRatio: getAspectRatio(w, h),
    playable: Boolean(item.url),
    category,
  }
}


const GM_PAGES = 50
const GM_PAGE_SIZE = 200

async function loadGMGames(): Promise<Game[]> {
  try {
    const allItems: GameMonetizeItem[] = []
    const seen = new Set<string>()
    for (let page = 1; page <= GM_PAGES; page++) {
      try {
        const result = await fetchGMGamesPage(page, GM_PAGE_SIZE)
        for (const item of result.items) {
          const key = String(item.id || "").trim()
          if (key && seen.has(key) === false) {
            seen.add(key)
            allItems.push(item)
          }
        }
        if (result.items.length < GM_PAGE_SIZE) break
      } catch (err) {
        console.error("[ArcadeNexa] GM page " + page + " failed:", err)
        break
      }
    }
    console.log("[ArcadeNexa] GameMonetize loaded " + allItems.length + " games")
    return allItems.map(convertGMGame)
  } catch (error) {
    console.error("[ArcadeNexa] GameMonetize failed:", error)
    return []
  }
}

// ===== FAST SLUG LOOKUP =====
export async function getGameBySlugFast(slug: string): Promise<Game | null> {
  // GameMonetize: slug = "gm-{id}"
  if (slug.startsWith('gm-')) {
    try {
      const id = slug.replace('gm-', '')
      const { fetchGMGamesPage } = await import('./gameMonetizeFeed')
      // ابحث في أول 5 صفحات فقط
      for (let page = 1; page <= 5; page++) {
        const result = await fetchGMGamesPage(page, 200)
        const item = result.items.find((i: any) => String(i.id) === id)
        if (item) return convertGMGame(item)
        if (result.items.length < 200) break
      }
    } catch {}
    return null
  }

  // GamePix: ابحث في أول 3 صفحات
  try {
    const { fetchGamesPage } = await import('./gamepixFeed')
    for (let page = 1; page <= 3; page++) {
      const result = await fetchGamesPage(page, 96, 'quality')
      const item = result.items.find(
        (i: any) => (i.namespace || i.id) === slug
      )
      if (item) return convertGame(item)
      if (!result.nextPage) break
    }
  } catch {}

  // fallback للكاش إذا كان موجوداً
  if (cachedGames) {
    return cachedGames.find(g => g.slug === slug) || null
  }

  return null
}
