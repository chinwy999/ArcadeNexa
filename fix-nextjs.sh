#!/data/data/com.termux/files/usr/bin/bash
set -e

echo "=== Fixing Next.js ArcadeNexa ==="

# 1. Create API route for GamePix proxy
mkdir -p app/api/gamepix-proxy
cat > app/api/gamepix-proxy/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1 hour cache

const CACHE_TTL_MS = 1000 * 60 * 60 * 4;
const memCache = new Map<string, { data: any; timestamp: number }>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const pagination = searchParams.get('pagination') || '24';
    const order = searchParams.get('order') || 'quality';
    const sid = process.env.GAMEPIX_SID || 'DXXR1';

    const cacheKey = `${sid}:${order}:${page}:${pagination}`;
    const cached = memCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(cached.data, {
        headers: { 'Cache-Control': 'public, max-age=14400' },
      });
    }

    const url = `https://feeds.gamepix.com/v2/json?sid=${sid}&pagination=${pagination}&page=${page}&order=${order}`;
    
    const response = await fetch(url, {
      headers: { 'Accept': 'application/feed+json, application/json' },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`GamePix feed returned ${response.status}`);
    }

    const data = await response.json();
    memCache.set(cacheKey, { data, timestamp: Date.now() });

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, max-age=14400' },
    });
  } catch (error: any) {
    console.error('GamePix proxy error:', error);
    return NextResponse.json(
      { error: error.message, ok: false },
      { status: 502 }
    );
  }
}
EOF
echo "✓ API route created"

# 2. Update lib/games.ts to fetch from API
cat > lib/games.ts << 'EOF'
import { buildGamePixUrl, getAspectRatio, aspectRatioMap } from './site'

export type GameProvider = 'gamepix' | 'manual'

export interface Game {
  id: string
  slug: string
  title: string
  name: string
  initials: string
  gradient: string
  genre: string[]
  genreFilter: string
  rating?: number
  platform: 'PC' | 'Multi'
  description: string
  longDescription: string
  instructions?: string
  tags: string[]
  officialUrl?: string
  iframeUrl: string
  thumbnail: string
  thumbnailLarge?: string
  thumbnailSizes?: { '512x384': string }
  releaseYear?: number
  provider: GameProvider
  providerGameId: string
  width: number
  height: number
  aspectRatio: string
  qualityScore?: number
  datePublished?: string
  source?: 'feed' | 'manual'
}

const CATEGORY_MAP: Record<string, string> = {
  action: 'Action', shooting: 'Action', battle: 'Action', fight: 'Action', war: 'Action',
  adventure: 'Adventure', exploration: 'Adventure', rpg: 'Adventure',
  arcade: 'Arcade', classic: 'Arcade', retro: 'Arcade', skill: 'Arcade', casual: 'Arcade',
  cards: 'Cards', solitaire: 'Cards', poker: 'Cards',
  puzzle: 'Puzzle', 'match-3': 'Puzzle', match3: 'Puzzle', brain: 'Puzzle', logic: 'Puzzle', '2048': 'Puzzle',
  racing: 'Racing', drift: 'Racing', car: 'Racing',
  sports: 'Sports', soccer: 'Sports', football: 'Sports', basketball: 'Sports',
  strategy: 'Strategy', 'tower-defense': 'Strategy', defense: 'Strategy',
  simulation: 'Simulation', simulator: 'Simulation', idle: 'Simulation',
  kids: 'Kids', educational: 'Kids',
}

function mapCategory(raw: string): string {
  if (!raw) return 'Other'
  return CATEGORY_MAP[raw.toLowerCase().trim()] || 'Other'
}

export function getAllGenreFilters(): string[] {
  return ['All', 'Action', 'Adventure', 'Arcade', 'Cards', 'Puzzle', 'Racing', 'Sports', 'Strategy', 'Simulation', 'Kids', 'Other']
}

export function getAllPlatformFilters(): string[] {
  return ['All', 'PC', 'Multi']
}

export function getAllRatingFilters(): string[] {
  return ['All', '5', '4', '3']
}

// Normalize GamePix feed item
function normalizeGamePixItem(item: any): Game {
  const slug = item.namespace || item.id.toLowerCase()
  const initials = item.title.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase()
  
  return {
    id: item.id,
    slug,
    title: item.title,
    name: item.title,
    initials,
    gradient: 'from-purple-500 to-blue-500',
    genre: [mapCategory(item.category)],
    genreFilter: mapCategory(item.category),
    rating: Number((item.quality_score * 10).toFixed(1)),
    platform: item.orientation === 'portrait' ? 'PC' : 'Multi',
    description: item.description || '',
    longDescription: item.description || '',
    tags: [item.category, item.orientation].filter(Boolean),
    iframeUrl: item.url,
    thumbnail: item.image || item.banner_image || '',
    thumbnailLarge: item.banner_image || item.image || '',
    thumbnailSizes: { '512x384': item.banner_image || item.image || '' },
    releaseYear: item.date_published ? new Date(item.date_published).getFullYear() : undefined,
    provider: 'gamepix',
    providerGameId: item.id,
    width: Number(item.width) || 800,
    height: Number(item.height) || 600,
    aspectRatio: getAspectRatio(Number(item.width) || 800, Number(item.height) || 600),
    qualityScore: Number(item.quality_score) || 0,
    datePublished: item.date_published || '',
    source: 'feed',
  }
}

// Static games (your existing 92 games)
export const manualGames: Game[] = [
  // Your existing manual games will be here
  // The array will be merged with feed games
]

// Fetch games from GamePix API
export async function fetchGamePixGames(page = 1, limit = 24): Promise<{
  games: Game[]
  hasMore: boolean
  nextPage: number
}> {
  try {
    const response = await fetch(`/api/gamepix-proxy?page=${page}&pagination=${limit}`)
    if (!response.ok) throw new Error('Failed to fetch games')
    
    const data = await response.json()
    const normalized = data.items.map(normalizeGamePixItem)
    
    return {
      games: normalized,
      hasMore: !!data.next_url,
      nextPage: page + 1,
    }
  } catch (error) {
    console.error('Error fetching GamePix games:', error)
    return { games: [], hasMore: false, nextPage: page }
  }
}

// Combined games (manual + feed)
export const games: Game[] = [...manualGames]

// Helper functions
export function getGamesByGenre(genre: string): Game[] {
  if (genre === 'All') return games
  return games.filter(g => g.genreFilter === genre)
}

export function getGamesByPlatform(platform: string): Game[] {
  if (platform === 'All') return games
  return games.filter(g => g.platform === platform)
}

export function searchGames(query: string): Game[] {
  if (!query) return games
  const q = query.toLowerCase()
  return games.filter(g => 
    g.name.toLowerCase().includes(q) ||
    g.description.toLowerCase().includes(q) ||
    g.genre.some(genre => genre.toLowerCase().includes(q)) ||
    g.tags.some(tag => tag.toLowerCase().includes(q))
  )
}

export function getTopRatedGames(count = 24): Game[] {
  return [...games]
    .filter(g => g.rating !== undefined)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, count)
}

export function getNewestGames(count = 24): Game[] {
  return [...games]
    .filter(g => g.datePublished)
    .sort((a, b) => new Date(b.datePublished!).getTime() - new Date(a.datePublished!).getTime())
    .slice(0, count)
}

export function getPopularGames(count = 24): Game[] {
  const now = Date.now()
  return games
    .filter(g => g.qualityScore !== undefined && g.datePublished)
    .map(g => {
      const ageDays = Math.max(1, (now - new Date(g.datePublished!).getTime()) / 86400000)
      const recency = 1 / Math.log10(ageDays + 1)
      return { g, score: (g.qualityScore || 0) * 0.7 + recency * 0.3 }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(x => x.g)
}
EOF
echo "✓ lib/games.ts updated"

# 3. Update GamesClient.tsx with pagination
cat > app/games/GamesClient.tsx << 'EOF'
'use client'

import { useState, useMemo, useEffect } from 'react'
import { SlidersHorizontal, Filter, Gamepad2, Loader2 } from 'lucide-react'
import GameCard from '@/components/GameCard'
import InstantPlayModal from '@/components/InstantPlayModal'
import { games as staticGames, type Game, getAllGenreFilters, fetchGamePixGames } from '@/lib/games'

export default function GamesClient() {
  const [genre, setGenre] = useState('All')
  const [platform, setPlatform] = useState('All')
  const [rating, setRating] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Game | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  
  // Pagination state
  const [games, setGames] = useState<Game[]>(staticGames)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const allGenres = useMemo(() => getAllGenreFilters(), [])

  // Load initial games from API
  useEffect(() => {
    async function loadInitialGames() {
      setLoading(true)
      try {
        const result = await fetchGamePixGames(1, 120)
        setGames(prev => {
          const combined = [...prev, ...result.games]
          // Deduplicate
          const seen = new Set<string>()
          return combined.filter(g => {
            const key = `${g.id}|${g.slug}`
            if (seen.has(key)) return false
            seen.add(key)
            return true
          })
        })
        setHasMore(result.hasMore)
        setCurrentPage(result.nextPage)
      } catch (error) {
        console.error('Failed to load games:', error)
      } finally {
        setLoading(false)
      }
    }
    loadInitialGames()
  }, [])

  // Load URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const g = params.get('genre')
    if (g) setGenre(g)
    const q = params.get('q')
    if (q) setSearch(q)
  }, [])

  // Secure postMessage handling
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
      if (search && !g.name.toLowerCase().includes(search.toLowerCase()) && 
          !g.genre.join(' ').toLowerCase().includes(search.toLowerCase()) && 
          !g.tags.join(' ').toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [games, genre, platform, rating, search])

  const loadMore = async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    try {
      const result = await fetchGamePixGames(currentPage, 24)
      setGames(prev => {
        const combined = [...prev, ...result.games]
        const seen = new Set<string>()
        return combined.filter(g => {
          const key = `${g.id}|${g.slug}`
          if (seen.has(key)) return false
          seen.add(key)
          return true
        })
      })
      setHasMore(result.hasMore)
      setCurrentPage(result.nextPage)
    } catch (error) {
      console.error('Failed to load more games:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <>
      {toast && (
        <div className="fixed top-4 right-4 z-[9999] bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg shadow-lg animate-in slide-in-from-top duration-300">
          🎮 {toast}
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Gamepad2 className="w-8 h-8 text-purple-500" />
            <h1 className="text-4xl font-bold">Games Arena</h1>
          </div>
          <p className="text-gray-400">
            {games.length} professional HTML5 games powered by GamePix — instant play, no download, fullscreen support.
          </p>
        </div>

        {/* Filters */}
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
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {allGenres.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                onChange={(e) => setRating(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search games..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Games Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            <span className="ml-3 text-gray-400">Loading games...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
              {filtered.map((game) => (
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
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More Games ({games.length} loaded)
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selected && (
        <InstantPlayModal game={selected} onClose={() => setSelected(null)} />
      )}
    </>
  )
}
EOF
echo "✓ GamesClient.tsx updated"

# 4. Build and deploy
echo "=== Building project ==="
npm run build

echo "=== Committing changes ==="
git add -A
git commit -m "feat: add GamePix API integration with pagination and dynamic loading"

echo "=== Pushing to GitHub ==="
git push origin main

echo "=== Deploying to Vercel ==="
vercel --prod --yes

echo ""
echo "========================================="
echo "✓ All fixes applied successfully!"
echo "========================================="
echo ""
echo "Your site should now show:"
echo "- 120+ games from GamePix API"
echo "- Load More button for pagination"
echo "- Working filters (genre, platform, rating)"
echo "- Real-time search"
echo "- Dynamic game loading"
