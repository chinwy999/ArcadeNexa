import { Globe2, Crown, Map, Shield } from "lucide-react"
import { getHomeGames } from '@/lib/games'
import GameCard from '@/components/GameCard'
import FeaturedGamesSlider from '@/components/FeaturedGamesSlider'
import Link from 'next/link'
import Image from 'next/image'
import RecentlyPlayed from '@/components/RecentlyPlayed'
import AdsterraBanner from "@/components/ads/AdsterraBanner";

export const revalidate = 300

const categoryMeta: Record<string, { icon?: any; image?: string; color: string }> = {
  Action:     { image: '/images/categories/action.webp',     color: 'from-red-500 to-orange-500' },
  Casual:     { image: '/images/categories/casual.webp',     color: 'from-green-500 to-emerald-400' },
  Puzzle:     { image: '/images/categories/puzzle.webp',     color: 'from-yellow-500 to-amber-400' },
  Racing:     { image: '/images/categories/racing.webp',     color: 'from-amber-500 to-orange-400' },
  Sports:     { image: '/images/categories/sports.webp',     color: 'from-cyan-500 to-blue-400' },
  Shooter:    { image: '/images/categories/shooter.webp',    color: 'from-red-500 to-zinc-500' },
  Simulation: { image: '/images/categories/simulation.webp', color: 'from-sky-500 to-blue-400' },
  Strategy:   { image: '/images/categories/strategy.webp',   color: 'from-indigo-500 to-blue-400' },
  Adventure:  { image: '/images/categories/adventure.webp',  color: 'from-teal-500 to-green-400' },
  Battle:     { image: '/images/categories/battle.webp',     color: 'from-orange-500 to-red-400' },
}

export default async function HomePage() {
  const games = await getHomeGames()

  /*
   * Build distinct homepage sections.
   *
   * IMPORTANT:
   * We deliberately prevent the same game from appearing
   * in multiple sections.
   *
   * We also avoid calling the section "Trending" because
   * ArcadeNexa does not yet have real play-count analytics.
   */

  const usedSlugs = new Set<string>()

  function takeUnique(
    source: typeof games,
    count: number,
    predicate?: (game: typeof games[number]) => boolean
  ) {
    const result: typeof games = []

    for (const game of source) {
      if (result.length >= count) break
      if (usedSlugs.has(game.slug)) continue
      if (predicate && !predicate(game)) continue

      usedSlugs.add(game.slug)
      result.push(game)
    }

    return result
  }

  const byScore = [...games].sort((a, b) => b.rating - a.rating)

  const byNewest = [...games].sort((a, b) => {
    if (b.releaseYear !== a.releaseYear) {
      return b.releaseYear - a.releaseYear
    }

    return b.rating - a.rating
  })

  /*
   * Editor picks use a deterministic score based on the game
   * identity. This gives visitors variety without pretending
   * we have fake player analytics.
   */
  const editorPicks = [...games].sort((a, b) => {
    const score = (slug: string) => {
      let hash = 0

      for (let i = 0; i < slug.length; i++) {
        hash = ((hash << 5) - hash) + slug.charCodeAt(i)
        hash |= 0
      }

      return Math.abs(hash) % 100
    }

    return score(b.slug) - score(a.slug)
  })

  const featuredGames = takeUnique(byScore, 8)
  const newGames = takeUnique(byNewest, 8)
  const editorGames = takeUnique(editorPicks, 8)

  const availableCategories = Object.keys(categoryMeta).filter((cat) =>
    games.some(
      (game) =>
        game.genreFilter?.toLowerCase() === cat.toLowerCase() ||
        game.category?.toLowerCase()    === cat.toLowerCase()
    )
  )

  const gameCountLabel = '15,000+'

  return (
    <main className="min-h-screen overflow-hidden bg-transparent">
      <AdsterraBanner />

      <section className="arcade-hero relative px-4 pt-28 pb-20 sm:pt-32 sm:pb-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.08),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(139,92,246,0.06),transparent_30%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-nexa-emerald/20 bg-nexa-emerald/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-nexa-emerald">
              <span className="h-2 w-2 animate-pulse rounded-full bg-nexa-emerald" />
              {gameCountLabel} Free Browser Games
            </div>

            <h1 className="text-5xl font-black leading-[0.9] tracking-[-0.04em] text-[color:var(--text-primary)] sm:text-7xl lg:text-[6.5rem]">
              PLAY.<br />
              <span className="gradient-text">DISCOVER.</span><br />
              REPEAT.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[color:var(--text-secondary)] sm:text-lg lg:mx-0">
              Discover fast, free HTML5 games built for instant play.
              No downloads. No waiting. Just pick a game and play.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link href="/games" className="btn-premium rounded-xl px-8 py-4 text-center text-base font-black">
                PLAY NOW →
              </Link>
              <Link href="/categories" className="rounded-xl border border-[color:var(--white-10)] bg-[color:var(--white-03)] px-8 py-4 text-center text-base font-bold text-[color:var(--text-primary)] transition hover:border-nexa-cyan/30 hover:bg-[color:var(--white-06)]">
                EXPLORE CATEGORIES
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm lg:justify-start">
              <div>
                <strong className="text-xl text-[color:var(--text-primary)]">{gameCountLabel}</strong>
                <span className="ml-2 text-[color:var(--text-muted)]">Games</span>
              </div>
              <div className="h-7 w-px bg-[color:var(--white-10)]" />
              <div>
                <strong className="text-xl text-[color:var(--text-primary)]">47</strong>
                <span className="ml-2 text-[color:var(--text-muted)]">Categories</span>
              </div>
              <div className="h-7 w-px bg-[color:var(--white-10)]" />
              <div>
                <strong className="text-xl text-nexa-emerald">100%</strong>
                <span className="ml-2 text-[color:var(--text-muted)]">Free</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:py-10">
        <div className="mx-auto max-w-7xl">
          <FeaturedGamesSlider games={games} />
        </div>
      </section>

      <RecentlyPlayed />

      <section className="px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-nexa-emerald">Explore</p>
              <h2 className="mt-1 text-2xl font-black text-[color:var(--text-primary)] sm:text-3xl">Browse Categories</h2>
            </div>
            <Link href="/categories" className="text-sm font-bold text-[color:var(--text-secondary)] transition hover:text-nexa-emerald">
              View All →
            </Link>
          </div>

          <div className="scrollbar-hide grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {availableCategories.map((category) => {
              const meta = categoryMeta[category]
              const Icon = meta.icon
              return (
                <Link
                  key={category}
                  href={`/games?genre=${encodeURIComponent(category)}`}
                  className="category-card group relative overflow-hidden rounded-2xl p-4 active:scale-[0.97]"
                >
                  <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${meta.color} opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40`} />
                  <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-xl border border-[color:var(--white-10)] bg-black/30 shadow-lg transition-all duration-300 group-hover:scale-[1.02] group-hover:border-nexa-cyan/20">
                    {meta.image ? (
                      <Image
                        src={meta.image}
                        alt={`${category} games`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        loading="lazy"
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : Icon ? (
                      <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${meta.color}`}>
                        <Icon className="h-10 w-10 text-[color:var(--text-primary)] drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]" strokeWidth={2.4} />
                      </div>
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  </div>
                  <div className="relative">
                    <h3 className="text-sm font-black uppercase tracking-wide text-[color:var(--text-primary)]">{category}</h3>
                    <p className="mt-1 text-xs font-medium text-[color:var(--text-muted)]">Explore</p>
                  </div>
                  <div className="absolute bottom-4 right-4 text-xs font-bold text-[color:var(--text-primary)]/30 transition-colors group-hover:text-[color:var(--text-primary)]/80">→</div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ⭐ Top Rated */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-nexa-violet">Popular</p>
              <h2 className="mt-1 text-3xl font-black text-[color:var(--text-primary)]">⭐ Top Rated Games</h2>
              <p className="mt-1 text-sm text-[color:var(--text-muted)]">The games players are loving right now.</p>
            </div>
            <Link href="/games" className="hidden text-sm font-bold text-[color:var(--text-secondary)] hover:text-nexa-emerald sm:block">
              View All →
            </Link>
          </div>

          {featuredGames.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {featuredGames.map((game) => (
                <GameCard key={game.slug} game={game} />
              ))}
            </div>
          ) : (
            <p className="text-[color:var(--text-muted)] text-center py-10">Loading games...</p>
          )}
        </div>
      </section>

      {/* ✨ Editor's Picks */}
      <section className="border-y border-white/[0.06] bg-nexa-navy/60 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-nexa-cyan">Handpicked Discovery</p>
              <h2 className="mt-1 text-3xl font-black text-[color:var(--text-primary)]">✨ Editor's Picks</h2>
              <p className="mt-1 text-sm text-[color:var(--text-muted)]">Fresh games worth discovering today.</p>
            </div>
            <Link href="/games" className="text-sm font-bold text-[color:var(--text-secondary)] hover:text-nexa-emerald">
              See More →
            </Link>
          </div>

          {editorGames.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {editorGames.map((game) => (
                <GameCard key={game.slug} game={game} />
              ))}
            </div>
          ) : (
            <p className="text-[color:var(--text-muted)] text-center py-10">Loading games...</p>
          )}
        </div>
      </section>

      {/* 🆕 New Games */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-nexa-emerald">Fresh Arrivals</p>
              <h2 className="mt-1 text-3xl font-black text-[color:var(--text-primary)]">🆕 New Games</h2>
            </div>
            <Link href="/games" className="text-sm font-bold text-[color:var(--text-secondary)] hover:text-nexa-emerald">
              See More →
            </Link>
          </div>

          {newGames.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {newGames.map((game) => (
                <GameCard key={game.slug} game={game} />
              ))}
            </div>
          ) : (
            <p className="text-[color:var(--text-muted)] text-center py-10">Loading games...</p>
          )}
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-[color:var(--white-10)] bg-gradient-to-br from-nexa-violet/20 via-white/[0.03] to-nexa-emerald/10 p-8 text-center sm:p-12">
          <div className="mx-auto max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-nexa-emerald">Your next game is waiting</p>
            <h2 className="mt-3 text-3xl font-black text-[color:var(--text-primary)] sm:text-5xl">Find your next favorite game.</h2>
            <p className="mt-4 text-[color:var(--text-secondary)]">Explore the full ArcadeNexa collection and start playing instantly.</p>
            <Link href="/games" className="mt-8 inline-flex rounded-xl bg-nexa-emerald px-8 py-4 font-black text-nexa-black shadow-lg shadow-nexa-emerald/20 transition hover:-translate-y-1">
              EXPLORE ALL GAMES →
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
