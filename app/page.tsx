import { Globe2, Crown, Map, Shield } from "lucide-react"
import { getHomeGames } from '@/lib/games'
import GameCard from '@/components/GameCard'
import FeaturedGamesSlider from '@/components/FeaturedGamesSlider'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

const categoryMeta: Record<string, { icon?: any; image?: string; color: string }> = {
  Action: { image: '/images/categories/action.webp', color: 'from-red-500 to-orange-500' },
  Casual: { image: '/images/categories/casual.webp', color: 'from-green-500 to-emerald-400' },
  Puzzle: { image: '/images/categories/puzzle.webp', color: 'from-yellow-500 to-amber-400' },
  Racing: { image: '/images/categories/racing.webp', color: 'from-amber-500 to-orange-400' },
  Sports: { image: '/images/categories/sports.webp', color: 'from-cyan-500 to-blue-400' },
  Shooter: { image: '/images/categories/shooter.webp', color: 'from-red-500 to-zinc-500' },
  Simulation: { image: '/images/categories/simulation.webp', color: 'from-sky-500 to-blue-400' },
  Strategy: { image: '/images/categories/strategy.webp', color: 'from-indigo-500 to-blue-400' },
  Adventure: { image: '/images/categories/adventure.webp', color: 'from-teal-500 to-green-400' },
  Battle: { image: '/images/categories/battle.webp', color: 'from-orange-500 to-red-400' },
}

export default async function HomePage() {
  // الصفحة الرئيسية تحتاج فقط عينة صغيرة من الألعاب.
  // لا ننتظر تحميل الكتالوج الكامل +29,400 لعبة.
  const games = await getHomeGames()

  const gmGames = [...games].filter(g => g.provider === 'GameMonetize')
  const gpGames = [...games].filter(g => g.provider === 'GamePix')

  const featuredGames = [...gmGames].sort((a, b) => b.rating - a.rating).slice(0, 8)
  const newGames = [...gmGames].sort((a, b) => b.releaseYear - a.releaseYear).slice(8, 16)
  const trendingGames = [...gpGames].sort((a, b) => b.rating - a.rating).slice(0, 8)




  const availableCategories = Object.keys(categoryMeta).filter((cat) =>
    games.some(
      (game) =>
        game.genreFilter?.toLowerCase() === cat.toLowerCase() ||
        game.category?.toLowerCase() === cat.toLowerCase()
    )
  )

  const gameCountLabel = '29,400+'

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

      <section className="px-4 py-6 sm:py-10">
        <div className="mx-auto max-w-7xl">
          <FeaturedGamesSlider games={games} />
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

          <div className="scrollbar-hide grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {availableCategories.map((category) => {
              const meta = categoryMeta[category]
              const Icon = meta.icon

              const categoryGameCount = 'Explore'

              return (
                <Link
                  key={category}
                  href={`/games?genre=${encodeURIComponent(category)}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07] active:scale-[0.97]"
                >
                  <div
                    className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${meta.color} opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40`}
                  />

                  <div
                    className="relative mb-4 h-32 overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-lg transition-all duration-300 group-hover:scale-[1.02] group-hover:border-white/20"
                  >
                    {meta.image ? (
                      <Image
                        src={meta.image}
                        alt={`${category} games`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        loading="lazy" className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : Icon ? (
                      <div
                        className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${meta.color}`}
                      >
                        <Icon
                          className="h-10 w-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                          strokeWidth={2.4}
                        />
                      </div>
                    ) : null}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  </div>

                  <div className="relative">
                    <h3 className="text-sm font-black uppercase tracking-wide text-white">
                      {category}
                    </h3>

                    <p className="mt-1 text-xs font-medium text-gray-500">
                      {categoryGameCount}
                    </p>
                  </div>

                  <div className="absolute bottom-4 right-4 text-xs font-bold text-white/30 transition-colors group-hover:text-white/80">
                    →
                  </div>
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
              <GameCard key={game.slug} game={game} lazy />
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
              <GameCard key={game.slug} game={game} lazy />
            ))}
          </div>
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
              <GameCard key={game.slug} game={game} lazy />
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
