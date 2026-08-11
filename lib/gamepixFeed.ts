import type { Game } from './games'
import { getAspectRatio } from './site'

const CATEGORY_MAP: Record<string, string> = {
  action: 'Action', shooting: 'Action', battle: 'Action', fight: 'Action', war: 'Action', zombie: 'Action', gun: 'Action',
  adventure: 'Adventure', exploration: 'Adventure', rpg: 'Adventure',
  arcade: 'Arcade', classic: 'Arcade', retro: 'Arcade', skill: 'Arcade', clicker: 'Arcade', casual: 'Arcade',
  cards: 'Cards', solitaire: 'Cards', poker: 'Cards', blackjack: 'Cards',
  puzzle: 'Puzzle', 'match-3': 'Puzzle', match3: 'Puzzle', brain: 'Puzzle', logic: 'Puzzle', '2048': 'Puzzle', sudoku: 'Puzzle', jigsaw: 'Puzzle', word: 'Puzzle', memory: 'Puzzle',
  racing: 'Racing', drift: 'Racing', car: 'Racing', bike: 'Racing', offroad: 'Racing',
  sports: 'Sports', soccer: 'Sports', football: 'Sports', basketball: 'Sports', tennis: 'Sports', golf: 'Sports',
  strategy: 'Strategy', 'tower-defense': 'Strategy', towerdefense: 'Strategy', defense: 'Strategy', chess: 'Strategy', board: 'Strategy',
  simulation: 'Simulation', simulator: 'Simulation', life: 'Simulation', idle: 'Simulation', cooking: 'Simulation', farming: 'Simulation',
  kids: 'Kids', 'kids-game': 'Kids', baby: 'Kids', educational: 'Kids', girl: 'Kids', 'dress-up': 'Kids',
}

function mapCategory(raw: string): string {
  if (!raw) return 'Other'
  return CATEGORY_MAP[raw.toLowerCase().trim()] || 'Other'
}

export function normalizeGamePixItem(item: any): Game {
  const width = Number(item.width) || 800
  const height = Number(item.height) || 600
  const slug = item.namespace || String(item.id).toLowerCase()
  const initials = String(item.title || '')
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w.charAt(0))
    .join('')
    .toUpperCase()

  return {
    id: String(item.id),
    slug,
    title: item.title,
    name: item.title,
    initials,
    gradient: 'from-purple-600 to-blue-600',
    genre: [mapCategory(item.category)],
    genreFilter: mapCategory(item.category),
    rating: Math.round((Number(item.quality_score) || 0) * 10),
    platform: item.orientation === 'portrait' ? 'PC' : 'Multi',
    description: item.description || '',
    longDescription: item.description || '',
    tags: [item.category, item.orientation].filter(Boolean),
    officialUrl: item.url,
    iframeUrl: item.url,
    thumbnail: item.image || item.banner_image || '',
    thumbnailLarge: item.banner_image || item.image || '',
    releaseYear: item.date_published ? new Date(item.date_published).getFullYear() : undefined,
    provider: 'gamepix',
    providerGameId: String(item.id),
    width,
    height,
    aspectRatio: getAspectRatio(width, height),
  }
}

export async function fetchGamePixGames(page = 1, limit = 24): Promise<{
  games: Game[]
  hasMore: boolean
  nextPage: number
}> {
  try {
    const res = await fetch(`/api/gamepix-proxy?page=${page}&pagination=${limit}`)
    if (!res.ok) throw new Error(`Feed failed: ${res.status}`)
    const data = await res.json()
    return {
      games: (data.items || []).map(normalizeGamePixItem),
      hasMore: !!data.next_url,
      nextPage: page + 1,
    }
  } catch (e) {
    console.error('fetchGamePixGames error:', e)
    return { games: [], hasMore: false, nextPage: page }
  }
}
