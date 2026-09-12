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

  const relatedArticleMap: Record<string, string[]> = {
    "complete-guide-to-browser-gaming": [
      "what-are-html5-games",
      "best-free-online-games-no-download",
      "browser-games-vs-mobile-games",
    ],
    "what-are-html5-games": [
      "complete-guide-to-browser-gaming",
      "evolution-of-browser-gaming",
      "browser-gaming-on-phones-and-tablets",
    ],
    "browser-games-vs-mobile-games": [
      "browser-gaming-on-phones-and-tablets",
      "best-mobile-gaming-experience-in-browser",
      "what-are-html5-games",
    ],
    "how-to-choose-a-game-for-your-mood": [
      "game-genres-explained-for-beginners",
      "how-to-discover-new-games",
      "casual-games-for-short-sessions",
    ],
    "best-puzzle-game-genres-for-beginners": [
      "puzzle-games-from-classic-to-html5",
      "best-puzzle-games-online-free-adults-2026",
      "game-genres-explained-for-beginners",
    ],
    "improve-racing-game-skills": [
      "arcade-racing-vs-simulation",
      "best-car-games-online-free-no-download-2026",
      "how-to-choose-a-game-for-your-mood",
    ],
    "beginner-guide-to-strategy-games": [
      "game-genres-explained-for-beginners",
      "how-to-choose-a-game-for-your-mood",
      "complete-guide-to-browser-gaming",
    ],
    "why-instant-play-games-are-popular": [
      "best-free-online-games-no-download",
      "what-are-html5-games",
      "browser-gaming-on-phones-and-tablets",
    ],
    "browser-gaming-on-phones-and-tablets": [
      "best-mobile-gaming-experience-in-browser",
      "browser-games-vs-mobile-games",
      "what-are-html5-games",
    ],
    "finding-fun-games-without-downloading-apps": [
      "best-free-online-games-no-download",
      "how-to-discover-new-games",
      "complete-guide-to-browser-gaming",
    ],
    "evolution-of-browser-gaming": [
      "what-are-html5-games",
      "complete-guide-to-browser-gaming",
      "future-of-browser-gaming",
    ],
    "best-mobile-gaming-experience-in-browser": [
      "browser-gaming-on-phones-and-tablets",
      "browser-games-vs-mobile-games",
      "complete-guide-to-browser-gaming",
    ],
    "puzzle-games-from-classic-to-html5": [
      "best-puzzle-game-genres-for-beginners",
      "best-puzzle-games-online-free-adults-2026",
      "what-are-html5-games",
    ],
    "arcade-racing-vs-simulation": [
      "improve-racing-game-skills",
      "best-car-games-online-free-no-download-2026",
      "game-genres-explained-for-beginners",
    ],
    "casual-games-for-short-sessions": [
      "how-to-choose-a-game-for-your-mood",
      "best-puzzle-games-online-free-adults-2026",
      "best-free-online-games-no-download",
    ],
    "beginner-guide-to-sports-games": [
      "game-genres-explained-for-beginners",
      "how-to-choose-a-game-for-your-mood",
      "best-free-online-games-no-download",
    ],
    "action-games-reflexes-timing-strategy": [
      "best-shooting-games-online-no-download-2026",
      "beginner-guide-to-strategy-games",
      "game-genres-explained-for-beginners",
    ],
    "how-to-discover-new-games": [
      "game-genres-explained-for-beginners",
      "how-to-choose-a-game-for-your-mood",
      "finding-fun-games-without-downloading-apps",
    ],
    "game-genres-explained-for-beginners": [
      "complete-guide-to-browser-gaming",
      "how-to-choose-a-game-for-your-mood",
      "best-puzzle-game-genres-for-beginners",
    ],
    "future-of-browser-gaming": [
      "evolution-of-browser-gaming",
      "what-are-html5-games",
      "browser-games-vs-mobile-games",
    ],
    "unblocked-games-for-school-2025": [
      "games-to-play-when-bored-at-school",
      "best-free-online-games-no-download",
      "finding-fun-games-without-downloading-apps",
    ],
    "best-free-online-games-no-download": [
      "complete-guide-to-browser-gaming",
      "finding-fun-games-without-downloading-apps",
      "why-instant-play-games-are-popular",
    ],
    "games-to-play-when-bored-at-school": [
      "unblocked-games-for-school-2025",
      "casual-games-for-short-sessions",
      "best-free-online-games-no-download",
    ],
    "best-io-games-online-2026": [
      "best-shooting-games-online-no-download-2026",
      "game-genres-explained-for-beginners",
      "best-free-online-games-no-download",
    ],
    "best-car-games-online-free-no-download-2026": [
      "improve-racing-game-skills",
      "arcade-racing-vs-simulation",
      "best-free-online-games-no-download",
    ],
    "best-math-games-for-kids-online-free-2026": [
      "best-puzzle-game-genres-for-beginners",
      "game-genres-explained-for-beginners",
      "best-puzzle-games-online-free-adults-2026",
    ],
    "best-shooting-games-online-no-download-2026": [
      "action-games-reflexes-timing-strategy",
      "best-io-games-online-2026",
      "complete-guide-to-browser-gaming",
    ],
    "best-puzzle-games-online-free-adults-2026": [
      "best-puzzle-game-genres-for-beginners",
      "puzzle-games-from-classic-to-html5",
      "casual-games-for-short-sessions",
    ],
  }

  const relatedArticleSlugs = relatedArticleMap[article.slug] ?? []

  const related = relatedArticleSlugs
    .map((slug) => articles.find((item) => item.slug === slug))
    .filter((item): item is (typeof articles)[number] => Boolean(item))

  const fallbackRelated = related.length
    ? related.slice(0, 3)
    : articles
        .filter((item) => item.slug !== article.slug)
        .slice(0, 3)

  const categoryLinks: Record<string, { label: string; href: string }> = {
    "best-puzzle-game-genres-for-beginners": {
      label: "Explore Puzzle Games →",
      href: "/games?genre=puzzle",
    },
    "puzzle-games-from-classic-to-html5": {
      label: "Explore Puzzle Games →",
      href: "/games?genre=puzzle",
    },
    "best-puzzle-games-online-free-adults-2026": {
      label: "Explore Puzzle Games →",
      href: "/games?genre=puzzle",
    },
    "improve-racing-game-skills": {
      label: "Explore Racing Games →",
      href: "/games?genre=racing",
    },
    "arcade-racing-vs-simulation": {
      label: "Explore Racing Games →",
      href: "/games?genre=racing",
    },
    "best-car-games-online-free-no-download-2026": {
      label: "Explore Racing Games →",
      href: "/games?genre=racing",
    },
    "beginner-guide-to-strategy-games": {
      label: "Explore Strategy Games →",
      href: "/games?genre=strategy",
    },
    "beginner-guide-to-sports-games": {
      label: "Explore Sports Games →",
      href: "/games?genre=sports",
    },
    "action-games-reflexes-timing-strategy": {
      label: "Explore Action Games →",
      href: "/games?genre=action",
    },
    "best-shooting-games-online-no-download-2026": {
      label: "Explore Shooter Games →",
      href: "/games?genre=shooter",
    },
    "best-io-games-online-2026": {
      label: "Explore IO Games →",
      href: "/games?genre=io",
    },
    "casual-games-for-short-sessions": {
      label: "Explore Casual Games →",
      href: "/games?genre=casual",
    },
    "best-math-games-for-kids-online-free-2026": {
      label: "Explore Math Games →",
      href: "/games?genre=math",
    },
  }

  const categoryLink = categoryLinks[article.slug]

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

      <nav className="mb-8 text-sm text-[color:var(--text-secondary)]" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[color:var(--text-primary)]">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-[color:var(--text-primary)]">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-[color:var(--text-primary)]">{article.title}</span>
      </nav>

      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full border border-nexa-emerald/20 bg-nexa-emerald/10 px-3 py-1 font-bold text-nexa-emerald">
            {article.category}
          </span>
          <time dateTime={article.date} className="text-[color:var(--text-secondary)]">
            {new Date(`${article.date}T00:00:00Z`).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: 'UTC',
            })}
          </time>
          <span className="text-[color:var(--text-secondary)]">• {article.readTime}</span>
        </div>

        <h1 className="mb-6 text-4xl font-black leading-tight text-[color:var(--text-primary)] sm:text-5xl">
          {article.title}
        </h1>

        <p className="text-xl leading-9 text-[color:var(--text-secondary)]">
          {article.intro}
        </p>
      </header>

      <article className="space-y-10">
        {article.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="mb-4 text-2xl font-bold text-[color:var(--text-primary)]">
              {section.heading}
            </h2>
            <p className="text-lg leading-9 text-[color:var(--text-secondary)]">
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
              className="mt-2 text-2xl font-black text-[color:var(--text-primary)] sm:text-3xl"
            >
              Games You Can Play on ArcadeNexa
            </h2>

            <p className="mt-2 max-w-2xl leading-7 text-[color:var(--text-secondary)]">
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

      <section className="mt-14 rounded-2xl border border-[color:var(--white-10)] bg-[color:var(--white-03)] p-6">
        <h2 className="mb-6 text-2xl font-bold text-[color:var(--text-primary)]">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {article.faq.map((item) => (
            <div key={item.question}>
              <h3 className="mb-2 font-bold text-[color:var(--text-primary)]">{item.question}</h3>
              <p className="leading-7 text-[color:var(--text-secondary)]">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-[color:var(--white-10)] pt-10">
        <h2 className="mb-5 text-2xl font-bold text-[color:var(--text-primary)]">
          Continue Exploring
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">
          {fallbackRelated.map((item) => (
            <Link
              key={item.slug}
              href={`/blog/${item.slug}`}
              className="rounded-xl border border-[color:var(--white-10)] p-4 text-[color:var(--text-primary)] transition hover:border-nexa-violet/40 hover:bg-[color:var(--white-03)]"
            >
              <span className="text-sm font-bold">{item.title}</span>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {categoryLink && (
            <Link
              href={categoryLink.href}
              className="inline-flex rounded-xl border border-nexa-emerald/30 bg-nexa-emerald/10 px-5 py-3 font-bold text-nexa-emerald transition hover:bg-nexa-emerald/20"
            >
              {categoryLink.label}
            </Link>
          )}

          <Link
            href="/games"
            className="inline-flex rounded-xl bg-nexa-violet px-5 py-3 font-bold text-[color:var(--text-primary)] transition hover:opacity-90"
          >
            Explore ArcadeNexa Games →
          </Link>
        </div>
      </section>
    </main>
  )
}
