import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FAQ - ArcadeNexa',
  description: 'Frequently asked questions about ArcadeNexa gaming platform.',
  alternates: { canonical: '/faq' },
}

const faqs = [
  {
    q: 'Is ArcadeNexa free?',
    a: 'Yes! ArcadeNexa is 100% free. All games are available instantly with no payment required.'
  },
  {
    q: 'Do I need to create an account to play?',
    a: 'No! You can play all games without registration or login. Just open the game and start playing instantly.'
  },
  {
    q: 'Do I need to download anything?',
    a: 'No downloads needed. All games run directly in your browser using HTML5 technology.'
  },
  {
    q: 'What devices are supported?',
    a: 'ArcadeNexa works on all devices — mobile phones, tablets, and desktop computers. Any modern browser is supported.'
  },
  {
    q: 'How many games are available?',
    a: 'We currently offer 13,485+ free HTML5 games across 10+ categories including Action, Puzzle, Racing, Sports, and more.'
  },
  {
    q: 'Why is a game not loading?',
    a: 'Try refreshing the page or clearing your browser cache. Make sure JavaScript is enabled. If the problem persists, try a different browser.'
  },
  {
    q: 'Can I play on mobile?',
    a: 'Yes! Most games are optimized for touch controls and work great on mobile devices.'
  },
  {
    q: 'How do I report a bug or problem?',
    a: 'Use our Contact page to report any issues. Please include the game name and a description of the problem.'
  },
  {
    q: 'Are the games safe for kids?',
    a: 'Most games on ArcadeNexa are family-friendly. We offer a wide range of casual and puzzle games suitable for all ages.'
  },
  {
    q: 'Will you add more games?',
    a: 'Yes! We regularly update our library with new games. Check back often for fresh additions to the arena.'
  },
]

export default function FAQPage() {
  return (
    <div className="py-20 px-4 sm:px-6 max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-5xl font-black text-white mb-4">FAQ</h1>
      <p className="text-text-secondary text-lg mb-12">Frequently Asked Questions about ArcadeNexa</p>

      <div className="space-y-4 mb-12">
        {faqs.map((f, i) => (
          <details key={i} className="glass rounded-xl border border-white/5 p-5 group">
            <summary className="text-white font-bold cursor-pointer list-none flex justify-between items-center gap-4">
              <span>{f.q}</span>
              <span className="text-text-secondary group-open:rotate-180 transition-transform flex-shrink-0">▼</span>
            </summary>
            <p className="text-text-secondary text-sm mt-4 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="glass rounded-2xl border border-white/5 p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Still have questions?</h2>
        <p className="text-text-secondary mb-6">Our team is happy to help you.</p>
        <Link href="/contact" className="bg-electric-violet text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition inline-block">
          Contact Us
        </Link>
      </div>
    </div>
  )
}
