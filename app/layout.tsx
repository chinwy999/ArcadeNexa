import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { games } from '@/lib/games'

const gameCount = games.length
const siteUrl = 'https://arcadenexa.netlify.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ArcadeNexa - Professional HTML5 Gaming Platform',
    template: '%s | ArcadeNexa',
  },
  description: `Professional HTML5 gaming platform with ${gameCount} real GamePix games. Instant play in same page, no download, no leaving site. Official thumbnails and descriptions.`,
  keywords: ['HTML5 games', 'GamePix', 'instant play', 'ArcadeNexa', 'online games', 'free games', 'browser games'],
  authors: [{ name: 'ArcadeNexa' }],
  creator: 'ArcadeNexa',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'ArcadeNexa - Professional HTML5 Gaming Platform',
    description: `${gameCount} real GamePix games - instant play in same page, official thumbnails, no download required.`,
    siteName: 'ArcadeNexa',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArcadeNexa - Professional HTML5 Gaming Platform',
    description: `${gameCount} real GamePix games - instant play`,
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
          "@context":"https://schema.org",
          "@type":"Organization",
          "name":"ArcadeNexa",
          "url":siteUrl,
          "logo":`${siteUrl}/logo.png`,
          "sameAs":["https://twitter.com/","https://youtube.com/","https://twitch.tv/"],
          "description":`Professional HTML5 gaming platform powered by GamePix - ${gameCount} real games`
        })}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context":"https://schema.org",
          "@type":"WebSite",
          "name":"ArcadeNexa",
          "url":siteUrl,
          "potentialAction":{
            "@type":"SearchAction",
            "target":`${siteUrl}/search?q={search_term_string}`,
            "query-input":"required name=search_term_string"
          }
        })}} />
      </body>
    </html>
  )
}
