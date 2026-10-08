import { getLocale } from '@/lib/i18n/server'
import { getTranslations } from '@/lib/i18n'

export default function Loading() {
  const locale = getLocale()
  const t = getTranslations(locale)
  const isArabic = locale === 'ar'

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-[60vh] flex items-center justify-center"
    >
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-nexa-violet/30 border-t-nexa-violet rounded-full animate-spin mx-auto" />
        <p className="text-[color:var(--text-secondary)] text-sm">
          {t.common.loading}
        </p>
      </div>
    </div>
  )
}
