import { calculateArcadeNexaScore } from './arcadeNexaScore'
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
  const quality = Math.max(
    0,
    Math.min(1, Number(item.quality_score) || 0)
  )

  const publishedDate = new Date(item.date_published)

  const releaseYear = Number.isNaN(publishedDate.getTime())
    ? new Date().getFullYear()
    : publishedDate.getFullYear()

  const category = item.category || 'arcade'

  // ArcadeNexa Score:
  // Internal quality score calculated from 5 factors.
  const rating = calculateArcadeNexaScore({
    rating: 5.5 + quality * 4.5,
    releaseYear,
    playable: Boolean(item.url),
    thumbnail: item.banner_image || item.image || '',
    description: item.description || '',
    instructions: 'Use mouse or touch controls to play.',
    tags: [category, 'html5', 'browser'],
    title: item.title || 'Untitled Game',
  })


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


/**
 * REAL CATALOG COUNT
 *
 * GamePix currently exposes 141 pages:
 * - pages 1-140 = 96 games
 * - page 141 = 45 games
 * - exact total = 13,485
 *
 * We calculate the exact count from the provider instead
 * of using a hard-coded marketing number.
 */
let cachedRealGameCount: number | null = null
let realGameCountTimestamp = 0

const REAL_COUNT_CACHE = 6 * 60 * 60 * 1000

export async function getRealGameCount(): Promise<number> {
  const now = Date.now()

  if (
    cachedRealGameCount !== null &&
    now - realGameCountTimestamp < REAL_COUNT_CACHE
  ) {
    return cachedRealGameCount
  }

  try {
    // GamePix exact count
    const firstPage = await fetchGamesPage(1, 96, 'quality')

    if (!firstPage.totalPages || firstPage.totalPages < 1) {
      throw new Error('GamePix total pages unavailable')
    }

    const lastPage = firstPage.totalPages
    const finalPage =
      lastPage === 1
        ? firstPage
        : await fetchGamesPage(lastPage, 96, 'quality')

    const gamePixCount =
      lastPage === 1
        ? firstPage.items.length
        : (lastPage - 1) * 96 + finalPage.items.length

    // GameMonetize verified available catalog count.
    // We intentionally use a small page size and stop on an empty page.
    let gameMonetizeCount = 0

    try {
      const { fetchGMGamesPage } = await import('@/lib/gameMonetizeFeed')

      for (let page = 1; page <= 9; page++) {
        const result = await fetchGMGamesPage(page, 200)

        if (!result.items || result.items.length === 0) {
          break
        }

        gameMonetizeCount += result.items.length

        // Avoid unnecessary requests after a short final page.
        if (result.items.length < 200) {
          break
        }

        // Small delay to reduce provider rate-limit risk.
        if (page < 9) {
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
      }
    } catch (error) {
      console.error(
        '[ArcadeNexa] Failed to determine GameMonetize count:',
        error
      )
    }

    const exactCount = gamePixCount + gameMonetizeCount

    cachedRealGameCount = exactCount
    realGameCountTimestamp = now

    console.log(
      `[ArcadeNexa] REAL catalog count: GamePix=${gamePixCount}, GameMonetize=${gameMonetizeCount}, Total=${exactCount}`
    )

    return exactCount
  } catch (error) {
    console.error(
      '[ArcadeNexa] Failed to determine real catalog count:',
      error
    )

    // Last verified combined catalog count.
    return 14485
  }
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
  const normalizedGenre = genre.trim().toLowerCase()

  /*
   * ARCADENEXA PAGINATION MODEL
   *
   * Each ArcadeNexa page contains up to:
   *   24 GameMonetize + 24 GamePix
   *
   * Each provider is treated as an independent stream.
   */

  const providerTake = Math.ceil(safeSize / 2)
  const arcadeOffset = (safePage - 1) * providerTake

  /*
   * ---------------------------------------------------------
   * GAMEPIX STREAM
   * ---------------------------------------------------------
   */

  const GP_PAGE_SIZE = 48

  const gpProviderPage =
    Math.floor(arcadeOffset / GP_PAGE_SIZE) + 1

  const gpOffset =
    arcadeOffset % GP_PAGE_SIZE

  let gpRaw: Game[] = []
  let gpHasMore = false

  try {
    const result = await fetchGamesPage(
      gpProviderPage,
      GP_PAGE_SIZE,
      'quality',
      normalizedGenre
    )

    gpRaw = result.items.map(convertGame)

    gpHasMore =
      result.nextPage !== null ||
      gpRaw.length >= GP_PAGE_SIZE

    gpRaw = gpRaw.slice(
      gpOffset,
      gpOffset + providerTake
    )
  } catch (error) {
    console.error(
      `[ArcadeNexa] GamePix provider page ${gpProviderPage} unavailable:`,
      error
    )
  }

  /*
   * ---------------------------------------------------------
   * GAMEMONETIZE STREAM
   * ---------------------------------------------------------
   *
   * ALL-GAMES:
   *   The provider feed can be sliced directly.
   *
   * CATEGORY:
   *   Category filtering changes the effective stream.
   *   Therefore we walk GameMonetize pages from page 1,
   *   filter the requested category, and only then apply
   *   the absolute offset.
   *
   * This prevents category games from being skipped when
   * unrelated games occupy earlier provider pages.
   */

  const GM_PAGE_SIZE = 200

  let gmRaw: Game[] = []
  let gmHasMore = false

  try {
    if (!normalizedGenre) {
      const gmProviderPage =
        Math.floor(arcadeOffset / GM_PAGE_SIZE) + 1

      const gmOffset =
        arcadeOffset % GM_PAGE_SIZE

      const result = await fetchGMGamesPage(
        gmProviderPage,
        GM_PAGE_SIZE
      )

      const raw = result.items.map(convertGMGame)

      gmHasMore =
        result.nextPage !== null ||
        raw.length >= GM_PAGE_SIZE

      gmRaw = raw.slice(
        gmOffset,
        gmOffset + providerTake
      )

      console.log(
        `[ArcadeNexa] GM all-games stream: ` +
        `provider=${gmProviderPage}, offset=${gmOffset}`
      )
    } else {
      /*
       * CATEGORY STREAM
       *
       * We need enough filtered games to reach:
       *
       *   arcadeOffset + providerTake
       *
       * Example:
       *   Arcade page 10
       *   offset = 216
       *
       * We continue fetching GM pages until at least
       * 240 matching category games are collected, or
       * the provider reaches its end.
       */

      const requiredEnd =
        arcadeOffset + providerTake

      const categoryGames: Game[] = []

      const seenGM = new Set<string>()

      let providerPage = 1
      let providerEnded = false

      while (
        categoryGames.length < requiredEnd &&
        providerPage <= 50
      ) {
        const result = await fetchGMGamesPage(
          providerPage,
          GM_PAGE_SIZE
        )

        const raw = result.items.map(convertGMGame)

        for (const game of raw) {
          const matchesCategory =
            game.category?.toLowerCase() === normalizedGenre ||
            game.genreFilter?.toLowerCase() === normalizedGenre

          if (!matchesCategory) {
            continue
          }

          if (!game.slug || seenGM.has(game.slug)) {
            continue
          }

          seenGM.add(game.slug)
          categoryGames.push(game)
        }

        if (
          result.nextPage === null ||
          raw.length < GM_PAGE_SIZE
        ) {
          providerEnded = true
          break
        }

        providerPage++
      }

      gmRaw = categoryGames.slice(
        arcadeOffset,
        arcadeOffset + providerTake
      )

      gmHasMore =
        categoryGames.length > arcadeOffset + providerTake ||
        !providerEnded

      console.log(
        `[ArcadeNexa] GM category stream: ` +
        `genre=${normalizedGenre}, ` +
        `pagesScanned=${providerPage}, ` +
        `matches=${categoryGames.length}, ` +
        `offset=${arcadeOffset}`
      )
    }
  } catch (error) {
    console.error(
      `[ArcadeNexa] GameMonetize stream unavailable ` +
      `(genre=${normalizedGenre || 'all'}):`,
      error
    )
  }

  /*
   * ---------------------------------------------------------
   * MERGE
   * ---------------------------------------------------------
   *
   * Keep the intended provider balance:
   *
   *   GameMonetize first
   *   GamePix second
   *
   * If one provider is unavailable, the other provider
   * can fill the remaining slots.
   */

  let merged: Game[] = [
    ...gmRaw,
    ...gpRaw
  ]

  if (merged.length < safeSize) {
    const fallback = [
      ...gpRaw,
      ...gmRaw
    ]

    for (const game of fallback) {
      if (merged.length >= safeSize) {
        break
      }

      if (
        game.slug &&
        !merged.some(
          existing => existing.slug === game.slug
        )
      ) {
        merged.push(game)
      }
    }
  }

  /*
   * ---------------------------------------------------------
   * REMOVE DUPLICATES
   * ---------------------------------------------------------
   */

  const seen = new Set<string>()

  merged = merged.filter(game => {
    if (!game.slug || seen.has(game.slug)) {
      return false
    }

    seen.add(game.slug)
    return true
  })

  /*
   * Final category safety check.
   */

  if (normalizedGenre) {
    merged = merged.filter(game =>
      game.category?.toLowerCase() === normalizedGenre ||
      game.genreFilter?.toLowerCase() === normalizedGenre
    )
  }

  const games = merged.slice(0, safeSize)

  /*
   * ---------------------------------------------------------
   * HAS MORE
   * ---------------------------------------------------------
   */

  const hasMore =
    gpHasMore ||
    gmHasMore ||
    games.length >= safeSize

  console.log(
    `[ArcadeNexa] Page ${safePage}: ${games.length} games ` +
    `(GamePix provider=${gpProviderPage}, offset=${gpOffset}, ` +
    `genre=${normalizedGenre || 'all'})`
  )

  return {
    games,
    hasMore,
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
    // GameMonetize does not provide a reliable user rating.
    // ArcadeNexa calculates its own score from 5 quality factors.
    rating: calculateArcadeNexaScore({
      rating: 7.0,
      releaseYear: new Date().getFullYear(),
      playable: Boolean(item.url),
      thumbnail: item.thumb || '',
      description: item.description || item.instructions || '',
      instructions: item.instructions || '',
      tags: item.tags
        ? item.tags.split(',').map(t => t.trim())
        : [category, 'html5'],
      title: item.title || 'Untitled Game',
    }),
    platform: 'Multi',
    description: item.description || item.instructions || 'Play instantly in your browser.',
    longDescription: item.description || item.instructions || 'Play instantly in your browser.',
    instructions: item.instructions || 'Use mouse or touch controls to play.',
    tags: item.tags ? item.tags.split(',').map(t => t.trim()) : [category, 'html5'],
    officialUrl: item.url,
    iframeUrl: item.url,
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
  /*
   * FAST SLUG LOOKUP
   *
   * GameMonetize:
   *   - Uses direct ID lookup.
   *   - Does NOT scan feed pages.
   *   - Successful lookups are cached in memory.
   *
   * GamePix:
   *   - Keeps the existing limited fast lookup.
   */

  // ---------------------------------------------------------
  // GameMonetize
  // ---------------------------------------------------------
  if (slug.startsWith('gm-')) {
    const id = slug.slice(3).trim()

    if (!id) return null

    const gmSlugCache =
      (globalThis as typeof globalThis & {
        __arcadeNexaGMSlugCache?: Map<string, Game>
      }).__arcadeNexaGMSlugCache ||
      new Map<string, Game>()

    ;(
      globalThis as typeof globalThis & {
        __arcadeNexaGMSlugCache?: Map<string, Game>
      }
    ).__arcadeNexaGMSlugCache = gmSlugCache

    const cached = gmSlugCache.get(slug)

    if (cached) {
      return cached
    }

    /*
     * IMPORTANT:
     * GameMonetize may return HTTP 429 for direct ID requests.
     * A 429 must NEVER turn an existing game into a 404.
     *
     * First try the already cached/full catalog.
     * Only use the direct API as a fallback.
     */

    try {
      if (cachedGames && cachedGames.length > 0) {
        const catalogGame = cachedGames.find(
          game => game.slug === slug
        )

        if (catalogGame) {
          gmSlugCache.set(slug, catalogGame)

          console.log(
            `[ArcadeNexa] GM catalog lookup HIT: ${slug}`
          )

          return catalogGame
        }
      }
    } catch (error) {
      console.warn(
        `[ArcadeNexa] GM catalog lookup failed for ${slug}:`,
        error
      )
    }

    try {
      const { fetchGMGameById } =
        await import('./gameMonetizeFeed')

      console.log(
        `[ArcadeNexa] GM direct lookup START: slug=${slug} id=${id}`
      )

      const item = await fetchGMGameById(id)

      console.log(
        `[ArcadeNexa] GM direct lookup RESULT: slug=${slug} id=${id} found=${Boolean(item)} title=${item?.title || 'NONE'}`
      )

      if (item) {
        const game = convertGMGame(item)

        gmSlugCache.set(slug, game)

        return game
      }
    } catch (error) {
      console.warn(
        `[ArcadeNexa] GM direct lookup unavailable for ${slug}; using catalog fallback`,
        error
      )
    }

    /*
     * Final fallback:
     * Load the catalog once and search it.
     *
     * This is slower on the first request, but prevents
     * legitimate GameMonetize games from becoming 404.
     */
    try {
      const allGames = await loadGames()

      const catalogGame = allGames.find(
        game => game.slug === slug
      )

      if (catalogGame) {
        gmSlugCache.set(slug, catalogGame)

        console.log(
          `[ArcadeNexa] GM final catalog fallback HIT: ${slug}`
        )

        return catalogGame
      }
    } catch (error) {
      console.error(
        `[ArcadeNexa] GM final catalog fallback failed for ${slug}:`,
        error
      )
    }

    return null
  }

  // ---------------------------------------------------------
  // GamePix
  // ---------------------------------------------------------
  try {
    const { fetchGamesPage } =
      await import('./gamepixFeed')

    for (let page = 1; page <= 10; page++) {
      const result = await fetchGamesPage(
        page,
        96,
        'quality'
      )

      const item = result.items.find(
        (i: any) => (i.namespace || i.id) === slug
      )

      if (item) {
        return convertGame(item)
      }

      if (!result.nextPage) {
        break
      }
    }
  } catch (error) {
    console.error(
      `[ArcadeNexa] GamePix slug lookup failed for ${slug}:`,
      error
    )
  }

  // ---------------------------------------------------------
  // Existing catalog cache fallback
  // ---------------------------------------------------------
  if (cachedGames) {
    return cachedGames.find(
      g => g.slug === slug
    ) || null
  }

  return null
}

