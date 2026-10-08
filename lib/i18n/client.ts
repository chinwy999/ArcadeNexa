'use client'

import { usePathname } from 'next/navigation'
import { getTranslations, type Locale } from './index'

export function getClientLocale(pathname: string): Locale {
  return pathname === '/ar' || pathname.startsWith('/ar/')
    ? 'ar'
    : 'en'
}

export function useClientTranslations() {
  const pathname = usePathname()
  const locale = getClientLocale(pathname)
  const t = getTranslations(locale)

  return { locale, t }
}

export function localizedPath(pathname: string, locale: Locale): string {
  if (locale === 'en') {
    return pathname.startsWith('/ar/')
      ? pathname.slice(3) || '/'
      : pathname === '/ar'
        ? '/'
        : pathname
  }

  if (pathname === '/') return '/ar'
  if (pathname.startsWith('/ar/')) return pathname
  return `/ar${pathname}`
}
