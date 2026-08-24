import type { Metadata } from 'next'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { getGames } from '@/lib/games'

export const metadata: Metadata = {
  title: 'Games for Girls – Free Online Girl Games | ArcadeNexa',
  description: 'Play the best free games for girls online. Fashion, puzzle, casual, cooking and more. No download, no login. 13,000+ free browser games for girls of all ages.',
  keywords: 'games for girls, girl games, free girl games online, games for girls free, fun games for girls',
  alternates: { canonical: '/games-for-girls' },
}

const GIRL_CATEGORIES = [
  { key: 'puzzle',   label: 'Puzzle',      icon: '🧩', color: 'from-yellow-400 to-amber-500' },
  { key: 'casual',   label: 'Casual',      icon: '🎯', color: 'from-pink-400 to-rose-500' },
  { key: 'match-3',  label: 'Match 3',     icon: '💎', color: 'from-purple-400 to-pink-500' },
  { key: 'brain',    label: 'Brain',       icon: '🧠', color: 'from-cyan-500 to-blue-600' },
  { key: 'memory',   label: 'Memory',      icon: '🎭', color: 'from-violet-500 to-purple-600' },
  { key: 'educational', label: 'Educational', icon: '📚', color: 'from-green-500 to-teal-600' },
]

export default async function GamesForGirlsPage() {
  const allGames = await getGames()
  const games = allGames
  const featured = games.slice(0, 12)

  const byCategory: Record<string, typeof games> = {}
  for (const cat of GIRL_CATEGORIES) {
    byCategory[cat.key] = games
      .filter(g => g.category?.toLowerCase() === cat.key || g.genre?.includes(cat.key))
      .slice(0, 8)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">

      <section className="relative overflow-hidden bg-gradient-to-b from-[#1a0a1e] to-[#0a0a0f] px-4 py-16 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(236,72,153,0.15),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-sm text-pink-400">
            <span>💖</span> Free • No Login • Play Instantly
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Fun Games for{' '}
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Girls
            </span>
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-lg text-gray-300">
            Discover <strong className="text-white">13,000+ free games</strong> including puzzle, casual, match-3, memory, and brain games. Play instantly in your browser — no download, no login required.
          </p>
          <div className="mb-8 flex flex-wrap justify-center gap-2 text-sm">
            {['Puzzle Games','Match 3','Casual Games','Brain Games','Memory','Educational','Free Forever'].map(tag => (
              <span key={tag} className="rounded-full border border-gray-700 bg-gray-800/60 px-3 py-1 text-gray-300">{tag}</span>
            ))}
          </div>
          <Link href="/games" className="inline-block rounded-xl bg-pink-500 px-8 py-3 font-bold text-white transition hover:bg-pink-400">
            Browse All Games →
          </Link>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="mb-6 text-2xl font-bold">💖 Popular Games for Girls</h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {featured.map(game => (
              <Link key={game.id} href={`/games/${game.slug}`}
                className="group rounded-xl border border-gray-800 bg-gray-900/60 p-2 transition hover:border-pink-500/50 hover:bg-gray-800">
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

      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="mb-8 text-2xl font-bold">🎮 Games by Category</h2>
        {GIRL_CATEGORIES.map(cat => {
          const catGames = byCategory[cat.key] ?? []
          if (catGames.length === 0) return null
          return (
            <div key={cat.key} className="mb-12">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-xl font-bold">
                  <span>{cat.icon}</span><span>Free {cat.label} Games</span>
                </h3>
                <Link href={`/categories/${cat.key}`} className="text-sm text-pink-400 hover:text-pink-300">View all →</Link>
              </div>
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
                {catGames.map(game => (
                  <Link key={game.id} href={`/games/${game.slug}`}
                    className="group rounded-xl border border-gray-800 bg-gray-900/60 p-2 transition hover:border-pink-500/50 hover:bg-gray-800">
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

      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-8">
          <h2 className="mb-4 text-2xl font-bold">Best Free Online Games for Girls</h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>ArcadeNexa offers a huge collection of free online games perfect for girls of all ages. From relaxing puzzle and match-3 games to brain training and educational games, there is something for everyone.</p>
            <p>All games are <strong className="text-white">completely free</strong> with no download or login required. Simply open your browser on any device — phone, tablet, laptop, or Chromebook — and start playing instantly.</p>
            <p>Popular categories include <strong className="text-white">match-3 puzzle games</strong>, casual games for quick fun, memory and brain games for a mental challenge, and educational games that make learning enjoyable.</p>
          </div>
        </div>
      </section>

    </main>
  )
}
