import type { Metadata } from 'next'
import { getGames } from '@/lib/games'
import SearchClient from './SearchClient'

export const metadata: Metadata = {
  title: 'Search Games - ArcadeNexa',
  description: 'Search thousands of free HTML5 games on ArcadeNexa',
  alternates: { canonical: '/search' },
}

export const dynamic = 'force-dynamic'

export default async function SearchPage() {
  const games = await getGames()
  return <SearchClient allGames={games} />
}
