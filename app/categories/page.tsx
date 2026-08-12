import type { Metadata } from 'next'
import Link from 'next/link'
import { getGames, getAllGenreFilters } from '@/lib/games'

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse ArcadeNexa games by category',
  alternates: { canonical: '/categories' },
}

const categoryMeta: Record<string, { desc: string, color: string }> = {
  FPS: { desc: 'Tactical and classic first-person shooters where aim and strategy win', color: 'from-rose-500/20 to-orange-500/20' },
  MOBA: { desc: 'Team-based strategic battle arenas with deep mechanics', color: 'from-blue-500/20 to-cyan-500/20' },
  'Battle Royale': { desc: 'Last player standing — loot, survive, dominate', color: 'from-purple-500/20 to-pink-500/20' },
  Sports: { desc: 'High-octane sports, soccer and racing action', color: 'from-cyan-500/20 to-blue-500/20' },
  Racing: { desc: 'High-speed racing, driving, boat and hill climb', color: 'from-amber-500/20 to-orange-500/20' },
  Puzzle: { desc: 'Brain teasers, logic and meme puzzles', color: 'from-yellow-500/20 to-amber-500/20' },
  Shooter: { desc: 'Shooter games from GamePix', color: 'from-red-500/20 to-zinc-500/20' },
  Simulation: { desc: 'Simulation and physics games', color: 'from-sky-500/20 to-blue-500/20' },
  Battle: { desc: 'Battle and defense strategy', color: 'from-orange-500/20 to-red-500/20' },
  Casual: { desc: 'Casual, fun and quick games', color: 'from-green-500/20 to-emerald-500/20' },
  Action: { desc: 'Fast-paced action and adventure games', color: 'from-red-500/20 to-orange-500/20' },
  Adventure: { desc: 'Explore worlds and go on epic quests', color: 'from-teal-500/20 to-green-500/20' },
  Strategy: { desc: 'Plan, build and conquer', color: 'from-indigo-500/20 to-blue-500/20' },
  Sports: { desc: 'High-octane sports and athletics', color: 'from-cyan-500/20 to-blue-500/20' },
}

export default async function CategoriesPage() {
  const games = await getGames()

  // استخدام فقط الفئات المعرّفة في categoryMeta
  const definedCategories = Object.keys(categoryMeta)

  // تطابق بدون حساسية لحالة الأحرف
  const filters = definedCategories.filter(cat =>
    games.some(g =>
      g.genreFilter?.toLowerCase() === cat.toLowerCase() ||
      g.category?.toLowerCase() === cat.toLowerCase()
    )
  )

  return (
    <div className="py-20 px-4 sm:px-6 max-w-6xl mx-auto animate-fade-in">
      <h1 className="text-5xl font-black text-white mb-4">Categories</h1>
      <p className="text-text-secondary text-lg mb-10">
        Choose your battlefield type — {games.length} games across {filters.length} categories
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filters.map(filter => {
          const meta = categoryMeta[filter]
          const count = games.filter(g =>
            g.genreFilter?.toLowerCase() === filter.toLowerCase() ||
            g.category?.toLowerCase() === filter.toLowerCase()
          ).length
          const gamePixCount = games.filter(g =>
            (g.genreFilter?.toLowerCase() === filter.toLowerCase() ||
            g.category?.toLowerCase() === filter.toLowerCase()) &&
            g.provider === 'gamepix'
          ).length
          const selfCount = count - gamePixCount

          return (
            <Link key={filter} href={`/games?genre=${encodeURIComponent(filter)}`} className="group glass rounded-2xl overflow-hidden border border-white/5 hover:border-electric-violet/40 transition-all hover:scale-[1.02] block">
              <div className={`h-24 bg-gradient-to-br ${meta.color} flex items-center justify-center`}>
                <span className="text-2xl font-black text-white/40 tracking-wider">{filter}</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black text-white group-hover:text-electric-violet transition-colors">{filter}</h3>
                <p className="text-text-secondary text-sm mt-2 line-clamp-2">{meta.desc}</p>
                <div className="flex gap-2 mt-4">
                  <span className="text-neon-green text-xs font-bold bg-neon-green/10 px-3 py-1 rounded-full border border-neon-green/20">{count} games</span>
                  {gamePixCount > 0 && <span className="text-blue-400 text-[10px] bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20">{gamePixCount} GamePix</span>}
                  {selfCount > 0 && <span className="text-zinc-400 text-[10px] bg-white/5 px-2 py-1 rounded-full">{selfCount} SELF</span>}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-4">All Games by Category</h2>
        {filters.map(filter => {
          const categoryGames = games.filter(g =>
            g.genreFilter?.toLowerCase() === filter.toLowerCase() ||
            g.category?.toLowerCase() === filter.toLowerCase()
          )
          return (
            <div key={filter} className="mb-8">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                {filter} <span className="text-xs text-text-secondary font-normal">({categoryGames.length})</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {categoryGames.map(g => (
                  <Link key={g.slug} href={`/games/${g.slug}`} className="bg-elevated border border-white/10 hover:border-electric-violet/30 text-white px-4 py-2 rounded-full text-sm transition flex items-center gap-2">
                    {g.name}
                    {g.provider === 'gamepix' && <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-full">GamePix</span>}
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
