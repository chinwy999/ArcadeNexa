import type { MetadataRoute } from 'next'
import { games } from '@/lib/games'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://arcade-nexa-3gxg.vercel.app'
  const now = new Date()

  const staticPages = [
    '',
    '/games',
    '/tournaments',
    '/leaderboard',
    '/news',
    '/login',
    '/register',
    '/faq',
    '/contact',
    '/privacy',
    '/terms',
    '/cookies',
    '/about',
    '/search',
    '/categories',
  ]

  const staticEntries: MetadataRoute.Sitemap = staticPages.map(p => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: p === '' ? 'daily' : 'weekly',
    priority: p === '' ? 1 : p === '/games' ? 0.9 : 0.7,
  }))

  const gameEntries: MetadataRoute.Sitemap = games.map(g => ({
    url: `${base}/games/${g.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  return [...staticEntries, ...gameEntries]
}
