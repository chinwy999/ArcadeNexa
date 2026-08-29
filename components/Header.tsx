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
  { href: '/blog', label: 'Blog' },
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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[color:var(--white-10)] bg-nexa-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

        <Link
          href="/"
          aria-label="ArcadeNexa Home"
          className="group flex items-center gap-2.5"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-nexa-violet to-nexa-emerald shadow-lg shadow-nexa-violet/20 transition-transform duration-300 group-hover:rotate-6">
            <Gamepad2 className="h-5 w-5 text-nexa-black" />
          </div>

          <span className="text-lg font-black tracking-tight sm:text-xl">
            <span className="text-[color:var(--text-primary)]">ARCADE</span>
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
          <Link
            href="/search"
            aria-label="Search games"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--white-10)] bg-[color:var(--white-05)] text-[color:var(--text-secondary)] transition hover:border-[color:var(--white-20)] hover:bg-[color:var(--white-10)] hover:text-[color:var(--text-primary)]"
          >
            <Search className="h-4 w-4" />
          </Link>

          <Link
            href="/games"
            className="rounded-xl bg-nexa-emerald px-4 py-2.5 text-xs font-black text-nexa-black shadow-lg shadow-nexa-emerald/10 transition hover:-translate-y-0.5 hover:shadow-nexa-emerald/20"
          >
            PLAY NOW
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:hidden">
          <Link
            href="/search"
            aria-label="Search games"
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
        <div className="fixed inset-x-0 top-16 z-40 border-t border-[color:var(--white-10)] bg-nexa-black px-4 pb-6 pt-4 shadow-2xl lg:hidden overflow-y-auto max-h-[calc(100vh-4rem)]">
          <div className="mx-auto max-w-7xl">

            <Link
              href="/games"
              className="mb-4 flex items-center justify-between rounded-2xl bg-gradient-to-r from-nexa-emerald to-nexa-cyan p-4 text-nexa-black"
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
                href="/about"
                className="block rounded-xl px-4 py-3 text-sm font-bold text-[color:var(--text-secondary)] hover:bg-[color:var(--white-05)] hover:text-[color:var(--text-primary)]"
              >
                About ArcadeNexa
              </Link>

              <Link
                href="/contact"
                className="block rounded-xl px-4 py-3 text-sm font-bold text-[color:var(--text-secondary)] hover:bg-[color:var(--white-05)] hover:text-[color:var(--text-primary)]"
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
