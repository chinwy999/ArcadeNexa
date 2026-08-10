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
    sitemap: 'https://bespoke-daffodil-e35130.netlify.app/sitemap.xml',
    host: 'https://bespoke-daffodil-e35130.netlify.app',
  }
}
