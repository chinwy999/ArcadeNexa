import type { Metadata } from 'next'
import FavoritesClient from './FavoritesClient'

export const metadata: Metadata = {
  title: 'Favorite Games | ArcadeNexa',
  description:
    'View and manage your favorite games saved on ArcadeNexa.',
}

export default function FavoritesPage() {
  return <FavoritesClient />
}
