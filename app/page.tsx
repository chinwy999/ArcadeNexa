import Link from 'next/link'
import GameCard from '@/components/GameCard'
import FeaturedGamesSlider from '@/components/FeaturedGamesSlider'
import CategorySlider from '@/components/CategorySlider'
import RecentlyPlayed from '@/components/RecentlyPlayed'
import { getHomeGames, type Game } from '@/lib/games'
import { getLocale } from '@/lib/i18n/server'
import { getTranslations } from '@/lib/i18n'
import {
  ArrowRight,
  Gamepad2,
  Star,
  Clock,
  Sparkles,
  Flame,
} from 'lucide-react'

export const revalidate = 300

export async function generateMetadata() {
  const locale = getLocale()
  const t = getTranslations(locale)
  const isArabic = locale === 'ar'

  return {
    title: t.home.metadata.title,
    description: t.home.metadata.description,
    keywords:
      'free HTML5 games, online games, browser games, arcade games, free games',
    alternates: {
      canonical: isArabic ? '/ar' : '/',
    },
    openGraph: {
      title: t.home.metadata.openGraphTitle,
      description: t.home.metadata.openGraphDescription,
      url: isArabic ? '/ar' : '/',
      siteName: 'Arcadlo',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t.home.metadata.twitterTitle,
      description: t.home.metadata.twitterDescription,
    },
  }
}

const categorySlugs = [
  'action',
  'adventure',
  'arcade',
  'puzzle',
  'racing',
  'sports',
  'shooter',
  'strategy',
  'rpg',
  'casual',
] as const

export default async function HomePage() {
  const locale = getLocale()
  const t = getTranslations(locale)
  const isArabic = locale === 'ar'
  const prefix = isArabic ? '/ar' : ''

  const categories = categorySlugs.map((slug) => ({
    name: t.home.categories[slug],
    slug,
  }))

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
      <section className="relative mb-6 overflow-hidden rounded-2xl border border-[color:var(--white-10)] bg-gradient-to-br from-purple-600/20 via-[color:var(--nexa-navy)] to-cyan-600/10 px-4 py-6 shadow-[0_20px_70px_rgba(0,0,0,0.28)] sm:px-7 sm:py-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-purple-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-12 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute right-1/3 top-0 h-24 w-24 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-nexa-violet/30 bg-nexa-violet/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-nexa-violet">
              <Gamepad2 size={13} />
              {t.home.gamesCount}
            </div>

            <h1 className="text-3xl font-black leading-[1.05] tracking-tight text-[color:var(--text-primary)] sm:text-4xl lg:text-5xl">
              {t.home.heroTitle}{' '}
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {t.home.heroHighlight}
              </span>
              <span className="block text-[color:var(--text-primary)]/90">
                {t.home.heroSubtitle}
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[color:var(--text-secondary)] sm:text-base">
              {t.home.heroDescription}
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link
                href={`${prefix}/games`}
                className="inline-flex items-center gap-2 rounded-xl bg-nexa-violet px-4 py-2.5 text-xs font-black text-white shadow-[0_10px_30px_var(--nexa-violet-shadow-strong)] transition-all hover:scale-[1.03] hover:brightness-110 active:scale-95 sm:px-5 sm:py-3 sm:text-sm"
              >
                <Gamepad2 size={16} />
                {t.home.playAllGames}
                <ArrowRight size={14} />
              </Link>

              <Link
                href={`${prefix}/categories`}
                className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--white-15)] bg-[color:var(--white-05)] px-4 py-2.5 text-xs font-bold text-[color:var(--text-secondary)] backdrop-blur-sm transition-all hover:border-nexa-cyan/30 hover:bg-nexa-cyan/10 hover:text-white active:scale-95 sm:px-5 sm:py-3 sm:text-sm"
              >
                {t.home.exploreCategories}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:w-[390px] lg:grid-cols-2">
            <div className="rounded-xl border border-[color:var(--white-10)] bg-[color:var(--white-04)] p-3 backdrop-blur-sm">
              <Gamepad2 size={16} className="mb-2 text-nexa-violet" />
              <p className="text-sm font-black text-white">15,000+</p>
              <p className="mt-0.5 text-[10px] font-semibold text-[color:var(--text-muted)]">{t.home.games}</p>
            </div>

            <div className="rounded-xl border border-[color:var(--white-10)] bg-[color:var(--white-04)] p-3 backdrop-blur-sm">
              <Star size={16} className="mb-2 text-nexa-gold" />
              <p className="text-sm font-black text-white">{t.home.topRated}</p>
              <p className="mt-0.5 text-[10px] font-semibold text-[color:var(--text-muted)]">{t.home.games}</p>
            </div>

            <div className="rounded-xl border border-[color:var(--white-10)] bg-[color:var(--white-04)] p-3 backdrop-blur-sm">
              <Clock size={16} className="mb-2 text-nexa-cyan" />
              <p className="text-sm font-black text-white">{t.home.instant}</p>
              <p className="mt-0.5 text-[10px] font-semibold text-[color:var(--text-muted)]">{t.home.play}</p>
            </div>

            <div className="rounded-xl border border-[color:var(--white-10)] bg-[color:var(--white-04)] p-3 backdrop-blur-sm">
              <Sparkles size={16} className="mb-2 text-purple-400" />
              <p className="text-sm font-black text-white">{t.home.free}</p>
              <p className="mt-0.5 text-[10px] font-semibold text-[color:var(--text-muted)]">{t.home.always}</p>
            </div>
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

      {/* {t.home.popularGames} */}
      <section className="mb-9">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-400/20 bg-gradient-to-br from-orange-500/20 to-red-500/10 shadow-[0_8px_25px_rgba(249,115,22,0.10)]">
              <Flame size={18} className="text-orange-400" />
              <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5" />
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-nexa-violet">
                Top Rated
              </p>
              <h2 className="mt-0.5 text-lg font-black tracking-tight text-[color:var(--text-primary)] sm:text-xl">
                {t.home.popularGames}
              </h2>
            </div>
          </div>

          <Link
            href={`${prefix}/games`}
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[color:var(--white-10)] bg-[color:var(--white-03)] px-2.5 py-1.5 text-[10px] font-extrabold text-[color:var(--text-secondary)] transition-all hover:border-nexa-violet/30 hover:bg-nexa-violet/10 hover:text-white sm:px-3 sm:py-2 sm:text-xs"
          >
            {t.home.viewAll}
            <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mb-4 h-px bg-gradient-to-r from-nexa-violet/40 via-[color:var(--white-10)] to-transparent" />

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
              {t.home.unavailablePopular}
            </p>
          </div>
        )}
      </section>

      {/* More Games */}
      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-nexa-violet">
              {t.home.discover}
            </p>
            <h2 className="text-base font-black text-[color:var(--text-primary)] sm:text-lg">
              {t.home.moreGames}
            </h2>
          </div>

          <Link
            href={`${prefix}/games`}
            className="inline-flex items-center gap-1 text-[10px] font-bold text-nexa-violet hover:underline"
          >
            {t.home.viewAll}
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
              {t.home.unavailableMore}
            </p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="rounded-xl border border-[color:var(--white-10)] bg-gradient-to-br from-purple-600/10 to-blue-600/10 p-5 text-center">
        <h2 className="text-base font-black text-[color:var(--text-primary)] sm:text-lg">
          🎯 {t.home.discoverThousands}
        </h2>

        <p className="mx-auto mt-1 max-w-2xl text-[10px] text-[color:var(--text-secondary)] sm:text-xs">
          {t.home.browseDescription}
        </p>

        <Link
          href={`${prefix}/games`}
          className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-nexa-violet px-4 py-2 text-xs font-bold text-[color:var(--text-primary)] transition hover:brightness-110 hover:scale-105 active:scale-95"
        >
          {t.home.exploreAllGames}
          <ArrowRight size={14} />
        </Link>
      </section>
    </main>
  )
}
