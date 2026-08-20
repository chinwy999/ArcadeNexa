import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { allArticles as articles } from '@/lib/articles'

type Props = {
  params: { slug: string }
}

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = articles.find((item) => item.slug === params.slug)

  if (!article) {
    return {}
  }

  return {
    title: `${article.title} | ArcadeNexa`,
    description: article.description,
    alternates: {
      canonical: `/news/${article.slug}`,
    },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.description,
      url: `/news/${article.slug}`,
      publishedTime: article.date,
      siteName: 'ArcadeNexa',
    },
  }
}

export default function ArticlePage({ params }: Props) {
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
      '@id': `/news/${article.slug}`,
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
        <Link href="/news" className="hover:text-white">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-white">{article.title}</span>
      </nav>

      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full border border-neon-green/20 bg-neon-green/10 px-3 py-1 font-bold text-neon-green">
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
              href={`/news/${item.slug}`}
              className="rounded-xl border border-white/10 p-4 text-white transition hover:border-electric-violet/40 hover:bg-white/[0.03]"
            >
              <span className="text-sm font-bold">{item.title}</span>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/games"
            className="inline-flex rounded-xl bg-electric-violet px-5 py-3 font-bold text-white transition hover:opacity-90"
          >
            Explore ArcadeNexa Games →
          </Link>
        </div>
      </section>
    </main>
  )
}
