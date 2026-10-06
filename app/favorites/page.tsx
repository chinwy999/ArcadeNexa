import type { Metadata } from 'next'
import FavoritesClient from './FavoritesClient'

export const metadata: Metadata = {
  title: 'Favorite Games | Arcadlo',
  description:
    'View and manage your favorite games saved on Arcadlo.',
}

export default function FavoritesPage() {
  return <FavoritesClient />
}
