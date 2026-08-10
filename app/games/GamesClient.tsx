'use client'
import { useState, useMemo, useEffect } from 'react'
import { SlidersHorizontal, Filter, Gamepad2 } from 'lucide-react'
import GameCard from '@/components/GameCard'
import InstantPlayModal from '@/components/InstantPlayModal'
import { games, type Game, getAllGenreFilters } from '@/lib/games'

export default function GamesClient() {
  const [genre, setGenre] = useState('All')
  const [platform, setPlatform] = useState('All')
  const [rating, setRating] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Game | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const allGenres = useMemo(() => getAllGenreFilters(), [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const g = params.get('genre')
    if (g) setGenre(g)
    const q = params.get('q')
    if (q) setSearch(q)
  }, [])

  // Secure postMessage handling - same origin + trusted GPX origins
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      const trustedHosts = ['gamepix.com', 'play.gamepix.com', 'img.gamepix.com']
      const isSameOrigin = e.origin === window.location.origin
      const isGamePix = trustedHosts.some(h => e.origin === `https://${h}`)
      if (!isSameOrigin && !isGamePix) return
      const data = e.data
      if (
        data?.type === 'NEXARENA_SCORE' &&
        typeof data.game === 'string' &&
        data.game.length <= 120 &&
        typeof data.score === 'number' &&
        Number.isFinite(data.score) &&
        typeof data.coins === 'number' &&
        Number.isFinite(data.coins)
      ) {
        const msg = `${data.game} - Earned +${data.coins} NexCoins! Score ${data.score}`
        setToast(msg)
        setTimeout(() => setToast(null), 4000)
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  const filtered = useMemo(() => {
    return games.filter(g => {
      if (genre !== 'All' && g.genreFilter !== genre) return false
      if (platform !== 'All' && g.platform !== platform) return false
      if (rating !== 'All' && (g.rating ?? 0) < parseInt(rating, 10)) return false
      if (search && !g.name.toLowerCase().includes(search.toLowerCase()) && !g.genre.join(' ').toLowerCase().includes(search.toLowerCase()) && !g.tags.join(' ').toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [genre, platform, rating, search])

  return (
    <div className="animate-fade-in py-12 px-4 sm:px-6 max-w-7xl mx-auto relative">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 glass bg-space-black/90 border border-neon-green/40 px-6 py-4 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.3)] flex items-center gap-3 animate-slide-up">
          <Gamepad2 className="w-5 h-5 text-neon-green" />
          <span className="text-white font-bold text-sm">{toast}</span>
        </div>
      )}

      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-black mb-3"><span className="gradient-text">GAMES ARENA</span></h1>
        <p className="text-text-secondary text-lg max-w-3xl mx-auto">
          {games.length} professional HTML5 games powered by GamePix — instant play, no download, fullscreen support.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-2 bg-neon-green/10 border border-neon-green/30 text-neon-green text-xs font-bold px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" /> {games.length} INSTANT PLAY
          </span>
          <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold px-4 py-2 rounded-full">
            GamePix Official
          </span>
          <span className="inline-flex items-center gap-2 bg-electric-violet/10 border border-electric-violet/30 text-electric-violet text-xs font-bold px-4 py-2 rounded-full">
            No Download Required
          </span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-black text-white mb-3">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {allGenres.filter(g => g !== 'All').map(g => {
            const count = games.filter(game => game.genreFilter === g).length
            return (
              <button
                key={g}
                onClick={() => setGenre(g)}
                className={`rounded-xl border px-3 py-3 text-left transition ${
                  genre === g
                    ? 'border-electric-violet/60 bg-electric-violet/15 text-white'
                    : 'border-white/10 bg-elevated text-text-secondary hover:border-white/20 hover:text-white'
                }`}
              >
                <span className="block text-sm font-bold">{g}</span>
                <span className="text-xs opacity-70">{count} games</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2 text-text-secondary mr-2"><SlidersHorizontal className="w-4 h-4" /><span className="text-sm font-medium">Filters:</span></div>
        <select value={genre} onChange={e => setGenre(e.target.value)} className="bg-elevated border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-electric-violet outline-none" aria-label="Filter by genre">
          {allGenres.map(g => (
            <option key={g} value={g}>{g === 'All' ? 'All Genres' : g}</option>
          ))}
        </select>
        <select value={platform} onChange={e => setPlatform(e.target.value)} className="bg-elevated border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-electric-violet outline-none" aria-label="Filter by platform">
          <option value="All">All Platforms</option>
          <option value="PC">PC</option>
          <option value="Multi">Multi-Platform</option>
        </select>
        <select value={rating} onChange={e => setRating(e.target.value)} className="bg-elevated border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-electric-violet outline-none" aria-label="Filter by rating">
          <option value="All">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
        </select>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search games..." className="bg-elevated border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-electric-violet outline-none w-44" aria-label="Search games" />
        <span className="text-xs text-text-secondary ml-auto">{filtered.length} of {games.length} games</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(g => (
          <GameCard key={g.slug} game={g} onPlay={() => setSelected(g)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <Filter className="w-12 h-12 text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary text-lg">No games match your filters.</p>
          <button onClick={() => { setGenre('All'); setPlatform('All'); setRating('All'); setSearch('') }} className="mt-4 text-electric-violet hover:underline text-sm">Clear filters</button>
        </div>
      )}

      {selected && (
        <InstantPlayModal
          url={selected.iframeUrl}
          title={selected.name}
          width={selected.width}
          height={selected.height}
          aspectRatio={selected.aspectRatio}
          provider={selected.provider}
          onClose={() => setSelected(null)}
        />
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context":"https://schema.org",
        "@type":"ItemList",
        "name":"ArcadeNexa GamePix Games",
        "numberOfItems": games.length,
        "itemListElement": games.map((g,i)=>({
          "@type":"ListItem",
          "position": i+1,
          "item": {
            "@type":"VideoGame",
            "name": g.name,
            "url": `https://arcade-nexa-3gxg.vercel.app/games/${g.slug}`,
            "image": g.thumbnail,
            "genre": g.genre,
            "gamePlatform": g.platform,
            "isAccessibleForFree": true,
            "provider": g.provider
          }
        }))
      })}} />
    </div>
  )
}
