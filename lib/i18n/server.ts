import { headers } from 'next/headers'
import { defaultLocale, isLocale, type Locale } from './config'

export async function getLocale(): Promise<Locale> {
  const requestHeaders = await headers()
  const locale = requestHeaders.get('x-arcade-locale')

  if (locale && isLocale(locale)) {
    return locale
  }

  return defaultLocale
}
