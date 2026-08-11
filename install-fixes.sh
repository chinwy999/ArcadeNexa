#!/data/data/com.termux/files/usr/bin/bash
set -e

echo "====================================="
echo "ArcadeNexa Auto-Fix Script"
echo "====================================="

echo "[1/6] Creating backups..."
mkdir -p backups
[ -f src/pages/Games.tsx ] && cp src/pages/Games.tsx backups/Games.tsx.bak
[ -f src/services/gamepixService.ts ] && cp src/services/gamepixService.ts backups/gamepixService.ts.bak
[ -f src/pages/Home.tsx ] && cp src/pages/Home.tsx backups/Home.tsx.bak
[ -f src/components/GamePlayer.tsx ] && cp src/components/GamePlayer.tsx backups/GamePlayer.tsx.bak
echo "Backups created in ./backups/"

echo "[2/6] Fixing Games.tsx..."
cat > src/pages/Games.tsx << 'EOF'
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { gamepixService } from '../services/gamepixService';
import type { NormalizedGame } from '../types/game';
import { GameCard } from '../components/GameCard';
import { CatalogFilters } from '../components/CatalogFilters';

export function Games() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  
  const [games, setGames] = useState<NormalizedGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextPage, setNextPage] = useState(1);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<'popular' | 'new' | 'top'>('popular');

  useEffect(() => {
    gamepixService.loadCatalog(120).then(r => {
      setGames(r.games);
      setHasMore(r.hasMore);
      setNextPage(r.nextPage);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    const newParams = new URLSearchParams(searchParams);
    if (newCategory === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', newCategory);
    }
    setSearchParams(newParams);
  };

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const r = await gamepixService.loadMore(nextPage);
      setGames(r.games);
      setHasMore(r.hasMore);
      setNextPage(r.nextPage);
    } finally {
      setLoadingMore(false);
    }
  };

  const displayed = useMemo(() => {
    let list = games;
    list = gamepixService.filterByCategory(list, category);
    if (query) list = gamepixService.search(list, query);
    
    switch (sort) {
      case 'top':
        return [...list].sort((a, b) => b.qualityScore - a.qualityScore);
      case 'new':
        return [...list].sort((a, b) => 
          new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
        );
      case 'popular':
      default:
        return gamepixService.getPopularGames(list, list.length);
    }
  }, [games, query, category, sort]);

  const featured = useMemo(() => gamepixService.getPopularGames(games, 4), [games]);

  return (
    <>
      <Helmet>
        <title>All Games | ArcadeNexa</title>
        <meta name="description" content={`Browse ${games.length}+ free HTML5 games.`} />
      </Helmet>
      <div className="page">
        <h1>All Games</h1>
        <p>{games.length.toLocaleString()} HTML5 games loaded. {hasMore && 'More available!'}</p>
        
        {featured.length > 0 && (
          <section>
            <h2>Featured</h2>
            <div className="game-grid game-grid--large">
              {featured.map(g => <GameCard key={g.slug} game={g} variant="large" />)}
            </div>
          </section>
        )}
        
        <CatalogFilters 
          query={query} 
          onQueryChange={setQuery} 
          category={category} 
          onCategoryChange={handleCategoryChange} 
          totalCount={games.length} 
          filteredCount={displayed.length} 
        />
        
        <div className="sort-row">
          <button className={sort === 'popular' ? 'active' : ''} onClick={() => setSort('popular')}>Popular</button>
          <button className={sort === 'top' ? 'active' : ''} onClick={() => setSort('top')}>Top Quality</button>
          <button className={sort === 'new' ? 'active' : ''} onClick={() => setSort('new')}>New</button>
        </div>
        
        {loading ? (
          <div className="loader">Loading catalog...</div>
        ) : (
          <>
            <div className="game-grid">
              {displayed.map(g => <GameCard key={g.slug} game={g} />)}
            </div>
            {displayed.length === 0 && <p className="loader">No games match your filters.</p>}
            {hasMore && (
              <button className="load-more" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? 'Loading...' : `Load more games (${games.length} loaded)`}
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
}
EOF
echo "Games.tsx updated"

echo "[3/6] Fixing gamepixService.ts..."
cat > src/services/gamepixService.ts << 'EOF'
import type { GamePixFeedResponse, NormalizedGame } from '../types/game';
import { mapCategory } from '../utils/categories';

const SID = (import.meta as any).env?.VITE_GAMEPIX_SID || 'DXXR1';
const API_BASE = '/api/gamepix-proxy';
const CACHE_KEY = 'arcadenexa:catalog:v2';
const CACHE_TTL = 1000 * 60 * 60 * 6;
const PAGE_SIZE = 24;

const MANUAL_GAMES: NormalizedGame[] = [];

function normalizeGame(i: any): NormalizedGame {
  return {
    id: i.id, namespace: i.namespace, slug: i.namespace || String(i.id).toLowerCase(),
    title: i.title, description: i.description || '',
    category: mapCategory(i.category), originalCategory: i.category || '',
    orientation: i.orientation || 'landscape',
    qualityScore: Number(i.quality_score) || 0,
    width: Number(i.width) || 800, height: Number(i.height) || 600,
    dateModified: i.date_modified || '', datePublished: i.date_published || '',
    bannerImage: i.banner_image || i.image || '', image: i.image || i.banner_image || '',
    gameUrl: i.url, source: 'gamepix',
  };
}

function dedupe(games: NormalizedGame[]): NormalizedGame[] {
  const seen = new Set<string>();
  return games.filter(g => {
    const key = `${g.id}|${g.namespace}`.toLowerCase();
    if (seen.has(key)) {
      console.warn(`Duplicate skipped: ${g.title}`);
      return false;
    }
    seen.add(key);
    return true;
  });
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (Date.now() - p.timestamp > CACHE_TTL) return null;
    return p;
  } catch { return null; }
}

function writeCache(games: NormalizedGame[], nextPage: number) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ games, nextPage, timestamp: Date.now() }));
  } catch {}
}

async function fetchFeedPage(page: number): Promise<GamePixFeedResponse> {
  const res = await fetch(`${API_BASE}?page=${page}&pagination=${PAGE_SIZE}&sid=${SID}`);
  if (!res.ok) throw new Error(`Feed request failed: ${res.status}`);
  return res.json();
}

async function fetchPages(startPage: number, count: number) {
  const games: NormalizedGame[] = [];
  let page = startPage, hasMore = true, totalPages = 0;
  for (let i = 0; i < count; i++) {
    try {
      const feed = await fetchFeedPage(page);
      const m = feed.last_page_url?.match(/page=(\d+)/);
      if (m) totalPages = parseInt(m[1], 10);
      games.push(...feed.items.map(normalizeGame));
      hasMore = !!feed.next_url;
      if (!hasMore) break;
      page++;
    } catch (e) { console.warn(`Feed page ${page} failed`, e); break; }
  }
  return { games, hasMore, nextPage: page + 1, totalPages };
}

export const gamepixService = {
  async loadCatalog(targetCount = 120) {
    const cached = readCache();
    if (cached && cached.games.length >= targetCount) {
      return { 
        games: dedupe([...MANUAL_GAMES, ...cached.games]), 
        hasMore: true, 
        nextPage: cached.nextPage, 
        totalPages: 0 
      };
    }
    const pages = Math.max(1, Math.ceil(targetCount / PAGE_SIZE));
    const r = await fetchPages(cached?.nextPage ?? 1, pages);
    const merged = cached ? [...cached.games, ...r.games] : r.games;
    const deduped = dedupe([...MANUAL_GAMES, ...merged]);
    writeCache(deduped.filter(g => g.source === 'gamepix'), r.nextPage);
    return { games: deduped, hasMore: r.hasMore, nextPage: r.nextPage, totalPages: r.totalPages };
  },

  async loadMore(currentPage: number) {
    const r = await fetchPages(currentPage, 1);
    const cached = readCache();
    const merged = dedupe([...(cached?.games || []), ...r.games, ...MANUAL_GAMES]);
    writeCache(merged.filter(g => g.source === 'gamepix'), r.nextPage);
    return { games: merged, hasMore: r.hasMore, nextPage: r.nextPage };
  },

  getTopGames(g: NormalizedGame[], n = 24) {
    return [...g].sort((a, b) => b.qualityScore - a.qualityScore).slice(0, n);
  },
  
  getNewGames(g: NormalizedGame[], n = 24) {
    return [...g].sort((a, b) => 
      new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
    ).slice(0, n);
  },
  
  getPopularGames(g: NormalizedGame[], n = 24) {
    const now = Date.now();
    return g.map(x => ({
      x, 
      s: x.qualityScore * 0.7 + (1 / Math.log10(Math.max(1, (now - new Date(x.datePublished).getTime()) / 86400000) + 1)) * 0.3
    }))
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map(y => y.x);
  },
  
  filterByCategory(g: NormalizedGame[], c: string) {
    return (!c || c === 'all') ? g : g.filter(x => x.category === c);
  },
  
  search(g: NormalizedGame[], q: string) {
    const s = q.trim().toLowerCase();
    if (!s) return g;
    return g.filter(x => 
      x.title.toLowerCase().includes(s) || 
      x.description.toLowerCase().includes(s) || 
      x.category.toLowerCase().includes(s) || 
      x.originalCategory.toLowerCase().includes(s)
    );
  },
  
  clearCache() { localStorage.removeItem(CACHE_KEY); },
};
EOF
echo "gamepixService.ts updated"

echo "[4/6] Fixing Home.tsx..."
cat > src/pages/Home.tsx << 'EOF'
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { gamepixService } from '../services/gamepixService';
import type { NormalizedGame } from '../types/game';
import { GameCard } from '../components/GameCard';
import { ALL_CATEGORIES } from '../utils/categories';

export function Home() {
  const [games, setGames] = useState<NormalizedGame[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    gamepixService.loadCatalog(120).then(r => {
      setGames(r.games);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);
  
  const popular = useMemo(() => gamepixService.getPopularGames(games, 8), [games]);
  const newest = useMemo(() => gamepixService.getNewGames(games, 8), [games]);
  const topQuality = useMemo(() => gamepixService.getTopGames(games, 8), [games]);
  
  if (loading) return <div className="loader">Loading...</div>;
  
  return (
    <>
      <Helmet>
        <title>ArcadeNexa — {games.length}+ Free HTML5 Games</title>
        <meta name="description" content="Play thousands of free HTML5 games on ArcadeNexa." />
        <meta property="og:title" content="ArcadeNexa" />
        <meta property="og:description" content={`${games.length}+ free HTML5 games.`} />
      </Helmet>
      
      <div className="page">
        <header className="hero">
          <h1>ArcadeNexa</h1>
          <p>{games.length.toLocaleString()}+ free HTML5 games - instant browser play.</p>
          <Link className="btn" to="/games">Browse all games</Link>
        </header>
        
        <section>
          <h2>Popular Now</h2>
          <div className="game-grid game-grid--large">
            {popular.map(g => <GameCard key={g.slug} game={g} variant="large" />)}
          </div>
        </section>
        
        <section>
          <h2>New Games</h2>
          <div className="game-grid">
            {newest.map(g => <GameCard key={g.slug} game={g} />)}
          </div>
        </section>
        
        <section>
          <h2>Top Quality</h2>
          <div className="game-grid">
            {topQuality.map(g => <GameCard key={g.slug} game={g} />)}
          </div>
        </section>
        
        <section>
          <h2>Browse by Category</h2>
          <div className="category-grid">
            {ALL_CATEGORIES.map(c => (
              <Link key={c} className="category-tile" to={`/games?category=${c}`}>
                {c}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
EOF
echo "Home.tsx updated"

echo "[5/6] Fixing GamePlayer.tsx..."
cat > src/components/GamePlayer.tsx << 'EOF'
import { useEffect, useRef, useState } from 'react';
import type { NormalizedGame } from '../types/game';

export function GamePlayer({ game }: { game: NormalizedGame }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: game.width, h: game.height });

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    
    const updateSize = () => {
      const cw = container.clientWidth;
      const aspectRatio = game.height / game.width;
      const targetW = Math.min(cw - 32, game.width);
      setSize({ w: targetW, h: Math.round(targetW * aspectRatio) });
    };
    
    updateSize();
    
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);
    window.addEventListener('resize', updateSize);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [game.width, game.height]);

  return (
    <div ref={ref} className="game-player" data-orientation={game.orientation}>
      <iframe 
        src={game.gameUrl} 
        title={game.title} 
        width={size.w} 
        height={size.h}
        allow="autoplay; fullscreen; gamepad" 
        allowFullScreen 
        loading="lazy" 
        style={{ 
          border: 0,
          maxWidth: '100%',
          display: 'block',
          margin: '0 auto'
        }} 
      />
    </div>
  );
}
EOF
echo "GamePlayer.tsx updated"

echo "[6/6] Building project..."
npm run build

if [ -d "dist" ]; then
  echo ""
  echo "====================================="
  echo "Build completed successfully!"
  echo "====================================="
  echo "Output directory: dist/"
  ls -lh dist/
  echo ""
  echo "Next steps:"
  echo "1. Commit changes: git add . && git commit -m 'fix: resolve issues'"
  echo "2. Push to repo: git push"
  echo "3. Deploy to Vercel/Netlify"
  echo ""
else
  echo ""
  echo "ERROR: Build failed!"
  echo "Check the error messages above."
fi
