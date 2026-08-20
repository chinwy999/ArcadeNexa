import { NextResponse } from 'next/server'
import { allArticles as articles } from '@/lib/articles'
import { getSiteUrl } from '@/lib/site'
import { fetchGamesPage } from '@/lib/gamepixFeed'
import { fetchGMGamesPage } from '@/lib/gameMonetizeFeed'

const base = getSiteUrl()

const GAMEPIX_PAGES = 141
const GAMEMONETIZE_PAGES = 9
const GAMEMONETIZE_SITEMAP_ID = GAMEPIX_PAGES + 1

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function buildUrlset(
  entries: Array<{
    url: string
    lastModified?: Date
    changeFrequency?: string
    priority?: number
  }>
) {
  const body = entries.map((entry) => `
  <url>
    <loc>${escapeXml(entry.url)}</loc>${entry.lastModified ? `
    <lastmod>${entry.lastModified.toISOString()}</lastmod>` : ''}${entry.changeFrequency ? `
    <changefreq>${entry.changeFrequency}</changefreq>` : ''}${entry.priority !== undefined ? `
    <priority>${entry.priority}</priority>` : ''}
  </url>`).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`
}

function response(xml: string) {
  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400',
    },
  })
}

export async function GET(
  _request: Request,
  { params }: { params: { parts: string[] } }
) {
  const raw = params.parts?.[0] || ''

  if (!raw.endsWith('.xml')) {
    return new NextResponse('Not Found', { status: 404 })
  }

  const id = Number(raw.slice(0, -4))

  if (
    !Number.isInteger(id) ||
    id < 0 ||
    id > GAMEMONETIZE_SITEMAP_ID
  ) {
    return new NextResponse('Not Found', { status: 404 })
  }

  const now = new Date()

  /*
   * Sitemap 0:
   * Static pages + news.
   */
  if (id === 0) {
    const staticPages = [
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
      {
        url: `${base}/unblocked-games`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${base}/two-player-games`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${base}/chromebook-games`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${base}/games-for-girls`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.9,
      },
    ]

    const articleEntries = articles.map((article) => ({
      url: `${base}/news/${article.slug}`,
      lastModified: new Date(article.date),
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

    return response(
      buildUrlset([...staticPages, ...articleEntries])
    )
  }

  /*
   * GamePix: 1..141
   */
  if (id >= 1 && id <= GAMEPIX_PAGES) {
    try {
      const result = await fetchGamesPage(
        id,
        96,
        'quality'
      )

      const entries = result.items.flatMap((game) => {
        const slug = game.namespace || game.id

        if (!slug) return []

        return [{
          url: `${base}/games/${slug}`,
          lastModified: game.date_modified
            ? new Date(game.date_modified)
            : game.date_published
              ? new Date(game.date_published)
              : now,
          changeFrequency: 'weekly',
          priority: 0.8,
        }]
      })

      return response(buildUrlset(entries))
    } catch (error) {
      console.error(
        `[ArcadeNexa] GamePix sitemap ${id} failed:`,
        error
      )

      return response(buildUrlset([]))
    }
  }

  /*
   * GameMonetize: 142
   */
  if (id === GAMEMONETIZE_SITEMAP_ID) {
    const entries: Array<{
      url: string
      lastModified: Date
      changeFrequency: string
      priority: number
    }> = []

    for (let page = 1; page <= GAMEMONETIZE_PAGES; page++) {
      try {
        const result = await fetchGMGamesPage(page, 200)

        for (const game of result.items) {
          if (!game.id) continue

          entries.push({
            url: `${base}/games/gm-${game.id}`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
          })
        }

        if (page < GAMEMONETIZE_PAGES) {
          await new Promise((resolve) =>
            setTimeout(resolve, 1500)
          )
        }
      } catch (error) {
        console.error(
          `[ArcadeNexa] GameMonetize sitemap page ${page} failed:`,
          error
        )
      }
    }

    console.log(
      `[ArcadeNexa] GameMonetize sitemap ready: ${entries.length} URLs`
    )

    return response(buildUrlset(entries))
  }

  return new NextResponse('Not Found', { status: 404 })
}
