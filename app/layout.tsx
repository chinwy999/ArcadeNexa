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
  description: 'Play 15,000+ free HTML5 games instantly on ArcadeNexa. No download, no registration required. Action, Puzzle, Racing, Sports and more!',
  keywords: ['HTML5 games', 'free online games', 'browser games', 'instant play', 'ArcadeNexa', 'no download games'],
  authors: [{ name: 'ArcadeNexa' }],
  creator: 'ArcadeNexa',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'ArcadeNexa - Free HTML5 Games Online',
    description: 'Play 15,000+ free HTML5 games instantly. No download, no registration required.',
    siteName: 'ArcadeNexa',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArcadeNexa - Free HTML5 Games Online',
    description: 'Play 15,000+ free HTML5 games instantly. No download required.',
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
        <meta name="google-site-verification" content="j-iHu7oSEMHvRJt9EXUbTqBgAL71liygmOrO5HD72EU" />
        <meta name="44bee4f3953015f0fb0854150e90e01530b6ba26" content="44bee4f3953015f0fb0854150e90e01530b6ba26" />
      </head>
      <body className="min-h-screen bg-nexa-black text-[color:var(--text-primary)] antialiased">
        <Header />
        <main className="pt-16">
          {children}
        </main>
        <script async src="https://pl31045270.profitableratecpmnetwork.com/a1/dd/b8/a1ddb888e0b6ea30ae8110f682aa63d0.js"></script>
        <script async src="https://pl31045271.profitableratecpmnetwork.com/a7/fa/9c/a7fa9c78b482be0b1d03715f54273f58.js"></script>
        <div id="container-a65b979f47b71a91b2448c709b97e96e"></div>
        <script async data-cfasync="false" src="https://pl31053046.profitableratecpmnetwork.com/a65b979f47b71a91b2448c709b97e96e/invoke.js"></script>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "ArcadeNexa",
          "url": siteUrl,
          "description": "Free HTML5 gaming platform with 15,000+ instant play games"
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
