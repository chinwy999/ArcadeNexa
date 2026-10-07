'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Gamepad2,
  Search,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'
import en from '@/lib/i18n/en'
import ar from '@/lib/i18n/ar'

export default function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isArabic = pathname === '/ar' || pathname.startsWith('/ar/')

  const t = isArabic ? ar : en

  // Convert the current public URL to the equivalent URL
  // in the other language while keeping the same route/slug.
  const getLocalizedPath = (targetLocale: 'en' | 'ar') => {
    if (targetLocale === 'ar') {
      if (isArabic) return pathname
      return pathname === '/' ? '/ar' : `/ar${pathname}`
    }

    if (!isArabic) return pathname

    const englishPath = pathname.slice(3)
    return englishPath || '/'
  }

  const navLinks = [
    { href: '/games', label: t.nav.games },
    { href: '/categories', label: t.nav.categories },
    { href: '/blog', label: t.nav.blog },
  ]

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = ''
      return
    }

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const isActive = (href: string) => {
    const currentPath = isArabic
      ? pathname === '/ar'
        ? '/'
        : pathname.slice(3) || '/'
      : pathname

    return currentPath === href || currentPath.startsWith(`${href}/`)
  }

  return (
    <header
      dir={isArabic ? 'rtl' : 'ltr'}
      className="fixed inset-x-0 top-0 z-50 border-b border-[color:var(--white-10)] bg-nexa-black/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

        <Link
          href={isArabic ? '/ar' : '/'}
          aria-label={isArabic ? 'الرئيسية - Arcadlo' : 'Arcadlo Home'}
          className="group flex items-center gap-2.5"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-nexa-violet to-nexa-emerald shadow-lg shadow-nexa-violet/20 transition-transform duration-300 group-hover:rotate-6">
            <Gamepad2 className="h-5 w-5 text-nexa-black" />
          </div>

          <span className="text-lg font-black tracking-tight sm:text-xl">
            <span className="text-[color:var(--text-primary)]">ARCAD</span>
            <span className="gradient-text">LO</span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label={isArabic ? 'التنقل الرئيسي' : 'Main navigation'}
        >
          {navLinks.map((link) => {
            const active = isActive(link.href)
            const href = isArabic ? `/ar${link.href}` : link.href

            return (
              <Link
                key={link.href}
                href={href}
                className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wide transition ${
                  active
                    ? 'bg-[color:var(--white-10)] text-[color:var(--text-primary)]'
                    : 'text-[color:var(--text-secondary)] hover:bg-[color:var(--white-05)] hover:text-[color:var(--text-primary)]'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">

          {/* Language switch */}
          <Link
            href={getLocalizedPath(isArabic ? 'en' : 'ar')}
            aria-label={isArabic ? 'English' : 'العربية'}
            className="flex h-10 items-center justify-center rounded-xl border border-[color:var(--white-10)] bg-[color:var(--white-05)] px-3 text-xs font-black text-[color:var(--text-secondary)] transition hover:border-[color:var(--white-20)] hover:bg-[color:var(--white-10)] hover:text-[color:var(--text-primary)]"
          >
            {isArabic ? 'EN' : 'ع'}
          </Link>

          <Link
            href={isArabic ? '/ar/search' : '/search'}
            aria-label={t.nav.search}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--white-10)] bg-[color:var(--white-05)] text-[color:var(--text-secondary)] transition hover:border-[color:var(--white-20)] hover:bg-[color:var(--white-10)] hover:text-[color:var(--text-primary)]"
          >
            <Search className="h-4 w-4" />
          </Link>

          <Link
            href={isArabic ? '/ar/games' : '/games'}
            className="rounded-xl bg-nexa-emerald px-4 py-2.5 text-xs font-black text-nexa-black shadow-lg shadow-nexa-emerald/10 transition hover:-translate-y-0.5 hover:shadow-nexa-emerald/20"
          >
            {t.nav.playNow}
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:hidden">

          {/* Mobile language switch */}
          <Link
            href={getLocalizedPath(isArabic ? 'en' : 'ar')}
            aria-label={isArabic ? 'English' : 'العربية'}
            className="flex h-10 min-w-10 items-center justify-center rounded-xl border border-[color:var(--white-10)] bg-[color:var(--white-05)] px-2.5 text-xs font-black text-[color:var(--text-primary)]"
          >
            {isArabic ? 'EN' : 'ع'}
          </Link>

          <Link
            href={isArabic ? '/ar/search' : '/search'}
            aria-label={t.nav.search}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--white-10)] bg-[color:var(--white-05)] text-[color:var(--text-primary)]"
          >
            <Search className="h-5 w-5" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--white-10)] bg-[color:var(--white-05)] text-[color:var(--text-primary)]"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-x-0 top-16 z-40 max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-[color:var(--white-10)] bg-nexa-black px-4 pb-6 pt-4 shadow-2xl lg:hidden">
          <div className="mx-auto max-w-7xl">

            <Link
              href={isArabic ? '/ar/games' : '/games'}
              className="mb-4 flex items-center justify-between rounded-2xl bg-gradient-to-r from-nexa-emerald to-nexa-cyan p-4 text-nexa-black"
            >
              <div>
                <p className="text-lg font-black">{t.nav.playNow}</p>
                <p className="text-xs font-semibold opacity-70">
                  {t.nav.browseAllGames}
                </p>
              </div>

              <ChevronRight className="h-6 w-6" />
            </Link>

            <nav
              className="grid gap-1"
              aria-label={isArabic ? 'التنقل الرئيسي' : 'Mobile navigation'}
            >
              {navLinks.map((link) => {
                const active = isActive(link.href)
                const href = isArabic ? `/ar${link.href}` : link.href

                return (
                  <Link
                    key={link.href}
                    href={href}
                    className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-bold transition ${
                      active
                        ? 'bg-nexa-violet/15 text-[color:var(--text-primary)]'
                        : 'text-[color:var(--text-secondary)] hover:bg-[color:var(--white-05)] hover:text-[color:var(--text-primary)]'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </Link>
                )
              })}
            </nav>

            <div className="mt-4 border-t border-[color:var(--white-10)] pt-4">

              <Link
                href={isArabic ? '/ar/about' : '/about'}
                className="block rounded-xl px-4 py-3 text-sm font-bold text-[color:var(--text-secondary)] hover:bg-[color:var(--white-05)] hover:text-[color:var(--text-primary)]"
              >
                {t.nav.about}
              </Link>

              <Link
                href={isArabic ? '/ar/contact' : '/contact'}
                className="block rounded-xl px-4 py-3 text-sm font-bold text-[color:var(--text-secondary)] hover:bg-[color:var(--white-05)] hover:text-[color:var(--text-primary)]"
              >
                {t.nav.contact}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
