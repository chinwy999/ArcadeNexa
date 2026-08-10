import type { Metadata } from 'next'
import GamesClient from './GamesClient'

export const metadata: Metadata = {
  title: 'Games Arena',
  description: 'Browse and play ArcadeNexa trials for Valorant, CS2, LoL, Dota 2, Fortnite, Apex Legends, Rocket League, Overwatch 2. Filter by genre, platform, rating.',
  alternates: { canonical: '/games' },
  openGraph: {
    title: 'Games Arena | ArcadeNexa',
    description: 'Choose your battlefield — 8 esports titles with skill trials',
  }
}

export default function GamesPage() {
  return <GamesClient />
}
