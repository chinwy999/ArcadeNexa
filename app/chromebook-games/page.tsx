import type { Metadata } from 'next'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { getGames } from '@/lib/games'

export const metadata: Metadata = {
  title: 'Chromebook Games – Free Browser Games for School | ArcadeNexa',
  description: 'Play free Chromebook games instantly. No download, no install. 13,000+ HTML5 games that work perfectly on any Chromebook at school or home.',
  keywords: 'chromebook games, games for chromebook, chromebook games unblocked, free chromebook games, school chromebook games',
  alternates: { canonical: '/chromebook-games' },
}

export default async function ChromebookGamesPage() {
  const allGames = await getGames()
  const games = allGames
  const featured = games.slice(0, 18)

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">

      <section className="relative overflow-hidden bg-gradient-to-b from-[#0a1628] to-[#0a0a0f] px-4 py-16 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.15),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400">
            <span>💻</span> Chromebook Ready • No Install Needed
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Free Games for{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Chromebook
            </span>
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-lg text-gray-300">
            Every game on ArcadeNexa works perfectly on Chromebook. <strong className="text-white">13,000+ free HTML5 games</strong> — no download, no install, no Flash. Just open Chrome and play.
          </p>
          <div className="mb-8 flex flex-wrap justify-center gap-2 text-sm">
            {['No Download','No Flash','Works on Chrome','School Safe','Free Forever','Touch Friendly'].map(tag => (
              <span key={tag} className="rounded-full border border-gray-700 bg-gray-800/60 px-3 py-1 text-gray-300">{tag}</span>
            ))}
          </div>
          <Link href="/games" className="inline-block rounded-xl bg-blue-500 px-8 py-3 font-bold text-white transition hover:bg-blue-400">
            Browse All Games →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="mb-8 text-center text-2xl font-bold">Why ArcadeNexa Works Great on Chromebook</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: '🌐', title: 'Chrome Native', desc: 'HTML5 runs natively in Chrome' },
            { icon: '⚡', title: 'Instant Load', desc: 'No install, click and play' },
            { icon: '🔓', title: 'School Friendly', desc: 'Works on school networks' },
            { icon: '📱', title: 'Touch Support', desc: 'Works with touchscreen' },
          ].map(f => (
            <div key={f.title} className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-center">
              <div className="mb-2 text-3xl">{f.icon}</div>
              <div className="font-bold text-white">{f.title}</div>
              <div className="text-sm text-gray-400">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="mb-6 text-2xl font-bold">🎮 Popular Chromebook Games</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {featured.map(game => (
            <Link key={game.id} href={`/games/${game.slug}`}
              className="group rounded-xl border border-gray-800 bg-gray-900/60 p-2 transition hover:border-blue-500/50 hover:bg-gray-800">
              <div className="mb-2 aspect-square overflow-hidden rounded-lg bg-gray-800">
                {game.thumbnail
                  ? <img src={game.thumbnail} alt={game.title} className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
                  : <div className={`flex h-full w-full items-center justify-center text-lg font-bold ${game.gradient}`}>{game.initials}</div>
                }
              </div>
              <p className="truncate text-xs font-medium text-gray-200">{game.title}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-8">
          <h2 className="mb-4 text-2xl font-bold">Can You Play Games on a Chromebook?</h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>Yes! Chromebooks run the Chrome browser natively, which means any HTML5 game works perfectly without installation. ArcadeNexa is built entirely with HTML5 technology, making it one of the best gaming sites for Chromebook users.</p>
            <p>Unlike Android apps that may not be available on all Chromebooks, browser games work on <strong className="text-white">every Chromebook model</strong> regardless of age or specs. Simply open Chrome, visit ArcadeNexa, and start playing instantly.</p>
            <p>School Chromebooks often have app restrictions, but browser-based HTML5 games typically bypass these limitations since they run entirely within the Chrome browser.</p>
          </div>
        </div>
      </section>

    </main>
  )
}
