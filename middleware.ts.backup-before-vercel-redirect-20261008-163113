import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const LOCALES = ['en', 'ar'] as const
type Locale = (typeof LOCALES)[number]

function getLocaleFromPath(pathname: string): {
  locale: Locale
  pathname: string
} {
  if (pathname === '/ar') {
    return {
      locale: 'ar',
      pathname: '/',
    }
  }

  if (pathname.startsWith('/ar/')) {
    return {
      locale: 'ar',
      pathname: pathname.slice(3) || '/',
    }
  }

  return {
    locale: 'en',
    pathname,
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const { locale, pathname: internalPathname } =
    getLocaleFromPath(pathname)

  // Keep the existing invalid-game-slug protection.
  if (internalPathname.startsWith('/games/')) {
    const slug = internalPathname.slice('/games/'.length).split('/')[0]

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

  // English keeps the existing URL structure.
  if (locale === 'en') {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-arcade-locale', locale)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // Arabic uses /ar/... publicly but internally renders the
  // existing Next.js route without changing the browser URL.
  const url = request.nextUrl.clone()
  url.pathname = internalPathname

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-arcade-locale', locale)

  return NextResponse.rewrite(url, {
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml)$).*)',
  ],
}
