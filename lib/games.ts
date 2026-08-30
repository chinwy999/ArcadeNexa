import { calculateArcadeNexaScore } from './arcadeNexaScore'
import { fetchGMGamesPage, GameMonetizeItem } from './gameMonetizeFeed'
import { fetchGamesPage, GamePixItem } from './gamepixFeed'


/*
 * Provider category names are not always identical.
 * Keep original values in the game data and normalize only for comparison.
 */
function normalizeGenre(value: string | undefined | null): string {
  const raw = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")

  const aliases: Record<string, string> = {
    shooting: "shooter",
    shooter: "shooter",

    hypercasual: "hyper-casual",
    "hyper-casual": "hyper-casual",

    match3: "match-3",
    "match-3": "match-3",

    hiddenobject: "hidden-object",
    "hidden-object": "hidden-object",

    "games-for-girls": "girls",
    girl: "girls",
    girls: "girls",
  }

  return aliases[raw] || raw
}

function matchesGenre(
  requestedGenre: string | undefined | null,
  gameCategory: string | undefined | null,
  gameGenreFilter: string | undefined | null
): boolean {
  const requested = normalizeGenre(requestedGenre)

  return (
    normalizeGenre(gameCategory) === requested ||
    normalizeGenre(gameGenreFilter) === requested
  )
}

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


function buildGameDescriptions({
  title,
  description,
  category,
  tags = [],
  instructions,
}: {
  title: string
  description?: string
  category?: string
  tags?: string[]
  instructions?: string
}): {
  description: string
  longDescription: string
} {
  const clean = (value: string | undefined | null) =>
    String(value || '')
      .replace(/\s+/g, ' ')
      .trim()

  const gameTitle = clean(title) || 'This game'
  const rawDescription = clean(description)
  const gameCategory = clean(category) || 'arcade'

  const cleanTags = tags
    .map(tag => clean(tag))
    .filter(Boolean)
    .slice(0, 4)

  const usefulDescription =
    rawDescription &&
    rawDescription !== 'Play this game instantly in your browser.' &&
    rawDescription.length >= 40
      ? rawDescription
      : ''

  const seoBase =
    `${gameTitle} is a free ${gameCategory} browser game on ArcadeNexa. ` +
    `Play instantly with no download required.`

  const makeSeoDescription = (text: string) => {
    const normalized = clean(text)

    if (normalized.length >= 120 && normalized.length <= 160) {
      return normalized
    }

    if (normalized.length > 160) {
      const cut = normalized.slice(0, 157)
      const lastSpace = cut.lastIndexOf(' ')
      return `${(lastSpace > 100 ? cut.slice(0, lastSpace) : cut).trim()}...`
    }

    const fallback =
      `${normalized} Play ${gameTitle} free online on ArcadeNexa with no download required.`

    if (fallback.length <= 160) {
      return fallback
    }

    const cut = fallback.slice(0, 157)
    const lastSpace = cut.lastIndexOf(' ')
    return `${(lastSpace > 100 ? cut.slice(0, lastSpace) : cut).trim()}...`
  }

  const shortDescription = makeSeoDescription(
    usefulDescription || seoBase
  )

  const tagText = cleanTags.length
    ? ` The game is tagged with ${cleanTags.join(', ')}.`
    : ''

  const instructionText = clean(instructions)
    ? ` ${clean(instructions)}`
    : ' Use the on-screen instructions and controls provided by the game.'

  const longDescription = usefulDescription
    ? `${usefulDescription}${tagText}${instructionText} Play ${gameTitle} for free on ArcadeNexa and enjoy an instant browser gaming experience with no download required.`
    : `${gameTitle} is a free ${gameCategory} browser game available on ArcadeNexa. Play instantly in your browser with no download or installation required.${tagText}${instructionText} Start playing ${gameTitle} directly from its game page and discover a quick, accessible browser gaming experience.`

  return {
    description: shortDescription,
    longDescription,
  }
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
      ...buildGameDescriptions({
        title: item.title || 'Untitled Game',
        description: item.description,
        category,
        tags: [category, 'html5', 'browser'],
        instructions: 'Use mouse or touch controls to play.',
      }),
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

// Cache the expensive real provider count separately.
// This prevents multiple concurrent pages/components from scanning
// GameMonetize pages and calculating the same catalog total repeatedly.
const REAL_COUNT_CACHE_DURATION = 6 * 60 * 60 * 1000

let realGameCountCache: {
  value: number
  expiresAt: number
} | null = null

let realGameCountInflight: Promise<number> | null = null

// Home catalog is small but can still be requested concurrently.
// Cache the merged result and share one in-flight request.
const HOME_GAMES_CACHE_DURATION = 6 * 60 * 60 * 1000

let homeGamesCache: {
  value: Game[]
  expiresAt: number
} | null = null

let homeGamesInflight: Promise<Game[]> | null = null

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
 * - exact total = 15,000+
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
    realGameCountCache &&
    realGameCountCache.expiresAt > now
  ) {
    console.log(
      `[ArcadeNexa] REAL catalog count cache HIT: ${realGameCountCache.value}`
    )
    return realGameCountCache.value
  }

  if (realGameCountInflight) {
    console.log("[ArcadeNexa] REAL catalog count inflight JOIN")
    return realGameCountInflight
  }

  realGameCountInflight = (async () => {
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
    return 15285
  }
})()

  try {
    const value = await realGameCountInflight

    realGameCountCache = {
      value,
      expiresAt: Date.now() + REAL_COUNT_CACHE_DURATION,
    }

    console.log(
      `[ArcadeNexa] REAL catalog count cached: ${value}`
    )

    return value
  } finally {
    realGameCountInflight = null
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
  const now = Date.now()

  if (
    homeGamesCache &&
    homeGamesCache.expiresAt > now
  ) {
    console.log(
      `[ArcadeNexa] Home catalog cache HIT: ${homeGamesCache.value.length} games`
    )

    return homeGamesCache.value
  }

  if (homeGamesInflight) {
    console.log("[ArcadeNexa] Home catalog inflight JOIN")

    return homeGamesInflight
  }

  homeGamesInflight = (async () => {
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

      console.log(
        `[ArcadeNexa] Home catalog ready: ${result.length} games`
      )

      return result
    } catch (error) {
      console.error(
        '[ArcadeNexa] Fast home catalog failed:',
        error
      )

      // Keep the existing fallback behavior.
      try {
        const allGames = await loadGames()
        return allGames.slice(0, 32)
      } catch {
        return []
      }
    }
  })()

  try {
    const value = await homeGamesInflight

    homeGamesCache = {
      value,
      expiresAt: Date.now() + HOME_GAMES_CACHE_DURATION,
    }

    console.log(
      `[ArcadeNexa] Home catalog cached: ${value.length} games`
    )

    return value
  } finally {
    homeGamesInflight = null
  }
}

export async function getGamesPage(
  page = 1,
  pageSize = 48,
  genre = ''
): Promise<{ games: Game[]; hasMore: boolean }> {
  const safePage = Math.max(1, Math.floor(page))
  const safeSize = Math.min(48, Math.max(1, Math.floor(pageSize)))
  const normalizedGenre = normalizeGenre(genre)

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

  /*
   * Reuse category results during GamePix -> GameMonetize
   * failover so we do not rescan GameMonetize from page 1.
   */
  let gmCategoryStream: Game[] | null = null
  let gmCategorySeen = new Set<string>()
  let gmCategoryNextPage = 1
  let gmCategoryEnded = false

  try {
    if (!normalizedGenre) {
      /*
       * ALL-GAMES STREAM
       *
       * A single ArcadeNexa page may cross a GameMonetize
       * provider-page boundary.
       *
       * Example:
       *   GM page size = 200
       *   arcadeOffset = 192
       *   providerTake = 24
       *
       * GM page 1 provides only 8 games (192..199),
       * so the remaining 16 games must come from GM page 2.
       *
       * Therefore we collect enough provider games across
       * consecutive GM pages before slicing the ArcadeNexa
       * provider window.
       */

      const requiredEnd =
        arcadeOffset + providerTake + 1

      const collectedGM: Game[] = []

      const seenGM = new Set<string>()

      let providerPage =
        Math.floor(arcadeOffset / GM_PAGE_SIZE) + 1

      let providerOffset =
        arcadeOffset % GM_PAGE_SIZE

      let providerEnded = false

      /*
       * Continue across GM provider pages until we have enough
       * games to satisfy the requested ArcadeNexa window plus
       * one extra game for hasMore detection.
       */
      while (
        collectedGM.length <
          requiredEnd - arcadeOffset &&
        providerPage <= 50
      ) {
        const result = await fetchGMGamesPage(
          providerPage,
          GM_PAGE_SIZE
        )

        const raw = result.items.map(
          convertGMGame
        )

        /*
         * Only use the portion of the first provider page
         * starting at the requested provider offset.
         *
         * Subsequent provider pages start at offset 0.
         */
        const start =
          providerPage ===
          Math.floor(arcadeOffset / GM_PAGE_SIZE) + 1
            ? providerOffset
            : 0

        const available =
          raw.slice(start)

        for (const game of available) {
          if (
            !game.slug ||
            seenGM.has(game.slug)
          ) {
            continue
          }

          seenGM.add(game.slug)
          collectedGM.push(game)

          if (
            collectedGM.length >=
            requiredEnd - arcadeOffset
          ) {
            break
          }
        }

        if (
          result.nextPage === null ||
          raw.length < GM_PAGE_SIZE
        ) {
          providerEnded = true
          break
        }

        providerPage =
          result.nextPage || providerPage + 1

        providerOffset = 0
      }

      gmRaw = collectedGM.slice(
        0,
        providerTake
      )

      /*
       * We fetched one extra candidate when available.
       * This allows hasMore to represent an actual additional
       * GameMonetize game rather than merely another provider page.
       */
      gmHasMore =
        collectedGM.length > providerTake ||
        (
          !providerEnded &&
          collectedGM.length >= providerTake
        )

      console.log(
        `[ArcadeNexa] GM all-games stream: ` +
        `startProvider=${Math.floor(arcadeOffset / GM_PAGE_SIZE) + 1}, ` +
        `startOffset=${arcadeOffset % GM_PAGE_SIZE}, ` +
        `pagesScanned=${providerPage - Math.floor(arcadeOffset / GM_PAGE_SIZE)}, ` +
        `games=${gmRaw.length}`
      )
    } else {
      /*
       * CATEGORY STREAM
       *
       * IMPORTANT:
       * GameMonetize ordering must remain stable between
       * ArcadeNexa page requests.
       *
       * The filtered category stream is therefore stored
       * in a persistent in-memory snapshot instead of being
       * rebuilt from provider page 1 for every request.
       */

      const requiredEnd =
        arcadeOffset +
        providerTake +
        1

      const snapshot =
        await getGMCategorySnapshot(
          normalizedGenre,
          requiredEnd
        )

      const categoryGames =
        snapshot.games

      gmCategoryStream =
        categoryGames

      gmCategorySeen =
        new Set(
          categoryGames
            .map(game => game.slug)
            .filter(Boolean)
        )

      const cachedSnapshot =
        gmCategorySnapshotCache.get(
          normalizedGenre
        )

      gmCategoryNextPage =
        cachedSnapshot?.nextPage || 1

      gmCategoryEnded =
        cachedSnapshot?.ended ?? false

      gmRaw =
        categoryGames.slice(
          arcadeOffset,
          arcadeOffset + providerTake
        )

      gmHasMore =
        categoryGames.length >
        arcadeOffset + providerTake

      console.log(
        `[ArcadeNexa] GM category stream: ` +
        `genre=${normalizedGenre}, ` +
        `snapshotGames=${categoryGames.length}, ` +
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
   * PROVIDER FAILOVER
   * ---------------------------------------------------------
   *
   * Normal mode:
   *
   *   GameMonetize = providerTake
   *   GamePix      = providerTake
   *
   * If one provider fails completely, the healthy provider
   * gets one opportunity to fill the missing capacity.
   *
   * IMPORTANT:
   * We do NOT refetch both providers.
   * Extra provider requests happen only after a real
   * provider failure.
   */

  let merged: Game[] = [
    ...gmRaw,
    ...gpRaw
  ]

  const gmAvailable = gmRaw.length > 0
  const gpAvailable = gpRaw.length > 0

  /*
   * GameMonetize failed:
   *
   * IMPORTANT:
   * GamePix must become the COMPLETE provider stream.
   *
   * The normal hybrid mode reserves only providerTake
   * GamePix games (24 for a 48-game ArcadeNexa page).
   *
   * During GM failover we must NOT reuse gpProviderPage/gpOffset,
   * because that would cause:
   *
   *   Page 1 -> GP page 1, games 0..47
   *   Page 2 -> GP page 1, games 24..47
   *
   * which creates 24 duplicates.
   *
   * Instead, GamePix gets its own full-page pagination:
   *
   *   Arcade page 1 -> GamePix page 1
   *   Arcade page 2 -> GamePix page 2
   *   Arcade page 3 -> GamePix page 3
   *
   * GM snapshot/fallback logic below remains untouched.
   */
  if (!gmAvailable && gpAvailable && gpRaw.length < safeSize) {
    try {
      const fallbackProviderPage = safePage

      const fallbackResult = await fetchGamesPage(
        fallbackProviderPage,
        GP_PAGE_SIZE,
        'quality',
        normalizedGenre
      )

      const fallbackGames =
        fallbackResult.items.map(convertGame)

      merged = fallbackGames.slice(
        0,
        safeSize
      )

      gpHasMore =
        fallbackResult.nextPage !== null ||
        fallbackGames.length >= GP_PAGE_SIZE

      console.log(
        `[ArcadeNexa] GamePix full failover: ` +
        `page=${safePage}, providerPage=${fallbackProviderPage}, ` +
        `games=${merged.length}, genre=${normalizedGenre || 'all'}`
      )
    } catch (error) {
      console.error(
        `[ArcadeNexa] GamePix failover unavailable:`,
        error
      )

      /*
       * Do not fall back to the partial hybrid GamePix window.
       *
       * In full failover mode, a provider page failure/end means
       * the requested ArcadeNexa page cannot be served as a
       * complete GamePix page. Returning the previously loaded
       * 24-game hybrid slice would create incorrect pagination.
       */
      merged = []
      gpHasMore = false
    }
  }

  /*
   * GamePix failed:
   *
   * GameMonetize becomes the complete source for the requested
   * ArcadeNexa page. Category streams reuse the filtered results
   * already collected above and only continue scanning when the
   * requested failover window requires additional games.
   */
  if (!gpAvailable && gmAvailable && gmRaw.length < safeSize) {
    try {
      /*
       * FULL GM FAILOVER MODE
       *
       * GamePix is unavailable, so GameMonetize becomes
       * the complete source for this ArcadeNexa page.
       *
       * Category requests reuse the persistent snapshot.
       * This guarantees:
       *
       * Page 1 -> 0..47
       * Page 2 -> 48..95
       * Page 3 -> 96..143
       *
       * without rebuilding the category stream from
       * GameMonetize page 1 on every request.
       */

      const fallbackOffset =
        (safePage - 1) * safeSize

      const requiredEnd =
        fallbackOffset +
        safeSize +
        1

      let fallbackGames: Game[]

      if (normalizedGenre) {
        const snapshot =
          await getGMCategorySnapshot(
            normalizedGenre,
            requiredEnd
          )

        fallbackGames =
          snapshot.games
      } else {
        /*
         * ALL-GAMES failover keeps the existing provider
         * pagination behavior.
         */
        fallbackGames = []

        const seenFallback =
          new Set<string>()

        let providerPage =
          Math.floor(
            fallbackOffset / GM_PAGE_SIZE
          ) + 1

        let providerOffset =
          fallbackOffset % GM_PAGE_SIZE

        let fallbackEnded = false

        while (
          !fallbackEnded &&
          fallbackGames.length <
            requiredEnd &&
          providerPage <= GM_PAGES
        ) {
          const result =
            await fetchGMGamesPage(
              providerPage,
              GM_PAGE_SIZE
            )

          const raw =
            result.items.map(convertGMGame)

          const startOffset =
            providerPage ===
            Math.floor(
              fallbackOffset /
              GM_PAGE_SIZE
            ) + 1
              ? providerOffset
              : 0

          for (
            const game of
            raw.slice(startOffset)
          ) {
            if (
              !game.slug ||
              seenFallback.has(game.slug)
            ) {
              continue
            }

            seenFallback.add(game.slug)
            fallbackGames.push(game)

            if (
              fallbackGames.length >=
              requiredEnd
            ) {
              break
            }
          }

          if (
            result.nextPage === null ||
            raw.length < GM_PAGE_SIZE
          ) {
            fallbackEnded = true
            break
          }

          providerPage =
            result.nextPage ||
            providerPage + 1

          providerOffset = 0
        }
      }

      merged =
        fallbackGames.slice(
          fallbackOffset,
          fallbackOffset + safeSize
        )

      gmHasMore =
        fallbackGames.length >
          fallbackOffset + safeSize ||
        (
          fallbackGames.length >=
            fallbackOffset + safeSize &&
          (
            normalizedGenre
              ? !(
                  gmCategorySnapshotCache
                    .get(normalizedGenre)
                    ?.ended
                )
              : true
          )
        )

      console.log(
        `[ArcadeNexa] GameMonetize full failover: ` +
        `page=${safePage}, ` +
        `genre=${normalizedGenre || 'all'}, ` +
        `offset=${fallbackOffset}, ` +
        `games=${merged.length}`
      )
      console.log(
        `[ArcadeNexa] GameMonetize full failover: ` +
        `page=${safePage}, ` +
        `genre=${normalizedGenre || 'all'}, ` +
        `offset=${fallbackOffset}, ` +
        `games=${merged.length}`
      )
    } catch (error) {
      console.error(
        `[ArcadeNexa] GameMonetize failover unavailable:`,
        error
      )
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
      matchesGenre(
        normalizedGenre,
        game.category,
        game.genreFilter
      )
    )
  }

  const games = merged.slice(0, safeSize)

  /*
   * ---------------------------------------------------------
   * HAS MORE
   * ---------------------------------------------------------
   */

  // Never advertise another page when this page is empty.
  // More importantly, only advertise hasMore when at least
  // one provider has confirmed an actual additional game.
  const hasMore =
    games.length > 0 &&
    (
      gpHasMore ||
      gmHasMore
    )

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



function cleanGMText(value: string | null | undefined): string {
  if (!value) return ''

  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}

export function convertGMGame(item: GameMonetizeItem): Game {
  const slug = `gm-${item.id}`
  const category = item.category?.toLowerCase() || 'arcade'
  const w = Number(item.width) || 800
  const h = Number(item.height) || 600

  const cleanDescription =
    cleanGMText(item.description) ||
    cleanGMText(item.instructions) ||
    'Play instantly in your browser.'

  const cleanInstructions =
    cleanGMText(item.instructions) ||
    'Use mouse or touch controls to play.'

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
      description: cleanDescription,
      instructions: cleanInstructions,
      tags: item.tags
        ? item.tags.split(',').map(t => t.trim())
        : [category, 'html5'],
      title: item.title || 'Untitled Game',
    }),
      platform: 'Multi',
      ...buildGameDescriptions({
        title: item.title || 'Untitled Game',
        description: cleanDescription,
        category,
        tags: item.tags
          ? item.tags.split(',').map(t => t.trim())
          : [category, 'html5'],
        instructions: cleanInstructions,
      }),
      instructions: cleanInstructions,
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

const GM_CATEGORY_CACHE_DURATION =
  6 * 60 * 60 * 1000

interface GMCategorySnapshot {
  games: Game[]
  nextPage: number
  ended: boolean
  expiresAt: number
}

const gmCategorySnapshotCache =
  new Map<string, GMCategorySnapshot>()

const gmCategorySnapshotInflight =
  new Map<string, Promise<Game[]>>()

async function getGMCategorySnapshot(
  genre: string,
  requiredCount: number
): Promise<{
  games: Game[]
  hasMore: boolean
}> {
  const key = normalizeGenre(genre)
  const now = Date.now()

  let snapshot =
    gmCategorySnapshotCache.get(key)

  /*
   * Expired snapshots are discarded so provider ordering
   * is refreshed periodically.
   */
  if (
    snapshot &&
    snapshot.expiresAt <= now
  ) {
    gmCategorySnapshotCache.delete(key)
    snapshot = undefined
  }

  /*
   * If another request is already extending this category,
   * wait for it instead of launching a duplicate scan.
   */
  const existingInflight =
    gmCategorySnapshotInflight.get(key)

  if (
    existingInflight &&
    (!snapshot ||
      snapshot.games.length < requiredCount)
  ) {
    await existingInflight
    snapshot =
      gmCategorySnapshotCache.get(key)
  }

  /*
   * Nothing more is required from the provider.
   */
  if (
    snapshot &&
    (
      snapshot.games.length >= requiredCount ||
      snapshot.ended
    )
  ) {
    return {
      games: snapshot.games,
      hasMore:
        snapshot.games.length > requiredCount - 1 ||
        !snapshot.ended,
    }
  }

  const inflight = (async () => {
    let current =
      gmCategorySnapshotCache.get(key)

    if (!current) {
      current = {
        games: [],
        nextPage: 1,
        ended: false,
        expiresAt:
          Date.now() +
          GM_CATEGORY_CACHE_DURATION,
      }
    }

    const seen = new Set(
      current.games
        .map(game => game.slug)
        .filter(Boolean)
    )

    while (
      !current.ended &&
      current.games.length < requiredCount &&
      current.nextPage <= GM_PAGES
    ) {
      const providerPage =
        current.nextPage

      const result =
        await fetchGMGamesPage(
          providerPage,
          GM_PAGE_SIZE
        )

      const raw =
        result.items.map(convertGMGame)

      for (const game of raw) {
        if (
          !game.slug ||
          seen.has(game.slug)
        ) {
          continue
        }

        if (
          !matchesGenre(
            key,
            game.category,
            game.genreFilter
          )
        ) {
          continue
        }

        seen.add(game.slug)
        current.games.push(game)
      }

      if (
        result.nextPage === null ||
        raw.length < GM_PAGE_SIZE
      ) {
        current.ended = true
        break
      }

      current.nextPage =
        result.nextPage ||
        providerPage + 1
    }

    current.expiresAt =
      Date.now() +
      GM_CATEGORY_CACHE_DURATION

    gmCategorySnapshotCache.set(
      key,
      current
    )

    console.log(
      `[ArcadeNexa] GM category snapshot: ` +
      `genre=${key}, ` +
      `games=${current.games.length}, ` +
      `nextPage=${current.nextPage}, ` +
      `ended=${current.ended}`
    )

    return current.games
  })()

  gmCategorySnapshotInflight.set(
    key,
    inflight
  )

  try {
    const games = await inflight

    return {
      games,
      hasMore:
        games.length >= requiredCount &&
        Boolean(
          gmCategorySnapshotCache
            .get(key)
            ?.ended === false
        ) ||
        games.length > requiredCount,
    }
  } finally {
    gmCategorySnapshotInflight.delete(key)
  }
}


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
export async function getGameBySlugFast(
  slug: string
): Promise<Game | null> {
  /*
   * FAST SLUG LOOKUP
   *
   * GameMonetize:
   *   1. Memory cache
   *   2. Existing catalog cache
   *   3. Direct ID lookup
   *   4. Full catalog fallback
   *
   * GamePix:
   *   1. Memory cache
   *   2. Existing catalog cache
   *   3. Limited sequential feed lookup
   *
   * IMPORTANT:
   * Never scan the entire GamePix catalog on every request.
   * Sitemap/pagination remain responsible for catalog discovery.
   */

  if (!slug) return null

  // ---------------------------------------------------------
  // SHARED GAMEPIX SLUG CACHE
  // ---------------------------------------------------------
  const gamePixSlugCache =
    (globalThis as typeof globalThis & {
      __arcadeNexaGamePixSlugCache?: Map<string, Game>
    }).__arcadeNexaGamePixSlugCache ||
    new Map<string, Game>()

  ;(
    globalThis as typeof globalThis & {
      __arcadeNexaGamePixSlugCache?: Map<string, Game>
    }
  ).__arcadeNexaGamePixSlugCache = gamePixSlugCache

  const gamePixCached = gamePixSlugCache.get(slug)

  if (gamePixCached) {
    console.log(
      `[ArcadeNexa] GamePix slug cache HIT: ${slug}`
    )

    return gamePixCached
  }

  // ---------------------------------------------------------
  // GAMEMONETIZE
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
     * GameMonetize may return HTTP 429 for direct ID requests.
     * A 429 must NEVER turn an existing game into a 404.
     */

    try {
      if (cachedGames && cachedGames.length > 0) {
        const catalogGame = cachedGames.find(
          game =>
            game.slug === slug &&
            game.provider === 'GameMonetize'
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
        `[ArcadeNexa] GM direct lookup RESULT: ` +
        `slug=${slug} id=${id} found=${Boolean(item)} ` +
        `title=${item?.title || 'NONE'}`
      )

      if (item) {
        const game = convertGMGame(item)

        // SECURITY / SEO: never accept a mismatched GameMonetize result.
        // The returned game must correspond exactly to the requested gm-* slug.
        if (game.slug !== slug) {
          console.warn(
            `[ArcadeNexa] GM direct lookup slug mismatch: requested=${slug} returned=${game.slug}`
          )
          return null
        }

        gmSlugCache.set(slug, game)

        return game
      }
    } catch (error) {
      console.warn(
        `[ArcadeNexa] GM direct lookup unavailable for ${slug}; ` +
        `using catalog fallback`,
        error
      )
    }

    try {
      const allGames = await loadGames()

      const catalogGame = allGames.find(
        game =>
          game.slug === slug &&
          game.provider === 'GameMonetize'
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
  // GAMEPIX
  // ---------------------------------------------------------
  try {
    const { fetchGamesPage } =
      await import('./gamepixFeed')

    /*
     * First check the existing catalog cache.
     *
     * This is important for games already discovered by:
     *   - home catalog
     *   - pagination
     *   - other server requests
     */
    if (cachedGames && cachedGames.length > 0) {
      const catalogGame = cachedGames.find(
        game => game.slug === slug
      )

      if (catalogGame) {
        gamePixSlugCache.set(slug, catalogGame)

        console.log(
          `[ArcadeNexa] GamePix catalog lookup HIT: ${slug}`
        )

        return catalogGame
      }
    }

    /*
     * Limited lookup:
     *
     * GamePix pages are ordered by quality.
     * Most games are therefore found near the beginning.
     *
     * We deliberately avoid scanning all 141 pages during
     * a normal page request.
     */
    const GAMEPIX_LOOKUP_MAX_PAGES = 12

    for (
      let page = 1;
      page <= GAMEPIX_LOOKUP_MAX_PAGES;
      page++
    ) {
      const result = await fetchGamesPage(
        page,
        96,
        'quality'
      )

      const item = result.items.find(
        (i: GamePixItem) =>
          (i.namespace || i.id) === slug
      )

      if (item) {
        const game = convertGame(item)

        gamePixSlugCache.set(slug, game)

        console.log(
          `[ArcadeNexa] GamePix feed lookup HIT: ` +
          `slug=${slug} page=${page}`
        )

        return game
      }

      if (!result.nextPage) {
        break
      }
    }

    console.warn(
      `[ArcadeNexa] GamePix limited lookup MISS: ${slug}`
    )
  } catch (error) {
    console.error(
      `[ArcadeNexa] GamePix slug lookup failed for ${slug}:`,
      error
    )
  }

  /*
   * Final existing catalog fallback.
   */
  if (cachedGames) {
    const catalogGame = cachedGames.find(
      game => game.slug === slug
    )

    if (catalogGame) {
      gamePixSlugCache.set(slug, catalogGame)
      return catalogGame
    }
  }

  return null
}

