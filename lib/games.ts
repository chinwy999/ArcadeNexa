import {
  fetchGamesPage,
  type GamePixItem,
} from './gamepixFeed'

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
  const words = title.split(/\s+/).filter(Boolean)

  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }

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
  const safeWidth = width > 0 ? width : 800
  const safeHeight = height > 0 ? height : 600

  const gcd = (a: number, b: number): number =>
    b === 0 ? a : gcd(b, a % b)

  const divisor = gcd(safeWidth, safeHeight)

  return `${safeWidth / divisor} / ${safeHeight / divisor}`
}

export function convertGame(item: GamePixItem): Game {
  const quality = Number(item.quality_score) || 0

  // GamePix quality_score is normally 0..1.
  // Convert it to a 1..5 display rating.
  const rating = Math.max(
    1,
    Math.min(5, Math.round(quality * 5))
  )

  const category = item.category || 'Casual'
  const title = item.title || 'Untitled Game'
  const slug = item.namespace || item.id

  const releaseDate = new Date(item.date_published)
  const releaseYear = Number.isNaN(releaseDate.getTime())
    ? new Date().getFullYear()
    : releaseDate.getFullYear()

  return {
    id: `gamepix-${item.id || slug}`,
    slug,
    title,
    name: title,
    initials: getInitials(title),
    gradient: getGradient(slug),

    genre: [category, 'HTML5'],
    genreFilter: category,

    rating,
    platform: 'Multi',

    description: item.description || `Play ${title} online for free.`,
    longDescription:
      item.description || `Play ${title} online for free on ArcadeNexa.`,

    instructions: 'Use mouse, keyboard, or touch controls to play.',

    tags: [
      category,
      'html5',
      'browser',
      'free',
      'instant-play',
    ],

    officialUrl: item.url,
    iframeUrl: item.url,

    thumbnail: item.banner_image,
    thumbnailLarge: item.banner_image,

    thumbnailSizes: {
      '320w': item.banner_image,
      '512w': item.banner_image,
    },

    releaseYear,

    provider: 'GamePix',
    providerGameId: item.id,

    width: item.width || 800,
    height: item.height || 600,

    aspectRatio: getAspectRatio(
      item.width || 800,
      item.height || 600
    ),

    playable: Boolean(item.url),
    category,
  }
}

const CACHE_DURATION = 60 * 60 * 1000

let cachedGames: Game[] | null = null
let cacheTimestamp = 0

async function loadGames(): Promise<Game[]> {
  const now = Date.now()

  if (
    cachedGames &&
    now - cacheTimestamp < CACHE_DURATION
  ) {
    return cachedGames
  }

  console.log('[ArcadeNexa] Loading GamePix catalog...')

  const result = await fetchGamesPage(1, 96, 'quality')

  const unique = new Map<string, Game>()

  for (const item of result.items) {
    const game = convertGame(item)

    if (!unique.has(game.slug)) {
      unique.set(game.slug, game)
    }
  }

  cachedGames = Array.from(unique.values())
  cacheTimestamp = now

  console.log(
    `[ArcadeNexa] Loaded ${cachedGames.length} GamePix games`
  )

  return cachedGames
}

export async function getGames(): Promise<Game[]> {
  return loadGames()
}

export async function getGamesPage(
  page = 1,
  pagination = 48
): Promise<{
  games: Game[]
  page: number
  totalPages: number | null
}> {
  const result = await fetchGamesPage(
    page,
    pagination,
    'quality'
  )

  const unique = new Map<string, Game>()

  for (const item of result.items) {
    const game = convertGame(item)

    if (!unique.has(game.slug)) {
      unique.set(game.slug, game)
    }
  }

  return {
    games: Array.from(unique.values()),
    page: result.page,
    totalPages: result.totalPages,
  }
}

export async function getGameBySlug(
  slug: string
): Promise<Game | null> {
  const games = await getGames()

  return (
    games.find(
      game => game.slug.toLowerCase() === slug.toLowerCase()
    ) || null
  )
}

export async function getAllGenreFilters(): Promise<string[]> {
  const allGames = await getGames()

  const categories = new Set<string>()

  for (const game of allGames) {
    if (game.category) {
      categories.add(game.category)
    }

    if (game.genreFilter) {
      categories.add(game.genreFilter)
    }
  }

  return Array.from(categories).sort()
}

export async function getGameCount(): Promise<number> {
  const games = await getGames()
  return games.length
}

/*
 * Kept only for backward compatibility.
 * Do not use this as the actual catalog source.
 */
export const games: Game[] = []
