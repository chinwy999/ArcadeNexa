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
