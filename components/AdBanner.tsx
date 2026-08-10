'use client'
import { Sparkles, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function AdBanner() {
  return (
    <div className="relative w-full max-w-5xl mx-auto my-6 glass rounded-xl overflow-hidden border border-electric-violet/20 p-3 bg-space-black/60 shadow-[0_0_20px_rgba(124,58,237,0.1)]">
      <div className="absolute top-1 right-2 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-text-secondary/60">
        <span>Advertisement</span><span className="w-1.5 h-1.5 rounded-full bg-neon-green/60 animate-pulse" />
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 px-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-electric-violet/30 to-neon-green/30 flex items-center justify-center border border-white/10 flex-shrink-0">
            <Sparkles className="w-6 h-6 text-neon-green" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm sm:text-base">NexGaming Pro Gear & Cloud Gaming</h4>
            <p className="text-text-secondary text-xs">Boost your FPS with zero latency cloud rigs. Try 7 days free!</p>
          </div>
        </div>
        <Link href="/tournaments" className="flex items-center gap-2 bg-gradient-to-r from-electric-violet to-violet-600 hover:from-violet-600 hover:to-electric-violet text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-all shadow-lg whitespace-nowrap">
          <span>Explore Tournaments</span><ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
