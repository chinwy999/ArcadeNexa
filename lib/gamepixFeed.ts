const API_BASE = 'https://feeds.gamepix.com/v2/json'
const SITE_ID = 'DXXR1'
const ITEMS_PER_PAGE = 96

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
    const url = `${API_BASE}?sid=${SITE_ID}&pagination=${ITEMS_PER_PAGE}&page=${page}`
    console.log(`Fetching: ${url}`)
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.error(`Error fetching page ${page}:`, error)
    return []
  }
}

export async function fetchAllGames(): Promise<GamePixItem[]> {
  const allGames: GamePixItem[] = []
  let page = 1
  
  while (page <= 20) {
    const games = await fetchPage(page)
    if (games.length === 0) break
    allGames.push(...games)
    console.log(`Fetched ${games.length} games from page ${page} (total: ${allGames.length})`)
    page++
  }
  
  return allGames
}
