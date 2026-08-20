import type { Metadata } from 'next'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { getGames } from '@/lib/games'

export const metadata: Metadata = {
  title: 'Two Player Games – Free Online 2 Player Games | ArcadeNexa',
  description: 'Play the best two player games online free. Compete with friends on the same device. No download, no login. 29,400+ free browser games including 2 player options.',
  keywords: 'two player games, 2 player games, two player games online, 2 player games unblocked, games for two players',
  alternates: { canonical: '/two-player-games' },
}

const TWO_PLAYER_CATEGORIES = [
  { key: 'sports',   label: 'Sports',   icon: '⚽', color: 'from-cyan-400 to-blue-500' },
  { key: 'fighting', label: 'Fighting', icon: '🥊', color: 'from-rose-400 to-red-600' },
  { key: 'racing',   label: 'Racing',   icon: '🏎️', color: 'from-amber-400 to-orange-500' },
  { key: 'io',       label: '.IO',      icon: '🌐', color: 'from-emerald-400 to-teal-500' },
  { key: 'action',   label: 'Action',   icon: '⚔️', color: 'from-red-500 to-orange-500' },
  { key: 'arcade',   label: 'Arcade',   icon: '🕹️', color: 'from-pink-400 to-purple-600' },
]

export default async function TwoPlayerGamesPage() {
  const allGames = await getGames({ page: 1, limit: 200 })
  const games = allGames?.games ?? []
  const featured = games.slice(0, 12)

  const byCategory: Record<string, typeof games> = {}
  for (const cat of TWO_PLAYER_CATEGORIES) {
    byCategory[cat.key] = games
      .filter(g => g.category?.toLowerCase() === cat.key || g.genre?.includes(cat.key))
      .slice(0, 8)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1a0a2e] to-[#0a0a0f] px-4 py-16 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(168,85,247,0.15),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-400">
            <span>👥</span> Play with Friends • Same Device
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Two Player Games{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Free Online
            </span>
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-lg text-gray-300">
            Challenge a friend on the <strong className="text-white">same device</strong> or compete solo.
            ArcadeNexa has 29,400+ free browser games including the best 2 player games — no download, no login.
          </p>
          <div className="mb-8 flex flex-wrap justify-center gap-2 text-sm">
            {['2 Player Sports','Fighting Games','Racing Games','.IO Multiplayer','Same Screen','Unblocked'].map(tag => (
              <span key={tag} className="rounded-full border border-gray-700 bg-gray-800/60 px-3 py-1 text-gray-300">{tag}</span>
            ))}
          </div>
          <Link href="/games" className="inline-block rounded-xl bg-purple-500 px-8 py-3 font-bold text-white transition hover:bg-purple-400">
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
                className="group rounded-xl border border-gray-800 bg-gray-900/60 p-2 transition hover:border-purple-500/50 hover:bg-gray-800">
                <div className="mb-2 aspect-square overflow-hidden rounded-lg bg-gray-800">
                  {game.thumbnail
                    ? <img src={game.thumbnail} alt={game.title} className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
                    : <div className={`flex h-full w-full items-center justify-center text-lg font-bold ${game.gradient}`}>{game.initials}</div>
                  }
                </div>
                <p className="truncate text-xs font-medium text-gray-200">{game.title}</p>
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
                <Link href={`/categories/${cat.key}`} className="text-sm text-purple-400 hover:text-purple-300">View all →</Link>
              </div>
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
                {catGames.map(game => (
                  <Link key={game.id} href={`/games/${game.slug}`}
                    className="group rounded-xl border border-gray-800 bg-gray-900/60 p-2 transition hover:border-purple-500/50 hover:bg-gray-800">
                    <div className="mb-2 aspect-square overflow-hidden rounded-lg bg-gray-800">
                      {game.thumbnail
                        ? <img src={game.thumbnail} alt={game.title} className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
                        : <div className={`flex h-full w-full items-center justify-center text-sm font-bold ${game.gradient}`}>{game.initials}</div>
                      }
                    </div>
                    <p className="truncate text-xs text-gray-300">{game.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </section>

      {/* SEO TEXT */}
      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-8">
          <h2 className="mb-4 text-2xl font-bold">Best Two Player Games Online Free</h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>Two player games are perfect for competing with a friend or family member on the same device. ArcadeNexa offers the best selection of free 2 player browser games including sports, fighting, racing, and .IO multiplayer games.</p>
            <p>All games are <strong className="text-white">free to play with no download</strong> required. Simply open the game in your browser and start competing. Works on desktop, laptop, tablet, and mobile — including school Chromebooks.</p>
            <p>Popular two player game categories include <strong className="text-white">sports games</strong> like soccer and basketball, <strong className="text-white">fighting games</strong> for head-to-head combat, and <strong className="text-white">.IO games</strong> for multiplayer competition online.</p>
          </div>
        </div>
      </section>

    </main>
  )
}
