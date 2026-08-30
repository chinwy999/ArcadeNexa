import { cache } from 'react'
import { getGameBySlugFast } from '@/lib/games'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import InstantPlaySection from './InstantPlaySection'
import RecentlyPlayedTracker from '@/components/RecentlyPlayedTracker'
import FavoriteButton from '@/components/FavoriteButton'
import { allArticles } from '@/lib/articles'
import { getSiteUrl } from '@/lib/site'
import AdsterraBanner from '@/components/ads/AdsterraBanner'
import HilltopMultitag from '@/components/ads/HilltopMultitag'

export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0

type PageParams = {
  params: {
    slug: string
  }
}

const getGameBySlug = cache(async (slug: string) => {
  return getGameBySlugFast(slug)
})

/*
 * IMPORTANT:
 * generateMetadata must NOT call notFound().
 *
 * Invalid game slugs are handled exclusively by GamePage().
 * This guarantees that the actual route can return HTTP 404.
 */
export async function generateMetadata(
  { params }: PageParams
): Promise<Metadata> {
  const game = await getGameBySlug(params.slug)

  if (!game) {
    return {
      title: 'Game Not Found - ArcadeNexa',
      description:
        'The requested game could not be found on ArcadeNexa.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const titleSuffix = ' - Play Free Online'
  const maxTitleLength = 60
  const maxGameTitleLength = maxTitleLength - titleSuffix.length

  const seoTitle =
    game.title.length > maxGameTitleLength
      ? `${game.title
          .slice(0, maxGameTitleLength - 3)
          .trimEnd()}...`
      : game.title

  const pageTitle = `${seoTitle}${titleSuffix}`

  return {
    title: pageTitle,
    description:
      game.description ||
      `Play ${game.title} for free online on ArcadeNexa. No download required, instant play in your browser.`,
    keywords: [
      game.title,
      game.category,
      'free online game',
      'HTML5 game',
      'browser game',
      'ArcadeNexa',
    ],
    openGraph: {
      title: pageTitle,
      description:
        game.description ||
        `Play ${game.title} for free on ArcadeNexa`,
      images: game.thumbnail
        ? [
            {
              url: game.thumbnail,
              width: 512,
              height: 384,
              alt: game.title,
            },
          ]
        : [],
      url: `${getSiteUrl()}/games/${game.slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description:
        game.description ||
        `Play ${game.title} for free on ArcadeNexa`,
      images: game.thumbnail ? [game.thumbnail] : [],
    },
    alternates: {
      canonical: `/games/${game.slug}`,
    },
  }
}

export async function generateStaticParams() {
  return []
}

function getHowToPlay(game: {
  title: string
  category: string
  instructions?: string
}) {
  const category = game.category.toLowerCase()

  const categoryInstructions: Record<string, string> = {
    racing:
      'Use the available steering, acceleration, and brake controls to guide your vehicle through the track. Avoid obstacles, maintain speed, and aim for the best finish time.',

    puzzle:
      'Use your mouse, touch screen, or keyboard controls to interact with the puzzle. Study the board carefully, plan your moves, and complete the objective with as few mistakes as possible.',

    action:
      'Use the available movement and action controls to overcome obstacles and complete the level. React quickly, explore the environment, and use the game mechanics to your advantage.',

    shooter:
      'Use your mouse, touch controls, or keyboard to aim and interact with targets. Watch your surroundings, react quickly, and complete the objective before the level ends.',

    sports:
      'Use the on-screen or keyboard controls to move your player and perform actions. Time your movements carefully and complete the objective to win the match.',

    strategy:
      'Plan your moves before acting. Use the available controls to manage your units, resources, or objectives and adapt your strategy as the game progresses.',

    simulation:
      'Use the available controls to interact with the game world and manage its systems. Follow the objectives, experiment with the available mechanics, and progress at your own pace.',

    adventure:
      'Explore the game world, interact with objects and characters, and follow the objectives. Use the available movement and action controls to progress through the adventure.',

    casual:
      'Use the simple mouse, touch, or keyboard controls provided by the game. Follow the objective, react to what appears on screen, and enjoy the game at your own pace.',

    arcade:
      'Use the available mouse, touch, or keyboard controls to play. React quickly, complete the objective, avoid obstacles, and try to achieve the highest score possible.',
  }

  for (const key of Object.keys(categoryInstructions)) {
    if (category.includes(key)) {
      return categoryInstructions[key]
    }
  }

  return game.instructions &&
    game.instructions !== 'Use mouse or touch controls to play.'
    ? game.instructions
    : 'Use the available mouse, touch, or keyboard controls to play. Follow the on-screen objective, learn the game mechanics, and complete the level or challenge.'
}

function getRelatedArticles(game: {
  title: string
  category: string
}) {
  const titleWords = game.title
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length >= 3)

  const category = game.category.toLowerCase()

  const categoryKeywords: Record<string, string[]> = {
    racing: ['racing', 'race', 'car', 'driving'],
    puzzle: ['puzzle'],
    action: ['action', 'reflexes', 'timing'],
    shooter: ['shooting', 'shooter'],
    sports: ['sports', 'sport'],
    strategy: ['strategy'],
    simulation: ['simulation'],
    adventure: ['adventure'],
    casual: ['casual'],
    arcade: ['arcade'],
  }

  const keywords = [
    category,
    ...(categoryKeywords[category] || []),
  ]

  const scored = allArticles
    .map((article) => {
      const searchable = [
        article.title,
        article.description,
        article.intro,
        article.category,
        ...article.sections.map((section) => section.heading),
      ]
        .join(' ')
        .toLowerCase()

      let score = 0

      for (const keyword of keywords) {
        if (keyword && searchable.includes(keyword)) {
          score += keyword === category ? 8 : 4
        }
      }

      for (const word of titleWords) {
        if (searchable.includes(word)) {
          score += 2
        }
      }

      if (article.category === 'GUIDE') {
        score += 1
      }

      return { article, score }
    })
    .filter(({ article }) => article.slug)
    .sort((a, b) => b.score - a.score)

  const selected = scored
    .filter(({ score }) => score > 0)
    .slice(0, 3)
    .map(({ article }) => article)

  if (selected.length >= 3) {
    return selected
  }

  const selectedSlugs = new Set(
    selected.map((article) => article.slug)
  )

  for (const article of allArticles) {
    if (!selectedSlugs.has(article.slug)) {
      selected.push(article)
    }

    if (selected.length === 3) {
      break
    }
  }

  return selected
}

export default async function GamePage({ params }: PageParams) {
  /*
   * SINGLE SOURCE OF TRUTH FOR ROUTE VALIDATION.
   *
   * If the requested slug does not resolve to a real game,
   * notFound() is called here so Next.js returns HTTP 404.
   */
  const slug = params.slug?.trim()

  if (!slug) {
    notFound()
  }

  const game = await getGameBySlug(slug)

  if (!game) {
    notFound()
  }

  const howToPlay = getHowToPlay(game)
  const relatedArticles = getRelatedArticles(game)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.title,
    description:
      game.description || `Play ${game.title} free online`,
    image: game.thumbnail,
    url: `${getSiteUrl()}/games/${game.slug}`,
    applicationCategory: 'Game',
    operatingSystem: 'Web Browser',
    gamePlatform: 'Web Browser',
    genre: game.category,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: game.rating,
      bestRating: '10',
      worstRating: '1',
      ratingCount: '100',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <RecentlyPlayedTracker
          slug={game.slug}
          title={game.title}
          thumbnail={game.thumbnail}
          gradient={game.gradient}
          initials={game.initials}
        />

        <div className="flex items-center gap-2 text-sm text-[color:var(--text-secondary)] mb-6">
          <Link
            href="/"
            className="hover:text-[color:var(--text-primary)] transition"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            href="/games"
            className="hover:text-[color:var(--text-primary)] transition"
          >
            Games
          </Link>

          <span>/</span>

          <Link
            href={`/games?genre=${game.category}`}
            className="hover:text-[color:var(--text-primary)] transition capitalize"
          >
            {game.category}
          </Link>

          <span>/</span>

          <span className="text-[color:var(--text-primary)] truncate">
            {game.title}
          </span>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-black text-[color:var(--text-primary)] mb-2">
            {game.title}
          </h1>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="bg-nexa-emerald/10 border border-nexa-emerald/20 text-nexa-emerald text-xs px-3 py-1 rounded-full font-bold">
              HTML5 • Free
            </span>

            <span className="bg-[color:var(--white-05)] border border-[color:var(--white-10)] text-[color:var(--text-secondary)] text-xs px-3 py-1 rounded-full capitalize">
              {game.category}
            </span>

            <span
              className="text-nexa-gold text-sm font-bold"
              title="ArcadeNexa Score"
            >
              ★ {Number(game.rating).toFixed(1)} ArcadeNexa Score
            </span>

            <FavoriteButton
              slug={game.slug}
              title={game.title}
            />
          </div>
        </div>

        <div className="mb-8">
          <AdsterraBanner />

          <InstantPlaySection game={game} />

          <HilltopMultitag />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="glass rounded-2xl p-6 border border-[color:var(--white-05)]">
              <h2 className="text-xl font-bold text-[color:var(--text-primary)] mb-3">
                About {game.title}
              </h2>

              <p className="text-[color:var(--text-secondary)] leading-relaxed">
                {game.longDescription}
              </p>
            </div>

            <div className="glass rounded-2xl p-6 border border-[color:var(--white-05)]">
              <h2 className="text-xl font-bold text-[color:var(--text-primary)] mb-3">
                How to Play {game.title}
              </h2>

              <p className="text-[color:var(--text-secondary)] leading-relaxed">
                {howToPlay}
              </p>

              <p className="mt-4 text-sm text-[color:var(--text-secondary)]">
                Controls may vary by game. Check the on-screen instructions when
                the game loads for the exact keyboard, mouse, or touch controls.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 border border-[color:var(--white-05)]">
              <h2 className="text-xl font-bold text-[color:var(--text-primary)] mb-4">
                Gaming Guides & Tips
              </h2>

              <div className="grid gap-3 sm:grid-cols-3">
                {relatedArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="rounded-xl border border-[color:var(--white-10)] bg-[color:var(--white-02)] p-4 transition hover:border-nexa-violet/40 hover:bg-[color:var(--white-04)]"
                  >
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-nexa-violet">
                      {article.category}
                    </span>

                    <span className="block text-sm font-bold leading-6 text-[color:var(--text-primary)]">
                      {article.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass rounded-2xl p-6 border border-[color:var(--white-05)]">
              <h3 className="text-xl font-bold text-[color:var(--text-primary)] mb-4">
                Details
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[color:var(--text-secondary)]">
                    Provider
                  </span>

                  <span className="text-[color:var(--text-primary)] font-medium">
                    {game.provider}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[color:var(--text-secondary)]">
                    Platform
                  </span>

                  <span className="text-[color:var(--text-primary)] font-medium">
                    {game.platform}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[color:var(--text-secondary)]">
                    Category
                  </span>

                  <span className="text-[color:var(--text-primary)] font-medium capitalize">
                    {game.category}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[color:var(--text-secondary)]">
                    Rating
                  </span>

                  <span className="text-nexa-gold font-medium">
                    ★ {Number(game.rating).toFixed(1)}/10
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[color:var(--text-secondary)]">
                    Resolution
                  </span>

                  <span className="text-[color:var(--text-primary)] font-medium">
                    {game.width}×{game.height}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href={`/games?genre=${game.category}`}
              className="block glass rounded-2xl p-4 border border-[color:var(--white-05)] hover:border-nexa-violet/40 transition text-center"
            >
              <p className="text-[color:var(--text-secondary)] text-sm">
                More{' '}
                <span className="capitalize text-nexa-violet font-bold">
                  {game.category}
                </span>{' '}
                games →
              </p>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
