import fs from 'node:fs'

import { convertGame } from './lib/games'

const inputFile = 'data/gamepix-raw-test.json'
const catalogFile = 'data/gamepix-catalog.json'
const indexFile = 'data/gamepix-index.json'

console.log('========================================')
console.log(' ARCADENEXA — BUILD REAL GAMEPIX CATALOG')
console.log('========================================')

if (!fs.existsSync(inputFile)) {
  throw new Error(`Input file not found: ${inputFile}`)
}

const raw = JSON.parse(
  fs.readFileSync(inputFile, 'utf8')
)

if (!Array.isArray(raw)) {
  throw new Error('Input JSON is not an array')
}

console.log(`Raw games: ${raw.length}`)
console.log('')

const catalog: any[] = []
const index: Record<string, number> = {}
const seen = new Set<string>()

let convertedCount = 0
let skippedCount = 0

for (const item of raw) {
  const slug = String(
    item.namespace || item.id || ''
  ).trim()

  if (!slug || seen.has(slug)) {
    skippedCount++
    continue
  }

  const game = convertGame(item)

  if (!game.slug) {
    throw new Error(
      `Converted game has no slug: ${slug}`
    )
  }

  if (game.slug !== slug) {
    throw new Error(
      `Slug mismatch: raw=${slug} converted=${game.slug}`
    )
  }

  index[slug] = catalog.length
  catalog.push(game)
  seen.add(slug)
  convertedCount++
}

console.log('===== VALIDATION =====')
console.log(`Converted : ${convertedCount}`)
console.log(`Skipped   : ${skippedCount}`)
console.log(`Index     : ${Object.keys(index).length}`)

if (catalog.length !== Object.keys(index).length) {
  throw new Error('Catalog/index count mismatch')
}

if (catalog.length === 0) {
  throw new Error('Catalog is empty')
}

const testSlugs = [
  'floppa-scary-horror',
  'scary-house-clown-evil',
  'escape-from-work',
]

console.log('')
console.log('===== TEST GAMES =====')

for (const slug of testSlugs) {
  const position = index[slug]

  if (position === undefined) {
    throw new Error(
      `Test slug missing from index: ${slug}`
    )
  }

  const game = catalog[position]

  console.log(
    `[OK] ${slug} → index ${position} → ${game.title} → rating ${game.rating}`
  )
}

console.log('')
console.log('===== WRITING FILES =====')

fs.writeFileSync(
  catalogFile,
  JSON.stringify(catalog)
)

fs.writeFileSync(
  indexFile,
  JSON.stringify(index)
)

const catalogSize =
  fs.statSync(catalogFile).size / 1024 / 1024

const indexSize =
  fs.statSync(indexFile).size / 1024 / 1024

console.log(`Catalog : ${catalogSize.toFixed(2)} MB`)
console.log(`Index   : ${indexSize.toFixed(2)} MB`)

console.log('')
console.log('===== FINAL CHECK =====')

const savedCatalog = JSON.parse(
  fs.readFileSync(catalogFile, 'utf8')
)

const savedIndex = JSON.parse(
  fs.readFileSync(indexFile, 'utf8')
)

if (
  savedCatalog.length !== catalog.length ||
  Object.keys(savedIndex).length !== Object.keys(index).length
) {
  throw new Error('Saved files failed validation')
}

for (const slug of testSlugs) {
  const position = savedIndex[slug]

  if (
    position === undefined ||
    savedCatalog[position]?.slug !== slug
  ) {
    throw new Error(
      `Saved index validation failed: ${slug}`
    )
  }
}

console.log('Catalog validation : PASS')
console.log('Index validation   : PASS')
console.log('')
console.log('REAL GAMEPIX CATALOG BUILD COMPLETE')
console.log(`Output: ${catalogFile}`)
console.log(`Output: ${indexFile}`)
