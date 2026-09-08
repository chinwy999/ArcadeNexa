import type { Metadata } from 'next'
import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { Gamepad2, Swords, Compass, Joystick, Puzzle, Trophy, Zap, Crosshair, Car, Shield, Footprints, Skull, Wand2, Globe2, Rocket, Plane, Ship, Bot, Gem, Brain, Calculator, CircleHelp, Clock3, Building2, Sprout, ChefHat, PawPrint, Ghost, Heart, Pencil, GraduationCap, Box, CircleDot, Target, Dumbbell } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Game Categories - ArcadeNexa',
  description: 'Explore 15,000+ free browser games by category on ArcadeNexa.',
  alternates: { canonical: '/categories' },
}

type Category = {
  slug: string
  title: string
  description: string
  accent: string
  featured?: boolean
}

const categoryAliases: Record<string, string> = {
  hypercasual: 'hyper-casual',
  shooting: 'shooter',
  girls: 'games-for-girls',
}

const categories: Category[] = [
  { slug: 'action', title: 'Action', description: 'Fast-paced action and intense gameplay.', accent: 'from-red-500/70 to-orange-500/20', featured: true },
  { slug: 'adventure', title: 'Adventure', description: 'Explore worlds, quests and epic stories.', accent: 'from-nexa-emerald/70 to-nexa-cyan/20', featured: true },
  { slug: 'arcade', title: 'Arcade', description: 'Classic pick-up-and-play arcade fun.', accent: 'from-nexa-violet/70 to-nexa-cyan/20', featured: true },
  { slug: 'casual', title: 'Casual', description: 'Easy, fun games for quick play sessions.', accent: 'from-nexa-emerald/70 to-nexa-cyan/20', featured: true },
  { slug: 'puzzle', title: 'Puzzle', description: 'Brain teasers, logic and problem solving.', accent: 'from-yellow-500/70 to-amber-500/20', featured: true },
  { slug: 'racing', title: 'Racing', description: 'Speed, drifting and high-octane competition.', accent: 'from-orange-500/70 to-red-500/20', featured: true },
  { slug: 'sports', title: 'Sports', description: 'Football, basketball, golf and more.', accent: 'from-nexa-cyan/70 to-nexa-blue/20', featured: true },
  { slug: 'shooter', title: 'Shooter', description: 'Aim, shoot and battle your way to victory.', accent: 'from-red-600/70 to-zinc-700/20', featured: true },
  { slug: 'simulation', title: 'Simulation', description: 'Realistic worlds, systems and experiences.', accent: 'from-nexa-blue/70 to-nexa-cyan/20', featured: true },
  { slug: 'strategy', title: 'Strategy', description: 'Plan carefully, build and outsmart opponents.', accent: 'from-nexa-blue/70 to-nexa-cyan/20', featured: true },
  { slug: 'platformer', title: 'Platformer', description: 'Jump, run and conquer challenging levels.', accent: 'from-nexa-emerald/70 to-nexa-cyan/20' },
  { slug: 'fighting', title: 'Fighting', description: 'Combat, martial arts and head-to-head action.', accent: 'from-nexa-violet/70 to-nexa-blue/20' },
  { slug: 'runner', title: 'Runner', description: 'Keep moving and beat your best distance.', accent: 'from-nexa-violet/70 to-nexa-blue/20' },
  { slug: 'battle', title: 'Battle', description: 'Intense battles, warfare and competitive action.', accent: 'from-orange-500/70 to-red-500/20' },
  { slug: 'stealth', title: 'Stealth', description: 'Sneak, hide and complete missions undetected.', accent: 'from-slate-500/70 to-violet-500/20' },
  { slug: 'survival', title: 'Survival', description: 'Gather resources and survive dangerous worlds.', accent: 'from-nexa-emerald/70 to-nexa-blue/20' },
  { slug: 'rpg', title: 'RPG', description: 'Characters, quests and role-playing adventures.', accent: 'from-nexa-violet/70 to-nexa-blue/20' },
  { slug: 'mmorpg', title: 'MMORPG', description: 'Online role-playing adventures and fantasy worlds.', accent: 'from-violet-500/70 to-indigo-500/20' },
  { slug: 'io', title: '.IO', description: 'Competitive online multiplayer-style games.', accent: 'from-nexa-emerald/70 to-nexa-cyan/20' },
  { slug: 'open-world', title: 'Open World', description: 'Explore large worlds and choose your adventure.', accent: 'from-nexa-blue/70 to-nexa-cyan/20' },
  { slug: 'car', title: 'Car', description: 'Drive, park, race and customize cars.', accent: 'from-slate-500/70 to-zinc-700/20' },
  { slug: 'bike', title: 'Bike', description: 'Motorbikes, stunts and two-wheel racing.', accent: 'from-orange-500/70 to-red-600/20' },
  { slug: 'flying', title: 'Flying', description: 'Take off and explore the skies.', accent: 'from-nexa-blue/70 to-nexa-cyan/20' },
  { slug: 'air-combat', title: 'Air Combat', description: 'Dogfights, aerial battles and combat missions.', accent: 'from-sky-500/70 to-blue-600/20' },
  { slug: 'boat', title: 'Boat', description: 'Boats, ships, submarines and water adventures.', accent: 'from-blue-500/70 to-cyan-500/20' },
  { slug: 'tank', title: 'Tank', description: 'Armored combat, tank battles and battlefield action.', accent: 'from-green-600/70 to-slate-600/20' },
  { slug: 'space', title: 'Space', description: 'Explore galaxies and futuristic worlds.', accent: 'from-nexa-blue/70 to-nexa-violet/20' },
  { slug: 'robots', title: 'Robots', description: 'Robots, technology and sci-fi action.', accent: 'from-slate-500/70 to-gray-700/20' },
  { slug: 'match-3', title: 'Match 3', description: 'Match colors, gems and objects.', accent: 'from-nexa-violet/70 to-nexa-cyan/20' },
  { slug: '2048', title: '2048', description: 'Merge tiles and master number puzzles.', accent: 'from-orange-500/70 to-amber-600/20' },
  { slug: 'block', title: 'Block', description: 'Block-based challenges, puzzles and adventures.', accent: 'from-cyan-500/70 to-blue-500/20' },
  { slug: 'board', title: 'Board', description: 'Classic board and tabletop games.', accent: 'from-amber-500/70 to-yellow-600/20' },
  { slug: 'card', title: 'Card', description: 'Cards, decks and classic tabletop gameplay.', accent: 'from-red-500/70 to-nexa-violet/20' },
  { slug: 'brain', title: 'Brain', description: 'Challenge memory, logic and concentration.', accent: 'from-nexa-cyan/70 to-nexa-blue/20' },
  { slug: 'memory', title: 'Memory', description: 'Train recall, focus and concentration.', accent: 'from-nexa-violet/70 to-nexa-blue/20' },
  { slug: 'math', title: 'Math', description: 'Numbers, arithmetic and calculation games.', accent: 'from-nexa-blue/70 to-nexa-cyan/20' },
  { slug: 'quiz', title: 'Quiz', description: 'Test your knowledge with fun quiz challenges.', accent: 'from-yellow-500/70 to-orange-500/20' },
  { slug: 'trivia', title: 'Trivia', description: 'Test your knowledge with quizzes and facts.', accent: 'from-yellow-500/70 to-amber-600/20' },
  { slug: 'word', title: 'Word', description: 'Word puzzles, spelling challenges and vocabulary games.', accent: 'from-indigo-500/70 to-violet-500/20' },
  { slug: 'hidden-object', title: 'Hidden Object', description: 'Search scenes and find hidden clues.', accent: 'from-nexa-cyan/70 to-nexa-emerald/20' },
  { slug: 'clicker', title: 'Clicker', description: 'Tap, click and build your progress.', accent: 'from-amber-500/70 to-orange-600/20' },
  { slug: 'idle', title: 'Idle', description: 'Progress and build even with simple actions.', accent: 'from-slate-500/70 to-gray-700/20' },
  { slug: 'hyper-casual', title: 'Hyper Casual', description: 'Simple controls and instantly playable games.', accent: 'from-nexa-violet/70 to-nexa-cyan/20' },
  { slug: 'time-management', title: 'Time Management', description: 'Serve customers, manage tasks and beat the clock.', accent: 'from-amber-500/70 to-orange-500/20' },
  { slug: 'tycoon', title: 'Tycoon', description: 'Build businesses, manage resources and grow your empire.', accent: 'from-yellow-500/70 to-amber-500/20' },
  { slug: 'building', title: 'Building', description: 'Create, construct and manage projects.', accent: 'from-yellow-600/70 to-amber-700/20' },
  { slug: 'farming', title: 'Farming', description: 'Grow, harvest and manage your farm.', accent: 'from-nexa-emerald/70 to-nexa-cyan/20' },
  { slug: 'cooking', title: 'Cooking', description: 'Cook recipes and run your kitchen.', accent: 'from-orange-500/70 to-amber-600/20' },
  { slug: 'animal', title: 'Animal', description: 'Animal-themed adventures and challenges.', accent: 'from-nexa-emerald/70 to-nexa-cyan/20' },
  { slug: 'cats', title: 'Cats', description: 'Playful games starring feline friends.', accent: 'from-orange-500/70 to-amber-600/20' },
  { slug: 'monster', title: 'Monster', description: 'Creatures, monsters and fantastic worlds.', accent: 'from-nexa-violet/70 to-nexa-cyan/20' },
  { slug: 'zombie', title: 'Zombie', description: 'Survive hordes and defeat the undead.', accent: 'from-nexa-emerald/70 to-nexa-blue/20' },
  { slug: 'horror', title: 'Horror', description: 'Scary stories and thrilling challenges.', accent: 'from-red-700/70 to-black/40' },
  { slug: 'games-for-girls', title: 'Games for Girls', description: 'Fashion, beauty and dress-up adventures.', accent: 'from-nexa-violet/70 to-nexa-blue/20' },
  { slug: 'beauty-dress-up', title: 'Beauty & Dress Up', description: 'Fashion, makeup, styling and dress-up games.', accent: 'from-pink-500/70 to-fuchsia-500/20' },
  { slug: 'drawing', title: 'Drawing', description: 'Creative drawing and art challenges.', accent: 'from-nexa-violet/70 to-nexa-cyan/20' },
  { slug: 'educational', title: 'Educational', description: 'Learn while playing and having fun.', accent: 'from-nexa-emerald/70 to-nexa-cyan/20' },
  { slug: 'sandbox', title: 'Sandbox', description: 'Create, experiment and play your way.', accent: 'from-emerald-500/70 to-cyan-500/20' },
  { slug: 'snake', title: 'Snake', description: 'Classic snake and worm challenges.', accent: 'from-nexa-emerald/70 to-nexa-cyan/20' },
  { slug: 'ball', title: 'Ball', description: 'Physics, sports and skill-based ball games.', accent: 'from-nexa-blue/70 to-nexa-cyan/20' },
  { slug: 'basketball', title: 'Basketball', description: 'Shoot hoops and master the court.', accent: 'from-orange-500/70 to-red-600/20' },
  { slug: 'golf', title: 'Golf', description: 'Aim for the perfect shot and beat par.', accent: 'from-nexa-emerald/70 to-nexa-blue/20' }
]

const categoryIcons: Record<string, LucideIcon> = {
  action: Swords, adventure: Compass, arcade: Joystick, casual: Gamepad2, puzzle: Puzzle, racing: Trophy, sports: Dumbbell,
  shooter: Crosshair, simulation: Globe2, strategy: Shield, platformer: Footprints, fighting: Swords, runner: Zap, battle: Skull,
  stealth: Ghost, survival: Shield, rpg: Wand2, mmorpg: Globe2, io: Gamepad2, 'open-world': Globe2, car: Car, bike: Zap,
  flying: Plane, 'air-combat': Plane, boat: Ship, tank: Shield, space: Rocket, robots: Bot, 'match-3': Gem, '2048': Calculator,
  block: Box, board: Gamepad2, card: Gem, brain: Brain, memory: Brain, math: Calculator, quiz: CircleHelp, trivia: CircleHelp,
  word: CircleHelp, 'hidden-object': Compass, clicker: CircleDot, idle: Clock3, 'hyper-casual': Zap, 'time-management': Clock3,
  tycoon: Building2, building: Building2, farming: Sprout, cooking: ChefHat, animal: PawPrint, cats: PawPrint, monster: Skull,
  zombie: Skull, horror: Ghost, 'games-for-girls': Heart, 'beauty-dress-up': Heart, drawing: Pencil, educational: GraduationCap,
  sandbox: Box, snake: CircleDot, ball: CircleDot, basketball: Dumbbell, golf: Target,
}

const getCategoryIcon = (slug: string): LucideIcon => categoryIcons[slug] || Gamepad2

const displayTitle = (slug: string) => {
  if (slug === 'io') return '.IO'
  if (slug === 'rpg') return 'RPG'
  if (slug === '2048') return '2048'
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

async function getCategoryGameCounts() {
  const counts: Record<string, number> = {}
  for (const category of categories) {
    try {
      const { getGamesPage } = await import('@/lib/games')
      const result = await getGamesPage(1, 48, category.slug)
      let total = result.games.length
      let page = 1
      let hasMore = result.hasMore
      while (hasMore && page < 5) {
        page++
        const nextResult = await getGamesPage(page, 48, category.slug)
        total += nextResult.games.length
        hasMore = nextResult.hasMore
        if (nextResult.games.length < 48) break
      }
      counts[category.slug] = total
    } catch {
      counts[category.slug] = 0
    }
  }
  return counts
}

export default async function CategoriesPage() {
  const gameCounts = await getCategoryGameCounts()
  const featuredCategories = categories.filter(category => category.featured)
  const allCategories = categories

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <header className="mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 rounded-full border border-nexa-violet/30 bg-nexa-violet/10 px-3 py-1 text-xs font-bold text-nexa-violet">
          <span aria-hidden="true">🎮</span> BROWSE GAME CATEGORIES
        </div>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-[color:var(--text-primary)] sm:text-5xl">Explore Games by Category</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[color:var(--text-secondary)] sm:text-lg">
          Discover <span className="font-bold text-[color:var(--text-primary)]">15,000+ free browser games</span>{' '}
          across action, puzzle, racing, sports, adventure and many more genres.
        </p>
      </header>

      <section aria-labelledby="popular-categories">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-nexa-violet">Start here</p>
            <h2 id="popular-categories" className="mt-1 text-2xl font-black text-[color:var(--text-primary)] sm:text-3xl">Popular Categories</h2>
          </div>
          <span className="hidden text-sm text-[color:var(--text-secondary)] sm:block">{featuredCategories.length} featured genres</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {featuredCategories.map((category, index) => {
            const Icon = getCategoryIcon(category.slug)
            const count = gameCounts[category.slug] || 0
            return (
              <Link key={category.slug} href={`/games?genre=${encodeURIComponent(categoryAliases[category.slug] || category.slug)}`}
                className="group relative min-h-[150px] overflow-hidden rounded-2xl border border-[color:var(--white-10)] bg-[color:var(--white-03)] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-nexa-violet/50 hover:bg-[color:var(--white-06)] hover:shadow-[0_12px_40px_rgba(155,108,255,0.16)]">
                <div className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${category.accent} opacity-20 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-40`} />
                <div className="relative flex h-full flex-col">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[color:var(--white-10)] bg-[color:var(--white-06)] text-nexa-violet transition-all duration-300 group-hover:scale-110 group-hover:border-nexa-violet/40 group-hover:bg-nexa-violet/15">
                      <Icon size={21} strokeWidth={2} />
                    </div>
                    <span className="text-[10px] font-black tracking-widest text-[color:var(--text-muted)] opacity-60">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="mt-auto">
                    <h3 className="text-sm font-black text-[color:var(--text-primary)]">{category.title}</h3>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-[color:var(--text-muted)]">{category.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] font-bold text-nexa-violet bg-nexa-violet/10 px-2 py-0.5 rounded-full">{count > 0 ? `${count}+ games` : 'Explore'}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-nexa-violet opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                      Play games <span aria-hidden="true">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="mt-12 sm:mt-16" aria-labelledby="all-categories">
        <div className="mb-5">
          <p className="text-sm font-bold uppercase tracking-widest text-nexa-violet">Browse everything</p>
          <h2 id="all-categories" className="mt-1 text-2xl font-black text-[color:var(--text-primary)] sm:text-3xl">All Game Categories</h2>
          <p className="mt-2 text-sm text-[color:var(--text-secondary)]">Choose a genre to find games you can play instantly in your browser.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {allCategories.map(category => {
            const Icon = getCategoryIcon(category.slug)
            const count = gameCounts[category.slug] || 0
            return (
              <Link key={category.slug} href={`/games?genre=${encodeURIComponent(categoryAliases[category.slug] || category.slug)}`}
                className="group relative flex min-h-[82px] items-center gap-3 overflow-hidden rounded-xl border border-[color:var(--white-10)] bg-[color:var(--white-03)] px-3.5 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-nexa-cyan/40 hover:bg-nexa-cyan/5 hover:shadow-[0_8px_30px_rgba(34,230,255,0.08)]">
                <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${category.accent} opacity-70 transition-all duration-300 group-hover:w-1.5 group-hover:opacity-100`} />
                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[color:var(--white-10)] bg-[color:var(--white-03)] text-[color:var(--text-muted)] transition-all duration-300 group-hover:border-nexa-cyan/30 group-hover:bg-nexa-cyan/10 group-hover:text-nexa-cyan">
                  <Icon size={17} strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-[color:var(--text-secondary)] transition-colors group-hover:text-[color:var(--text-primary)]">{displayTitle(category.slug)}</span>
                  <span className="mt-0.5 block truncate text-[10px] text-[color:var(--text-muted)]">{count > 0 ? `${count}+ games` : 'Explore'}</span>
                </div>
                <span aria-hidden="true" className="shrink-0 text-sm text-[color:var(--text-muted)] transition-all duration-300 group-hover:translate-x-1 group-hover:text-nexa-cyan">→</span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="mt-12 rounded-2xl border border-[color:var(--white-10)] bg-[color:var(--white-03)] p-6 sm:p-8">
        <h2 className="text-xl font-black text-[color:var(--text-primary)]">New games added regularly</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--text-secondary)]">
          ArcadeNexa combines games from trusted HTML5 game providers so you can discover and play thousands of games directly in your browser.
        </p>
        <Link href="/games" className="mt-5 inline-flex rounded-xl bg-nexa-violet px-5 py-3 text-sm font-bold text-[color:var(--text-primary)] transition hover:brightness-110">Browse All Games</Link>
      </section>
    </main>
  )
}
