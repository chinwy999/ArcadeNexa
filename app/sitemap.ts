import type { MetadataRoute } from 'next'
import { getGames } from '@/lib/games'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://arcade-nexa-3gxg.vercel.app'
  const now = new Date()

  const staticPages = [
    { path: '', priority: 1.0, freq: 'daily' },
    { path: '/games', priority: 0.9, freq: 'daily' },
    { path: '/categories', priority: 0.8, freq: 'weekly' },
    { path: '/search', priority: 0.8, freq: 'weekly' },
    { path: '/news', priority: 0.7, freq: 'weekly' },
    { path: '/tournaments', priority: 0.7, freq: 'weekly' },
    { path: '/leaderboard', priority: 0.6, freq: 'weekly' },
    { path: '/about', priority: 0.6, freq: 'monthly' },
    { path: '/faq', priority: 0.6, freq: 'monthly' },
    { path: '/contact', priority: 0.5, freq: 'monthly' },
    { path: '/privacy', priority: 0.4, freq: 'monthly' },
    { path: '/terms', priority: 0.4, freq: 'monthly' },
    { path: '/cookies', priority: 0.4, freq: 'monthly' },
  ]

  const staticEntries: MetadataRoute.Sitemap = staticPages.map(p => ({
    url: `${base}${p.path}`,
    lastModified: now,
    changeFrequency: p.freq as any,
    priority: p.priority,
  }))

  const games = await getGames()
  const gameEntries: MetadataRoute.Sitemap = games.map(g => ({
    url: `${base}/games/${g.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as any,
    priority: 0.8,
  }))

  return [...staticEntries, ...gameEntries]
}
