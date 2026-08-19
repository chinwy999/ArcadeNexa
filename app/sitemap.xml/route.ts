import { NextResponse } from 'next/server'
import { getSiteUrl } from '@/lib/site'

const base = getSiteUrl()

const TOTAL_SITEMAPS = 143

export async function GET() {
  const urls = Array.from(
    { length: TOTAL_SITEMAPS },
    (_, i) => `
  <sitemap>
    <loc>${base}/sitemap/${i}.xml</loc>
  </sitemap>`
  ).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</sitemapindex>`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
