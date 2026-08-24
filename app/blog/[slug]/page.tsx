import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { allArticles as articles } from '@/lib/articles'
import { getGamesPage, type Game } from '@/lib/games'
import GameCard from '@/components/GameCard'

type Props = {
  params: { slug: string }
}

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }))
}


function getGameCategoryForArticle(article: {
  slug: string
  title: string
  category: string
}): string {
  const text = `${article.slug} ${article.title} ${article.category}`.toLowerCase()

  if (
    text.includes('racing') ||
    text.includes('race') ||
    text.includes('driving') ||
    text.includes('car')
  ) {
    return 'racing'
  }

  if (
    text.includes('puzzle') ||
    text.includes('logic')
  ) {
    return 'puzzle'
  }

  if (
    text.includes('strategy')
  ) {
    return 'strategy'
  }

  if (
    text.includes('sport')
  ) {
    return 'sports'
  }

  if (
    text.includes('shooter') ||
    text.includes('shooting')
  ) {
    return 'shooter'
  }

  if (
    text.includes('adventure')
  ) {
    return 'adventure'
  }

  if (
    text.includes('simulation')
  ) {
    return 'simulation'
  }

  if (
    text.includes('casual')
  ) {
    return 'casual'
  }

  if (
    text.includes('arcade')
  ) {
    return 'arcade'
  }

  if (
    text.includes('action') ||
    text.includes('reflex') ||
    text.includes('timing')
  ) {
    return 'action'
  }

  return ''
}

const relatedGamesCache = new Map<string, Game[]>()

async function getRelatedGamesForArticle(article: {
  slug: string
  title: string
  category: string
}): Promise<Game[]> {
  const category = getGameCategoryForArticle(article)
  const cacheKey = category || 'general'

  const cached = relatedGamesCache.get(cacheKey)

  if (cached) {
    return cached
  }

  try {
    const result = await getGamesPage(
      1,
      6,
      category
    )

    let games = result.games.filter(
      (game) => Boolean(game.slug)
    )

    // If the category has too few games, use the general catalog
    // so every article can still contain useful internal links.
    if (games.length < 3) {
      const fallback = await getGamesPage(1, 6, '')

      const existing = new Set(
        games.map((game) => game.slug)
      )

      for (const game of fallback.games) {
        if (!existing.has(game.slug)) {
          games.push(game)
        }

        if (games.length >= 6) {
          break
        }
      }
    }

    games = games.slice(0, 6)

    relatedGamesCache.set(cacheKey, games)

    return games
  } catch (error) {
    console.error(
      `[ArcadeNexa] Failed to load related games for article ${article.slug}:`,
      error
    )

    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = articles.find((item) => item.slug === params.slug)

  if (!article) {
    return {}
  }

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: `/blog/${article.slug}`,
    },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.description,
      url: `/blog/${article.slug}`,
      publishedTime: article.date,
      siteName: 'ArcadeNexa',
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const article = articles.find((item) => item.slug === params.slug)

  if (!article) {
    notFound()
  }

  const related = articles
    .filter((item) => item.slug !== article.slug)
    .filter((item) => item.category === article.category)
    .slice(0, 3)

  const fallbackRelated = related.length
    ? related
    : articles.filter((item) => item.slug !== article.slug).slice(0, 3)

  const relatedGames = await getRelatedGamesForArticle(article)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      '@type': 'Organization',
      name: 'ArcadeNexa Editorial',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ArcadeNexa',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `/blog/${article.slug}`,
    },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <nav className="mb-8 text-sm text-text-secondary" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-white">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-white">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-white">{article.title}</span>
      </nav>

      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full border border-nexa-emerald/20 bg-nexa-emerald/10 px-3 py-1 font-bold text-nexa-emerald">
            {article.category}
          </span>
          <time dateTime={article.date} className="text-text-secondary">
            {new Date(`${article.date}T00:00:00Z`).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: 'UTC',
            })}
          </time>
          <span className="text-text-secondary">• {article.readTime}</span>
        </div>

        <h1 className="mb-6 text-4xl font-black leading-tight text-white sm:text-5xl">
          {article.title}
        </h1>

        <p className="text-xl leading-9 text-text-secondary">
          {article.intro}
        </p>
      </header>

      <article className="space-y-10">
        {article.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="mb-4 text-2xl font-bold text-white">
              {section.heading}
            </h2>
            <p className="text-lg leading-9 text-text-secondary">
              {section.body}
            </p>
          </section>
        ))}
      </article>

      {relatedGames.length > 0 && (
        <section className="mt-14" aria-labelledby="related-games-heading">
          <div className="mb-6">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-nexa-emerald">
              Play Related Games
            </span>

            <h2
              id="related-games-heading"
              className="mt-2 text-2xl font-black text-white sm:text-3xl"
            >
              Games You Can Play on ArcadeNexa
            </h2>

            <p className="mt-2 max-w-2xl leading-7 text-text-secondary">
              Try games related to this article directly on ArcadeNexa.
              No download is required.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {relatedGames.map((game) => (
              <GameCard
                key={game.slug}
                game={game}
              />
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/games"
              className="inline-flex rounded-xl border border-nexa-emerald/30 bg-nexa-emerald/10 px-5 py-3 font-bold text-nexa-emerald transition hover:bg-nexa-emerald/20"
            >
              Browse All Games →
            </Link>
          </div>
        </section>
      )}

      <section className="mt-14 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="mb-6 text-2xl font-bold text-white">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {article.faq.map((item) => (
            <div key={item.question}>
              <h3 className="mb-2 font-bold text-white">{item.question}</h3>
              <p className="leading-7 text-text-secondary">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-white/10 pt-10">
        <h2 className="mb-5 text-2xl font-bold text-white">
          Continue Exploring
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">
          {fallbackRelated.map((item) => (
            <Link
              key={item.slug}
              href={`/blog/${item.slug}`}
              className="rounded-xl border border-white/10 p-4 text-white transition hover:border-nexa-violet/40 hover:bg-white/[0.03]"
            >
              <span className="text-sm font-bold">{item.title}</span>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/games"
            className="inline-flex rounded-xl bg-nexa-violet px-5 py-3 font-bold text-white transition hover:opacity-90"
          >
            Explore ArcadeNexa Games →
          </Link>
        </div>
      </section>
    </main>
  )
}
