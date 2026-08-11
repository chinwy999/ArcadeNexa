import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const CACHE_TTL_MS = 1000 * 60 * 60;
const memCache = new Map<string, { data: unknown; timestamp: number }>();

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
      return NextResponse.json(cached.data);
    }

    const url = `https://feeds.gamepix.com/v2/json?sid=${encodeURIComponent(sid)}&pagination=${pagination}&page=${page}&order=${order}`;
    const response = await fetch(url, {
      headers: { Accept: 'application/feed+json, application/json' },
    });

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: `Upstream error: ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    memCache.set(cacheKey, { data, timestamp: Date.now() });

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=3600' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
