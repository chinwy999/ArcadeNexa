export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://arcade-nexa-3gxg.vercel.app'
  ).replace(/\/$/, '')
}
