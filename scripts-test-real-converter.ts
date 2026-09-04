import fs from 'node:fs'

import { convertGame } from './lib/games'

const raw = JSON.parse(
  fs.readFileSync('data/gamepix-raw-test.json', 'utf8')
)

const slugs = [
  'floppa-scary-horror',
  'scary-house-clown-evil',
  'escape-from-work',
]

console.log('========================================')
console.log(' ARCADENEXA — REAL CONVERTER TEST')
console.log('========================================')

for (const slug of slugs) {
  const item = raw.find(
    (game: any) =>
      String(game.namespace || game.id || '').trim() === slug
  )

  if (!item) {
    console.log(`[MISS RAW] ${slug}`)
    continue
  }

  const game = convertGame(item)

  console.log('')
  console.log(`[OK] ${slug}`)
  console.log(`title        : ${game.title}`)
  console.log(`rating       : ${game.rating}`)
  console.log(`description  : ${game.description?.slice(0, 80)}`)
  console.log(`genre        : ${game.genre.join(', ')}`)
  console.log(`provider     : ${game.provider}`)
  console.log(`iframeUrl    : ${game.iframeUrl}`)
  console.log(`aspectRatio  : ${game.aspectRatio}`)
}

console.log('')
console.log('REAL CONVERTER TEST COMPLETE')
