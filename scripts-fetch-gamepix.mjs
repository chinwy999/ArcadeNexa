import fs from 'node:fs/promises'

const API_BASE = 'https://feeds.gamepix.com/v2/json'
const SITE_ID = process.env.GAMEPIX_SID || 'DXXR1'

const TOTAL_PAGES = 141
const PAGE_SIZE = 96
const CONCURRENCY = 5
const TIMEOUT = 20000

async function fetchPage(page) {
  const url =
    `${API_BASE}?sid=${encodeURIComponent(SITE_ID)}` +
    `&pagination=${PAGE_SIZE}` +
    `&page=${page}` +
    `&order=quality`

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT)

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()

    if (!Array.isArray(data.items)) {
      throw new Error('Invalid response: items is not an array')
    }

    return data.items
  } finally {
    clearTimeout(timer)
  }
}

async function main() {
  const started = Date.now()

  console.log('========================================')
  console.log(' ARCADENEXA — FULL GAMEPIX FETCH TEST')
  console.log('========================================')
  console.log(`Pages      : ${TOTAL_PAGES}`)
  console.log(`Page size  : ${PAGE_SIZE}`)
  console.log(`Concurrency: ${CONCURRENCY}`)
  console.log('')

  const allItems = []
  const seen = new Set()
  let completed = 0
  let failed = 0

  for (let start = 1; start <= TOTAL_PAGES; start += CONCURRENCY) {
    const pages = []

    for (
      let page = start;
      page < start + CONCURRENCY && page <= TOTAL_PAGES;
      page++
    ) {
      pages.push(page)
    }

    const results = await Promise.all(
      pages.map(async page => {
        try {
          const items = await fetchPage(page)

          completed++

          console.log(
            `[OK] page ${page}/${TOTAL_PAGES} — ${items.length} games`
          )

          return { page, items }
        } catch (error) {
          failed++

          console.error(
            `[FAIL] page ${page}/${TOTAL_PAGES} — ${error.message}`
          )

          return { page, items: [] }
        }
      })
    )

    results
      .sort((a, b) => a.page - b.page)
      .forEach(({ items }) => {
        for (const item of items) {
          const key = String(item.namespace || item.id || '').trim()

          if (key && !seen.has(key)) {
            seen.add(key)
            allItems.push(item)
          }
        }
      })

    console.log(
      `Progress: ${completed}/${TOTAL_PAGES} pages | ` +
      `${allItems.length} unique games`
    )
    console.log('')
  }

  await fs.mkdir('data', { recursive: true })

  await fs.writeFile(
    'data/gamepix-raw-test.json',
    JSON.stringify(allItems)
  )

  const seconds = ((Date.now() - started) / 1000).toFixed(1)

  console.log('========================================')
  console.log(' GAMEPIX TEST COMPLETE')
  console.log('========================================')
  console.log(`Successful pages : ${completed}`)
  console.log(`Failed pages     : ${failed}`)
  console.log(`Unique games     : ${allItems.length}`)
  console.log(`Time             : ${seconds}s`)

  const stat = await fs.stat('data/gamepix-raw-test.json')

  console.log(
    `File size        : ${(stat.size / 1024 / 1024).toFixed(2)} MB`
  )

  console.log('')
  console.log('Output:')
  console.log('data/gamepix-raw-test.json')
}

main().catch(error => {
  console.error('')
  console.error('FATAL:', error)
  process.exit(1)
})
