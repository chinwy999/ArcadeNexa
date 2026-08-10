import type { Metadata } from 'next'
import SearchClient from './SearchClient'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search ArcadeNexa games, genres, and tournaments',
  alternates: { canonical: '/search' },
}

export default function SearchPage() {
  return <SearchClient />
}
