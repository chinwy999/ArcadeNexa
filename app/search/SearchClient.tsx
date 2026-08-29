'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import type { Game } from '@/lib/games'

export default function SearchClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialQ = searchParams.get('q') || ''

  const [q, setQ] = useState(initialQ)
  const [results, setResults] = useState<Game[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(Boolean(initialQ))

  useEffect(() => {
    setQ(initialQ)
  }, [initialQ])

  useEffect(() => {
    if (!initialQ.trim()) {
      setResults([])
      setSearched(false)
      return
    }

    let cancelled = false

    async function searchGames() {
      setLoading(true)
      setSearched(true)

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(initialQ)}`,
          {
            cache: 'no-store',
          }
        )

        if (!response.ok) {
          throw new Error('Search request failed')
        }

        const data = await response.json()

        if (!cancelled) {
          setResults(Array.isArray(data.games) ? data.games : [])
        }
      } catch {
        if (!cancelled) {
          setResults([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    searchGames()

    return () => {
      cancelled = true
    }
  }, [initialQ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const value = q.trim()

    if (value) {
      router.push(`/search?q=${encodeURIComponent(value)}`)
    } else {
      router.push('/search')
    }
  }

  const popularCategories = [
    'Action',
    'Puzzle',
    'Racing',
    'Sports',
    'Casual',
    'Shooter',
  ]

  const selectCategory = (category: string) => {
    setQ(category)
    router.push(`/search?q=${encodeURIComponent(category)}`)
  }

  return (
    <div className="py-20 px-4 sm:px-6 max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-4xl font-black text-[color:var(--text-primary)] mb-2">
        Search Games
      </h1>

      <p className="text-[color:var(--text-secondary)] mb-8">
        Find your next game from 15,000+ free games
      </p>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <label htmlFor="game-search" className="sr-only">
            Search games
          </label>

          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[color:var(--text-secondary)]" />

          <input
            id="game-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search games, categories..."
            className="w-full bg-nexa-surface border border-[color:var(--white-10)] rounded-xl pl-12 pr-4 py-4 text-[color:var(--text-primary)] placeholder:text-[color:var(--text-secondary)] focus:ring-2 focus:ring-nexa-cyan outline-none"
            autoFocus
          />
        </div>

        <button
          type="submit"
          className="bg-nexa-cyan hover:brightness-110 text-[color:var(--text-primary)] px-6 py-4 rounded-xl font-bold transition"
        >
          Search
        </button>
      </form>

      {!q && (
        <div className="mb-8">
          <p className="text-[color:var(--text-secondary)] text-sm mb-3">
            Popular categories:
          </p>

          <div className="flex gap-2 flex-wrap">
            {popularCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => selectCategory(cat)}
                className="px-4 py-2 rounded-full bg-[color:var(--white-05)] border border-[color:var(--white-10)] text-[color:var(--text-primary)] text-sm hover:bg-nexa-cyan/20 hover:border-nexa-cyan/40 transition"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <p className="text-sm text-[color:var(--text-secondary)] mb-3">
          {loading
            ? 'Searching...'
            : searched
              ? `${results.length} results for "${initialQ}"`
              : 'Popular games'}
        </p>

        {loading && (
          <div className="text-center py-12 text-[color:var(--text-secondary)]">
            Searching games...
          </div>
        )}

        {!loading &&
          results.map((g) => (
            <Link
              key={g.slug}
              href={`/games/${g.slug}`}
              className="flex items-center gap-4 glass p-4 rounded-xl border border-[color:var(--white-05)] hover:border-nexa-cyan/40 transition group"
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${g.gradient} font-black text-[color:var(--text-primary)] flex-shrink-0`}
              >
                {g.initials}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-[color:var(--text-primary)] font-bold group-hover:text-nexa-cyan transition-colors truncate">
                  {g.name}
                </h3>

                <p className="text-[color:var(--text-secondary)] text-sm">
                  {g.category} • {g.platform}
                </p>
              </div>

              <span className="text-nexa-emerald text-xs font-bold flex-shrink-0">
                {g.rating}★
              </span>
            </Link>
          ))}

        {!loading && results.length === 0 && searched && (
          <div className="text-center py-12 glass rounded-xl border border-[color:var(--white-05)]">
            <p className="text-4xl mb-4">🔍</p>

            <p className="text-[color:var(--text-primary)] font-bold mb-2">
              No results found for "{initialQ}"
            </p>

            <p className="text-[color:var(--text-secondary)] text-sm mb-6">
              Try a different keyword or browse by category
            </p>

            <div className="flex gap-2 justify-center flex-wrap">
              {popularCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => selectCategory(cat)}
                  className="px-3 py-1 rounded-full bg-[color:var(--white-05)] text-[color:var(--text-secondary)] text-sm hover:bg-[color:var(--white-10)] transition"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
