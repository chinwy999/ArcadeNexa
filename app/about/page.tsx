import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About ArcadeNexa',
  description: 'Learn about ArcadeNexa — where legends are forged. Our mission, team, and vision for professional esports.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <div className="py-20 px-4 sm:px-6 max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-5xl font-black text-white mb-6">About ArcadeNexa</h1>
      <p className="text-text-secondary text-lg mb-8">A growing HTML5 gaming platform focused on fast, accessible browser gameplay.</p>

      <div className="space-y-8">
        <section className="glass p-6 rounded-2xl border border-white/5">
          <h2 className="text-2xl font-bold text-white mb-3">Our Mission</h2>
          <p className="text-text-secondary">To provide a fast, accessible place to discover and play browser games directly from supported game providers.</p>
        </section>

        

        

        <div className="flex gap-3">
          <Link href="/games" className="bg-electric-violet text-white px-6 py-3 rounded-xl font-bold">Browse Games</Link>
          <Link href="/contact" className="border border-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/5">Contact Us</Link>
        </div>
      </div>
    </div>
  )
}
