'use client'

import Link from 'next/link'

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

  const mobileCategories = categories.slice(0, 5)
  const tabletCategories = categories.slice(0, 7)
  const desktopCategories = categories.slice(0, 10)

  return (
    <nav
      aria-label="Game categories"
      className="relative border-y border-[color:var(--white-10)] bg-[color:var(--nexa-surface)]/55 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center">
        <div className="scrollbar-none flex min-w-0 flex-1 items-center justify-center overflow-x-auto">
          <div className="flex items-center md:hidden">
            {mobileCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/games?genre=${encodeURIComponent(category.slug)}`}
                className="shrink-0 px-3.5 py-3 text-xs font-bold whitespace-nowrap text-[color:var(--text-muted)] transition-colors duration-200 hover:text-nexa-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-nexa-cyan/60"
              >
                {category.name}
              </Link>
            ))}
          </div>

          <div className="hidden items-center md:flex lg:hidden">
            {tabletCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/games?genre=${encodeURIComponent(category.slug)}`}
                className="shrink-0 px-3.5 py-3 text-xs font-bold whitespace-nowrap text-[color:var(--text-muted)] transition-colors duration-200 hover:text-nexa-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-nexa-cyan/60"
              >
                {category.name}
              </Link>
            ))}
          </div>

          <div className="hidden items-center lg:flex">
            {desktopCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/games?genre=${encodeURIComponent(category.slug)}`}
                className="shrink-0 px-4 py-3 text-xs font-bold whitespace-nowrap text-[color:var(--text-muted)] transition-colors duration-200 hover:text-nexa-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-nexa-cyan/60"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
