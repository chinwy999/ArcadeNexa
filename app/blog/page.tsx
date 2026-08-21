import type { Metadata } from 'next'
import Link from 'next/link'
import { allArticles as articles } from '@/lib/articles'

export const metadata: Metadata = {
  title: {
    absolute: 'ArcadeNexa Blog | Gaming Guides, Tips & Articles',
  },
  description:
    'Read original gaming guides, browser gaming explainers, genre guides, tips, and articles from ArcadeNexa.',
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    url: '/blog',
    title: 'ArcadeNexa Blog | Gaming Guides, Tips & Articles',
    description:
      'Read original gaming guides, browser gaming explainers, genre guides, tips, and articles from ArcadeNexa.',
    siteName: 'ArcadeNexa',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArcadeNexa Blog | Gaming Guides, Tips & Articles',
    description:
      'Read original gaming guides, browser gaming explainers, genre guides, tips, and articles from ArcadeNexa.',
  },
}

export default function BlogPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <header className="mb-12">
        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-neon-green">
          ArcadeNexa Editorial
        </p>
        <h1 className="mb-4 text-4xl font-black text-white sm:text-5xl">
          Gaming Guides & Articles
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-text-secondary">
          Practical guides, explainers, comparisons, and gaming tips designed
          to help you discover and enjoy browser games.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <article
            key={article.slug}
            className="glass rounded-2xl border border-white/10 p-6 transition hover:-translate-y-1 hover:border-electric-violet/40"
          >
            <div className="mb-4 flex items-center justify-between gap-3 text-xs">
              <span className="rounded-full border border-neon-green/20 bg-neon-green/10 px-3 py-1 font-bold text-neon-green">
                {article.category}
              </span>
              <span className="text-text-secondary">{article.readTime}</span>
            </div>

            <h2 className="mb-3 text-xl font-bold text-white">
              <Link
                href={`/blog/${article.slug}`}
                className="hover:text-neon-green"
              >
                {article.title}
              </Link>
            </h2>

            <p className="mb-5 line-clamp-4 text-sm leading-7 text-text-secondary">
              {article.description}
            </p>

            <Link
              href={`/blog/${article.slug}`}
              className="font-bold text-neon-green hover:underline"
            >
              Read article →
            </Link>
          </article>
        ))}
      </div>
    </main>
  )
}
