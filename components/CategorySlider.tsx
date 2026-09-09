'use client'

import Link from 'next/link'
import {
  Swords,
  Compass,
  Gamepad2,
  Puzzle,
  Car,
  Trophy,
  Crosshair,
  Shield,
  Wand2,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

interface CategoryItem {
  name: string
  slug: string
}

interface CategorySliderProps {
  categories: CategoryItem[]
}

const categoryStyles: Record<string, { icon: LucideIcon; accent: string }> = {
  action: { icon: Swords, accent: 'from-red-500 to-orange-500' },
  adventure: { icon: Compass, accent: 'from-emerald-400 to-cyan-500' },
  arcade: { icon: Gamepad2, accent: 'from-violet-500 to-fuchsia-500' },
  puzzle: { icon: Puzzle, accent: 'from-cyan-400 to-blue-500' },
  racing: { icon: Car, accent: 'from-orange-400 to-red-500' },
  sports: { icon: Trophy, accent: 'from-amber-400 to-orange-500' },
  shooter: { icon: Crosshair, accent: 'from-red-500 to-pink-500' },
  strategy: { icon: Shield, accent: 'from-blue-400 to-violet-500' },
  rpg: { icon: Wand2, accent: 'from-fuchsia-400 to-violet-500' },
  casual: { icon: Sparkles, accent: 'from-cyan-400 to-emerald-400' },
}

export default function CategorySlider({
  categories,
}: CategorySliderProps) {
  if (categories.length === 0) return null

  const visibleCategories = categories.slice(0, 10)

  return (
    <nav
      aria-label="Game categories"
      className="relative border-y border-[color:var(--white-10)] bg-[color:var(--nexa-surface)]/65 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl">
        <div className="scrollbar-none flex items-center justify-start gap-1 overflow-x-auto px-2 py-2 sm:gap-1.5 sm:px-4 lg:justify-center">
          {visibleCategories.map((category) => {
            const style = categoryStyles[category.slug] || {
              icon: Gamepad2,
              accent: 'from-nexa-violet to-nexa-cyan',
            }
            const Icon = style.icon

            return (
              <Link
                key={category.slug}
                href={`/games?genre=${encodeURIComponent(category.slug)}`}
                className="group relative flex shrink-0 items-center gap-2 overflow-hidden rounded-xl border border-[color:var(--white-08)] bg-[color:var(--white-03)] px-3 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:bg-[color:var(--white-06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-nexa-cyan/60"
              >
                <span
                  className={`relative flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${style.accent} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={14} strokeWidth={2.2} />
                </span>

                <span className="text-[11px] font-extrabold whitespace-nowrap text-[color:var(--text-secondary)] transition-colors group-hover:text-white sm:text-xs">
                  {category.name}
                </span>

                <span
                  className={`absolute inset-x-2 bottom-0 h-px bg-gradient-to-r ${style.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
