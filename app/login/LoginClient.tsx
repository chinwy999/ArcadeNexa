'use client'
import Link from 'next/link'

export default function LoginClient() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 animate-fade-in">
      <div className="w-full max-w-md glass rounded-2xl p-8 border border-white/10 text-center">
        <span className="text-6xl mb-6 block">🎮</span>
        <h1 className="text-3xl font-black text-white mb-3">No Login Needed!</h1>
        <p className="text-text-secondary mb-8">
          ArcadeNexa is completely free and open. No account required — just pick a game and start playing instantly!
        </p>
        <div className="space-y-3">
          <Link href="/games" className="w-full bg-electric-violet hover:bg-violet-600 text-white font-bold py-3 rounded-xl transition block">
            Browse Games →
          </Link>
          <Link href="/categories" className="w-full border border-white/10 hover:bg-white/5 text-white font-bold py-3 rounded-xl transition block">
            Browse Categories
          </Link>
        </div>
        <p className="text-text-secondary text-sm mt-6">
          Coming soon: accounts for tournaments and leaderboards 🏆
        </p>
      </div>
    </div>
  )
}
