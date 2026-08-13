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
    iframeUrl: item.url,
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

    cachedGames = allItems.map(convertGame)
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
