import { getGames } from '@/lib/games'
import GameCard from '@/components/GameCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const categoryMeta: Record<string, { emoji: string; color: string }> = {
  Action: { emoji: '⚔️', color: 'from-red-500 to-orange-500' },
  Casual: { emoji: '🎯', color: 'from-green-500 to-emerald-400' },
  Puzzle: { emoji: '🧩', color: 'from-yellow-500 to-amber-400' },
  Racing: { emoji: '🏎️', color: 'from-amber-500 to-orange-400' },
  Sports: { emoji: '⚽', color: 'from-cyan-500 to-blue-400' },
  Shooter: { emoji: '🎯', color: 'from-red-500 to-zinc-500' },
  Simulation: { emoji: '🌍', color: 'from-sky-500 to-blue-400' },
  Strategy: { emoji: '♟️', color: 'from-indigo-500 to-blue-400' },
  Adventure: { emoji: '🗺️', color: 'from-teal-500 to-green-400' },
  Battle: { emoji: '🛡️', color: 'from-orange-500 to-red-400' },
}

export default async function HomePage() {
  const games = await getGames()

  const featuredGames = [...games].filter(g => g.provider === 'GameMonetize')
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8)

  const newGames = [...games].filter(g => g.provider === 'GameMonetize')
    .sort((a, b) => b.releaseYear - a.releaseYear)
    .slice(0, 8)


  const trendingGames = [...games].filter(g => g.provider === 'GameMonetize')
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(4, 12)

  const availableCategories = Object.keys(categoryMeta).filter((cat) =>
    games.some(
      (game) =>
        game.genreFilter?.toLowerCase() === cat.toLowerCase() ||
        game.category?.toLowerCase() === cat.toLowerCase()
    )
  )

  const gameCountLabel =
    games.length >= 1000
      ? `${(games.length / 1000).toFixed(1)}K+`
      : `13000+`

  return (
    <main className="min-h-screen overflow-hidden">

      <section className="relative px-4 pt-24 pb-16 sm:pt-28 sm:pb-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.24),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(34,197,94,0.14),transparent_30%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neon-green/20 bg-neon-green/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-neon-green">
              <span className="h-2 w-2 animate-pulse rounded-full bg-neon-green" />
              {gameCountLabel} Free Browser Games
            </div>

            <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl">
              PLAY.
              <br />
              <span className="gradient-text">DISCOVER.</span>
              <br />
              REPEAT.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg lg:mx-0">
              Discover fast, free HTML5 games built for instant play.
              No downloads. No waiting. Just pick a game and play.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href="/games"
                className="rounded-xl bg-neon-green px-8 py-4 text-center text-base font-black text-space-black shadow-lg shadow-neon-green/20 transition hover:-translate-y-1 hover:shadow-neon-green/30"
              >
                PLAY NOW →
              </Link>

              <Link
                href="/categories"
                className="rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-center text-base font-bold text-white backdrop-blur transition hover:bg-white/10"
              >
                EXPLORE CATEGORIES
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm lg:justify-start">
              <div>
                <strong className="text-xl text-white">{gameCountLabel}</strong>
                <span className="ml-2 text-gray-500">Games</span>
              </div>
              <div className="h-7 w-px bg-white/10" />
              <div>
                <strong className="text-xl text-white">{47}</strong>
                <span className="ml-2 text-gray-500">Categories</span>
              </div>
              <div className="h-7 w-px bg-white/10" />
              <div>
                <strong className="text-xl text-neon-green">100%</strong>
                <span className="ml-2 text-gray-500">Free</span>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-6 rounded-[2rem] bg-electric-violet/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-3 shadow-2xl backdrop-blur-xl">
              {featuredGames[0] ? (
                <Link
                  href={`/games/${featuredGames[0].slug}`}
                  className="group block overflow-hidden rounded-2xl"
                >
                  <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-black">
                    <img
                      src={featuredGames[0].thumbnail}
                      alt={featuredGames[0].name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                    <div className="absolute left-5 top-5 rounded-full border border-neon-green/30 bg-black/60 px-3 py-1.5 text-xs font-bold text-neon-green backdrop-blur">
                      FEATURED GAME
                    </div>

                    <div className="absolute inset-x-5 bottom-5">
                      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-neon-green">
                        Top Rated
                      </p>
                      <h2 className="text-2xl font-black text-white sm:text-3xl">
                        {featuredGames[0].name}
                      </h2>
                      <div className="mt-3 inline-flex rounded-lg bg-white px-4 py-2 text-sm font-black text-black transition group-hover:bg-neon-green">
                        PLAY GAME →
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="aspect-[16/11] rounded-2xl bg-white/5" />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-neon-green">
                Explore
              </p>
              <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">
                Browse Categories
              </h2>
            </div>

            <Link
              href="/categories"
              className="text-sm font-bold text-gray-400 transition hover:text-neon-green"
            >
              View All →
            </Link>
          </div>

          <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-3">
            {availableCategories.map((category) => {
              const meta = categoryMeta[category]

              return (
                <Link
                  key={category}
                  href={`/games?genre=${encodeURIComponent(category)}`}
                  className={`flex min-w-max items-center gap-2 rounded-xl bg-gradient-to-r ${meta.color} px-5 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-1`}
                >
                  <span>{meta.emoji}</span>
                  {category}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-electric-violet">
                Popular
              </p>
              <h2 className="mt-1 text-3xl font-black text-white">
                ⭐ Top Rated Games
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                The games players are loving right now.
              </p>
            </div>

            <Link
              href="/games"
              className="hidden text-sm font-bold text-gray-400 hover:text-neon-green sm:block"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {featuredGames.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-white/[0.015] px-4 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
                Hot Right Now
              </p>
              <h2 className="mt-1 text-3xl font-black text-white">
                🔥 Trending Games
              </h2>
            </div>

            <Link
              href="/games"
              className="text-sm font-bold text-gray-400 hover:text-neon-green"
            >
              See More →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {trendingGames.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        </div>
      </section>

        </div>
      </section>
      <section className="px-4 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-neon-green">
                Fresh Arrivals
              </p>
              <h2 className="mt-1 text-3xl font-black text-white">
                🆕 New Games
              </h2>
            </div>

            <Link
              href="/games"
              className="text-sm font-bold text-gray-400 hover:text-neon-green"
            >
              See More →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {newGames.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-electric-violet/20 via-white/[0.03] to-neon-green/10 p-8 text-center sm:p-12">
          <div className="mx-auto max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-neon-green">
              Your next game is waiting
            </p>

            <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">
              Find your next favorite game.
            </h2>

            <p className="mt-4 text-gray-400">
              Explore the full ArcadeNexa collection and start playing instantly.
            </p>

            <Link
              href="/games"
              className="mt-8 inline-flex rounded-xl bg-neon-green px-8 py-4 font-black text-space-black shadow-lg shadow-neon-green/20 transition hover:-translate-y-1"
            >
              EXPLORE ALL GAMES →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
