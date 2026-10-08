import Link from 'next/link'
import { getLocale } from '@/lib/i18n/server'
import { getTranslations } from '@/lib/i18n'

export default function Footer() {
  const locale = getLocale()
  const t = getTranslations(locale)
  const isArabic = locale === 'ar'
  const prefix = isArabic ? '/ar' : ''

  return (
    <footer
      dir={isArabic ? 'rtl' : 'ltr'}
      className="border-t border-[color:var(--white-05)] bg-nexa-navy/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          <div className="space-y-4">
            <Link
              href={prefix || '/'}
              className="flex items-center gap-2"
              aria-label={isArabic ? 'الرئيسية - Arcadlo' : 'Arcadlo Home'}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nexa-violet to-nexa-emerald flex items-center justify-center transform rotate-45">
                <span className="text-nexa-black font-black text-sm transform -rotate-45">
                  N
                </span>
              </div>

              <span className="text-xl font-black tracking-wider">
                <span className="text-[color:var(--text-primary)]">ARCAD</span>
                <span className="gradient-text">LO</span>
              </span>
            </Link>

            <p className="text-[color:var(--text-secondary)] text-sm">
              {t.footer.description}
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-nexa-emerald/10 border border-nexa-emerald/20 text-nexa-emerald text-xs px-3 py-1 rounded-full font-bold">
                {t.footer.freeToPlay}
              </span>

              <span className="bg-[color:var(--white-05)] border border-[color:var(--white-10)] text-[color:var(--text-secondary)] text-xs px-3 py-1 rounded-full">
                {t.footer.noLogin}
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-[color:var(--text-primary)] font-semibold uppercase tracking-wider text-sm mb-4">
              {t.footer.platform}
            </h2>

            <ul className="space-y-2.5">
              <li>
                <Link href={`${prefix}/games`} className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] text-sm transition-colors">
                  {t.footer.games}
                </Link>
              </li>
              <li>
                <Link href={`${prefix}/categories`} className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] text-sm transition-colors">
                  {t.footer.categories}
                </Link>
              </li>
              <li>
                <Link href={`${prefix}/search`} className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] text-sm transition-colors">
                  {t.footer.search}
                </Link>
              </li>
              <li>
                <Link href={`${prefix}/blog`} className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] text-sm transition-colors">
                  {t.footer.blog}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-[color:var(--text-primary)] font-semibold uppercase tracking-wider text-sm mb-4">
              {t.footer.support}
            </h2>

            <ul className="space-y-2.5">
              <li>
                <Link href={`${prefix}/about`} className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] text-sm transition-colors">
                  {t.footer.about}
                </Link>
              </li>
              <li>
                <Link href={`${prefix}/faq`} className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] text-sm transition-colors">
                  {t.footer.faq}
                </Link>
              </li>
              <li>
                <Link href={`${prefix}/contact`} className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] text-sm transition-colors">
                  {t.footer.contact}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-[color:var(--text-primary)] font-semibold uppercase tracking-wider text-sm mb-4">
              {t.footer.legal}
            </h2>

            <ul className="space-y-2.5">
              <li>
                <Link href={`${prefix}/privacy`} className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] text-sm transition-colors">
                  {t.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href={`${prefix}/terms`} className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] text-sm transition-colors">
                  {t.footer.terms}
                </Link>
              </li>
              <li>
                <Link href={`${prefix}/cookies`} className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] text-sm transition-colors">
                  {t.footer.cookies}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[color:var(--white-05)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[color:var(--text-secondary)] text-xs text-center sm:text-start">
            {t.footer.copyright}
          </p>

          <div className="flex items-center gap-2 text-xs text-[color:var(--text-secondary)]">
            <span>{t.footer.instantPlay}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
