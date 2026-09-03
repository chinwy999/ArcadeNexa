'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

interface CategoryItem {
  name: string
  slug: string
  image: string
}

interface CategorySliderProps {
  categories: CategoryItem[]
}

export default function CategorySlider({
  categories,
}: CategorySliderProps) {
  if (categories.length === 0) return null

  /*
   * Three identical sets create a seamless infinite track.
   * We animate exactly one set width, matching the Featured Games
   * slider so the movement remains continuous without a visible jump.
   */
  const trackCategories = [
    ...categories,
    ...categories,
    ...categories,
  ]

  return (
    <section
      className="relative w-full select-none overflow-hidden"
      aria-label="Game categories"
    >
      <style>{`
        @keyframes categoryInfiniteScroll {
          from {
            transform: translate3d(0, 0, 0);
          }

          to {
            transform: translate3d(-33.333333%, 0, 0);
          }
        }

        .category-infinite-track {
          animation: categoryInfiniteScroll 140s linear infinite;
          width: max-content;
          will-change: transform;
        }

        .category-infinite-track:hover {
          animation-play-state: running;
        }

        @media (max-width: 640px) {
          .category-infinite-track {
            animation-duration: 120s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .category-infinite-track {
            animation-duration: 180s;
          }
        }
      `}</style>

      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-nexa-cyan/15">
            <Sparkles className="h-4 w-4 text-nexa-cyan" />
          </div>

          <div>
            <h2 className="text-xl font-black text-[color:var(--text-primary)] sm:text-2xl">
              Browse Categories
            </h2>

            <p className="text-[11px] text-[color:var(--text-muted)]">
              Explore every game genre
            </p>
          </div>
        </div>

        <Link
          href="/categories"
          className="group inline-flex items-center gap-2 rounded-full border border-[color:var(--white-10)] bg-[color:var(--white-05)] px-4 py-2 text-xs font-bold text-[color:var(--text-secondary)] transition-all hover:border-nexa-cyan/50 hover:bg-nexa-cyan/10 hover:text-[color:var(--text-primary)]"
        >
          View All
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Edge fades */}
      <div className="pointer-events-none absolute bottom-0 left-0 top-[4.5rem] z-20 w-12 bg-gradient-to-r from-[var(--nexa-black)] via-[var(--nexa-black)]/70 to-transparent sm:w-24" />

      <div className="pointer-events-none absolute bottom-0 right-0 top-[4.5rem] z-20 w-12 bg-gradient-to-l from-[var(--nexa-black)] via-[var(--nexa-black)]/70 to-transparent sm:w-24" />

      {/* Infinite continuous track */}
      <div className="relative overflow-hidden py-2">
        <div className="category-infinite-track flex gap-3 sm:gap-4">
          {trackCategories.map((category, index) => (
            <Link
              key={`${category.slug}-${index}`}
              href={`/games?genre=${encodeURIComponent(category.slug)}`}
              aria-label={`Browse ${category.name} games`}
              className="group relative w-[180px] shrink-0 overflow-hidden rounded-2xl border border-[color:var(--white-10)] bg-[color:var(--nexa-surface)] shadow-[0_14px_40px_rgba(0,0,0,0.30)] transition-all duration-300 hover:-translate-y-1 hover:border-nexa-cyan/50 hover:shadow-[0_18px_45px_rgba(0,0,0,0.42)] sm:w-[220px] md:w-[250px]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={category.image}
                  alt={`${category.name} games`}
                  fill
                  sizes="250px"
                  loading="lazy"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-nexa-cyan">
                        Explore
                      </p>

                      <h3 className="text-sm font-black uppercase tracking-[0.08em] text-white drop-shadow-lg sm:text-base">
                        {category.name}
                      </h3>
                    </div>

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white/80 backdrop-blur-sm transition-all duration-300 group-hover:border-nexa-cyan/50 group-hover:bg-nexa-cyan/15 group-hover:text-white">
                      →
                    </span>
                  </div>
                </div>

                <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-nexa-cyan opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-25" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
