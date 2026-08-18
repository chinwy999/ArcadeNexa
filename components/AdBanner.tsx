'use client'
import { Gamepad2 } from 'lucide-react'
import Link from 'next/link'

export default function AdBanner() {
  return (
    <div className="relative w-full max-w-5xl mx-auto my-6 glass rounded-xl overflow-hidden border border-electric-violet/20 p-3 bg-space-black/60 shadow-[0_0_20px_rgba(124,58,237,0.1)]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 px-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-electric-violet/30 to-neon-green/30 flex items-center justify-center border border-white/10 flex-shrink-0">
            <Gamepad2 className="w-6 h-6 text-neon-green" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm sm:text-base">29,400+ Free Games Await!</h4>
            <p className="text-text-secondary text-xs">No download, no login — just instant play in your browser.</p>
          </div>
        </div>
        <Link href="/games" className="flex items-center gap-2 bg-gradient-to-r from-electric-violet to-violet-600 hover:from-violet-600 hover:to-electric-violet text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-all shadow-lg whitespace-nowrap">
          <span>Play Now →</span>
        </Link>
      </div>
    </div>
  )
}
