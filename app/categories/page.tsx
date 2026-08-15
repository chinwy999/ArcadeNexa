import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse ArcadeNexa games by category',
  alternates: { canonical: '/categories' },
}

const categoryMeta: Record<string, { desc: string; gradient: string; bg: string; icon: string; image?: string }> = {
  'adventure':          { image: '/images/categories/adventure.webp', desc: 'Explore worlds & epic quests',    gradient: 'from-teal-400 to-green-500',      bg: 'from-teal-500/20 to-green-500/10',      icon: '🗺️' },
  'action':             { image: '/images/categories/action.webp', desc: 'Fast-paced action games',         gradient: 'from-red-400 to-orange-500',      bg: 'from-red-500/20 to-orange-500/10',      icon: '⚔️' },
  'arcade':             { image: '/images/categories/arcade.webp', desc: 'Classic arcade fun',              gradient: 'from-pink-400 to-purple-600',     bg: 'from-pink-500/20 to-purple-500/10',     icon: '🕹️' },
  'casual':             { image: '/images/categories/casual.webp', desc: 'Fun and quick games',             gradient: 'from-green-400 to-emerald-500',   bg: 'from-green-500/20 to-emerald-500/10',   icon: '🎯' },
  'puzzle':             { image: '/images/categories/puzzle.webp', desc: 'Brain teasers & logic',           gradient: 'from-yellow-400 to-amber-500',    bg: 'from-yellow-500/20 to-amber-500/10',    icon: '🧩' },
  'racing':             { image: '/images/categories/racing.webp', desc: 'High-speed racing',               gradient: 'from-amber-400 to-orange-500',   bg: 'from-amber-500/20 to-orange-500/10',   icon: '🏎️' },
  'sports':             { image: '/images/categories/sports.webp', desc: 'Sports & athletics',              gradient: 'from-cyan-400 to-blue-500',       bg: 'from-cyan-500/20 to-blue-500/10',       icon: '⚽' },
  'shooter':            { image: '/images/categories/shooter.webp', desc: 'Shoot your way to victory',       gradient: 'from-red-500 to-zinc-600',        bg: 'from-red-500/20 to-zinc-500/10',        icon: '🔫' },
  'simulation':         { image: '/images/categories/simulation.webp', desc: 'Simulation & physics',            gradient: 'from-sky-400 to-blue-500',        bg: 'from-sky-500/20 to-blue-500/10',        icon: '🌍' },
  'strategy':           { image: '/images/categories/strategy.webp', desc: 'Plan, build & conquer',           gradient: 'from-indigo-400 to-blue-600',     bg: 'from-indigo-500/20 to-blue-500/10',     icon: '♟️' },
  'battle':             { image: '/images/categories/battle.webp', desc: 'Battle & defense',                gradient: 'from-orange-400 to-red-500',      bg: 'from-orange-500/20 to-red-500/10',      icon: '🛡️' },
  'platformer':         { image: '/images/categories/platformer.webp', desc: 'Jump & run platform games',       gradient: 'from-lime-400 to-green-500',      bg: 'from-lime-500/20 to-green-500/10',      icon: '🏃' },
  'fighting':           { image: '/images/categories/fighting.webp', desc: 'Combat & fighting',               gradient: 'from-rose-400 to-red-600',        bg: 'from-rose-500/20 to-red-500/10',        icon: '🥊' },
  'runner':             { image: '/images/categories/runner.webp', desc: 'Endless runner games',            gradient: 'from-violet-400 to-purple-600',   bg: 'from-violet-500/20 to-purple-500/10',   icon: '👟' },
  'idle':               { image: '/images/categories/idle.webp', desc: 'Idle & clicker games',            gradient: 'from-slate-400 to-gray-600',      bg: 'from-slate-500/20 to-gray-500/10',      icon: '💤' },
  'clicker':            { image: '/images/categories/clicker.webp', desc: 'Click your way to success',       gradient: 'from-orange-300 to-yellow-500',   bg: 'from-orange-500/20 to-yellow-500/10',   icon: '👆' },
  'hyper-casual':       { image: '/images/categories/hyper-casual.webp', desc: 'Simple & addictive',              gradient: 'from-pink-400 to-rose-500',       bg: 'from-pink-500/20 to-rose-500/10',       icon: '⚡' },
  'io':                 { image: '/images/categories/io.webp', desc: 'Multiplayer .io games',           gradient: 'from-emerald-400 to-teal-500',    bg: 'from-emerald-500/20 to-teal-500/10',    icon: '🌐' },
  'match-3':            { image: '/images/categories/match-3.webp', desc: 'Match 3 puzzle games',            gradient: 'from-purple-400 to-pink-500',     bg: 'from-purple-500/20 to-pink-500/10',     icon: '💎' },
  'ball':               { image: '/images/categories/ball.webp', desc: 'Ball & physics games',            gradient: 'from-blue-400 to-cyan-500',       bg: 'from-blue-500/20 to-cyan-500/10',       icon: '🎱' },
  'car':                { image: '/images/categories/car.webp', desc: 'Car & driving games',             gradient: 'from-gray-400 to-slate-600',      bg: 'from-gray-500/20 to-slate-500/10',      icon: '🚗' },
  'card':               { image: '/images/categories/card.webp', desc: 'Card & board games',              gradient: 'from-red-400 to-pink-500',        bg: 'from-red-500/20 to-pink-500/10',        icon: '🃏' },
  'board':              { image: '/images/categories/board.webp', desc: 'Classic board games',             gradient: 'from-amber-500 to-yellow-600',    bg: 'from-amber-500/20 to-yellow-500/10',    icon: '🎲' },
  'brain':              { image: '/images/categories/brain.webp', desc: 'Brain training games',            gradient: 'from-cyan-500 to-blue-600',       bg: 'from-cyan-500/20 to-blue-500/10',       icon: '🧠' },
  'educational':        { image: '/images/categories/educational.webp', desc: 'Learn while you play',            gradient: 'from-green-500 to-teal-600',      bg: 'from-green-500/20 to-teal-500/10',      icon: '📚' },
  'math':               { image: '/images/categories/math.webp', desc: 'Math & number games',             gradient: 'from-blue-500 to-indigo-600',     bg: 'from-blue-500/20 to-indigo-500/10',     icon: '🔢' },
  'memory':             { image: '/images/categories/memory.webp', desc: 'Memory & concentration',          gradient: 'from-violet-500 to-purple-600',   bg: 'from-violet-500/20 to-purple-500/10',   icon: '🎭' },
  'trivia':             { image: '/images/categories/trivia.webp', desc: 'Quiz & trivia games',             gradient: 'from-yellow-500 to-amber-600',    bg: 'from-yellow-500/20 to-amber-500/10',    icon: '❓' },
  'hidden-object':      { image: '/images/categories/hidden-object.webp', desc: 'Find hidden objects',             gradient: 'from-teal-500 to-cyan-600',       bg: 'from-teal-500/20 to-cyan-500/10',       icon: '🔍' },
  'animal':             { image: '/images/categories/animal.webp', desc: 'Animal themed games',             gradient: 'from-lime-500 to-green-600',      bg: 'from-lime-500/20 to-green-500/10',      icon: '🐾' },
  'cats':               { image: '/images/categories/cats.webp', desc: 'Cat themed games',                gradient: 'from-orange-300 to-amber-500',    bg: 'from-orange-500/20 to-amber-500/10',    icon: '🐱' },
  'monster':            { image: '/images/categories/monster.webp', desc: 'Monster & creature games',        gradient: 'from-purple-600 to-violet-700',   bg: 'from-purple-500/20 to-violet-500/10',   icon: '👾' },
  'zombie':             { image: '/images/categories/zombie.webp', desc: 'Zombie survival games',           gradient: 'from-green-700 to-lime-600',      bg: 'from-green-700/20 to-lime-500/10',      icon: '🧟' },
  'stickman':           { image: '/images/categories/runner.webp', desc: 'Stickman action games',           gradient: 'from-gray-500 to-slate-600',      bg: 'from-gray-500/20 to-slate-500/10',      icon: '🏃' },
  'retro':              { image: '/images/categories/arcade.webp', desc: 'Classic retro games',             gradient: 'from-amber-600 to-yellow-700',    bg: 'from-amber-500/20 to-yellow-500/10',    icon: '🎮' },
  'snake':              { image: '/images/categories/io.webp', desc: 'Snake & worm games',              gradient: 'from-green-600 to-emerald-700',   bg: 'from-green-500/20 to-emerald-500/10',   icon: '🐍' },
  'airplane':           { image: '/images/categories/flying.webp', desc: 'Flying & airplane games',         gradient: 'from-sky-500 to-blue-600',        bg: 'from-sky-500/20 to-blue-500/10',        icon: '✈️' },
  'basketball':         { image: '/images/categories/sports.webp', desc: 'Basketball games',                gradient: 'from-orange-500 to-red-600',      bg: 'from-orange-500/20 to-red-500/10',      icon: '🏀' },
  'golf':               { image: '/images/categories/ball.webp', desc: 'Golf games',                      gradient: 'from-green-400 to-lime-500',      bg: 'from-green-500/20 to-lime-500/10',      icon: '⛳' },
  'block':              { image: '/images/categories/puzzle.webp', desc: 'Block & building games',          gradient: 'from-blue-400 to-indigo-500',     bg: 'from-blue-500/20 to-indigo-500/10',     icon: '🧱' },
  'building':           { image: '/images/categories/sandbox.webp', desc: 'Building & construction',         gradient: 'from-yellow-600 to-amber-700',    bg: 'from-yellow-500/20 to-amber-500/10',    icon: '🏗️' },
  'farming':            { image: '/images/categories/farming.webp', desc: 'Farming & management',            gradient: 'from-lime-400 to-green-600',      bg: 'from-lime-500/20 to-green-500/10',      icon: '🌾' },
  'drawing':            { image: '/images/categories/hyper-casual.webp', desc: 'Drawing & creative games',        gradient: 'from-pink-400 to-rose-500',       bg: 'from-pink-500/20 to-rose-500/10',       icon: '🎨' },
  'robots':             { image: '/images/categories/space.webp', desc: 'Robot & sci-fi games',            gradient: 'from-slate-500 to-gray-600',      bg: 'from-slate-500/20 to-gray-500/10',      icon: '🤖' },
  'fun':                { image: '/images/categories/clicker.webp', desc: 'Fun & entertaining games',        gradient: 'from-yellow-400 to-orange-500',   bg: 'from-yellow-500/20 to-orange-500/10',   icon: '😄' },
  'games-for-girls':    { image: '/images/categories/beauty-dress-up.webp', desc: 'Games for girls',                 gradient: 'from-pink-500 to-rose-600',       bg: 'from-pink-500/20 to-rose-500/10',       icon: '👑' },
  '2048':               { image: '/images/categories/math.webp', desc: '2048 & number puzzles',           gradient: 'from-orange-400 to-amber-500',    bg: 'from-orange-500/20 to-amber-500/10',    icon: '🔢' },
  'first-person-shooter': { image: '/images/categories/shooter.webp', desc: 'First person shooter',         gradient: 'from-red-600 to-orange-700',      bg: 'from-red-500/20 to-orange-500/10',      icon: '🎯' },
  'christmas':          { image: '/images/categories/tycoon.webp', desc: 'Christmas & holiday games',       gradient: 'from-red-500 to-green-600',       bg: 'from-red-500/20 to-green-500/10',       icon: '🎄' },
}

const categoryImages: Record<string, string> = {
  'action': '/images/categories/action.webp',
  'adventure': '/images/categories/adventure.webp',
  'air-combat': '/images/categories/air-combat.webp',
  'arcade': '/images/categories/arcade.webp',
  'ball': '/images/categories/ball.webp',
  'battle': '/images/categories/battle.webp',
  'beauty-dress-up': '/images/categories/beauty-dress-up.webp',
  'bike': '/images/categories/bike.webp',
  'board': '/images/categories/board.webp',
  'boat': '/images/categories/boat.webp',
  'brain': '/images/categories/brain.webp',
  'car': '/images/categories/car.webp',
  'card': '/images/categories/card.webp',
  'casual': '/images/categories/casual.webp',
  'clicker': '/images/categories/clicker.webp',
  'cooking': '/images/categories/cooking.webp',
  'educational': '/images/categories/educational.webp',
  'farming': '/images/categories/farming.webp',
  'fighting': '/images/categories/fighting.webp',
  'flying': '/images/categories/flying.webp',
  'hidden-object': '/images/categories/hidden-object.webp',
  'horror': '/images/categories/horror.webp',
  'hyper-casual': '/images/categories/hyper-casual.webp',
  'idle': '/images/categories/idle.webp',
  'io': '/images/categories/io.webp',
  'match-3': '/images/categories/match-3.webp',
  'math': '/images/categories/math.webp',
  'memory': '/images/categories/memory.webp',
  'mmorpg': '/images/categories/mmorpg.webp',
  'open-world': '/images/categories/open-world.webp',
  'platformer': '/images/categories/platformer.webp',
  'puzzle': '/images/categories/puzzle.webp',
  'quiz': '/images/categories/quiz.webp',
  'racing': '/images/categories/racing.webp',
  'rpg': '/images/categories/rpg.webp',
  'runner': '/images/categories/runner.webp',
  'sandbox': '/images/categories/sandbox.webp',
  'shooter': '/images/categories/shooter.webp',
  'simulation': '/images/categories/simulation.webp',
  'space': '/images/categories/space.webp',
  'sports': '/images/categories/sports.webp',
  'stealth': '/images/categories/stealth.webp',
  'strategy': '/images/categories/strategy.webp',
  'survival': '/images/categories/survival.webp',
  'tank': '/images/categories/tank.webp',
  'time-management': '/images/categories/time-management.webp',
  'trivia': '/images/categories/trivia.webp',
  'tycoon': '/images/categories/tycoon.webp',
  'word': '/images/categories/word.webp',
  'zombie': '/images/categories/zombie.webp',
  'animal': '/images/categories/animal.webp',
  'cats': '/images/categories/cats.webp',
  'monster': '/images/categories/monster.webp',
  'stickman': '/images/categories/fighting.webp',
  'retro': '/images/categories/arcade.webp',
  'snake': '/images/categories/survival.webp',
  'airplane': '/images/categories/flying.webp',
  'basketball': '/images/categories/sports.webp',
  'golf': '/images/categories/sports.webp',
  'block': '/images/categories/puzzle.webp',
  'building': '/images/categories/simulation.webp',
  'drawing': '/images/categories/educational.webp',
  'robots': '/images/categories/air-combat.webp',
  'fun': '/images/categories/casual.webp',
  'games-for-girls': '/images/categories/beauty-dress-up.webp',
  '2048': '/images/categories/match-3.webp',
  'first-person-shooter': '/images/categories/shooter.webp',
  'christmas': '/images/categories/casual.webp',
}

export default async function CategoriesPage() {
  // الفئات ثابتة، ولا نحتاج لتحميل آلاف الألعاب أثناء build.
  const filters = Object.keys(categoryMeta)

  return (
    <div className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 bg-electric-violet/10 border border-electric-violet/20 text-electric-violet text-xs font-bold px-3 py-1 rounded-full mb-4">
          🎮 BROWSE CATEGORIES
        </div>
        <h1 className="text-5xl font-black text-white mb-3">Explore Games</h1>
        <p className="text-text-secondary text-lg">
          <span className="text-white font-bold">29,400+</span> games across{' '}
          <span className="text-electric-violet font-bold">{filters.length}</span> categories
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {filters.map(filter => {
          const meta = categoryMeta[filter]
          const image = categoryImages[filter] ?? meta?.image
          const count = 0

          return (
            <Link
              key={filter}
              href={`/games?genre=${encodeURIComponent(filter)}`}
              className="group relative rounded-2xl overflow-hidden border border-white/8 hover:border-white/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl block"
            >
              {/* Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${meta.bg} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
              
              {/* Top shine line */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${meta.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              {/* Content */}
              <div className="relative p-4 flex flex-col gap-3">
                {/* Icon box */}
                <div className="relative w-full h-24 overflow-hidden rounded-xl border border-white/10 bg-black/20 shadow-lg group-hover:scale-[1.02] transition-transform duration-300">
                  {image ? (
                    <Image
                      src={image}
                      alt={`${filter.replace(/-/g, ' ')} games`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${meta.gradient} text-2xl`}>
                      {meta.icon}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-white font-bold capitalize text-sm leading-tight mb-1 group-hover:text-white transition-colors">
                    {filter.replace(/-/g, ' ')}
                  </h3>
                  <p className="text-gray-500 text-[10px] leading-tight line-clamp-2 group-hover:text-gray-400 transition-colors">
                    {meta.desc}
                  </p>
                </div>

                {/* Count badge */}
                <div className={`self-start px-2 py-0.5 rounded-full bg-gradient-to-r ${meta.gradient} text-white text-[10px] font-black shadow-sm`}>
                  {count.toLocaleString()} games
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
