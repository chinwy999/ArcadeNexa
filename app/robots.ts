import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/static/', '/private/'],
      },
    ],
    sitemap: 'https://arcade-nexa-3gxg.vercel.app/sitemap.xml',
    host: 'https://arcade-nexa-3gxg.vercel.app',
  }
}
