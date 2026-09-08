import Link from 'next/link'
import GameCard from '@/components/GameCard'
import FeaturedGamesSlider from '@/components/FeaturedGamesSlider'
import CategorySlider from '@/components/CategorySlider'
import RecentlyPlayed from '@/components/RecentlyPlayed'
import { getHomeGames, type Game } from '@/lib/games'
import {
  ArrowRight,
  Gamepad2,
  Star,
  Clock,
  Sparkles,
  Flame,
} from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 300

export const metadata = {
  title: 'ArcadeNexa - Play 15,000+ Free HTML5 Games Online',
  description:
    'Play 15,000+ free HTML5 games online on ArcadeNexa. No download, no registration. Action, puzzle, racing, sports and more!',
  keywords:
    'free HTML5 games, online games, browser games, arcade games, free games',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ArcadeNexa - Free HTML5 Games Online',
    description:
      'Play 15,000+ free HTML5 games instantly in your browser. No download required.',
    url: '/',
    siteName: 'ArcadeNexa',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArcadeNexa - Free HTML5 Games',
    description:
      'Play 15,000+ free HTML5 games instantly. No download required.',
  },
}

const categories = [
  { name: 'Action', slug: 'action' },
  { name: 'Adventure', slug: 'adventure' },
  { name: 'Arcade', slug: 'arcade' },
  { name: 'Puzzle', slug: 'puzzle' },
  { name: 'Racing', slug: 'racing' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Shooter', slug: 'shooter' },
  { name: 'Strategy', slug: 'strategy' },
  { name: 'RPG', slug: 'rpg' },
  { name: 'Casual', slug: 'casual' },
]

export default async function HomePage() {
  let games: Game[] = []

  try {
    games = await getHomeGames()
  } catch (error) {
    console.error('[HomePage] Failed to load games:', error)
  }

  const playableGames = games.filter(
    (game) => game.playable && game.thumbnail && game.slug
  )

  const usedSlugs = new Set<string>()

  function takeUnique(source: Game[], count: number) {
    const result: Game[] = []

    for (const game of source) {
      if (usedSlugs.has(game.slug)) continue

      usedSlugs.add(game.slug)
      result.push(game)

      if (result.length === count) break
    }

    return result
  }

  const featuredGames = takeUnique(playableGames, 8)

  const popularSource = [...playableGames].sort(
    (a, b) => (b.rating || 0) - (a.rating || 0)
  )

  const popularGames = takeUnique(popularSource, 12)

  const moreGames = takeUnique(playableGames, 12)

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">

      {/* Hero */}
      <section className="relative mb-6 overflow-hidden rounded-2xl border border-[color:var(--white-10)] bg-gradient-to-br from-purple-600/15 via-blue-600/10 to-cyan-600/15 p-4 sm:p-6">
        <div className="absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-1/2 translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl animate-pulse-slower" />

        <div className="relative flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-nexa-violet/30 bg-nexa-violet/10 px-2.5 py-0.5 text-[10px] font-bold text-nexa-violet">
              <span aria-hidden="true">🎮</span>
              15,000+ FREE
            </div>

            <h1 className="text-xl font-black tracking-tight text-[color:var(--text-primary)] sm:text-2xl lg:text-3xl">
              Play Free{' '}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                HTML5 Games
              </span>
            </h1>

            <p className="mt-0.5 max-w-xl text-xs text-[color:var(--text-secondary)]">
              No downloads. No registration. Instant play.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-1.5">
            <Link
              href="/games"
              className="inline-flex items-center gap-1 rounded-xl bg-nexa-violet px-3 py-1.5 text-xs font-bold text-[color:var(--text-primary)] transition hover:brightness-110 hover:scale-105 active:scale-95"
            >
              <Gamepad2 size={14} />
              All Games
            </Link>

            <Link
              href="/categories"
              className="inline-flex items-center gap-1 rounded-xl border border-[color:var(--white-10)] px-3 py-1.5 text-xs font-bold text-[color:var(--text-secondary)] transition hover:bg-[color:var(--white-05)] hover:scale-105 active:scale-95"
            >
              Categories
            </Link>
          </div>
        </div>

        <div className="relative mt-2 flex flex-wrap gap-3 text-[10px]">
          <div className="flex items-center gap-1">
            <Gamepad2 size={12} className="text-nexa-violet" />
            <span className="text-[color:var(--text-secondary)]">
              15,000+ Games
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-500" />
            <span className="text-[color:var(--text-secondary)]">
              Top Rated
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Clock size={12} className="text-nexa-cyan" />
            <span className="text-[color:var(--text-secondary)]">
              Instant Play
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Sparkles size={12} className="text-purple-400" />
            <span className="text-[color:var(--text-secondary)]">
              100% Free
            </span>
          </div>
        </div>
      </section>

      {/* Category navigation */}
      <div className="mb-7 -mx-4 sm:-mx-6">
        <CategorySlider categories={categories} />
      </div>

      {/* Featured */}
      {featuredGames.length > 0 && (
        <section className="mb-8">
          <FeaturedGamesSlider games={featuredGames} />
        </section>
      )}

      {/* Recently Played */}
      <RecentlyPlayed />

      {/* Popular Games */}
      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
              <Flame size={15} className="text-orange-500" />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-nexa-violet">
                Top Rated
              </p>
              <h2 className="text-base font-black text-[color:var(--text-primary)] sm:text-lg">
                Popular Games
              </h2>
            </div>
          </div>

          <Link
            href="/games"
            className="inline-flex items-center gap-1 text-[10px] font-bold text-nexa-violet hover:underline"
          >
            View All
            <ArrowRight size={12} />
          </Link>
        </div>

        {popularGames.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {popularGames.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-[color:var(--white-10)] bg-[color:var(--white-03)] py-8 text-center">
            <p className="mb-1 text-2xl">🎮</p>
            <p className="text-xs text-[color:var(--text-secondary)]">
              Games are temporarily unavailable.
            </p>
          </div>
        )}
      </section>

      {/* More Games */}
      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-nexa-violet">
              Discover
            </p>
            <h2 className="text-base font-black text-[color:var(--text-primary)] sm:text-lg">
              More Games
            </h2>
          </div>

          <Link
            href="/games"
            className="inline-flex items-center gap-1 text-[10px] font-bold text-nexa-violet hover:underline"
          >
            View All
            <ArrowRight size={12} />
          </Link>
        </div>

        {moreGames.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {moreGames.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-[color:var(--white-10)] bg-[color:var(--white-03)] py-8 text-center">
            <p className="text-xs text-[color:var(--text-secondary)]">
              More games are temporarily unavailable.
            </p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="rounded-xl border border-[color:var(--white-10)] bg-gradient-to-br from-purple-600/10 to-blue-600/10 p-5 text-center">
        <h2 className="text-base font-black text-[color:var(--text-primary)] sm:text-lg">
          🎯 Discover Thousands More Games
        </h2>

        <p className="mx-auto mt-1 max-w-2xl text-[10px] text-[color:var(--text-secondary)] sm:text-xs">
          Browse 15,000+ free HTML5 games across all genres.
        </p>

        <Link
          href="/games"
          className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-nexa-violet px-4 py-2 text-xs font-bold text-[color:var(--text-primary)] transition hover:brightness-110 hover:scale-105 active:scale-95"
        >
          Explore All Games
          <ArrowRight size={14} />
        </Link>
      </section>
    </main>
  )
}
