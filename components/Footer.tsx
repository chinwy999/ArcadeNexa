import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-nexa-navy/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2" aria-label="ArcadeNexa Home">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nexa-violet to-nexa-emerald flex items-center justify-center transform rotate-45">
                <span className="text-nexa-black font-black text-sm transform -rotate-45">N</span>
              </div>
              <span className="text-xl font-black tracking-wider">
                <span className="text-white">ARCADE</span><span className="gradient-text">NEXA</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm">Free HTML5 gaming platform. 13,000+ games, instant play, no download required.</p>
            <div className="flex items-center gap-2">
              <span className="bg-nexa-emerald/10 border border-nexa-emerald/20 text-nexa-emerald text-xs px-3 py-1 rounded-full font-bold">🎮 Free to Play</span>
              <span className="bg-white/5 border border-white/10 text-text-secondary text-xs px-3 py-1 rounded-full">No Login</span>
            </div>
          </div>

          <div>
            <h2 className="text-white font-semibold uppercase tracking-wider text-sm mb-4">Platform</h2>
            <ul className="space-y-2.5">
              <li><Link href="/games" className="text-text-secondary hover:text-white text-sm transition-colors">Games</Link></li>
              <li><Link href="/categories" className="text-text-secondary hover:text-white text-sm transition-colors">Categories</Link></li>
              <li><Link href="/search" className="text-text-secondary hover:text-white text-sm transition-colors">Search</Link></li>
              <li><Link href="/tournaments" className="text-text-secondary hover:text-white text-sm transition-colors">Tournaments</Link></li>
              <li><Link href="/leaderboard" className="text-text-secondary hover:text-white text-sm transition-colors">Leaderboard</Link></li>
              <li><Link href="/blog" className="text-text-secondary hover:text-white text-sm transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-white font-semibold uppercase tracking-wider text-sm mb-4">Support</h2>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-text-secondary hover:text-white text-sm transition-colors">About Us</Link></li>
              <li><Link href="/faq" className="text-text-secondary hover:text-white text-sm transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="text-text-secondary hover:text-white text-sm transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-white font-semibold uppercase tracking-wider text-sm mb-4">Legal</h2>
            <ul className="space-y-2.5">
              <li><Link href="/privacy" className="text-text-secondary hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-text-secondary hover:text-white text-sm transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="text-text-secondary hover:text-white text-sm transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-xs">© 2026 ArcadeNexa. All rights reserved. Games powered by GamePix & GameMonetize — all trademarks belong to their respective owners.</p>
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <span>🎮</span><span>Instant Play • No Download • Free Forever</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
