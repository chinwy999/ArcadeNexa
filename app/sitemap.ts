import type { MetadataRoute } from 'next'
import { getGames } from '@/lib/games'
import { articles } from '@/lib/articles'
import { getSiteUrl } from '@/lib/site'

const base = getSiteUrl()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/games`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/categories`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/news`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/cookies`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
  ]

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${base}/news/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  let gameEntries: MetadataRoute.Sitemap = []

  try {
    const games = await getGames()

    gameEntries = games
      .filter((game) => game.slug && game.playable)
      .map((game) => ({
        url: `${base}/games/${game.slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
  } catch (error) {
    console.error('[Sitemap] Failed to load games:', error)
  }

  return [
    ...staticPages,
    ...articleEntries,
    ...gameEntries,
  ]
}
