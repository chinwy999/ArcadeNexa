import type { Metadata } from 'next'
import Link from 'next/link'
import { getGames } from '@/lib/games'

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse ArcadeNexa games by category',
  alternates: { canonical: '/categories' },
}

const categoryMeta: Record<string, { desc: string, color: string, emoji: string, image: string }> = {
  Action:     { desc: 'Fast-paced action and adventure games', color: 'from-red-600/40 to-orange-500/40', emoji: '⚔️', image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&q=80' },
  Casual:     { desc: 'Casual, fun and quick games', color: 'from-green-500/40 to-emerald-400/40', emoji: '🎯', image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&q=80' },
  Puzzle:     { desc: 'Brain teasers, logic and meme puzzles', color: 'from-yellow-500/40 to-amber-400/40', emoji: '🧩', image: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400&q=80' },
  Racing:     { desc: 'High-speed racing, driving and hill climb', color: 'from-amber-500/40 to-orange-400/40', emoji: '🏎️', image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&q=80' },
  Sports:     { desc: 'High-octane sports and athletics', color: 'from-cyan-500/40 to-blue-400/40', emoji: '⚽', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80' },
  Shooter:    { desc: 'Shooter games from GamePix', color: 'from-red-500/40 to-zinc-500/40', emoji: '🔫', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80' },
  Simulation: { desc: 'Simulation and physics games', color: 'from-sky-500/40 to-blue-400/40', emoji: '🌍', image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&q=80' },
  Strategy:   { desc: 'Plan, build and conquer', color: 'from-indigo-500/40 to-blue-400/40', emoji: '♟️', image: 'https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=400&q=80' },
  Adventure:  { desc: 'Explore worlds and go on epic quests', color: 'from-teal-500/40 to-green-400/40', emoji: '🗺️', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80' },
  Battle:     { desc: 'Battle and defense strategy', color: 'from-orange-500/40 to-red-400/40', emoji: '🛡️', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80' },
}

export default async function CategoriesPage() {
  const games = await getGames()

  const filters = Object.keys(categoryMeta).filter(cat =>
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

          return (
            <Link key={filter} href={`/games?genre=${encodeURIComponent(filter)}`}
              className="group rounded-2xl overflow-hidden border border-white/10 hover:border-electric-violet/50 transition-all hover:scale-[1.02] block shadow-lg">
              <div className="relative h-36 overflow-hidden">
                <img
                  src={meta.image}
                  alt={filter}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${meta.color}`} />
                <div className="absolute inset-0 bg-black/30" />
                <span className="absolute top-3 left-4 text-4xl">{meta.emoji}</span>
                <span className="absolute bottom-3 right-4 text-white/20 text-3xl font-black tracking-wider">{filter}</span>
              </div>
              <div className="p-5 bg-elevated">
                <h3 className="text-xl font-black text-white group-hover:text-electric-violet transition-colors">{filter}</h3>
                <p className="text-text-secondary text-sm mt-1 line-clamp-2">{meta.desc}</p>
                <div className="mt-3">
                  <span className="text-neon-green text-xs font-bold bg-neon-green/10 px-3 py-1 rounded-full border border-neon-green/20">
                    {count} games
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
