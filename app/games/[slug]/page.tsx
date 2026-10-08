import { getGameBySlugFast, getRelatedGamesFromCatalog, type Game } from '@/lib/games'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import InstantPlaySection from './InstantPlaySection'
import RecentlyPlayedTracker from '@/components/RecentlyPlayedTracker'
import FavoriteButton from '@/components/FavoriteButton'
import { allArticles } from '@/lib/articles'
import { getSiteUrl } from '@/lib/site'
import AdsterraBanner from '@/components/ads/AdsterraBanner'
import { getLocale } from '@/lib/i18n/server'
import { getTranslations } from '@/lib/i18n'
import { getLocalizedArticle } from '@/lib/article-translations'

export const revalidate = 3600

type PageParams = {
  params: {
    slug: string
  }
  searchParams?: {
    genre?: string
  }
}

const getGameBySlug = async (
  slug: string,
  genre = ''
) => {
  return getGameBySlugFast(slug, genre)
}

/*
 * IMPORTANT:
 * generateMetadata must NOT call notFound().
 *
 * Invalid game slugs are handled exclusively by GamePage().
 * This guarantees that the actual route can return HTTP 404.
 */
export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const locale = getLocale()
  const t = getTranslations(locale)

  const genre = ''
  const game = await getGameBySlug(params.slug, genre)

  if (!game) {
    return {
      title: t.gamePage.notFoundTitle,
      description: t.gamePage.notFoundDescription,
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const localized = getLocalizedGameContent(game, locale)
  const categoryLabel = getGameCategoryLabel(game.category, locale)

  const titleSuffix = t.gamePage.seoSuffix
  const maxTitleLength = 60
  const maxGameTitleLength = maxTitleLength - titleSuffix.length

  const seoTitle =
    game.title.length > maxGameTitleLength
      ? `${game.title
          .slice(0, Math.max(1, maxGameTitleLength - 3))
          .trimEnd()}...`
      : game.title

  const pageTitle = `${seoTitle}${titleSuffix}`

  const publicPath =
    locale === 'ar'
      ? `/ar/games/${game.slug}`
      : `/games/${game.slug}`

  const keywords =
    locale === 'ar'
      ? [
          game.title,
          categoryLabel,
          'لعبة مجانية',
          'ألعاب HTML5',
          'ألعاب متصفح',
          'Arcadlo',
        ]
      : [
          game.title,
          categoryLabel,
          'free online game',
          'HTML5 game',
          'browser game',
          'Arcadlo',
        ]

  return {
    title: pageTitle,
    description: localized.description,
    keywords,
    openGraph: {
      title: pageTitle,
      description: localized.description,
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
      url: `${getSiteUrl()}${publicPath}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: localized.description,
      images: game.thumbnail ? [game.thumbnail] : [],
    },
    alternates: {
      canonical: publicPath,
      languages: {
        en: `/games/${game.slug}`,
        ar: `/ar/games/${game.slug}`,
      },
    },
  }
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


const GAME_CATEGORY_NAMES_AR: Record<string, string> = {
  action: 'الحركة',
  adventure: 'المغامرات',
  arcade: 'الأركيد',
  puzzle: 'الألغاز',
  racing: 'السباقات',
  sports: 'الرياضات',
  shooter: 'التصويب',
  strategy: 'الاستراتيجية',
  simulation: 'المحاكاة',
  casual: 'الألعاب الخفيفة',
  rpg: 'ألعاب تقمص الأدوار',
}

function getGameCategoryLabel(
  category: string,
  locale: 'en' | 'ar'
) {
  if (locale === 'en') return category
  return GAME_CATEGORY_NAMES_AR[category.toLowerCase()] || category
}

function getLocalizedGameContent(
  game: Game,
  locale: 'en' | 'ar'
) {
  if (locale === 'en') {
    return {
      description:
        game.description ||
        `Play ${game.title} for free online on Arcadlo. No download required.`,
      longDescription:
        game.longDescription ||
        `${game.title} is a free ${game.category} browser game available on Arcadlo. Play instantly in your browser.`,
      howToPlay: getHowToPlay(game),
      controls:
        'Controls may vary by game. Check the on-screen instructions when the game loads for the exact keyboard, mouse, or touch controls.',
    }
  }

  const category = game.category.toLowerCase()

  const categoryName = getGameCategoryLabel(game.category, locale)

  const tagNames: Record<string, string> = {
    memory: 'الذاكرة',
    html5: 'HTML5',
    browser: 'المتصفح',
    puzzle: 'الألغاز',
    action: 'الحركة',
    arcade: 'الأركيد',
    racing: 'السباقات',
    sports: 'الرياضات',
    shooter: 'التصويب',
    strategy: 'الاستراتيجية',
    adventure: 'المغامرات',
    casual: 'الألعاب الخفيفة',
    simulation: 'المحاكاة',
  }

  const translatedTags = game.tags
    .slice(0, 4)
    .map((tag) => tagNames[tag.toLowerCase()] || tag)
    .join('، ')

  const tagSentence = translatedTags
    ? ` وتندرج ضمن وسوم مثل ${translatedTags}.`
    : ''

  return {
    description:
      `${game.title} هي لعبة ${categoryName} مجانية يمكنك لعبها مباشرة عبر المتصفح على Arcadlo، دون الحاجة إلى تنزيل أو تثبيت.`,

    longDescription:
      `${game.title} هي لعبة ${categoryName} مجانية للمتصفح على Arcadlo. ` +
      `ابدأ اللعب مباشرة واستكشف طريقة اللعب والتحديات التي تقدمها اللعبة.` +
      tagSentence +
      ` استمتع بتجربة لعب فورية من المتصفح دون الحاجة إلى تنزيل اللعبة.`,

    howToPlay: getHowToPlayArabic(game),

    controls:
      'قد تختلف طريقة التحكم من لعبة إلى أخرى. تحقق من التعليمات الظاهرة عند تحميل اللعبة لمعرفة أزرار لوحة المفاتيح أو عناصر التحكم بالماوس أو اللمس المتاحة.',
  }
}

function getHowToPlayArabic(game: {
  title: string
  category: string
  instructions?: string
}) {
  const category = game.category.toLowerCase()

  const instructions: Record<string, string> = {
    racing:
      'استخدم عناصر التحكم المتاحة للتوجيه والتسارع والفرملة لقيادة مركبتك على المسار. تجنب العوائق وحافظ على سرعتك وحاول تحقيق أفضل وقت ممكن.',
    puzzle:
      'استخدم الماوس أو شاشة اللمس أو لوحة المفاتيح للتفاعل مع عناصر اللغز. راقب اللوحة بعناية، وخطط لتحركاتك، وحاول إكمال الهدف بأقل عدد ممكن من الأخطاء.',
    action:
      'استخدم عناصر التحكم المتاحة للحركة وتنفيذ الإجراءات وتجاوز العقبات وإكمال المرحلة. تحرك بسرعة واستفد من آليات اللعبة للتقدم.',
    shooter:
      'استخدم الماوس أو عناصر التحكم باللمس أو لوحة المفاتيح للتصويب والتفاعل مع الأهداف. راقب محيطك وتحرك بسرعة وحاول إكمال الهدف قبل انتهاء المرحلة.',
    sports:
      'استخدم عناصر التحكم الظاهرة على الشاشة أو لوحة المفاتيح لتحريك شخصيتك وتنفيذ الحركات المطلوبة. اختر التوقيت المناسب وحاول تحقيق الهدف والفوز بالمباراة.',
    strategy:
      'خطط لتحركاتك قبل تنفيذها. استخدم عناصر التحكم المتاحة لإدارة وحداتك أو مواردك أو أهدافك، وعدّل استراتيجيتك مع تقدم اللعبة.',
    simulation:
      'استخدم عناصر التحكم المتاحة للتفاعل مع عالم اللعبة وإدارة أنظمته. اتبع الأهداف وجرب آليات اللعب المختلفة وتقدم بالسرعة التي تناسبك.',
    adventure:
      'استكشف عالم اللعبة وتفاعل مع العناصر والشخصيات واتبع الأهداف المطلوبة. استخدم عناصر التحكم الخاصة بالحركة والإجراءات للتقدم في المغامرة.',
    casual:
      'استخدم عناصر التحكم البسيطة بالماوس أو اللمس أو لوحة المفاتيح التي توفرها اللعبة. اتبع الهدف وتفاعل مع ما يظهر على الشاشة واستمتع باللعب بالوتيرة التي تناسبك.',
    arcade:
      'استخدم الماوس أو اللمس أو لوحة المفاتيح المتاحة للعب. تحرك بسرعة وتجنب العقبات وأكمل الهدف وحاول تحقيق أعلى نتيجة ممكنة.',
  }

  for (const key of Object.keys(instructions)) {
    if (category.includes(key)) {
      return instructions[key]
    }
  }

  return 'استخدم عناصر التحكم المتاحة بالماوس أو اللمس أو لوحة المفاتيح للعب. اتبع الهدف الظاهر على الشاشة وتعرّف على آليات اللعبة وأكمل المرحلة أو التحدي.'
}

type SearchableArticle = {
  article: (typeof allArticles)[number]
  searchable: string
}

const searchableArticles: SearchableArticle[] = allArticles
  .filter((article) => article.slug)
  .map((article) => ({
    article,
    searchable: [
      article.title,
      article.description,
      article.intro,
      article.category,
      ...article.sections.map((section) => section.heading),
    ]
      .join(' ')
      .toLowerCase(),
  }))

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

  const scored = searchableArticles
    .map(({ article, searchable }) => {
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

function getRelatedGames(game: Game): Game[] {
  return getRelatedGamesFromCatalog(game, 6)
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

  const genre =
    ''

  const game = await getGameBySlug(slug, genre)

  console.log(
    `[Arcadlo] GAME PAGE RESOLVE: slug=${slug} found=${Boolean(game)} title=${game?.title || 'NONE'}`
  )

  if (!game) {
    console.log(
      `[Arcadlo] GAME PAGE NOTFOUND: ${slug}`
    )
    notFound()
  }

  const locale = getLocale()
  const t = getTranslations(locale)
  const localized = getLocalizedGameContent(game, locale)
  const categoryLabel = getGameCategoryLabel(game.category, locale)

  const relatedGames = getRelatedGames(game)
  const relatedArticles = getRelatedArticles(game).map((article) =>
    getLocalizedArticle(article, locale)
  )

  const publicGamePath =
    locale === 'ar'
      ? `/ar/games/${game.slug}`
      : `/games/${game.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.title,
    description: localized.description,
    image: game.thumbnail,
    url: `${getSiteUrl()}${publicGamePath}`,
    applicationCategory: 'Game',
    operatingSystem: 'Web Browser',
    gamePlatform: 'Web Browser',
    genre: categoryLabel,
    inLanguage: locale,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
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
            href={locale === 'ar' ? '/ar' : '/'}
            className="hover:text-[color:var(--text-primary)] transition"
          >
            {t.gamePage.home}
          </Link>

          <span>/</span>

          <Link
            href={locale === 'ar' ? '/ar/games' : '/games'}
            className="hover:text-[color:var(--text-primary)] transition"
          >
            {t.gamePage.games}
          </Link>

          <span>/</span>

          <Link
            href={locale === 'ar' ? `/ar/games?genre=${encodeURIComponent(game.category)}` : `/games?genre=${encodeURIComponent(game.category)}`}
            className="hover:text-[color:var(--text-primary)] transition capitalize"
          >
            {categoryLabel}
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
               {t.gamePage.html5Free}
            </span>

            <span className="bg-[color:var(--white-05)] border border-[color:var(--white-10)] text-[color:var(--text-secondary)] text-xs px-3 py-1 rounded-full capitalize">
              {categoryLabel}
            </span>

            <FavoriteButton
              slug={game.slug}
              title={game.title}
            />
          </div>
        </div>

        <div className="mb-8">
          <AdsterraBanner />

          <InstantPlaySection game={game} instructions={localized.howToPlay} />

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="glass rounded-2xl p-6 border border-[color:var(--white-05)]">
              <h2 className="text-xl font-bold text-[color:var(--text-primary)] mb-3">
                 {t.gamePage.about} {game.title}
              </h2>

              <p className="text-[color:var(--text-secondary)] leading-relaxed">
                {localized.longDescription}
              </p>
            </div>

            <div className="glass rounded-2xl p-6 border border-[color:var(--white-05)]">
              <h2 className="text-xl font-bold text-[color:var(--text-primary)] mb-3">
                 {t.gamePage.howToPlay} {game.title}
              </h2>

              <p className="text-[color:var(--text-secondary)] leading-relaxed">
                {localized.howToPlay}
              </p>

              <p className="mt-4 text-sm text-[color:var(--text-secondary)]">
                {t.gamePage.controlsNotice}
              </p>
            </div>

            {relatedGames.length > 0 && (
              <div className="glass rounded-2xl p-6 border border-[color:var(--white-05)]">
                <div className="flex items-end justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-[color:var(--text-primary)]">
                       {t.gamePage.moreGames}
                    </h2>

                    <p className="mt-1 text-sm text-[color:var(--text-secondary)]">
                                      {t.gamePage.moreCategoryGames.replace('{category}', categoryLabel)}
                    </p>
                  </div>

                  <Link
                    href={
                          locale === 'ar'
                            ? `/ar/games?genre=${encodeURIComponent(game.category)}`
                            : `/games?genre=${encodeURIComponent(game.category)}`
                        }
                    className="text-sm font-semibold text-nexa-emerald hover:underline whitespace-nowrap"
                  >
                     {t.gamePage.viewAll}
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {relatedGames.map((relatedGame) => (
                    <Link
                      key={relatedGame.slug}
                      href={locale === 'ar' ? `/ar/games/${relatedGame.slug}` : `/games/${relatedGame.slug}`}
                      className="group overflow-hidden rounded-xl border border-[color:var(--white-10)] bg-[color:var(--white-05)] transition-all duration-200 hover:border-nexa-emerald/40 hover:-translate-y-0.5"
                    >
                      <div className="aspect-[16/10] overflow-hidden bg-[color:var(--white-05)]">
                        {relatedGame.thumbnail ? (
                          <img
                            src={relatedGame.thumbnail}
                            alt={relatedGame.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-nexa-emerald">
                            {relatedGame.initials}
                          </div>
                        )}
                      </div>

                      <div className="p-3">
                        <h3 className="text-sm font-semibold text-[color:var(--text-primary)] line-clamp-2 group-hover:text-nexa-emerald transition-colors">
                          {relatedGame.title}
                        </h3>

                        <p className="mt-1 text-xs text-[color:var(--text-secondary)] capitalize">
                          {getGameCategoryLabel(relatedGame.category, locale)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="glass rounded-2xl p-6 border border-[color:var(--white-05)]">
              <h2 className="text-xl font-bold text-[color:var(--text-primary)] mb-4">
                 {t.gamePage.guidesTips}
              </h2>

              <div className="grid gap-3 sm:grid-cols-3">
                {relatedArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={locale === 'ar' ? `/ar/blog/${article.slug}` : `/blog/${article.slug}`}
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
                 {t.gamePage.details}
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[color:var(--text-secondary)]">
                     {t.gamePage.provider}
                  </span>

                  <span className="text-[color:var(--text-primary)] font-medium">
                    {game.provider}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[color:var(--text-secondary)]">
                     {t.gamePage.platform}
                  </span>

                  <span className="text-[color:var(--text-primary)] font-medium">
                    {game.platform}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[color:var(--text-secondary)]">
                     {t.gamePage.category}
                  </span>

                  <span className="text-[color:var(--text-primary)] font-medium capitalize">
                    {categoryLabel}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[color:var(--text-secondary)]">
                     {t.gamePage.resolution}
                  </span>

                  <span className="text-[color:var(--text-primary)] font-medium">
                    {game.width}×{game.height}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href={`${locale === "ar" ? "/ar" : ""}/games?genre=${game.category}`}
              className="block glass rounded-2xl p-4 border border-[color:var(--white-05)] hover:border-nexa-violet/40 transition text-center"
            >
              <p className="text-[color:var(--text-secondary)] text-sm">
                {t.gamePage.moreCategory.replace('{category}', categoryLabel)} →
              </p>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
