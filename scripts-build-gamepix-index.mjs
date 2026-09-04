import fs from 'node:fs/promises'

const catalogFile = 'data/gamepix-raw-test.json'
const indexFile = 'data/gamepix-index-test.json'

async function main() {
  console.log('========================================')
  console.log(' ARCADENEXA — BUILD GAMEPIX INDEX')
  console.log('========================================')

  const games = JSON.parse(
    await fs.readFile(catalogFile, 'utf8')
  )

  console.log(`Catalog games: ${games.length}`)

  const index = Object.create(null)

  let invalid = 0
  let duplicate = 0

  for (let i = 0; i < games.length; i++) {
    const game = games[i]

    const slug = String(
      game.namespace || game.id || ''
    ).trim()

    if (!slug) {
      invalid++
      continue
    }

    if (Object.prototype.hasOwnProperty.call(index, slug)) {
      duplicate++
      continue
    }

    index[slug] = i
  }

  await fs.writeFile(
    indexFile,
    JSON.stringify(index)
  )

  const catalogStat = await fs.stat(catalogFile)
  const indexStat = await fs.stat(indexFile)

  console.log('')
  console.log('===== RESULT =====')
  console.log(`Indexed games : ${Object.keys(index).length}`)
  console.log(`Invalid       : ${invalid}`)
  console.log(`Duplicates    : ${duplicate}`)
  console.log('')
  console.log(
    `Catalog size  : ${(catalogStat.size / 1024 / 1024).toFixed(2)} MB`
  )
  console.log(
    `Index size    : ${(indexStat.size / 1024 / 1024).toFixed(2)} MB`
  )

  const testSlugs = [
    'floppa-scary-horror',
    'prism-match-3d',
    'scary-house-clown-evil',
    'escape-from-work',
  ]

  console.log('')
  console.log('===== LOOKUP TEST =====')

  for (const slug of testSlugs) {
    const position = index[slug]

    if (position === undefined) {
      console.log(`[MISS] ${slug}`)
      continue
    }

    const game = games[position]

    console.log(
      `[OK] ${slug} → index ${position} → ${game.title}`
    )
  }

  console.log('')
  console.log(`Output: ${indexFile}`)
}

main().catch(error => {
  console.error('')
  console.error('FATAL:', error)
  process.exit(1)
})
