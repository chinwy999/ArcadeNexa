import { getGameBySlug } from '@/lib/games'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import InstantPlaySection from './InstantPlaySection'

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

  if (!game) notFound()

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-secondary mb-6">
        <Link href="/" className="hover:text-white transition">Home</Link>
        <span>/</span>
        <Link href="/games" className="hover:text-white transition">Games</Link>
        <span>/</span>
        <Link href={`/games?genre=${game.category}`} className="hover:text-white transition capitalize">{game.category}</Link>
        <span>/</span>
        <span className="text-white truncate">{game.title}</span>
      </div>

      {/* Game Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-white mb-2">{game.title}</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="bg-neon-green/10 border border-neon-green/20 text-neon-green text-xs px-3 py-1 rounded-full font-bold">HTML5 • Free</span>
          <span className="bg-white/5 border border-white/10 text-text-secondary text-xs px-3 py-1 rounded-full capitalize">{game.category}</span>
          <span className="text-yellow-400 text-sm font-bold">★ {game.rating}/10</span>
        </div>
      </div>

      {/* Game Player */}
      <div className="mb-8">
        <InstantPlaySection game={game} />
      </div>

      {/* Game Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="glass rounded-2xl p-6 border border-white/5">
            <h2 className="text-xl font-bold text-white mb-3">About {game.title}</h2>
            <p className="text-gray-400 leading-relaxed">{game.longDescription}</p>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/5">
            <h3 className="text-xl font-bold text-white mb-3">How to Play</h3>
            <p className="text-gray-400">{game.instructions}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-2xl p-6 border border-white/5">
            <h3 className="text-xl font-bold text-white mb-4">Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Provider</span>
                <span className="text-white font-medium">{game.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Platform</span>
                <span className="text-white font-medium">{game.platform}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Category</span>
                <span className="text-white font-medium capitalize">{game.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Rating</span>
                <span className="text-yellow-400 font-medium">★ {game.rating}/10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Resolution</span>
                <span className="text-white font-medium">{game.width}×{game.height}</span>
              </div>
            </div>
          </div>

          <Link href={`/games?genre=${game.category}`}
            className="block glass rounded-2xl p-4 border border-white/5 hover:border-electric-violet/40 transition text-center">
            <p className="text-text-secondary text-sm">More <span className="capitalize text-electric-violet font-bold">{game.category}</span> games →</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
