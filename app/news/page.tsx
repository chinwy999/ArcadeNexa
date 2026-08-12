import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'News - ArcadeNexa',
  description: 'Latest news and updates from ArcadeNexa gaming platform.',
  alternates: { canonical: '/news' },
}

const articles = [
  {
    title: "ArcadeNexa Launches with 13,000+ Free HTML5 Games",
    excerpt: "We are excited to announce the launch of ArcadeNexa, your new home for free browser games. No download, no registration — just instant play across 10+ categories.",
    cat: "ANNOUNCEMENT",
    date: "Aug 2026",
    featured: true,
    emoji: "🚀"
  },
  {
    title: "New Games Added Every Week",
    excerpt: "Our library keeps growing! We add new HTML5 games regularly to keep the fun going. Check back often for fresh titles across all categories.",
    cat: "UPDATE",
    date: "Aug 2026",
    emoji: "🎮"
  },
  {
    title: "Tournaments System Coming Soon",
    excerpt: "We are working hard on a competitive tournament system. Get ready to compete with players around the world and win epic prizes!",
    cat: "COMING SOON",
    date: "Aug 2026",
    emoji: "🏆"
  },
  {
    title: "Mobile Gaming Now Fully Supported",
    excerpt: "All games on ArcadeNexa are now optimized for mobile devices. Play your favorite HTML5 games on any smartphone or tablet with touch controls.",
    cat: "UPDATE",
    date: "Aug 2026",
    emoji: "📱"
  },
  {
    title: "10 Categories to Explore",
    excerpt: "From Action and Racing to Puzzle and Simulation — ArcadeNexa now features 10 curated game categories to help you find your perfect game.",
    cat: "FEATURE",
    date: "Aug 2026",
    emoji: "🎯"
  },
  {
    title: "Partnership with GamePix",
    excerpt: "ArcadeNexa partners with GamePix to bring you thousands of high-quality HTML5 games from top developers around the world.",
    cat: "ANNOUNCEMENT",
    date: "Aug 2026",
    emoji: "🤝"
  },
]

const catColors: Record<string, string> = {
  ANNOUNCEMENT: 'bg-electric-violet/20 text-electric-violet border-electric-violet/30',
  UPDATE: 'bg-neon-green/20 text-neon-green border-neon-green/30',
  'COMING SOON': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  FEATURE: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
}

export default function NewsPage() {
  return (
    <div className="py-20 px-4 sm:px-6 max-w-6xl mx-auto animate-fade-in">
      <h1 className="text-5xl font-black text-white mb-4">Latest News</h1>
      <p className="text-text-secondary text-lg mb-12">Stay updated with the latest from ArcadeNexa</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a, i) => (
          <article key={i} className={`glass rounded-2xl overflow-hidden border border-white/5 hover:border-electric-violet/30 hover:-translate-y-1 transition-all ${a.featured ? 'lg:col-span-2' : ''}`}>
            <div className={`h-32 bg-gradient-to-br from-electric-violet/20 to-neon-green/20 flex items-center justify-center`}>
              <span className="text-6xl">{a.emoji}</span>
            </div>
            <div className="p-5 space-y-3">
              <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border ${catColors[a.cat] || 'bg-white/10 text-white border-white/20'}`}>
                {a.cat}
              </span>
              <h3 className="text-white font-bold text-lg line-clamp-2">{a.title}</h3>
              <p className="text-text-secondary text-sm line-clamp-3">{a.excerpt}</p>
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-text-secondary">{a.date}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
