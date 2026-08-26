'use client'
import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import type { Game } from '@/lib/games'

export default function SearchClient({ allGames }: { allGames: Game[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQ = searchParams.get('q') || ''
  const [q, setQ] = useState(initialQ)

  useEffect(() => {
    setQ(initialQ)
  }, [initialQ])

  const results = useMemo(() => {
    if (!q.trim()) return allGames.slice(0, 8)
    const lower = q.toLowerCase()
    return allGames.filter(g =>
      g.name.toLowerCase().includes(lower) ||
      g.description.toLowerCase().includes(lower) ||
      g.category.toLowerCase().includes(lower) ||
      g.genreFilter.toLowerCase().includes(lower)
    )
  }, [q, allGames])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  const popularCategories = ['Action', 'Puzzle', 'Racing', 'Sports', 'Casual', 'Shooter']

  return (
    <div className="py-20 px-4 sm:px-6 max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-4xl font-black text-nexa-text-primary mb-2">Search Arena</h1>
      <p className="text-text-secondary mb-8">Find your next game from {allGames.length}+ titles</p>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <label htmlFor="game-search" className="sr-only">Search games</label>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            id="game-search"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search games, categories..."
            className="w-full bg-nexa-surface border border-white/10 rounded-xl pl-12 pr-4 py-4 text-nexa-text-primary placeholder:text-text-secondary focus:ring-2 focus:ring-nexa-violet outline-none"
            autoFocus
          />
        </div>
        <button type="submit" className="bg-nexa-violet hover:bg-violet-600 text-nexa-text-primary px-6 py-4 rounded-xl font-bold transition">
          Search
        </button>
      </form>

      {/* Popular Categories */}
      {!q && (
        <div className="mb-8">
          <p className="text-text-secondary text-sm mb-3">Popular categories:</p>
          <div className="flex gap-2 flex-wrap">
            {popularCategories.map(cat => (
              <button key={cat} onClick={() => setQ(cat)}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-nexa-text-primary text-sm hover:bg-nexa-violet/20 hover:border-nexa-violet/40 transition">
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <p className="text-sm text-text-secondary mb-3">
          {q ? `${results.length} results for "${q}"` : 'Popular games'}
        </p>

        {results.map(g => (
          <Link key={g.slug} href={`/games/${g.slug}`}
            className="flex items-center gap-4 glass p-4 rounded-xl border border-white/5 hover:border-nexa-violet/40 transition group">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${g.gradient} font-black text-nexa-text-primary flex-shrink-0`}>
              {g.initials}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-nexa-text-primary font-bold group-hover:text-nexa-violet transition-colors truncate">{g.name}</h3>
              <p className="text-text-secondary text-sm">{g.category} • {g.platform}</p>
            </div>
            <span className="text-nexa-emerald text-xs font-bold flex-shrink-0">{g.rating}★</span>
          </Link>
        ))}

        {results.length === 0 && q && (
          <div className="text-center py-12 glass rounded-xl border border-white/5">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-nexa-text-primary font-bold mb-2">No results found for "{q}"</p>
            <p className="text-text-secondary text-sm mb-6">Try a different keyword or browse by category</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {popularCategories.map(cat => (
                <button key={cat} onClick={() => setQ(cat)}
                  className="px-3 py-1 rounded-full bg-white/5 text-text-secondary text-sm hover:bg-white/10 transition">
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
