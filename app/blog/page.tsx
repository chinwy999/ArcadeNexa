import type { Metadata } from 'next'
import Link from 'next/link'
import { allArticles as articles } from '@/lib/articles'
import { getLocale } from '@/lib/i18n/server'
import { getTranslations } from '@/lib/i18n'
import { getLocalizedArticle } from '@/lib/article-translations'

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale()

  if (locale === 'ar') {
    return {
      title: {
        absolute: 'مدونة Arcadlo | أدلة ونصائح ومقالات الألعاب',
      },
      description:
        'اقرأ أدلة الألعاب وشروحات ألعاب المتصفح والمقارنات والنصائح والمقالات الأصلية من Arcadlo.',
      alternates: {
        canonical: '/ar/blog',
      },
      openGraph: {
        type: 'website',
        url: '/ar/blog',
        title: 'مدونة Arcadlo | أدلة ونصائح ومقالات الألعاب',
        description:
          'اقرأ أدلة الألعاب وشروحات ألعاب المتصفح والمقارنات والنصائح والمقالات الأصلية من Arcadlo.',
        siteName: 'Arcadlo',
        locale: 'ar_MA',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'مدونة Arcadlo | أدلة ونصائح ومقالات الألعاب',
        description:
          'اقرأ أدلة الألعاب وشروحات ألعاب المتصفح والنصائح والمقالات الأصلية من Arcadlo.',
      },
    }
  }

  return {
    title: {
      absolute: 'Arcadlo Blog | Gaming Guides, Tips & Articles',
    },
    description:
      'Read original gaming guides, browser gaming explainers, genre guides, tips, and articles from Arcadlo.',
    alternates: {
      canonical: '/blog',
    },
    openGraph: {
      type: 'website',
      url: '/blog',
      title: 'Arcadlo Blog | Gaming Guides, Tips & Articles',
      description:
        'Read original gaming guides, browser gaming explainers, genre guides, tips, and articles from Arcadlo.',
      siteName: 'Arcadlo',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Arcadlo Blog | Gaming Guides, Tips & Articles',
      description:
        'Read original gaming guides, browser gaming explainers, genre guides, tips, and articles from Arcadlo.',
    },
  }
}

export default function BlogPage() {
  const locale = getLocale()
  const t = getTranslations(locale)
  const isArabic = locale === 'ar'
  const prefix = isArabic ? '/ar' : ''

  const localizedArticles = articles.map((article) =>
    getLocalizedArticle(article, locale)
  )

  return (
    <main
      dir={isArabic ? 'rtl' : 'ltr'}
      className="mx-auto max-w-6xl px-4 py-16"
    >
      <header className="mb-12">
        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-nexa-emerald">
          {t.blog.editorial}
        </p>

        <h1 className="mb-4 text-4xl font-black text-[color:var(--text-primary)] sm:text-5xl">
          {t.blog.title}
        </h1>

        <p className="max-w-3xl text-lg leading-8 text-[color:var(--text-secondary)]">
          {t.blog.description}
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {localizedArticles.map((article) => (
          <article
            key={article.slug}
            className="glass rounded-2xl border border-[color:var(--white-10)] p-6 transition hover:-translate-y-1 hover:border-nexa-violet/40"
          >
            <div className="mb-4 flex items-center justify-between gap-3 text-xs">
              <span className="rounded-full border border-nexa-emerald/20 bg-nexa-emerald/10 px-3 py-1 font-bold text-nexa-emerald">
                {article.category}
              </span>

              <span className="text-[color:var(--text-secondary)]">
                {article.readTime}
              </span>
            </div>

            <h2 className="mb-3 text-xl font-bold text-[color:var(--text-primary)]">
              <Link
                href={`${prefix}/blog/${article.slug}`}
                className="hover:text-nexa-emerald"
              >
                {article.title}
              </Link>
            </h2>

            <p className="mb-5 line-clamp-4 text-sm leading-7 text-[color:var(--text-secondary)]">
              {article.description}
            </p>

            <Link
              href={`${prefix}/blog/${article.slug}`}
              className="font-bold text-nexa-emerald hover:underline"
            >
              {t.blog.readArticle}
            </Link>
          </article>
        ))}
      </div>
    </main>
  )
}
