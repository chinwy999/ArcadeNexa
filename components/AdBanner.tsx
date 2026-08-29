'use client'
import { Gamepad2 } from 'lucide-react'
import Link from 'next/link'

export default function AdBanner() {
  return (
    <div className="relative w-full max-w-5xl mx-auto my-6 glass rounded-xl overflow-hidden border border-nexa-violet/20 p-3 bg-nexa-black/60 shadow-[0_0_20px_var(--nexa-violet-shadow)]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 px-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-nexa-violet/30 to-nexa-emerald/30 flex items-center justify-center border border-[color:var(--white-10)] flex-shrink-0">
            <Gamepad2 className="w-6 h-6 text-nexa-emerald" />
          </div>
          <div>
            <p className="text-[color:var(--text-primary)] font-bold text-sm sm:text-base">15,000+ Free Games Await!</p>
            <p className="text-[color:var(--text-secondary)] text-xs">No download, no login — just instant play in your browser.</p>
          </div>
        </div>
        <Link href="/games" className="flex items-center gap-2 bg-gradient-to-r from-nexa-violet to-nexa-emerald hover:brightness-110 text-[color:var(--text-primary)] text-xs font-bold px-5 py-2.5 rounded-lg transition-all shadow-lg whitespace-nowrap">
          <span>Play Now →</span>
        </Link>
      </div>
    </div>
  )
}
