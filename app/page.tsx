import { getGames } from '@/lib/games'
import GameCard from '@/components/GameCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const categoryMeta: Record<string, { emoji: string, color: string }> = {
  Action:     { emoji: '⚔️', color: 'from-red-500 to-orange-500' },
  Casual:     { emoji: '🎯', color: 'from-green-500 to-emerald-400' },
  Puzzle:     { emoji: '🧩', color: 'from-yellow-500 to-amber-400' },
  Racing:     { emoji: '🏎️', color: 'from-amber-500 to-orange-400' },
  Sports:     { emoji: '⚽', color: 'from-cyan-500 to-blue-400' },
  Shooter:    { emoji: '🔫', color: 'from-red-500 to-zinc-500' },
  Simulation: { emoji: '🌍', color: 'from-sky-500 to-blue-400' },
  Strategy:   { emoji: '♟️', color: 'from-indigo-500 to-blue-400' },
  Adventure:  { emoji: '🗺️', color: 'from-teal-500 to-green-400' },
  Battle:     { emoji: '🛡️', color: 'from-orange-500 to-red-400' },
}

export default async function HomePage() {
  const games = await getGames()

  // أفضل الألعاب تقييماً
  const featuredGames = [...games]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8)

  // أحدث الألعاب
  const newGames = [...games]
    .sort((a, b) => b.releaseYear - a.releaseYear)
    .slice(0, 4)

  // الفئات المتاحة
  const availableCategories = Object.keys(categoryMeta).filter(cat =>
    games.some(g =>
      g.genreFilter?.toLowerCase() === cat.toLowerCase() ||
      g.category?.toLowerCase() === cat.toLowerCase()
    )
  )

  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-electric-violet/20 via-transparent to-neon-green/10 pointer-events-none" />
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-block bg-neon-green/10 border border-neon-green/30 text-neon-green text-sm font-bold px-4 py-2 rounded-full mb-6">
            🎮 {games.length}+ Free HTML5 Games
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-6 bg-gradient-to-r from-neon-green via-cyan-400 to-electric-violet bg-clip-text text-transparent">
            ARCADENEXA
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            The ultimate HTML5 gaming platform. No download, no registration — just instant play.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/games" className="bg-neon-green text-space-black px-8 py-4 rounded-xl font-black text-lg hover:opacity-90 transition-all hover:scale-105">
              PLAY NOW →
            </Link>
            <Link href="/categories" className="border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all">
              Browse Categories
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto">
            <div className="text-center">
              <p className="text-3xl font-black text-neon-green">{games.length}+</p>
              <p className="text-gray-400 text-sm">Games</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-electric-violet">{availableCategories.length}</p>
              <p className="text-gray-400 text-sm">Categories</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-cyan-400">Free</p>
              <p className="text-gray-400 text-sm">Forever</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Categories</h2>
            <Link href="/categories" className="text-neon-green hover:underline text-sm">View All</Link>
          </div>
          <div className="flex gap-3 flex-wrap">
            {availableCategories.map(cat => {
              const meta = categoryMeta[cat]
              return (
                <Link key={cat} href={`/games?genre=${encodeURIComponent(cat)}`}
                  className={`bg-gradient-to-r ${meta.color} text-white px-5 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-all shadow-lg`}>
                  {meta.emoji} {cat}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">⭐ Top Rated Games</h2>
              <p className="text-gray-400 text-sm mt-1">Best games picked for you</p>
            </div>
            <Link href="/games" className="text-neon-green hover:underline text-sm">
              View All ({games.length})
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGames.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        </div>
      </section>

      {/* New Games */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">🆕 New Games</h2>
              <p className="text-gray-400 text-sm mt-1">Fresh additions to the arena</p>
            </div>
            <Link href="/games" className="text-neon-green hover:underline text-sm">See More</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newGames.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-electric-violet/20 to-neon-green/20 border border-white/10 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-black text-white mb-4">Ready to Play?</h2>
            <p className="text-gray-400 mb-8">Join thousands of players on ArcadeNexa. No signup needed.</p>
            <Link href="/games" className="bg-neon-green text-space-black px-10 py-4 rounded-xl font-black text-lg hover:opacity-90 transition-all hover:scale-105 inline-block">
              START PLAYING →
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
