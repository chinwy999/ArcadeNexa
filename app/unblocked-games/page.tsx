import type { Metadata } from 'next'
import Link from 'next/link'
import { getGamesPage, type Game } from '@/lib/games'
import { getSiteUrl } from '@/lib/site'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Unblocked Games – Play Free Online Games | ArcadeNexa',
  description:
    'Play free HTML5 unblocked games instantly on ArcadeNexa. No download, no login required. Action, puzzle, racing, sports, arcade and more.',
  keywords:
    'unblocked games, unblocked games for school, free unblocked games, HTML5 games, browser games',
  alternates: {
    canonical: '/unblocked-games',
  },
  openGraph: {
    title: 'Unblocked Games – Play Free Online | ArcadeNexa',
    description:
      'Play free unblocked HTML5 games instantly. No download and no login required.',
    url: `${getSiteUrl()}/unblocked-games`,
    type: 'website',
  },
}

const UNBLOCKED_CATEGORIES = [
  { key: 'action', label: 'Action', icon: '⚔️' },
  { key: 'puzzle', label: 'Puzzle', icon: '🧩' },
  { key: 'racing', label: 'Racing', icon: '🏎️' },
  { key: 'sports', label: 'Sports', icon: '⚽' },
  { key: 'arcade', label: 'Arcade', icon: '🕹️' },
  { key: 'casual', label: 'Casual', icon: '🎯' },
  { key: 'io', label: '.IO Games', icon: '🌐' },
  { key: 'strategy', label: 'Strategy', icon: '♟️' },
]

export default async function UnblockedGamesPage() {
  let games: Game[] = []

  try {
    const result = await getGamesPage(1, 48, '')
    games = result.games
  } catch (error) {
    console.error('[Unblocked Games] failed:', error)
  }

  const featured = games.slice(0, 12)

  const byCategory: Record<string, typeof games> = {}

  for (const cat of UNBLOCKED_CATEGORIES) {
    byCategory[cat.key] = games
      .filter(
        game =>
          game.category?.toLowerCase() === cat.key ||
          game.genreFilter?.toLowerCase() === cat.key ||
          game.genre?.some(g => g.toLowerCase() === cat.key)
      )
      .slice(0, 8)
  }

  return (
    <main className="min-h-screen bg-nexa-black text-nexa-text-primary">

      <section className="relative overflow-hidden bg-gradient-to-b from-nexa-navy to-nexa-black px-4 py-16 text-center">
        <div className="relative mx-auto max-w-3xl">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-nexa-emerald/30 bg-nexa-emerald/10 px-4 py-1.5 text-sm text-nexa-emerald">
            <span className="h-2 w-2 animate-pulse rounded-full bg-nexa-emerald" />
            Free HTML5 Games • Instant Play
          </div>

          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Unblocked Games{' '}
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Online
            </span>
          </h1>

          <p className="mx-auto mb-6 max-w-2xl text-lg text-nexa-text-secondary">
            Play free HTML5 games instantly in your browser. No download,
            no Flash and no registration required.
          </p>

          <div className="mb-8 flex flex-wrap justify-center gap-2 text-sm">
            {[
              'Free Games',
              'HTML5 Games',
              'No Download',
              'Mobile Friendly',
              'Instant Play',
            ].map(tag => (
              <span
                key={tag}
                className="rounded-full border border-nexa-violet/25 bg-nexa-surface/60 px-3 py-1 text-nexa-text-secondary"
              >
                {tag}
              </span>
            ))}
          </div>

          <Link
            href="/games"
            className="inline-block rounded-xl bg-nexa-emerald px-8 py-3 font-bold text-nexa-black transition hover:bg-nexa-emerald"
          >
            Play Games →
          </Link>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10">

          <h2 className="mb-6 text-2xl font-bold">
            🔥 Featured Unblocked Games
          </h2>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {featured.map(game => (
              <Link
                key={game.id}
                href={`/games/${game.slug}`}
                className="group rounded-xl border border-nexa-violet/20 bg-nexa-black/60 p-2 transition hover:border-nexa-emerald/50 hover:bg-nexa-surface"
              >
                <div className="mb-2 aspect-square overflow-hidden rounded-lg bg-nexa-surface">

                  {game.thumbnail ? (
                    <img
                      src={game.thumbnail}
                      alt={game.title}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className={`flex h-full w-full items-center justify-center text-lg font-bold ${game.gradient}`}
                    >
                      {game.initials}
                    </div>
                  )}

                </div>

                <p className="truncate text-xs font-medium text-nexa-text-secondary">
                  {game.title}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-8">

        <h2 className="mb-8 text-2xl font-bold">
          🎮 Unblocked Games by Category
        </h2>

        {UNBLOCKED_CATEGORIES.map(cat => {
          const catGames = byCategory[cat.key] ?? []

          if (catGames.length === 0) return null

          return (
            <div key={cat.key} className="mb-12">

              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-xl font-bold">
                  <span>{cat.icon}</span>
                  <span>{cat.label} Games</span>
                </h3>

                <Link
                  href={`/games?genre=${cat.key}`}
                  className="text-sm text-nexa-emerald hover:text-nexa-emerald"
                >
                  View all →
                </Link>
              </div>

              <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
                {catGames.map(game => (
                  <Link
                    key={game.id}
                    href={`/games/${game.slug}`}
                    className="group rounded-xl border border-nexa-violet/20 bg-nexa-black/60 p-2 transition hover:border-nexa-emerald/50 hover:bg-nexa-surface"
                  >
                    <div className="mb-2 aspect-square overflow-hidden rounded-lg bg-nexa-surface">

                      {game.thumbnail ? (
                        <img
                          src={game.thumbnail}
                          alt={game.title}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className={`flex h-full w-full items-center justify-center text-sm font-bold ${game.gradient}`}
                        >
                          {game.initials}
                        </div>
                      )}

                    </div>

                    <p className="truncate text-xs text-nexa-text-secondary">
                      {game.title}
                    </p>
                  </Link>
                ))}
              </div>

            </div>
          )
        })}
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12">

        <div className="rounded-2xl border border-nexa-violet/20 bg-nexa-black/40 p-8">

          <h2 className="mb-4 text-2xl font-bold">
            What Are Unblocked Games?
          </h2>

          <div className="space-y-4 leading-relaxed text-nexa-text-secondary">

            <p>
              Unblocked games are browser games that can be played without
              installing additional software or browser plugins. Modern HTML5
              games run directly in supported web browsers on computers,
              tablets and phones.
            </p>

            <p>
              ArcadeNexa provides free browser games across multiple
              categories including action, puzzle, racing, sports, arcade,
              casual and strategy games.
            </p>

            <p>
              Games can be opened directly from your browser without a
              download or account.
            </p>

          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16">

        <h2 className="mb-6 text-2xl font-bold">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">

          {[
            {
              q: 'Are the games free?',
              a: 'Yes. ArcadeNexa provides free browser games that can be played without downloading the game files.',
            },
            {
              q: 'Do I need an account?',
              a: 'No account is required to start playing the available games.',
            },
            {
              q: 'Do the games work on mobile?',
              a: 'Many of the HTML5 games are designed to work on modern mobile browsers.',
            },
            {
              q: 'Can I play without downloading anything?',
              a: 'Yes. The games are designed to launch directly from the browser.',
            },
          ].map(({ q, a }) => (
            <details
              key={q}
              className="rounded-xl border border-nexa-violet/20 bg-nexa-black/50 px-5 py-4"
            >
              <summary className="cursor-pointer font-semibold text-nexa-text-primary">
                {q}
              </summary>

              <p className="mt-3 text-nexa-text-secondary">
                {a}
              </p>
            </details>
          ))}

        </div>
      </section>

    </main>
  )
}
