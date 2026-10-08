import type { Metadata } from 'next'
import Link from 'next/link'
import { getLocale } from '@/lib/i18n/server'
import { getTranslations } from '@/lib/i18n'

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale()
  const t = getTranslations(locale)

  return {
    title: t.about.title,
    description: t.about.subtitle,
    alternates: {
      canonical: locale === 'ar' ? '/ar/about' : '/about',
    },
  }
}

export default function AboutPage() {
  const locale = getLocale()
  const t = getTranslations(locale)
  const isArabic = locale === 'ar'
  const prefix = isArabic ? '/ar' : ''

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="py-20 px-4 sm:px-6 max-w-4xl mx-auto animate-fade-in"
    >
      <h1 className="text-5xl font-black text-[color:var(--text-primary)] mb-4">
        {t.about.title}
      </h1>

      <p className="text-[color:var(--text-secondary)] text-lg mb-12">
        {t.about.subtitle}
      </p>

      <div className="space-y-6 mb-12">

        <section className="glass p-6 rounded-2xl border border-[color:var(--white-05)]">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🎯</span>
            <h2 className="text-2xl font-bold text-[color:var(--text-primary)]">
              {t.about.missionTitle}
            </h2>
          </div>

          <p className="text-[color:var(--text-secondary)]">
            {t.about.missionText}
          </p>
        </section>

        <section className="glass p-6 rounded-2xl border border-[color:var(--white-05)]">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🚀</span>
            <h2 className="text-2xl font-bold text-[color:var(--text-primary)]">
              {t.about.offerTitle}
            </h2>
          </div>

          <ul className="text-[color:var(--text-secondary)] space-y-2">
            <li>✅ {t.about.offerGames}</li>
            <li>✅ {t.about.offerInstant}</li>
            <li>✅ {t.about.offerRegistration}</li>
            <li>✅ {t.about.offerDevices}</li>
            <li>✅ {t.about.offerCategories}</li>
          </ul>
        </section>

        <section className="glass p-6 rounded-2xl border border-[color:var(--white-05)]">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🌍</span>
            <h2 className="text-2xl font-bold text-[color:var(--text-primary)]">
              {t.about.visionTitle}
            </h2>
          </div>

          <p className="text-[color:var(--text-secondary)]">
            {t.about.visionText}
          </p>
        </section>

        <section className="glass p-6 rounded-2xl border border-[color:var(--white-05)]">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🤝</span>
            <h2 className="text-2xl font-bold text-[color:var(--text-primary)]">
              {t.about.partnersTitle}
            </h2>
          </div>

          <p className="text-[color:var(--text-secondary)]">
            {t.about.partnersText}
          </p>
        </section>

      </div>

      <div className="bg-gradient-to-r from-nexa-violet/20 to-nexa-emerald/20 border border-[color:var(--white-10)] rounded-2xl p-8 text-center mb-8">
        <h2 className="text-2xl font-black text-[color:var(--text-primary)] mb-2">
          {t.about.readyTitle}
        </h2>

        <p className="text-[color:var(--text-secondary)] mb-6">
          {t.about.readyText}
        </p>

        <Link
          href={`${prefix}/games`}
          className="bg-nexa-emerald text-nexa-black px-8 py-3 rounded-xl font-black hover:opacity-90 transition-all hover:scale-105 inline-block"
        >
          {t.about.browseGames}
        </Link>
      </div>

      <div className="flex gap-3 justify-center">
        <Link
          href={`${prefix}/contact`}
          className="border border-[color:var(--white-10)] text-[color:var(--text-primary)] px-6 py-3 rounded-xl font-bold hover:bg-[color:var(--white-05)] transition"
        >
          {t.about.contactUs}
        </Link>

        <Link
          href={`${prefix}/faq`}
          className="border border-[color:var(--white-10)] text-[color:var(--text-primary)] px-6 py-3 rounded-xl font-bold hover:bg-[color:var(--white-05)] transition"
        >
          {t.about.faq}
        </Link>
      </div>
    </div>
  )
}
