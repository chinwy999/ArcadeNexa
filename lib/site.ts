/** ArcadeNexa site and GamePix integration helpers. */
export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://bespoke-daffodil-e35130.netlify.app').replace(/\/$/, '')
}
export function getGameUrl(slug: string): string { return `${getSiteUrl()}/games/${slug}` }
export const GAMEPIX_PROPERTY_ID = process.env.NEXT_PUBLIC_GAMEPIX_PROPERTY_ID || 'gpx-property-DXXR1'
export function buildGamePixUrl(slug: string): string {
  return `https://play.gamepix.com/${slug}/embed?sid=${encodeURIComponent(GAMEPIX_PROPERTY_ID)}`
}
export function getAspectRatio(width: number, height: number): string {
  const gcd = (a:number,b:number):number => b === 0 ? a : gcd(b,a%b)
  const d=gcd(width,height); return `${width/d} / ${height/d}`
}
export const aspectRatioMap: Record<string,string> = {'800x600':'4 / 3','600x800':'3 / 4','960x600':'8 / 5','1280x720':'16 / 9','1120x630':'16 / 9','900x600':'3 / 2'}
