'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Search, LogIn, Menu, X, Sword } from 'lucide-react'

const navLinks = [
  { href: '/games', label: 'Games' },
  { href: '/tournaments', label: 'Tournaments' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/news', label: 'News' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push('/search')
    }
    setSearchOpen(false)
    setSearchQuery('')
    setMobileOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" aria-label="ArcadeNexa Home">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric-violet to-neon-green flex items-center justify-center transform rotate-45 group-hover:rotate-0 transition-transform duration-300">
            <span className="text-space-black font-black text-sm transform -rotate-45 group-hover:rotate-0 transition-transform duration-300">N</span>
          </div>
          <span className="text-xl font-black tracking-wider">
            <span className="text-white">ARCADE</span><span className="gradient-text">NEXA</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium uppercase tracking-wider transition-colors duration-300 relative group ${pathname === link.href || pathname.startsWith(link.href + '/') ? 'text-white' : 'text-text-secondary hover:text-white'}`}
            >
              {link.label}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-electric-violet transition-all duration-300 ${pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search games..."
                  className="bg-elevated border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white w-56 focus:ring-2 focus:ring-electric-violet outline-none"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="ml-2 p-1 text-text-secondary hover:text-white" aria-label="Close search">
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="p-2 text-text-secondary hover:text-white transition-colors" aria-label="Open search">
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          <Link href="/login" className="flex items-center gap-2 bg-electric-violet hover:bg-violet-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 neon-glow hover:scale-105">
            <LogIn className="w-4 h-4" /> LOGIN
          </Link>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-text-secondary hover:text-white transition-colors" aria-label="Toggle menu" aria-expanded={mobileOpen}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 top-16 bg-space-black/95 backdrop-blur-xl z-40 p-6 md:hidden flex flex-col gap-6 animate-fade-in overflow-y-auto">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search games..."
              className="flex-1 bg-elevated border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-electric-violet outline-none"
            />
            <button type="submit" className="bg-electric-violet text-white px-4 py-3 rounded-xl"><Search className="w-5 h-5" /></button>
          </form>
          <div className="flex flex-col gap-4">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={`text-lg font-bold uppercase tracking-wider ${pathname === link.href ? 'text-electric-violet' : 'text-white'}`}>
                {link.label}
              </Link>
            ))}
            <Link href="/categories" onClick={() => setMobileOpen(false)} className="text-lg font-bold uppercase tracking-wider text-white">Categories</Link>
            <Link href="/about" onClick={() => setMobileOpen(false)} className="text-lg font-bold uppercase tracking-wider text-white">About</Link>
            <Link href="/search" onClick={() => setMobileOpen(false)} className="text-lg font-bold uppercase tracking-wider text-white">Search</Link>
          </div>
          <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
            <Link href="/register" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 bg-electric-violet text-white px-6 py-3 rounded-xl font-bold">
              <Sword className="w-5 h-5" /> JOIN NOW
            </Link>
            <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 border border-white/20 text-white px-6 py-3 rounded-xl font-bold">
              <LogIn className="w-5 h-5" /> LOGIN
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
