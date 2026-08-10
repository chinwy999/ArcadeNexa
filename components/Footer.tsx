import Link from 'next/link'
import { Twitter, Youtube, Twitch, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark-navy/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2" aria-label="ArcadeNexa Home">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric-violet to-neon-green flex items-center justify-center transform rotate-45">
                <span className="text-space-black font-black text-sm transform -rotate-45">N</span>
              </div>
              <span className="text-xl font-black tracking-wider">
                <span className="text-white">ARCADE</span><span className="gradient-text">NEXA</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm">Professional HTML5 gaming platform powered by GamePix. Instant play, no download required.</p>
            <div className="flex items-center gap-3">
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="p-2 rounded-lg bg-white/5 text-text-secondary hover:text-white hover:bg-white/10 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="p-2 rounded-lg bg-white/5 text-text-secondary hover:text-white hover:bg-white/10 transition-all">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://twitch.tv/" target="_blank" rel="noopener noreferrer" aria-label="Twitch" className="p-2 rounded-lg bg-white/5 text-text-secondary hover:text-white hover:bg-white/10 transition-all">
                <Twitch className="w-4 h-4" />
              </a>
              <a href="https://discord.gg/" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="p-2 rounded-lg bg-white/5 text-text-secondary hover:text-white hover:bg-white/10 transition-all">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-sm mb-4">Platform</h4>
            <ul className="space-y-2.5">
              <li><Link href="/games" className="text-text-secondary hover:text-white text-sm transition-colors">Games</Link></li>
              <li><Link href="/tournaments" className="text-text-secondary hover:text-white text-sm transition-colors">Tournaments</Link></li>
              <li><Link href="/leaderboard" className="text-text-secondary hover:text-white text-sm transition-colors">Leaderboard</Link></li>
              <li><Link href="/news" className="text-text-secondary hover:text-white text-sm transition-colors">News</Link></li>
              <li><Link href="/categories" className="text-text-secondary hover:text-white text-sm transition-colors">Categories</Link></li>
              <li><Link href="/search" className="text-text-secondary hover:text-white text-sm transition-colors">Search</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-sm mb-4">Support</h4>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-text-secondary hover:text-white text-sm transition-colors">About Us</Link></li>
              <li><Link href="/faq" className="text-text-secondary hover:text-white text-sm transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="text-text-secondary hover:text-white text-sm transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="text-text-secondary hover:text-white text-sm transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-sm mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li><Link href="/privacy" className="text-text-secondary hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-text-secondary hover:text-white text-sm transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="text-text-secondary hover:text-white text-sm transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-xs">© 2026 ArcadeNexa. All rights reserved. Games powered by GamePix — all trademarks belong to their respective owners.</p>
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <span>🎮</span><span>Professional Gaming • Instant Play • No Download</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
