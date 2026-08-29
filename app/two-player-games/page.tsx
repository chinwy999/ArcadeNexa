import type { Metadata } from 'next'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { getGames } from '@/lib/games'
import SafeImage from '@/components/SafeImage'

export const metadata: Metadata = {
  title: 'Two Player Games – Free Online 2 Player Games | ArcadeNexa',
  description: 'Play the best two player games online free. Compete with friends on the same device. No download, no login. 15,000+ free browser games including 2 player options.',
  keywords: 'two player games, 2 player games, two player games online, 2 player games unblocked, games for two players',
  alternates: { canonical: '/two-player-games' },
}

const TWO_PLAYER_CATEGORIES = [
  { key: 'sports',   label: 'Sports',   icon: '⚽', color: 'from-nexa-cyan to-nexa-blue' },
  { key: 'fighting', label: 'Fighting', icon: '🥊', color: 'from-nexa-emerald to-nexa-blue' },
  { key: 'racing',   label: 'Racing',   icon: '🏎️', color: 'from-amber-400 to-orange-500' },
  { key: 'io',       label: '.IO',      icon: '🌐', color: 'from-nexa-emerald to-nexa-cyan' },
  { key: 'action',   label: 'Action',   icon: '⚔️', color: 'from-red-500 to-orange-500' },
  { key: 'arcade',   label: 'Arcade',   icon: '🕹️', color: 'from-nexa-cyan to-nexa-blue' },
]

export default async function TwoPlayerGamesPage() {
  const allGames = await getGames()
  const games = allGames
  const featured = games.slice(0, 12)

  const byCategory: Record<string, typeof games> = {}
  for (const cat of TWO_PLAYER_CATEGORIES) {
    byCategory[cat.key] = games
      .filter(g => g.category?.toLowerCase() === cat.key || g.genre?.includes(cat.key))
      .slice(0, 8)
  }

  return (
    <main className="min-h-screen bg-nexa-black text-[color:var(--text-primary)]">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-nexa-violet/30 to-nexa-black px-4 py-16 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(168,85,247,0.15),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-nexa-violet/30 bg-nexa-violet/10 px-4 py-1.5 text-sm text-nexa-violet">
            <span>👥</span> Play with Friends • Same Device
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Two Player Games{' '}
            <span className="bg-gradient-to-r from-nexa-cyan to-nexa-blue bg-clip-text text-transparent">
              Free Online
            </span>
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-lg text-[color:var(--text-secondary)]">
            Challenge a friend on the <strong className="text-[color:var(--text-primary)]">same device</strong> or compete solo.
            ArcadeNexa has 15,000+ free browser games including the best 2 player games — no download, no login.
          </p>
          <div className="mb-8 flex flex-wrap justify-center gap-2 text-sm">
            {['2 Player Sports','Fighting Games','Racing Games','.IO Multiplayer','Same Screen','Unblocked'].map(tag => (
              <span key={tag} className="rounded-full border border-nexa-violet/25 bg-nexa-surface/60 px-3 py-1 text-[color:var(--text-secondary)]">{tag}</span>
            ))}
          </div>
          <Link href="/games" className="inline-block rounded-xl bg-nexa-violet px-8 py-3 font-bold text-[color:var(--text-primary)] transition hover:bg-nexa-violet">
            Browse All Games →
          </Link>
        </div>
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="mb-6 text-2xl font-bold">🔥 Popular 2 Player Games</h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {featured.map(game => (
              <Link key={game.id} href={`/games/${game.slug}`}
                className="group rounded-xl border border-nexa-violet/20 bg-nexa-black/60 p-2 transition hover:border-nexa-violet/50 hover:bg-nexa-surface">
                <div className="relative mb-2 aspect-square overflow-hidden rounded-lg bg-nexa-surface">
                  {game.thumbnail
                    ? <SafeImage
                          src={game.thumbnail}
                          alt={game.title}
                          className="object-cover transition group-hover:scale-105"
                          sizes="(max-width: 640px) 33vw, 16vw"
                        />
                    : <div className={`flex h-full w-full items-center justify-center text-lg font-bold ${game.gradient}`}>{game.initials}</div>
                  }
                </div>
                <p className="truncate text-xs font-medium text-[color:var(--text-secondary)]">{game.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* BY CATEGORY */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="mb-8 text-2xl font-bold">🎮 2 Player Games by Category</h2>
        {TWO_PLAYER_CATEGORIES.map(cat => {
          const catGames = byCategory[cat.key] ?? []
          if (catGames.length === 0) return null
          return (
            <div key={cat.key} className="mb-12">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-xl font-bold">
                  <span>{cat.icon}</span><span>2 Player {cat.label} Games</span>
                </h3>
                <Link href={`/categories/${cat.key}`} className="text-sm text-nexa-violet hover:text-nexa-violet">View all →</Link>
              </div>
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
                {catGames.map(game => (
                  <Link key={game.id} href={`/games/${game.slug}`}
                    className="group rounded-xl border border-nexa-violet/20 bg-nexa-black/60 p-2 transition hover:border-nexa-violet/50 hover:bg-nexa-surface">
                    <div className="relative mb-2 aspect-square overflow-hidden rounded-lg bg-nexa-surface">
                      {game.thumbnail
                        ? <SafeImage
                          src={game.thumbnail}
                          alt={game.title}
                          className="object-cover transition group-hover:scale-105"
                          sizes="(max-width: 640px) 33vw, 16vw"
                        />
                        : <div className={`flex h-full w-full items-center justify-center text-sm font-bold ${game.gradient}`}>{game.initials}</div>
                      }
                    </div>
                    <p className="truncate text-xs text-[color:var(--text-secondary)]">{game.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </section>

      {/* SEO TEXT */}
      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-2xl border border-nexa-violet/20 bg-nexa-black/40 p-8">
          <h2 className="mb-4 text-2xl font-bold">Best Two Player Games Online Free</h2>
          <div className="space-y-4 text-[color:var(--text-secondary)] leading-relaxed">
            <p>Two player games are perfect for competing with a friend or family member on the same device. ArcadeNexa offers the best selection of free 2 player browser games including sports, fighting, racing, and .IO multiplayer games.</p>
            <p>All games are <strong className="text-[color:var(--text-primary)]">free to play with no download</strong> required. Simply open the game in your browser and start competing. Works on desktop, laptop, tablet, and mobile — including school Chromebooks.</p>
            <p>Popular two player game categories include <strong className="text-[color:var(--text-primary)]">sports games</strong> like soccer and basketball, <strong className="text-[color:var(--text-primary)]">fighting games</strong> for head-to-head combat, and <strong className="text-[color:var(--text-primary)]">.IO games</strong> for multiplayer competition online.</p>
          </div>
        </div>
      </section>

    </main>
  )
}
