import type { Metadata } from 'next'
import Link from 'next/link'
import { getLocale } from '@/lib/i18n/server'
import { getTranslations } from '@/lib/i18n'

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale()
  const t = getTranslations(locale)

  return {
    title: `${t.faq.title} - Arcadlo`,
    description: t.faq.subtitle,
    alternates: {
      canonical: locale === 'ar' ? '/ar/faq' : '/faq',
    },
  }
}

export default function FAQPage() {
  const locale = getLocale()
  const t = getTranslations(locale)
  const isArabic = locale === 'ar'

  const faqs = [
    [t.faq.freeQuestion, t.faq.freeAnswer],
    [t.faq.accountQuestion, t.faq.accountAnswer],
    [t.faq.downloadQuestion, t.faq.downloadAnswer],
    [t.faq.devicesQuestion, t.faq.devicesAnswer],
    [t.faq.gamesCountQuestion, t.faq.gamesCountAnswer],
    [t.faq.loadingQuestion, t.faq.loadingAnswer],
    [t.faq.mobileQuestion, t.faq.mobileAnswer],
    [t.faq.reportQuestion, t.faq.reportAnswer],
    [t.faq.kidsQuestion, t.faq.kidsAnswer],
    [t.faq.moreGamesQuestion, t.faq.moreGamesAnswer],
  ]

  const prefix = isArabic ? '/ar' : ''

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="py-20 px-4 sm:px-6 max-w-4xl mx-auto animate-fade-in"
    >
      <h1 className="text-5xl font-black text-[color:var(--text-primary)] mb-4">
        {t.faq.title}
      </h1>

      <p className="text-[color:var(--text-secondary)] text-lg mb-12">
        {t.faq.subtitle}
      </p>

      <div className="space-y-4 mb-12">
        {faqs.map(([question, answer], i) => (
          <details
            key={i}
            className="glass rounded-xl border border-[color:var(--white-05)] p-5 group"
          >
            <summary className="text-[color:var(--text-primary)] font-bold cursor-pointer list-none flex justify-between items-center gap-4">
              <span>{question}</span>
              <span className="text-[color:var(--text-secondary)] group-open:rotate-180 transition-transform flex-shrink-0">
                ▼
              </span>
            </summary>

            <p className="text-[color:var(--text-secondary)] text-sm mt-4 leading-relaxed">
              {answer}
            </p>
          </details>
        ))}
      </div>

      <div className="glass rounded-2xl border border-[color:var(--white-05)] p-8 text-center">
        <h2 className="text-2xl font-bold text-[color:var(--text-primary)] mb-2">
          {t.faq.stillQuestions}
        </h2>

        <p className="text-[color:var(--text-secondary)] mb-6">
          {t.faq.teamHelp}
        </p>

        <Link
          href={`${prefix}/contact`}
          className="bg-nexa-cyan text-[color:var(--text-primary)] px-8 py-3 rounded-xl font-bold hover:opacity-90 transition inline-block"
        >
          {t.faq.contactUs}
        </Link>
      </div>
    </div>
  )
}
