import { Globe2, Crown, Map, Shield } from "lucide-react"
import { getHomeGames } from '@/lib/games'
import GameCard from '@/components/GameCard'
import FeaturedGamesSlider from '@/components/FeaturedGamesSlider'
import CategorySlider from '@/components/CategorySlider'
import Link from 'next/link'
import Image from 'next/image'
import RecentlyPlayed from '@/components/RecentlyPlayed'

export const revalidate = 300

const categoryMeta: Record<string, { icon?: any; image?: string; color: string }> = {
  Action:     { image: '/images/categories/action.webp',     color: 'from-red-500 to-orange-500' },
  Casual:     { image: '/images/categories/casual.webp',     color: 'from-nexa-emerald to-nexa-cyan' },
  Puzzle:     { image: '/images/categories/puzzle.webp',     color: 'from-yellow-500 to-amber-400' },
  Racing:     { image: '/images/categories/racing.webp',     color: 'from-amber-500 to-orange-400' },
  Sports:     { image: '/images/categories/sports.webp',     color: 'from-nexa-cyan to-nexa-blue' },
  Shooter:    { image: '/images/categories/shooter.webp',    color: 'from-red-500 to-zinc-500' },
  Simulation: { image: '/images/categories/simulation.webp', color: 'from-nexa-blue to-nexa-cyan' },
  Strategy:   { image: '/images/categories/strategy.webp',   color: 'from-nexa-blue to-nexa-cyan' },
  Adventure:  { image: '/images/categories/adventure.webp',  color: 'from-nexa-emerald to-nexa-cyan' },
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

  const sliderCategories = [
    { name: 'Action', slug: 'action', image: '/images/categories/action.webp' },
    { name: 'Adventure', slug: 'adventure', image: '/images/categories/adventure.webp' },
    { name: 'Arcade', slug: 'arcade', image: '/images/categories/arcade.webp' },
    { name: 'Casual', slug: 'casual', image: '/images/categories/casual.webp' },
    { name: 'Puzzle', slug: 'puzzle', image: '/images/categories/puzzle.webp' },
    { name: 'Racing', slug: 'racing', image: '/images/categories/racing.webp' },
    { name: 'Sports', slug: 'sports', image: '/images/categories/sports.webp' },
    { name: 'Shooter', slug: 'shooter', image: '/images/categories/shooter.webp' },
    { name: 'Simulation', slug: 'simulation', image: '/images/categories/simulation.webp' },
    { name: 'Strategy', slug: 'strategy', image: '/images/categories/strategy.webp' },
    { name: 'Battle', slug: 'battle', image: '/images/categories/battle.webp' },
    { name: 'Fighting', slug: 'fighting', image: '/images/categories/fighting.webp' },
    { name: 'Platformer', slug: 'platformer', image: '/images/categories/platformer.webp' },
    { name: 'Runner', slug: 'runner', image: '/images/categories/runner.webp' },
    { name: 'Survival', slug: 'survival', image: '/images/categories/survival.webp' },
    { name: 'Horror', slug: 'horror', image: '/images/categories/horror.webp' },
    { name: 'RPG', slug: 'rpg', image: '/images/categories/rpg.webp' },
    { name: 'MMORPG', slug: 'mmorpg', image: '/images/categories/mmorpg.webp' },
    { name: 'Open World', slug: 'open-world', image: '/images/categories/open-world.webp' },
    { name: 'Sandbox', slug: 'sandbox', image: '/images/categories/sandbox.webp' },
    { name: 'Tycoon', slug: 'tycoon', image: '/images/categories/tycoon.webp' },
    { name: 'Idle', slug: 'idle', image: '/images/categories/idle.webp' },
    { name: 'Clicker', slug: 'clicker', image: '/images/categories/clicker.webp' },
    { name: 'Hyper-Casual', slug: 'hyper-casual', image: '/images/categories/hyper-casual.webp' },
    { name: 'Match 3', slug: 'match-3', image: '/images/categories/match-3.webp' },
    { name: 'Board', slug: 'board', image: '/images/categories/board.webp' },
    { name: 'Card', slug: 'card', image: '/images/categories/card.webp' },
    { name: 'Quiz', slug: 'quiz', image: '/images/categories/quiz.webp' },
    { name: 'Trivia', slug: 'trivia', image: '/images/categories/trivia.webp' },
    { name: 'Word', slug: 'word', image: '/images/categories/word.webp' },
    { name: 'Math', slug: 'math', image: '/images/categories/math.webp' },
    { name: 'Memory', slug: 'memory', image: '/images/categories/memory.webp' },
    { name: 'Educational', slug: 'educational', image: '/images/categories/educational.webp' },
    { name: 'Cooking', slug: 'cooking', image: '/images/categories/cooking.webp' },
    { name: 'Beauty & Dress Up', slug: 'beauty-dress-up', image: '/images/categories/beauty-dress-up.webp' },
    { name: 'Girls', slug: 'games-for-girls', image: '/images/categories/beauty-dress-up.webp' },
    { name: 'Farming', slug: 'farming', image: '/images/categories/farming.webp' },
    { name: 'Time Management', slug: 'time-management', image: '/images/categories/time-management.webp' },
    { name: 'Hidden Object', slug: 'hidden-object', image: '/images/categories/hidden-object.webp' },
    { name: 'Stealth', slug: 'stealth', image: '/images/categories/stealth.webp' },
    { name: 'Zombie', slug: 'zombie', image: '/images/categories/zombie.webp' },
    { name: 'Monster', slug: 'monster', image: '/images/categories/monster.webp' },
    { name: 'Robots', slug: 'robots', image: '/images/categories/robots.webp' },
    { name: 'Space', slug: 'space', image: '/images/categories/space.webp' },
    { name: 'Flying', slug: 'flying', image: '/images/categories/flying.webp' },
    { name: 'Bike', slug: 'bike', image: '/images/categories/bike.webp' },
    { name: 'Car', slug: 'car', image: '/images/categories/car.webp' },
    { name: 'Tank', slug: 'tank', image: '/images/categories/tank.webp' },
    { name: 'Golf', slug: 'golf', image: '/images/categories/golf.webp' },
    { name: 'Basketball', slug: 'basketball', image: '/images/categories/basketball.webp' },
    { name: 'Ball', slug: 'ball', image: '/images/categories/ball.webp' },
    { name: 'Snake', slug: 'snake', image: '/images/categories/snake.webp' },
    { name: 'IO', slug: 'io', image: '/images/categories/io.webp' },
    { name: 'Christmas', slug: 'christmas', image: '/images/categories/christmas.webp' },
    { name: 'Animal', slug: 'animal', image: '/images/categories/animal.webp' },
    { name: 'Cats', slug: 'cats', image: '/images/categories/cats.webp' },
    { name: 'Building', slug: 'building', image: '/images/categories/building.webp' },
    { name: 'Block', slug: 'block', image: '/images/categories/block.webp' },
    { name: 'Drawing', slug: 'drawing', image: '/images/categories/drawing.webp' },
    { name: 'Air Combat', slug: 'air-combat', image: '/images/categories/air-combat.webp' },
    { name: 'Boat', slug: 'boat', image: '/images/categories/boat.webp' },
  ]

  const gameCountLabel = '15,000+'

  return (
    <main className="min-h-screen overflow-hidden bg-transparent">

      <section className="arcade-hero relative px-4 pt-16 pb-12 sm:pt-18 sm:pb-14">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.08),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(139,92,246,0.06),transparent_30%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="text-center lg:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-nexa-emerald/20 bg-nexa-emerald/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-nexa-emerald">
              <span className="h-2 w-2 animate-pulse rounded-full bg-nexa-emerald" />
              {gameCountLabel} Free Browser Games
            </div>

            <h1 className="text-4xl font-black leading-[0.92] tracking-[-0.04em] text-[color:var(--text-primary)] sm:text-6xl lg:text-[5.5rem]">
              PLAY.<br />
              <span className="gradient-text">DISCOVER.</span><br />
              REPEAT.
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[color:var(--text-secondary)] sm:text-lg lg:mx-0">
              Discover fast, free HTML5 games built for instant play.
              No downloads. No waiting. Just pick a game and play.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link href="/games" className="btn-premium rounded-xl px-8 py-4 text-center text-base font-black">
                PLAY NOW →
              </Link>
              <Link href="/categories" className="rounded-xl border border-[color:var(--white-10)] bg-[color:var(--white-03)] px-8 py-4 text-center text-base font-bold text-[color:var(--text-primary)] transition hover:border-nexa-cyan/30 hover:bg-[color:var(--white-06)]">
                EXPLORE CATEGORIES
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm lg:justify-start">
              <div>
                <strong className="text-xl text-[color:var(--text-primary)]">{gameCountLabel}</strong>
                <span className="ml-2 text-[color:var(--text-muted)]">Games</span>
              </div>
              <div className="h-7 w-px bg-[color:var(--white-10)]" />
              <div>
                <strong className="text-xl text-[color:var(--text-primary)]">63</strong>
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
