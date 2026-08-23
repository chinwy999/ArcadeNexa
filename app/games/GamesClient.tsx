'use client'

import { useState, useMemo, useEffect } from 'react'
import { Filter, Gamepad2 } from 'lucide-react'
import GameCard from '@/components/GameCard'
import InstantPlayModal from '@/components/InstantPlayModal'
import { type Game } from '@/lib/games'

const PAGE_SIZE = 24

export default function GamesClient() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [genre, setGenre] = useState('All')
  const [platform, setPlatform] = useState('All')
  const [rating, setRating] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Game | null>(null)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch('/api/games')
        const data = await res.json()
        setGames(data.games ?? [])
      } catch (error) {
        console.error('Error fetching games:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchGames()
  }, [])

  const allGenres = useMemo(() => {
    const genres = new Set<string>()
    games.forEach(g => g.genre.forEach(gen => genres.add(gen)))
    return ['All', ...Array.from(genres)]
  }, [games])

  const filtered = useMemo(() => {
    return games.filter(g => {
      if (genre !== 'All' && !g.genre.includes(genre)) return false
      if (platform !== 'All' && g.platform !== platform) return false
      if (rating !== 'All' && (g.rating ?? 0) < parseInt(rating, 10)) return false
      if (search && !g.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [games, genre, platform, rating, search])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Gamepad2 className="w-8 h-8 text-purple-500" />
            <h1 className="text-4xl font-bold">Games Arena</h1>
          </div>
          <p className="text-gray-400">
            {games.length} HTML5 games - instant play, no download, fullscreen support.
          </p>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-6 mb-8 border border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="games-genre" className="block text-sm font-medium text-gray-400 mb-2">Genre</label>
              <select id="games-genre" value={genre} onChange={e => setGenre(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
                {allGenres.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="games-platform" className="block text-sm font-medium text-gray-400 mb-2">Platform</label>
              <select id="games-platform" value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
                <option value="All">All Platforms</option>
                <option value="PC">PC</option>
                <option value="Multi">Multi-Platform</option>
              </select>
            </div>
            <div>
              <label htmlFor="games-rating" className="block text-sm font-medium text-gray-400 mb-2">Rating</label>
              <select id="games-rating" value={rating} onChange={e => setRating(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
                <option value="All">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
              </select>
            </div>
            <div>
              <label htmlFor="games-search" className="block text-sm font-medium text-gray-400 mb-2">Search</label>
              <input id="games-search" type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search games..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
          {visible.map(game => (
            <div key={game.id} onClick={() => setSelected(game)}>
              <GameCard game={game} onPlay={() => setSelected(game)} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Gamepad2 className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">No games match your filters</p>
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center">
            <button onClick={() => setVisibleCount(v => v + PAGE_SIZE)} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold">
              Load More Games ({visible.length} / {filtered.length})
            </button>
          </div>
        )}
      </div>

      {selected && (
        <InstantPlayModal game={selected} onClose={() => setSelected(null)} />
      )}
    </>
  )
}
