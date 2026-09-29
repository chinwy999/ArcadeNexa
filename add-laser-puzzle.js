// Adds (or refreshes) "Laser Puzzle" in the ArcadeNexa GamePix catalog.
// Run from the project root:  node add-laser-puzzle.js
// Safe to re-run (e.g. after regenerating the catalog): it never duplicates the game.
const fs = require('fs')
const path = require('path')

const SLUG = 'laser-puzzle'
const dir = path.join(process.cwd(), 'data')
const files = {
  catalog: path.join(dir, 'gamepix-catalog.json'),
  index: path.join(dir, 'gamepix-index.json'),
  cats: path.join(dir, 'gamepix-category-index.json'),
}

for (const f of Object.values(files)) {
  if (!fs.existsSync(f)) {
    console.error('Missing file: ' + f + '\nRun this from the project root (arcadenexa-project).')
    process.exit(1)
  }
}

const read = (f) => JSON.parse(fs.readFileSync(f, 'utf8'))
const catalog = read(files.catalog)
const index = read(files.index)
const cats = read(files.cats)

if (!Array.isArray(catalog) || !index || typeof index !== 'object' || !cats || typeof cats !== 'object') {
  console.error('Unexpected data format, nothing changed.')
  process.exit(1)
}

// One-time backups, same naming style as your other .before-* files
for (const f of Object.values(files)) {
  const b = f + '.before-laser-puzzle'
  if (!fs.existsSync(b)) fs.copyFileSync(f, b)
}

const known = new Set(catalog.map((g) => g.category))
const category = ['puzzle', 'logic', 'brain'].find((c) => known.has(c)) || 'puzzle'

const thumb = '/games/laser-puzzle/thumb.png'
const url = '/games/laser-puzzle/index.html'
const game = {
  id: 'local-laser-puzzle',
  slug: SLUG,
  title: 'Laser Puzzle',
  name: 'Laser Puzzle',
  initials: 'LP',
  gradient: 'bg-gradient-to-br from-red-500/30 to-blue-500/30',
  genre: ['puzzle', 'HTML5'],
  genreFilter: category,
  rating: 9,
  platform: 'Multi',
  description:
    'Rotate the mirrors and guide the laser beam to every target. 25 levels with portals, color filters, splitters, switches and doors.',
  longDescription:
    'Rotate the mirrors and guide the laser beam to every target in this relaxing logic puzzle. ' +
    'Twenty-five hand-built levels grow from a single mirror to clever mixes of beam splitters, teleport portals, ' +
    'color filters, switches and doors. Finish each level in the fewest moves to earn three stars. ' +
    'The game is tagged with puzzle, laser, mirrors, logic, html5, browser. ' +
    'Tap or click a mirror to flip it. Play Laser Puzzle for free on ArcadeNexa and enjoy an instant browser gaming experience with no download required.',
  instructions: 'Tap or click a mirror to rotate it and send the laser to every target.',
  tags: ['puzzle', 'laser', 'mirrors', 'logic', 'html5', 'browser'],
  officialUrl: url,
  iframeUrl: url,
  thumbnail: thumb,
  thumbnailLarge: thumb,
  thumbnailSizes: { '512x384': thumb },
  releaseYear: 2026,
  provider: 'GamePix', // keeps the game inside the same listing/sitemap paths as the other catalog games
  providerGameId: SLUG,
  width: 800,
  height: 600,
  aspectRatio: '4 / 3',
  playable: true,
  category,
}

let pos = catalog.findIndex((g) => g && g.slug === SLUG)
if (pos >= 0) {
  catalog[pos] = game
} else {
  catalog.push(game)
  pos = catalog.length - 1
}
index[SLUG] = pos

let catNote = 'category index has no "' + category + '" list (page is built from the catalog): nothing to add'
if (Array.isArray(cats[category])) {
  if (!cats[category].includes(pos)) cats[category].push(pos)
  catNote = 'added to category index "' + category + '"'
}

fs.writeFileSync(files.catalog, JSON.stringify(catalog))
fs.writeFileSync(files.index, JSON.stringify(index))
fs.writeFileSync(files.cats, JSON.stringify(cats))

// Verify by reading back from disk
const c2 = read(files.catalog)
const i2 = read(files.index)
const ok = c2[i2[SLUG]] && c2[i2[SLUG]].slug === SLUG && c2.filter((g) => g.slug === SLUG).length === 1
if (!ok) {
  console.error('VERIFY FAILED - restore from the .before-laser-puzzle backups.')
  process.exit(1)
}
console.log('OK: "' + SLUG + '" at position ' + i2[SLUG] + ' of ' + c2.length + ' games; category "' + category + '"; ' + catNote)
