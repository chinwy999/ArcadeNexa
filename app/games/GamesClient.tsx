'use client'

import { useState, useMemo, useEffect } from 'react'
import { Filter, Gamepad2, Loader2 } from 'lucide-react'
import GameCard from '@/components/GameCard'
import InstantPlayModal from '@/components/InstantPlayModal'
import { games as staticGames, type Game, getAllGenreFilters } from '@/lib/games'
import { fetchGamePixGames } from '@/lib/gamepixFeed'

function dedupeGames(list: Game[]): Game[] {
  const seen = new Set<string>()
  return list.filter(g => {
    const key = `${g.id}|${g.slug}`.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export default function GamesClient() {
  const [genre, setGenre] = useState('All')
  const [platform, setPlatform] = useState('All')
  const [rating, setRating] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Game | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const [games, setGames] = useState<Game[]>(staticGames)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const allGenres = useMemo(() => getAllGenreFilters(), [])

  useEffect(() => {
    async function loadInitialGames() {
      setLoading(true)
      const result = await fetchGamePixGames(1, 120)
      setGames(prev => dedupeGames([...prev, ...result.games]))
      setHasMore(result.hasMore)
      setCurrentPage(result.nextPage)
      setLoading(false)
    }
    loadInitialGames()
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const g = params.get('genre')
    if (g) setGenre(g)
    const q = params.get('q')
    if (q) setSearch(q)
  }, [])

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
      if (
        search &&
        !g.name.toLowerCase().includes(search.toLowerCase()) &&
        !g.genre.join(' ').toLowerCase().includes(search.toLowerCase()) &&
        !g.tags.join(' ').toLowerCase().includes(search.toLowerCase())
      )
        return false
      return true
    })
  }, [games, genre, platform, rating, search])

  const loadMore = async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    const result = await fetchGamePixGames(currentPage, 24)
    setGames(prev => dedupeGames([...prev, ...result.games]))
    setHasMore(result.hasMore)
    setCurrentPage(result.nextPage)
    setLoadingMore(false)
  }

  return (
    <>
      {toast && (
        <div className="fixed top-4 right-4 z-[9999] bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {toast}
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Gamepad2 className="w-8 h-8 text-purple-500" />
            <h1 className="text-4xl font-bold">Games Arena</h1>
          </div>
          <p className="text-gray-400">
            {games.length} professional HTML5 games powered by GamePix - instant play, no download, fullscreen support.
          </p>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-6 mb-8 border border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Genre</label>
              <select
                value={genre}
                onChange={e => setGenre(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              >
                {allGenres.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Platform</label>
              <select
                value={platform}
                onChange={e => setPlatform(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              >
                <option value="All">All Platforms</option>
                <option value="PC">PC</option>
                <option value="Multi">Multi-Platform</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Rating</label>
              <select
                value={rating}
                onChange={e => setRating(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              >
                <option value="All">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Search</label>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search games..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            <span className="ml-3 text-gray-400">Loading games...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
              {filtered.map(game => (
                <GameCard key={game.id} game={game} onClick={() => setSelected(game)} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <Gamepad2 className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400 text-lg">No games match your filters</p>
              </div>
            )}

            {hasMore && filtered.length > 0 && (
              <div className="flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>Load More Games ({games.length} loaded)</>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selected && <InstantPlayModal game={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
