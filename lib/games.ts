import { fetchAllGames, GamePixItem } from './gamepixFeed'

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
  const words = title.split(' ').filter(w => w.length > 0)
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
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)
  const divisor = gcd(width, height)
  return `${width / divisor} / ${height / divisor}`
}

function convertGame(item: GamePixItem): Game {
  const rating = Math.round(item.quality_score * 10)
  
  return {
    id: `gamepix-${item.namespace}`,
    slug: item.namespace,
    title: item.title,
    name: item.title,
    initials: getInitials(item.title),
    gradient: getGradient(item.namespace),
    genre: [item.category, 'HTML5'],
    genreFilter: item.category,
    rating: rating > 5 ? rating : 7 + (item.namespace.length % 3),
    platform: 'Multi',
    description: item.description,
    longDescription: item.description,
    instructions: 'Use mouse or touch controls to play',
    tags: [item.category, 'html5', 'browser'],
    officialUrl: item.url,
    iframeUrl: item.url,
    thumbnail: item.banner_image,
    thumbnailLarge: item.banner_image,
    thumbnailSizes: { '512x384': item.banner_image },
    releaseYear: new Date(item.date_published).getFullYear(),
    provider: 'gamepix',
    providerGameId: item.id,
    width: item.width,
    height: item.height,
    aspectRatio: getAspectRatio(item.width, item.height),
    playable: true,
    category: item.category,
  }
}

export const games: Game[] = []

export async function getGames(): Promise<Game[]> {
  console.log('[getGames] Fetching from GamePix API...')
  const items = await fetchAllGames()
  console.log(`[getGames] Fetched ${items.length} games from API`)
  return items.map(convertGame)
}

export async function getGameBySlug(slug: string): Promise<Game | null> {
  const allGames = await getGames()
  return allGames.find(g => g.slug === slug) || null
}

export async function getAllGenreFilters(): Promise<string[]> {
  const allGames = await getGames()
  const categories = new Set<string>()
  
  allGames.forEach(game => {
    if (game.category) categories.add(game.category)
    if (game.genreFilter) categories.add(game.genreFilter)
  })
  
  return Array.from(categories).sort()
}

export async function getGameCount(): Promise<number> {
  const games = await getGames()
  return games.length
}
