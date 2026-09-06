'use client'

import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'

interface CategoryItem {
  name: string
  slug: string
}

interface CategorySliderProps {
  categories: CategoryItem[]
}

export default function CategorySlider({
  categories,
}: CategorySliderProps) {
  if (categories.length === 0) return null

  return (
    <nav
      aria-label="Game categories"
      className="rounded-2xl border border-[color:var(--white-10)] bg-[color:var(--nexa-surface)]/55 p-3 shadow-[var(--shadow-card)] backdrop-blur-xl sm:p-5"
    >
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/games?genre=${encodeURIComponent(category.slug)}`}
            className="group flex min-h-11 items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-[color:var(--text-secondary)] transition-all duration-200 hover:bg-nexa-cyan/10 hover:text-[color:var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nexa-cyan/60"
          >
            <span className="truncate">{category.name}</span>

            <ChevronRight
              className="ml-2 h-3.5 w-3.5 shrink-0 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>

      <div className="mt-4 flex justify-center border-t border-[color:var(--white-10)] pt-4">
        <Link
          href="/categories"
          className="group inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--text-muted)] transition-colors hover:text-nexa-cyan"
        >
          View All Categories
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>
    </nav>
  )
}
