export interface Game {
  id: string
  name: string
  genre: string[]
  genreFilter: string
  platform: string
  rating: number
  tags: string[]
  imageUrl: string
  gameUrl: string
}

export const games: Game[] = []

export function getAllGenreFilters(): string[] {
  return ['All']
}
