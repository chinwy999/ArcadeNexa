import { NextResponse } from 'next/server'
import { getSiteUrl } from '@/lib/site'

const base = getSiteUrl()
const TOTAL = 143

export async function GET() {
  const urls = Array.from({ length: TOTAL }, (_, i) => `  <sitemap><loc>${base}/sitemap/${i}.xml</loc></sitemap>`).join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</sitemapindex>`
  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } })
}
