import { headers } from 'next/headers'
import { defaultLocale, isLocale, type Locale } from './config'

export function getLocale(): Locale {
  const locale = headers().get('x-arcade-locale')

  if (locale && isLocale(locale)) {
    return locale
  }

  return defaultLocale
}
