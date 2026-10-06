import type { Metadata } from 'next'
import SearchClient from './SearchClient'

export const metadata: Metadata = {
  title: 'Search Games - Arcadlo',
  description: 'Search thousands of free HTML5 games on Arcadlo',
  alternates: { canonical: '/search' },
}

export const dynamic = 'force-dynamic'

export default function SearchPage() {
  return <SearchClient />
}
