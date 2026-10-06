import en from './en'
import ar from './ar'
import type { Locale } from './config'

export { locales, defaultLocale, isLocale } from './config'
export type { Locale } from './config'

export const translations = {
  en,
  ar,
} as const

export function getTranslations(locale: Locale) {
  return translations[locale]
}
