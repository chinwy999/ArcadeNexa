import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'News',
  description: 'Latest esports news — Valorant, CS2, LoL, Dota 2 updates',
  alternates: { canonical: '/news' },
}

const articles = [
  { title: "Valorant Champions 2026: The Ultimate Showdown Begins", excerpt: "The biggest Valorant tournament kicks off with 16 teams competing for $2.5M prize pool.", cat: "ESPORTS", date: "Aug 6, 2026", featured: true },
  { title: "CS2 Major Update: New Maps and Balance Changes", excerpt: "Valve releases massive update introducing two new competitive maps and significant weapon balancing.", cat: "PATCH NOTES", date: "Aug 5, 2026" },
  { title: "Interview: s1mple on His Return", excerpt: "Legendary AWPer discusses comeback.", cat: "INTERVIEWS", date: "Aug 4, 2026" },
  { title: "Rocket League Season 15: What's New?", excerpt: "New cars, decals, and revamped ranked system.", cat: "REVIEWS", date: "Aug 3, 2026" },
  { title: "Dota 2 The International 2026: Teams to Watch", excerpt: "Team Spirit, LGPX, OG are top contenders.", cat: "ESPORTS", date: "Aug 2, 2026" },
  { title: "Overwatch 2: New Hero Kiriko Rework Explained", excerpt: "Blizzard details rework.", cat: "PATCH NOTES", date: "Aug 1, 2026" },
]

export default function NewsPage() {
  return (
    <div className="py-20 px-4 sm:px-6 max-w-7xl mx-auto animate-fade-in">
      <h1 className="text-5xl font-black text-white mb-4">Latest News</h1>
      <p className="text-text-secondary mb-8">Stay updated with the esports world</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {['ALL','ESPORTS','PATCH NOTES','REVIEWS','INTERVIEWS'].map(c => (
          <button key={c} className={`px-4 py-2 rounded-full text-xs font-bold border ${c==='ALL'?'bg-electric-violet text-white border-electric-violet':'bg-white/5 text-text-secondary border-white/10'}`}>{c}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a,i) => (
          <article key={i} className={`glass rounded-2xl overflow-hidden border border-white/5 hover:border-electric-violet/30 hover:-translate-y-1 transition-all ${a.featured ? 'lg:col-span-2' : ''}`}>
            {a.featured && <div className="h-48 bg-gradient-to-br from-electric-violet/20 to-neon-green/20 flex items-center justify-center"><span className="text-4xl font-black text-white/10">FEATURED</span></div>}
            <div className="p-5 space-y-3">
              <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-electric-violet/20 text-electric-violet border border-electric-violet/30">{a.cat}</span>
              <h3 className="text-white font-bold text-lg line-clamp-2">{a.title}</h3>
              <p className="text-text-secondary text-sm line-clamp-2">{a.excerpt}</p>
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-text-secondary">{a.date}</span>
                <Link href="/news" className="text-electric-violet text-sm font-medium hover:gap-2 flex items-center gap-1 transition-all">READ MORE →</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
