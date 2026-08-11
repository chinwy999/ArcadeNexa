const API_BASE = 'https://feeds.gamepix.com/v2/json'
const SITE_ID = 'DXXR1'
const ITEMS_PER_PAGE = 96
const MAX_PAGES = 3

export interface GamePixItem {
  id: string
  title: string
  namespace: string
  description: string
  category: string
  orientation: string
  quality_score: number
  width: number
  height: number
  date_modified: string
  date_published: string
  banner_image: string
  image: string
  url: string
}

export async function fetchPage(page: number): Promise<GamePixItem[]> {
  try {
    const url = `${API_BASE}?sid=${SITE_ID}&pagination=${ITEMS_PER_PAGE}&page=${page}&order=quality`
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    
    const response = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 3600 }
    })
    
    clearTimeout(timeout)
    
    if (!response.ok) {
      console.error(`HTTP ${response.status} on page ${page}`)
      return []
    }
    
    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.error(`Error page ${page}:`, error)
    return []
  }
}

export async function fetchAllGames(): Promise<GamePixItem[]> {
  const allGames: GamePixItem[] = []
  
  for (let page = 1; page <= MAX_PAGES; page++) {
    const games = await fetchPage(page)
    if (games.length === 0) break
    allGames.push(...games)
    console.log(`[fetch] Page ${page}: ${games.length} games (total: ${allGames.length})`)
  }
  
  return allGames
}
