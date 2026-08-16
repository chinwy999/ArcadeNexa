import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getSiteUrl } from '@/lib/site'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ArcadeNexa - Free HTML5 Games Online',
    template: '%s | ArcadeNexa',
  },
  description: 'Play 13,000+ free HTML5 games instantly on ArcadeNexa. No download, no registration required. Action, Puzzle, Racing, Sports and more!',
  keywords: ['HTML5 games', 'free online games', 'browser games', 'instant play', 'ArcadeNexa', 'no download games'],
  authors: [{ name: 'ArcadeNexa' }],
  creator: 'ArcadeNexa',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'ArcadeNexa - Free HTML5 Games Online',
    description: 'Play 13,000+ free HTML5 games instantly. No download, no registration required.',
    siteName: 'ArcadeNexa',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArcadeNexa - Free HTML5 Games Online',
    description: 'Play 13,000+ free HTML5 games instantly. No download required.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-space-black text-text-primary antialiased">
        <Header />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "ArcadeNexa",
          "url": siteUrl,
          "description": "Free HTML5 gaming platform with 13,000+ instant play games"
        })}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "ArcadeNexa",
          "url": siteUrl,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${siteUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        })}} />
      </body>
    </html>
  )
}
