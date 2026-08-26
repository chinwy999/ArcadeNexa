import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About ArcadeNexa',
  description: 'Learn about ArcadeNexa — the ultimate free HTML5 gaming platform. No download, no registration, just instant play.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <div className="py-20 px-4 sm:px-6 max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-5xl font-black text-[color:var(--text-primary)] mb-4">About ArcadeNexa</h1>
      <p className="text-[color:var(--text-secondary)] text-lg mb-12">
        The ultimate destination for free HTML5 browser games — no download, no registration, just instant play.
      </p>

      <div className="space-y-6 mb-12">

        <section className="glass p-6 rounded-2xl border border-[color:var(--white-05)]">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🎯</span>
            <h2 className="text-2xl font-bold text-[color:var(--text-primary)]">Our Mission</h2>
          </div>
          <p className="text-[color:var(--text-secondary)]">
            To provide the fastest and most accessible browser gaming experience. We believe great games should be available to everyone, instantly, without any barriers.
          </p>
        </section>

        <section className="glass p-6 rounded-2xl border border-[color:var(--white-05)]">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🚀</span>
            <h2 className="text-2xl font-bold text-[color:var(--text-primary)]">What We Offer</h2>
          </div>
          <ul className="text-[color:var(--text-secondary)] space-y-2">
            <li>✅ 15,000+ free HTML5 games</li>
            <li>✅ Instant play — no download required</li>
            <li>✅ No registration or login needed</li>
            <li>✅ Works on any device — mobile, tablet, desktop</li>
            <li>✅ 10+ game categories</li>
          </ul>
        </section>

        <section className="glass p-6 rounded-2xl border border-[color:var(--white-05)]">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🌍</span>
            <h2 className="text-2xl font-bold text-[color:var(--text-primary)]">Our Vision</h2>
          </div>
          <p className="text-[color:var(--text-secondary)]">
            To become the world's leading free browser gaming platform, connecting millions of players with thousands of games from top developers around the globe.
          </p>
        </section>

        <section className="glass p-6 rounded-2xl border border-[color:var(--white-05)]">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🤝</span>
            <h2 className="text-2xl font-bold text-[color:var(--text-primary)]">Our Partners</h2>
          </div>
          <p className="text-[color:var(--text-secondary)]">
            We partner with leading game providers like <span className="text-[color:var(--text-primary)] font-bold">GamePix</span> to bring you the highest quality HTML5 games, carefully curated for the best gaming experience.
          </p>
        </section>

      </div>

      <div className="bg-gradient-to-r from-nexa-violet/20 to-nexa-emerald/20 border border-[color:var(--white-10)] rounded-2xl p-8 text-center mb-8">
        <h2 className="text-2xl font-black text-[color:var(--text-primary)] mb-2">Ready to Play?</h2>
        <p className="text-[color:var(--text-secondary)] mb-6">Join thousands of players on ArcadeNexa today.</p>
        <Link href="/games" className="bg-nexa-emerald text-nexa-black px-8 py-3 rounded-xl font-black hover:opacity-90 transition-all hover:scale-105 inline-block">
          Browse Games →
        </Link>
      </div>

      <div className="flex gap-3 justify-center">
        <Link href="/contact" className="border border-[color:var(--white-10)] text-[color:var(--text-primary)] px-6 py-3 rounded-xl font-bold hover:bg-[color:var(--white-05)] transition">Contact Us</Link>
        <Link href="/faq" className="border border-[color:var(--white-10)] text-[color:var(--text-primary)] px-6 py-3 rounded-xl font-bold hover:bg-[color:var(--white-05)] transition">FAQ</Link>
      </div>
    </div>
  )
}
