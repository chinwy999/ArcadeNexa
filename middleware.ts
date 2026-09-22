import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/games/')) {
    const slug = pathname.slice('/games/'.length).split('/')[0]

    const invalidSlug =
      !slug ||
      slug === 'null' ||
      slug === 'undefined' ||
      slug === '[object object]'

    if (invalidSlug) {
      return new NextResponse(null, {
        status: 404,
        headers: {
          'Cache-Control': 'no-store',
        },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/games/:path*'],
}
