import { fetchAllGames, GamePixItem } from './gamepixFeed'
import { convertAllGames, Game } from './gameConverter'

let cachedGames: Game[] | null = null
let lastFetchTime: number = 0
const CACHE_DURATION = 3600000 // 1 hour

export async function getAllGames(): Promise<Game[]> {
  const now = Date.now()
  
  if (cachedGames && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedGames
  }
  
  try {
    const gamePixItems = await fetchAllGames()
    cachedGames = convertAllGames(gamePixItems)
    lastFetchTime = now
    return cachedGames
  } catch (error) {
    console.error('Error fetching games:', error)
    return cachedGames || []
  }
}

export async function getGameBySlug(slug: string): Promise<Game | null> {
  const games = await getAllGames()
  return games.find(g => g.slug === slug) || null
}

export async function getGamesByCategory(category: string): Promise<Game[]> {
  const games = await getAllGames()
  return games.filter(g => g.category === category || g.genreFilter === category)
}

export async function searchGames(query: string): Promise<Game[]> {
  const games = await getAllGames()
  const lowerQuery = query.toLowerCase()
  return games.filter(g =>
    g.title.toLowerCase().includes(lowerQuery) ||
    g.description.toLowerCase().includes(lowerQuery) ||
    g.category.toLowerCase().includes(lowerQuery)
  )
}

export async function getFeaturedGames(limit: number = 8): Promise<Game[]> {
  const games = await getAllGames()
  return games.slice(0, limit)
}
