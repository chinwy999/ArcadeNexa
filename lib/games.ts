import { buildGamePixUrl, getAspectRatio, aspectRatioMap } from './site'

export type GameProvider = 'gamepix' | 'manual'

export interface Game {
  id: string
  slug: string
  title: string
  name: string
  initials: string
  gradient: string
  genre: string[]
  genreFilter: string
  rating?: number
  platform: 'PC' | 'Multi'
  description: string
  longDescription: string
  instructions?: string
  tags: string[]
  officialUrl?: string
  iframeUrl: string
  thumbnail: string
  thumbnailLarge?: string
  thumbnailSizes?: { '512x384': string }
  releaseYear?: number
  provider: GameProvider
  providerGameId: string
  width: number
  height: number
  aspectRatio: string
  qualityScore?: number
  datePublished?: string
  source?: 'feed' | 'manual'
}

const CATEGORY_MAP: Record<string, string> = {
  action: 'Action', shooting: 'Action', battle: 'Action', fight: 'Action', war: 'Action',
  adventure: 'Adventure', exploration: 'Adventure', rpg: 'Adventure',
  arcade: 'Arcade', classic: 'Arcade', retro: 'Arcade', skill: 'Arcade', casual: 'Arcade',
  cards: 'Cards', solitaire: 'Cards', poker: 'Cards',
  puzzle: 'Puzzle', 'match-3': 'Puzzle', match3: 'Puzzle', brain: 'Puzzle', logic: 'Puzzle', '2048': 'Puzzle',
  racing: 'Racing', drift: 'Racing', car: 'Racing',
  sports: 'Sports', soccer: 'Sports', football: 'Sports', basketball: 'Sports',
  strategy: 'Strategy', 'tower-defense': 'Strategy', defense: 'Strategy',
  simulation: 'Simulation', simulator: 'Simulation', idle: 'Simulation',
  kids: 'Kids', educational: 'Kids',
}

function mapCategory(raw: string): string {
  if (!raw) return 'Other'
  return CATEGORY_MAP[raw.toLowerCase().trim()] || 'Other'
}

export function getAllGenreFilters(): string[] {
  return ['All', 'Action', 'Adventure', 'Arcade', 'Cards', 'Puzzle', 'Racing', 'Sports', 'Strategy', 'Simulation', 'Kids', 'Other']
}

export function getAllPlatformFilters(): string[] {
  return ['All', 'PC', 'Multi']
}

export function getAllRatingFilters(): string[] {
  return ['All', '5', '4', '3']
}

// Normalize GamePix feed item
function normalizeGamePixItem(item: any): Game {
  const slug = item.namespace || item.id.toLowerCase()
  const initials = item.title.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase()
  
  return {
    id: item.id,
    slug,
    title: item.title,
    name: item.title,
    initials,
    gradient: 'from-purple-500 to-blue-500',
    genre: [mapCategory(item.category)],
    genreFilter: mapCategory(item.category),
    rating: Number((item.quality_score * 10).toFixed(1)),
    platform: item.orientation === 'portrait' ? 'PC' : 'Multi',
    description: item.description || '',
    longDescription: item.description || '',
    tags: [item.category, item.orientation].filter(Boolean),
    iframeUrl: item.url,
    thumbnail: item.image || item.banner_image || '',
    thumbnailLarge: item.banner_image || item.image || '',
    thumbnailSizes: { '512x384': item.banner_image || item.image || '' },
    releaseYear: item.date_published ? new Date(item.date_published).getFullYear() : undefined,
    provider: 'gamepix',
    providerGameId: item.id,
    width: Number(item.width) || 800,
    height: Number(item.height) || 600,
    aspectRatio: getAspectRatio(Number(item.width) || 800, Number(item.height) || 600),
    qualityScore: Number(item.quality_score) || 0,
    datePublished: item.date_published || '',
    source: 'feed',
  }
}

// Static games (your existing 92 games)
export const manualGames: Game[] = [
  // Your existing manual games will be here
  // The array will be merged with feed games
]

// Fetch games from GamePix API
export async function fetchGamePixGames(page = 1, limit = 24): Promise<{
  games: Game[]
  hasMore: boolean
  nextPage: number
}> {
  try {
    const response = await fetch(`/api/gamepix-proxy?page=${page}&pagination=${limit}`)
    if (!response.ok) throw new Error('Failed to fetch games')
    
    const data = await response.json()
    const normalized = data.items.map(normalizeGamePixItem)
    
    return {
      games: normalized,
      hasMore: !!data.next_url,
      nextPage: page + 1,
    }
  } catch (error) {
    console.error('Error fetching GamePix games:', error)
    return { games: [], hasMore: false, nextPage: page }
  }
}

// Combined games (manual + feed)
export const games: Game[] = [...manualGames]

// Helper functions
export function getGamesByGenre(genre: string): Game[] {
  if (genre === 'All') return games
  return games.filter(g => g.genreFilter === genre)
}

export function getGamesByPlatform(platform: string): Game[] {
  if (platform === 'All') return games
  return games.filter(g => g.platform === platform)
}

export function searchGames(query: string): Game[] {
  if (!query) return games
  const q = query.toLowerCase()
  return games.filter(g => 
    g.name.toLowerCase().includes(q) ||
    g.description.toLowerCase().includes(q) ||
    g.genre.some(genre => genre.toLowerCase().includes(q)) ||
    g.tags.some(tag => tag.toLowerCase().includes(q))
  )
}

export function getTopRatedGames(count = 24): Game[] {
  return [...games]
    .filter(g => g.rating !== undefined)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, count)
}

export function getNewestGames(count = 24): Game[] {
  return [...games]
    .filter(g => g.datePublished)
    .sort((a, b) => new Date(b.datePublished!).getTime() - new Date(a.datePublished!).getTime())
    .slice(0, count)
}

export function getPopularGames(count = 24): Game[] {
  const now = Date.now()
  return games
    .filter(g => g.qualityScore !== undefined && g.datePublished)
    .map(g => {
      const ageDays = Math.max(1, (now - new Date(g.datePublished!).getTime()) / 86400000)
      const recency = 1 / Math.log10(ageDays + 1)
      return { g, score: (g.qualityScore || 0) * 0.7 + recency * 0.3 }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(x => x.g)
}
