import { Globe2, Crown, Map, Shield } from "lucide-react"
import { getHomeGames } from '@/lib/games'
import GameCard from '@/components/GameCard'
import FeaturedGamesSlider from '@/components/FeaturedGamesSlider'
import CategorySlider from '@/components/CategorySlider'
import Link from 'next/link'
import RecentlyPlayed from '@/components/RecentlyPlayed'

export const revalidate = 300

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

  const sliderCategories = [
    { name: 'Action', slug: 'action' },
    { name: 'Adventure', slug: 'adventure' },
    { name: 'Arcade', slug: 'arcade' },
    { name: 'Casual', slug: 'casual' },
    { name: 'Puzzle', slug: 'puzzle' },
    { name: 'Racing', slug: 'racing' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Shooter', slug: 'shooter' },
    { name: 'Simulation', slug: 'simulation' },
    { name: 'Strategy', slug: 'strategy' },
    { name: 'Platformer', slug: 'platformer' },
    { name: 'Fighting', slug: 'fighting' },
    { name: 'Runner', slug: 'runner' },
    { name: 'Battle', slug: 'battle' },
    { name: 'Stealth', slug: 'stealth' },
    { name: 'Survival', slug: 'survival' },
    { name: 'RPG', slug: 'rpg' },
    { name: 'MMORPG', slug: 'mmorpg' },
    { name: 'IO', slug: 'io' },
    { name: 'Open World', slug: 'open-world' },
    { name: 'Car', slug: 'car' },
    { name: 'Bike', slug: 'bike' },
    { name: 'Flying', slug: 'flying' },
    { name: 'Air Combat', slug: 'air-combat' },
    { name: 'Boat', slug: 'boat' },
    { name: 'Tank', slug: 'tank' },
    { name: 'Space', slug: 'space' },
    { name: 'Robots', slug: 'robots' },
    { name: 'Match 3', slug: 'match-3' },
    { name: 'Block', slug: 'block' },
    { name: 'Board', slug: 'board' },
    { name: 'Card', slug: 'card' },
    { name: 'Memory', slug: 'memory' },
    { name: 'Math', slug: 'math' },
    { name: 'Quiz', slug: 'quiz' },
    { name: 'Trivia', slug: 'trivia' },
    { name: 'Word', slug: 'word' },
    { name: 'Hidden Object', slug: 'hidden-object' },
    { name: 'Clicker', slug: 'clicker' },
    { name: 'Idle', slug: 'idle' },
    { name: 'Hyper-Casual', slug: 'hyper-casual' },
    { name: 'Time Management', slug: 'time-management' },
    { name: 'Tycoon', slug: 'tycoon' },
    { name: 'Building', slug: 'building' },
    { name: 'Farming', slug: 'farming' },
    { name: 'Cooking', slug: 'cooking' },
    { name: 'Animal', slug: 'animal' },
    { name: 'Cats', slug: 'cats' },
    { name: 'Monster', slug: 'monster' },
    { name: 'Zombie', slug: 'zombie' },
    { name: 'Horror', slug: 'horror' },
    { name: 'Girls', slug: 'games-for-girls' },
    { name: 'Beauty & Dress Up', slug: 'beauty-dress-up' },
    { name: 'Drawing', slug: 'drawing' },
    { name: 'Educational', slug: 'educational' },
    { name: 'Sandbox', slug: 'sandbox' },
    { name: 'Snake', slug: 'snake' },
    { name: 'Ball', slug: 'ball' },
    { name: 'Basketball', slug: 'basketball' },
    { name: 'Golf', slug: 'golf' },
  ]

  const gameCountLabel = '15,000+'

  return (
    <main className="min-h-screen overflow-hidden bg-transparent">

      {/* COMPACT HERO */}
      <section className="relative px-4 pt-10 pb-6 sm:pt-14 sm:pb-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[color:var(--nexa-surface)]/70 px-5 py-9 text-center shadow-[var(--shadow-card)] backdrop-blur-xl sm:px-8 sm:py-11">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,230,255,0.14),transparent_55%)]" />

            <div className="relative">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-nexa-emerald/20 bg-nexa-emerald/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-nexa-emerald">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-nexa-emerald" />
                Free HTML5 Games
              </div>

              <h1 className="mx-auto max-w-4xl text-3xl font-black tracking-tight text-[color:var(--text-primary)] sm:text-5xl lg:text-6xl">
                Play Free Games Online
              </h1>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[color:var(--text-secondary)] sm:text-base">
                15,000+ games. No downloads. No registration. Just pick a game and play instantly.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/games"
                  className="btn-premium rounded-xl px-7 py-3 text-sm font-black"
                >
                  PLAY NOW →
                </Link>

                <Link
                  href="/categories"
                  className="rounded-xl border border-[color:var(--white-10)] bg-[color:var(--white-03)] px-7 py-3 text-sm font-bold text-[color:var(--text-primary)] transition hover:border-nexa-cyan/30 hover:bg-[color:var(--white-06)]"
                >
                  BROWSE CATEGORIES
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs font-semibold text-[color:var(--text-muted)]">
                <span><strong className="text-[color:var(--text-primary)]">{gameCountLabel}</strong> Games</span>
                <span className="h-4 w-px bg-[color:var(--white-10)]" />
                <span><strong className="text-[color:var(--text-primary)]">{sliderCategories.length}</strong> Categories</span>
                <span className="h-4 w-px bg-[color:var(--white-10)]" />
                <span><strong className="text-nexa-emerald">100%</strong> Free</span>
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

      <section className="px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl">
          <CategorySlider categories={sliderCategories} />
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
