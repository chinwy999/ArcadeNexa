import { getGameBySlug, getGames } from '@/lib/games'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const game = await getGameBySlug(params.slug)

  if (!game) {
    return {
      title: 'Game Not Found',
      description: 'The game you are looking for does not exist.',
    }
  }

  return {
    title: `${game.title} - Play Free Online | ArcadeNexa`,
    description: game.description || `Play ${game.title} for free online on ArcadeNexa. No download required, instant play in your browser.`,
    keywords: [game.title, game.category, 'free online game', 'HTML5 game', 'browser game', 'ArcadeNexa'],
    openGraph: {
      title: `${game.title} - Play Free Online`,
      description: game.description || `Play ${game.title} for free on ArcadeNexa`,
      images: [{ url: game.thumbnail, width: 512, height: 384, alt: game.title }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${game.title} - Play Free Online`,
      description: game.description || `Play ${game.title} for free on ArcadeNexa`,
      images: [game.thumbnail],
    },
    alternates: {
      canonical: `/games/${game.slug}`,
    },
  }
}

export async function generateStaticParams() {
  return []
}

export default async function GamePage({ params }: { params: { slug: string } }) {
  const game = await getGameBySlug(params.slug)

  if (!game) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/games" className="text-neon-green hover:underline mb-4 inline-block">
          ← Back to Games
        </Link>
        <h1 className="text-4xl font-bold text-white mb-2">{game.title}</h1>
        <p className="text-gray-400 text-lg">{game.description}</p>
      </div>

      <div className="bg-elevated rounded-lg overflow-hidden mb-8">
        <div className="relative" style={{ aspectRatio: game.aspectRatio }}>
          <iframe
            src={game.iframeUrl}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen; gamepad"
            title={game.title}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4 text-white">About</h2>
          <p className="text-gray-400 mb-6">{game.longDescription}</p>
          <h3 className="text-xl font-bold mb-3 text-white">How to Play</h3>
          <p className="text-gray-400">{game.instructions}</p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4 text-white">Details</h3>
          <div className="bg-space-black/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Provider:</span>
              <span className="text-white font-medium">{game.provider}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Platform:</span>
              <span className="text-white font-medium">{game.platform}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Category:</span>
              <span className="text-white font-medium">{game.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Rating:</span>
              <span className="text-yellow-400 font-medium">★ {game.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
