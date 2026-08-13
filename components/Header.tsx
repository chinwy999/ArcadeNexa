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

const navLinks = [
  { href: '/games', label: 'Games' },
  { href: '/categories', label: 'Categories' },
  { href: '/tournaments', label: 'Tournaments' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/news', label: 'News' },
]

export default function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

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

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-space-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

        <Link
          href="/"
          aria-label="ArcadeNexa Home"
          className="group flex items-center gap-2.5"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-electric-violet to-neon-green shadow-lg shadow-electric-violet/20 transition-transform duration-300 group-hover:rotate-6">
            <Gamepad2 className="h-5 w-5 text-space-black" />
          </div>

          <span className="text-lg font-black tracking-tight sm:text-xl">
            <span className="text-white">ARCADE</span>
            <span className="gradient-text">NEXA</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navLinks.map((link) => {
            const active = isActive(link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wide transition ${
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-text-secondary hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <Link
            href="/search"
            aria-label="Search games"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-text-secondary transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <Search className="h-4 w-4" />
          </Link>

          <Link
            href="/games"
            className="rounded-xl bg-neon-green px-4 py-2.5 text-xs font-black text-space-black shadow-lg shadow-neon-green/10 transition hover:-translate-y-0.5 hover:shadow-neon-green/20"
          >
            PLAY NOW
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:hidden">
          <Link
            href="/search"
            aria-label="Search games"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white"
          >
            <Search className="h-5 w-5" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white"
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
        <div className="border-t border-white/10 bg-space-black/98 px-4 pb-6 pt-4 shadow-2xl lg:hidden">
          <div className="mx-auto max-w-7xl">

            <Link
              href="/games"
              className="mb-4 flex items-center justify-between rounded-2xl bg-gradient-to-r from-neon-green to-emerald-400 p-4 text-space-black"
            >
              <div>
                <p className="text-lg font-black">PLAY NOW</p>
                <p className="text-xs font-semibold opacity-70">
                  Browse all games
                </p>
              </div>

              <ChevronRight className="h-6 w-6" />
            </Link>

            <nav className="grid gap-1" aria-label="Mobile navigation">
              {navLinks.map((link) => {
                const active = isActive(link.href)

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-bold transition ${
                      active
                        ? 'bg-electric-violet/15 text-white'
                        : 'text-text-secondary hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </Link>
                )
              })}
            </nav>

            <div className="mt-4 border-t border-white/10 pt-4">
              <Link
                href="/about"
                className="block rounded-xl px-4 py-3 text-sm font-bold text-text-secondary hover:bg-white/5 hover:text-white"
              >
                About ArcadeNexa
              </Link>

              <Link
                href="/contact"
                className="block rounded-xl px-4 py-3 text-sm font-bold text-text-secondary hover:bg-white/5 hover:text-white"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
