import type { Metadata } from 'next'
import Link from 'next/link'
import { getGames } from '@/lib/games'

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse ArcadeNexa games by category',
  alternates: { canonical: '/categories' },
}

const categoryMeta: Record<string, { desc: string, color: string, emoji: string }> = {
  'adventure':          { desc: 'Explore worlds and go on epic quests', color: 'from-teal-500/40 to-green-400/40', emoji: '🗺️' },
  'action':             { desc: 'Fast-paced action games', color: 'from-red-600/40 to-orange-500/40', emoji: '⚔️' },
  'arcade':             { desc: 'Classic arcade fun', color: 'from-pink-500/40 to-purple-500/40', emoji: '🕹️' },
  'casual':             { desc: 'Casual, fun and quick games', color: 'from-green-500/40 to-emerald-400/40', emoji: '🎯' },
  'puzzle':             { desc: 'Brain teasers and logic games', color: 'from-yellow-500/40 to-amber-400/40', emoji: '🧩' },
  'racing':             { desc: 'High-speed racing and driving', color: 'from-amber-500/40 to-orange-400/40', emoji: '🏎️' },
  'sports':             { desc: 'High-octane sports and athletics', color: 'from-cyan-500/40 to-blue-400/40', emoji: '⚽' },
  'shooter':            { desc: 'Shoot your way to victory', color: 'from-red-500/40 to-zinc-500/40', emoji: '🔫' },
  'simulation':         { desc: 'Simulation and physics games', color: 'from-sky-500/40 to-blue-400/40', emoji: '🌍' },
  'strategy':           { desc: 'Plan, build and conquer', color: 'from-indigo-500/40 to-blue-400/40', emoji: '♟️' },
  'battle':             { desc: 'Battle and defense games', color: 'from-orange-500/40 to-red-400/40', emoji: '🛡️' },
  'platformer':         { desc: 'Jump and run platform games', color: 'from-lime-500/40 to-green-400/40', emoji: '🏃' },
  'fighting':           { desc: 'Combat and fighting games', color: 'from-rose-500/40 to-red-400/40', emoji: '🥊' },
  'runner':             { desc: 'Endless runner games', color: 'from-violet-500/40 to-purple-400/40', emoji: '👟' },
  'idle':               { desc: 'Idle and clicker games', color: 'from-slate-500/40 to-gray-400/40', emoji: '💤' },
  'clicker':            { desc: 'Click your way to success', color: 'from-orange-400/40 to-yellow-400/40', emoji: '👆' },
  'hyper-casual':       { desc: 'Simple and addictive games', color: 'from-pink-400/40 to-rose-400/40', emoji: '⚡' },
  'io':                 { desc: 'Multiplayer .io games', color: 'from-emerald-500/40 to-teal-400/40', emoji: '🌐' },
  'match-3':            { desc: 'Match 3 puzzle games', color: 'from-purple-500/40 to-pink-400/40', emoji: '💎' },
  'ball':               { desc: 'Ball and physics games', color: 'from-blue-500/40 to-cyan-400/40', emoji: '⚽' },
  'car':                { desc: 'Car and driving games', color: 'from-gray-500/40 to-slate-400/40', emoji: '🚗' },
  'card':               { desc: 'Card and board games', color: 'from-red-400/40 to-pink-400/40', emoji: '🃏' },
  'board':              { desc: 'Classic board games', color: 'from-amber-600/40 to-yellow-500/40', emoji: '🎲' },
  'brain':              { desc: 'Brain training games', color: 'from-cyan-600/40 to-blue-500/40', emoji: '🧠' },
  'educational':        { desc: 'Learn while you play', color: 'from-green-600/40 to-teal-500/40', emoji: '📚' },
  'math':               { desc: 'Math and number games', color: 'from-blue-600/40 to-indigo-500/40', emoji: '🔢' },
  'memory':             { desc: 'Memory and concentration games', color: 'from-violet-600/40 to-purple-500/40', emoji: '🎭' },
  'trivia':             { desc: 'Quiz and trivia games', color: 'from-yellow-600/40 to-amber-500/40', emoji: '❓' },
  'hidden-object':      { desc: 'Find hidden objects games', color: 'from-teal-600/40 to-cyan-500/40', emoji: '🔍' },
  'animal':             { desc: 'Animal themed games', color: 'from-lime-600/40 to-green-500/40', emoji: '🐾' },
  'cats':               { desc: 'Cat themed games', color: 'from-orange-400/40 to-amber-400/40', emoji: '🐱' },
  'monster':            { desc: 'Monster and creature games', color: 'from-purple-700/40 to-violet-500/40', emoji: '👾' },
  'zombie':             { desc: 'Zombie survival games', color: 'from-green-800/40 to-lime-600/40', emoji: '🧟' },
  'stickman':           { desc: 'Stickman action games', color: 'from-gray-600/40 to-slate-500/40', emoji: '🏃' },
  'retro':              { desc: 'Classic retro games', color: 'from-amber-700/40 to-yellow-600/40', emoji: '👾' },
  'snake':              { desc: 'Snake and worm games', color: 'from-green-700/40 to-emerald-600/40', emoji: '🐍' },
  'airplane':           { desc: 'Flying and airplane games', color: 'from-sky-600/40 to-blue-500/40', emoji: '✈️' },
  'basketball':         { desc: 'Basketball games', color: 'from-orange-600/40 to-red-500/40', emoji: '🏀' },
  'golf':               { desc: 'Golf games', color: 'from-green-500/40 to-lime-400/40', emoji: '⛳' },
  'block':              { desc: 'Block and building games', color: 'from-blue-500/40 to-indigo-400/40', emoji: '🧱' },
  'building':           { desc: 'Building and construction games', color: 'from-yellow-700/40 to-amber-600/40', emoji: '🏗️' },
  'farming':            { desc: 'Farming and management games', color: 'from-lime-500/40 to-green-500/40', emoji: '🌾' },
  'drawing':            { desc: 'Drawing and creative games', color: 'from-pink-500/40 to-rose-400/40', emoji: '🎨' },
  'robots':             { desc: 'Robot and sci-fi games', color: 'from-slate-600/40 to-gray-500/40', emoji: '🤖' },
  'fun':                { desc: 'Fun and entertaining games', color: 'from-yellow-400/40 to-orange-400/40', emoji: '😄' },
  'games-for-girls':    { desc: 'Games for girls', color: 'from-pink-600/40 to-rose-500/40', emoji: '👑' },
  '2048':               { desc: '2048 and number puzzle games', color: 'from-orange-500/40 to-amber-400/40', emoji: '🔢' },
  'first-person-shooter': { desc: 'First person shooter games', color: 'from-red-700/40 to-orange-600/40', emoji: '🎯' },
  'christmas':          { desc: 'Christmas and holiday games', color: 'from-red-500/40 to-green-500/40', emoji: '🎄' },
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
        {games.length} games across {filters.length} categories
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filters.map(filter => {
          const meta = categoryMeta[filter]
          const count = games.filter(g =>
            g.genreFilter?.toLowerCase() === filter.toLowerCase() ||
            g.category?.toLowerCase() === filter.toLowerCase()
          ).length

          return (
            <Link key={filter} href={`/games?genre=${encodeURIComponent(filter)}`}
              className="group rounded-2xl overflow-hidden border border-white/10 hover:border-electric-violet/50 transition-all hover:scale-[1.02] block shadow-lg">
              <div className={`h-20 bg-gradient-to-br ${meta.color} flex items-center justify-center`}>
                <span className="text-4xl">{meta.emoji}</span>
              </div>
              <div className="p-4 bg-elevated">
                <h3 className="text-white font-bold capitalize group-hover:text-electric-violet transition-colors text-sm">
                  {filter.replace(/-/g, ' ')}
                </h3>
                <span className="text-neon-green text-xs font-bold">{count} games</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
