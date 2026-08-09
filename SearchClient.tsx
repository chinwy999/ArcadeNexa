'use client'
import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { games } from '@/lib/games'

export default function SearchClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQ = searchParams.get('q') || ''
  const [q, setQ] = useState(initialQ)

  useEffect(() => {
    setQ(initialQ)
  }, [initialQ])

  const results = useMemo(() => {
    if (!q.trim()) return games.slice(0, 4)
    const lower = q.toLowerCase()
    return games.filter(g => 
      g.name.toLowerCase().includes(lower) ||
      g.description.toLowerCase().includes(lower) ||
      g.genre.join(' ').toLowerCase().includes(lower) ||
      g.tags.join(' ').toLowerCase().includes(lower)
    )
  }, [q])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <div className="py-20 px-4 sm:px-6 max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-4xl font-black text-white mb-2">Search Arena</h1>
      <p className="text-text-secondary mb-8">Find your next battlefield</p>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search Valorant, FPS, MOBA..."
            className="w-full bg-elevated border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-text-secondary focus:ring-2 focus:ring-electric-violet outline-none"
            aria-label="Search games"
            autoFocus
          />
        </div>
        <button type="submit" className="bg-electric-violet hover:bg-violet-600 text-white px-6 py-4 rounded-xl font-bold transition">Search</button>
      </form>

      <div className="space-y-3">
        <p className="text-sm text-text-secondary mb-3">{results.length} results {q && `for "${q}"`}</p>
        {results.map(g => (
          <Link key={g.slug} href={`/games/${g.slug}`} className="flex items-center gap-4 glass p-4 rounded-xl border border-white/5 hover:border-electric-violet/40 transition group">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${g.gradient} font-black text-white`}>{g.initials}</div>
            <div className="flex-1">
              <h3 className="text-white font-bold group-hover:text-electric-violet transition-colors">{g.name}</h3>
              <p className="text-text-secondary text-sm">{g.genre.join(' • ')} — {g.platform}</p>
            </div>
            <span className="text-neon-green text-xs font-bold">{g.rating}★</span>
          </Link>
        ))}
        {results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary">No results found. Try FPS, MOBA, Battle Royale, or Sports.</p>
            <div className="flex gap-2 justify-center mt-4">
              {['FPS','MOBA','Battle Royale','Sports'].map(cat => (
                <button key={cat} onClick={() => setQ(cat)} className="px-3 py-1 rounded-full bg-white/5 text-text-secondary text-sm hover:bg-white/10">{cat}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
