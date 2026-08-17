import type { MetadataRoute } from 'next'
import { articles } from '@/lib/articles'
import { getSiteUrl } from '@/lib/site'
import { fetchGamesPage } from '@/lib/gamepixFeed'
import { fetchGMGamesPage } from '@/lib/gameMonetizeFeed'

const base = getSiteUrl()

const GAMEPIX_PAGES = 141
const GAMEMONETIZE_PAGES = 9

// One sitemap contains all GameMonetize pages.
// This avoids concurrent requests that trigger HTTP 429.
const GAMEMONETIZE_SITEMAP_ID = GAMEPIX_PAGES + 1

const STATIC_SITEMAP_ID = 0

export async function generateSitemaps() {
  const ids = [
    { id: STATIC_SITEMAP_ID },

    ...Array.from(
      { length: GAMEPIX_PAGES },
      (_, index) => ({
        id: index + 1,
      })
    ),

    {
      id: GAMEMONETIZE_SITEMAP_ID,
    },
  ]

  return ids
}

export default async function sitemap({
  id,
}: {
  id: number
}): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  /*
   * Sitemap 0:
   * Static pages + news articles
   */
  if (id === STATIC_SITEMAP_ID) {
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: `${base}/`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${base}/games`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${base}/categories`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${base}/news`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${base}/about`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${base}/faq`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${base}/contact`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.4,
      },
      {
        url: `${base}/privacy`,
        lastModified: now,
        changeFrequency: 'yearly',
        priority: 0.3,
      },
      {
        url: `${base}/terms`,
        lastModified: now,
        changeFrequency: 'yearly',
        priority: 0.3,
      },
    ]

    const articleEntries: MetadataRoute.Sitemap =
      articles.map((article) => ({
        url: `${base}/news/${article.slug}`,
        lastModified: new Date(article.date),
        changeFrequency: 'monthly',
        priority: 0.6,
      }))

    return [...staticPages, ...articleEntries]
  }

  /*
   * GamePix sitemaps
   *
   * id 1..141
   * maps directly to GamePix page 1..141
   */
  if (id >= 1 && id <= GAMEPIX_PAGES) {
    const gamePixPage = id

    try {
      const result = await fetchGamesPage(
        gamePixPage,
        96,
        'quality'
      )

      return result.items.flatMap((game) => {
        const slug = game.namespace || game.id

        if (!slug) {
          return []
        }

        return [{
          url: `${base}/games/${slug}`,
          lastModified: game.date_modified
            ? new Date(game.date_modified)
            : game.date_published
              ? new Date(game.date_published)
              : now,
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }]
      })
    } catch (error) {
      console.error(
        `[ArcadeNexa] GamePix sitemap ${gamePixPage} failed:`,
        error
      )

      return []
    }
  }

  /*
   * GameMonetize sitemap
   *
   * One sitemap contains all 9 GameMonetize feed pages.
   *
   * Pages are requested sequentially instead of concurrently.
   * This prevents GameMonetize HTTP 429 rate limits during build.
   */
  if (id === GAMEMONETIZE_SITEMAP_ID) {
    const entries: MetadataRoute.Sitemap = []

    for (
      let gameMonetizePage = 1;
      gameMonetizePage <= GAMEMONETIZE_PAGES;
      gameMonetizePage++
    ) {
      try {
        const result = await fetchGMGamesPage(
          gameMonetizePage,
          200
        )

        for (const game of result.items) {
          if (!game.id) continue

          entries.push({
            url: `${base}/games/gm-${game.id}`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
          })
        }

        /*
         * Small delay between GameMonetize requests.
         * This reduces the chance of provider rate limiting.
         */
        if (gameMonetizePage < GAMEMONETIZE_PAGES) {
          await new Promise(resolve => setTimeout(resolve, 1500))
        }
      } catch (error) {
        console.error(
          `[ArcadeNexa] GameMonetize sitemap page ${gameMonetizePage} failed:`,
          error
        )
      }
    }

    console.log(
      `[ArcadeNexa] GameMonetize sitemap ready: ${entries.length} URLs`
    )

    return entries
  }

  return []
}
