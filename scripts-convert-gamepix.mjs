import fs from 'node:fs/promises'

const inputFile = 'data/gamepix-raw-test.json'
const outputFile = 'data/gamepix-catalog-test.json'

async function main() {
  console.log('========================================')
  console.log(' ARCADENEXA — CONVERT FULL GAMEPIX CATALOG')
  console.log('========================================')

  const raw = JSON.parse(
    await fs.readFile(inputFile, 'utf8')
  )

  console.log(`Raw games: ${raw.length}`)
  console.log('')

  const converted = []
  const seen = new Set()

  for (const item of raw) {
    const slug = String(
      item.namespace || item.id || ''
    ).trim()

    if (!slug || seen.has(slug)) {
      continue
    }

    seen.add(slug)

    converted.push({
      id: `gamepix-${item.namespace || item.id}`,
      slug: item.namespace || item.id,
      title: item.title || 'Untitled Game',
      name: item.title || 'Untitled Game',
      initials: getInitials(item.title || 'Game'),
      gradient: getGradient(item.namespace || item.id),
      genre: [
        item.category || 'arcade',
        'HTML5'
      ],
      genreFilter: item.category || 'arcade',
      rating: 0,
      platform: 'Multi',
      description: item.description || '',
      longDescription: item.description || '',
      instructions: 'Use mouse or touch controls to play.',
      tags: [
        item.category || 'arcade',
        'html5',
        'browser'
      ],
      officialUrl: item.url,
      iframeUrl:
        `https://play.gamepix.com/${item.namespace}/embed?sid=DXXR1`,
      thumbnail:
        item.banner_image || item.image || '',
      thumbnailLarge:
        item.banner_image || item.image || '',
      thumbnailSizes: {
        '512x384':
          item.banner_image || item.image || ''
      },
      releaseYear: getReleaseYear(item.date_published),
      provider: 'GamePix',
      providerGameId: item.id,
      width: item.width || 800,
      height: item.height || 600,
      aspectRatio:
        getAspectRatio(
          item.width || 800,
          item.height || 600
        ),
      playable: Boolean(item.url),
      category: item.category || 'arcade'
    })
  }

  await fs.writeFile(
    outputFile,
    JSON.stringify(converted)
  )

  const stat = await fs.stat(outputFile)

  console.log('===== RESULT =====')
  console.log(`Converted games : ${converted.length}`)
  console.log(
    `File size      : ${(stat.size / 1024 / 1024).toFixed(2)} MB`
  )

  console.log('')
  console.log('===== TEST GAMES =====')

  for (const slug of [
    'floppa-scary-horror',
    'scary-house-clown-evil',
    'escape-from-work'
  ]) {
    const game = converted.find(
      item => item.slug === slug
    )

    if (!game) {
      console.log(`[MISS] ${slug}`)
      continue
    }

    console.log(
      `[OK] ${slug} → ${game.title} → ${game.iframeUrl}`
    )
  }

  console.log('')
  console.log(`Output: ${outputFile}`)
}

function getInitials(title) {
  return String(title)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase() || '')
    .join('')
}

function getGradient(id) {
  const gradients = [
    'from-cyan-500 to-blue-600',
    'from-violet-500 to-purple-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-red-600',
    'from-pink-500 to-rose-600',
    'from-indigo-500 to-blue-700'
  ]

  let hash = 0

  for (const char of String(id)) {
    hash =
      (hash << 5) -
      hash +
      char.charCodeAt(0)

    hash |= 0
  }

  return gradients[
    Math.abs(hash) % gradients.length
  ]
}

function getReleaseYear(date) {
  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) {
    return new Date().getFullYear()
  }

  return parsed.getFullYear()
}

function getAspectRatio(width, height) {
  const gcd = (a, b) =>
    b === 0 ? a : gcd(b, a % b)

  const w = width > 0 ? width : 800
  const h = height > 0 ? height : 600
  const divisor = gcd(w, h)

  return `${w / divisor} / ${h / divisor}`
}

main().catch(error => {
  console.error('')
  console.error('FATAL:', error)
  process.exit(1)
})
