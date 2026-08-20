export interface ArcadeNexaScoreInput {
  rating?: number | string | null
  releaseYear?: number | string | null
  playable?: boolean | null

  title?: string | null
  description?: string | null
  instructions?: string | null
  tags?: string[] | null

  thumbnail?: string | null
  thumbnailLarge?: string | null
  iframeUrl?: string | null
  officialUrl?: string | null

  width?: number | string | null
  height?: number | string | null

  provider?: string | null
}

export interface ArcadeNexaScoreBreakdown {
  baseRating: number
  playability: number
  content: number
  freshness: number
  completeness: number
  providerAdjustment: number
  finalScore: number
}

function clamp(
  value: number,
  min: number,
  max: number
): number {
  return Math.min(Math.max(value, min), max)
}

function toNumber(
  value: unknown,
  fallback = 0
): number {
  const number = Number(value)

  return Number.isFinite(number)
    ? number
    : fallback
}

function normalizeText(
  value: unknown
): string {
  return typeof value === 'string'
    ? value.trim()
    : ''
}

function getTagCount(
  tags?: string[] | null
): number {
  if (!Array.isArray(tags)) {
    return 0
  }

  return tags.filter(
    tag =>
      typeof tag === 'string' &&
      tag.trim().length > 0
  ).length
}

/**
 * ArcadeNexa Score V3
 *
 * Internal editorial/quality score.
 *
 * It is NOT a user-voted rating.
 *
 * Main goals:
 * - reward real playable games
 * - reward complete metadata
 * - distinguish weak and strong content
 * - avoid artificial 9+ inflation
 * - keep GamePix and GameMonetize reasonably balanced
 */
export function calculateArcadeNexaScore(
  game: ArcadeNexaScoreInput
): number {
  const title = normalizeText(game.title)
  const description = normalizeText(game.description)
  const instructions = normalizeText(game.instructions)

  const tags = getTagCount(game.tags)

  const thumbnail =
    normalizeText(game.thumbnail) ||
    normalizeText(game.thumbnailLarge)

  const iframeUrl =
    normalizeText(game.iframeUrl)

  const officialUrl =
    normalizeText(game.officialUrl)

  const width = toNumber(game.width)
  const height = toNumber(game.height)

  /*
   * ============================================================
   * 1. BASE QUALITY — 30%
   * ============================================================
   *
   * GamePix quality_score is useful.
   * GameMonetize usually does not provide an equivalent score.
   *
   * We therefore normalize the incoming rating but deliberately
   * reduce the influence of very high values.
   */

  const inputRating = clamp(
    toNumber(game.rating, 7),
    0,
    10
  )

  let baseRating = inputRating

  if (inputRating < 6) {
    baseRating -= 0.20
  }

  if (inputRating < 7) {
    baseRating -= 0.15
  }

  if (inputRating >= 9.5) {
    baseRating += 0.10
  }

  baseRating = clamp(
    baseRating,
    4.5,
    9.8
  )

  /*
   * ============================================================
   * 2. PLAYABILITY — 25%
   * ============================================================
   */

  let playability = 5.2

  if (game.playable === true) {
    playability += 1.9
  } else {
    playability -= 0.8
  }

  if (iframeUrl) {
    playability += 0.55
  }

  if (thumbnail) {
    playability += 0.30
  }

  if (title) {
    playability += 0.15
  }

  if (
    width >= 300 &&
    height >= 200
  ) {
    playability += 0.35
  }

  if (
    width >= 640 &&
    height >= 360
  ) {
    playability += 0.15
  }

  playability = clamp(
    playability,
    3.5,
    9.8
  )

  /*
   * ============================================================
   * 3. CONTENT QUALITY — 20%
   * ============================================================
   */

  let content = 4.4

  const descriptionLength =
    description.length

  const instructionLength =
    instructions.length

  const titleLength =
    title.length

  if (descriptionLength >= 40) {
    content += 0.45
  }

  if (descriptionLength >= 80) {
    content += 0.45
  }

  if (descriptionLength >= 150) {
    content += 0.40
  }

  if (descriptionLength >= 250) {
    content += 0.30
  }

  if (instructionLength >= 20) {
    content += 0.40
  }

  if (instructionLength >= 50) {
    content += 0.40
  }

  if (instructionLength >= 100) {
    content += 0.30
  }

  if (instructionLength >= 180) {
    content += 0.20
  }

  if (tags >= 2) {
    content += 0.20
  }

  if (tags >= 4) {
    content += 0.20
  }

  if (
    titleLength >= 3 &&
    titleLength <= 80
  ) {
    content += 0.20
  }

  /*
   * Penalize obvious empty metadata.
   */

  if (
    descriptionLength === 0 &&
    instructionLength === 0 &&
    tags === 0
  ) {
    content -= 0.50
  }

  content = clamp(
    content,
    3.5,
    9.6
  )

  /*
   * ============================================================
   * 4. FRESHNESS — 10%
   * ============================================================
   */

  const currentYear =
    new Date().getFullYear()

  const releaseYear =
    toNumber(game.releaseYear)

  let freshness = 6.5

  if (releaseYear > 0) {
    const age = Math.max(
      0,
      currentYear - releaseYear
    )

    if (age === 0) {
      freshness = 8.9
    } else if (age === 1) {
      freshness = 8.7
    } else if (age === 2) {
      freshness = 8.5
    } else if (age <= 4) {
      freshness = 8.1
    } else if (age <= 6) {
      freshness = 7.7
    } else if (age <= 10) {
      freshness = 7.3
    } else if (age <= 15) {
      freshness = 6.8
    } else {
      freshness = 6.2
    }
  }

  /*
   * ============================================================
   * 5. COMPLETENESS — 15%
   * ============================================================
   */

  let completeness = 3.8

  if (title) {
    completeness += 0.85
  }

  if (thumbnail) {
    completeness += 0.75
  }

  if (description) {
    completeness += 0.70
  }

  if (instructions) {
    completeness += 0.55
  }

  if (tags > 0) {
    completeness += 0.45
  }

  if (iframeUrl) {
    completeness += 0.50
  }

  if (officialUrl) {
    completeness += 0.20
  }

  if (
    width >= 300 &&
    height >= 200
  ) {
    completeness += 0.25
  }

  completeness = clamp(
    completeness,
    3.0,
    9.5
  )

  /*
   * ============================================================
   * 6. PROVIDER CALIBRATION
   * ============================================================
   *
   * Small adjustment only.
   *
   * This prevents the score from becoming biased simply because
   * one provider supplies weaker/more generic metadata.
   *
   * We deliberately keep this tiny.
   */

  let providerAdjustment = 0

  const provider =
    normalizeText(game.provider).toLowerCase()

  if (provider === 'gamepix') {
    providerAdjustment += 0.10
  }

  if (provider === 'gamemonetize') {
    providerAdjustment -= 0.05
  }

  /*
   * ============================================================
   * 7. WEIGHTED SCORE
   * ============================================================
   */

  let weighted =
    baseRating * 0.30 +
    playability * 0.25 +
    content * 0.20 +
    freshness * 0.10 +
    completeness * 0.15

  weighted += providerAdjustment

  /*
   * ============================================================
   * 8. QUALITY GUARDS
   * ============================================================
   *
   * These prevent a game with poor metadata from receiving an
   * artificially high score.
   */

  if (!title) {
    weighted -= 0.40
  }

  if (!thumbnail) {
    weighted -= 0.25
  }

  if (!description) {
    weighted -= 0.25
  }

  if (!game.playable) {
    weighted -= 0.45
  }

  if (
    descriptionLength < 40 &&
    instructionLength < 20 &&
    tags < 2
  ) {
    weighted -= 0.30
  }

  /*
   * High score requires supporting quality.
   */

  if (
    baseRating < 7 &&
    weighted >= 8.2
  ) {
    weighted -= 0.30
  }

  if (
    content < 6.5 &&
    weighted >= 8.4
  ) {
    weighted -= 0.25
  }

  if (
    playability < 7.5 &&
    weighted >= 8.4
  ) {
    weighted -= 0.25
  }

  /*
   * ============================================================
   * 9. FINAL NORMALIZATION
   * ============================================================
   *
   * Final public-facing ArcadeNexa Score:
   *
   * 6.0 → weak
   * 7.x → average/good
   * 8.x → strong
   * 9.x → exceptional
   */

  const finalScore =
    6 +
    (weighted - 5) * 0.72

  return Number(
    clamp(
      finalScore,
      6.0,
      9.8
    ).toFixed(1)
  )
}

/**
 * Detailed score breakdown.
 *
 * Useful for internal testing/debugging.
 */
export function getArcadeNexaScoreBreakdown(
  game: ArcadeNexaScoreInput
): ArcadeNexaScoreBreakdown {
  const title = normalizeText(game.title)
  const description = normalizeText(game.description)
  const instructions = normalizeText(game.instructions)

  const tags = getTagCount(game.tags)

  const thumbnail =
    normalizeText(game.thumbnail) ||
    normalizeText(game.thumbnailLarge)

  const iframeUrl =
    normalizeText(game.iframeUrl)

  const officialUrl =
    normalizeText(game.officialUrl)

  const width = toNumber(game.width)
  const height = toNumber(game.height)

  const inputRating = clamp(
    toNumber(game.rating, 7),
    0,
    10
  )

  let baseRating = inputRating

  if (inputRating < 6) {
    baseRating -= 0.20
  }

  if (inputRating < 7) {
    baseRating -= 0.15
  }

  if (inputRating >= 9.5) {
    baseRating += 0.10
  }

  baseRating = clamp(
    baseRating,
    4.5,
    9.8
  )

  let playability = 5.2

  if (game.playable === true) {
    playability += 1.9
  } else {
    playability -= 0.8
  }

  if (iframeUrl) {
    playability += 0.55
  }

  if (thumbnail) {
    playability += 0.30
  }

  if (title) {
    playability += 0.15
  }

  if (
    width >= 300 &&
    height >= 200
  ) {
    playability += 0.35
  }

  if (
    width >= 640 &&
    height >= 360
  ) {
    playability += 0.15
  }

  playability = clamp(
    playability,
    3.5,
    9.8
  )

  let content = 4.4

  const d = description.length
  const i = instructions.length

  if (d >= 40) content += 0.45
  if (d >= 80) content += 0.45
  if (d >= 150) content += 0.40
  if (d >= 250) content += 0.30

  if (i >= 20) content += 0.40
  if (i >= 50) content += 0.40
  if (i >= 100) content += 0.30
  if (i >= 180) content += 0.20

  if (tags >= 2) content += 0.20
  if (tags >= 4) content += 0.20

  if (
    title.length >= 3 &&
    title.length <= 80
  ) {
    content += 0.20
  }

  if (
    d === 0 &&
    i === 0 &&
    tags === 0
  ) {
    content -= 0.50
  }

  content = clamp(
    content,
    3.5,
    9.6
  )

  const currentYear =
    new Date().getFullYear()

  const releaseYear =
    toNumber(game.releaseYear)

  let freshness = 6.5

  if (releaseYear > 0) {
    const age = Math.max(
      0,
      currentYear - releaseYear
    )

    if (age === 0) freshness = 8.9
    else if (age === 1) freshness = 8.7
    else if (age === 2) freshness = 8.5
    else if (age <= 4) freshness = 8.1
    else if (age <= 6) freshness = 7.7
    else if (age <= 10) freshness = 7.3
    else if (age <= 15) freshness = 6.8
    else freshness = 6.2
  }

  let completeness = 3.8

  if (title) completeness += 0.85
  if (thumbnail) completeness += 0.75
  if (description) completeness += 0.70
  if (instructions) completeness += 0.55
  if (tags > 0) completeness += 0.45
  if (iframeUrl) completeness += 0.50
  if (officialUrl) completeness += 0.20

  if (
    width >= 300 &&
    height >= 200
  ) {
    completeness += 0.25
  }

  completeness = clamp(
    completeness,
    3.0,
    9.5
  )

  let providerAdjustment = 0

  const provider =
    normalizeText(game.provider).toLowerCase()

  if (provider === 'gamepix') {
    providerAdjustment += 0.10
  }

  if (provider === 'gamemonetize') {
    providerAdjustment -= 0.05
  }

  let weighted =
    baseRating * 0.30 +
    playability * 0.25 +
    content * 0.20 +
    freshness * 0.10 +
    completeness * 0.15

  weighted += providerAdjustment

  if (!title) weighted -= 0.40
  if (!thumbnail) weighted -= 0.25
  if (!description) weighted -= 0.25
  if (!game.playable) weighted -= 0.45

  if (
    d < 40 &&
    i < 20 &&
    tags < 2
  ) {
    weighted -= 0.30
  }

  if (
    baseRating < 7 &&
    weighted >= 8.2
  ) {
    weighted -= 0.30
  }

  if (
    content < 6.5 &&
    weighted >= 8.4
  ) {
    weighted -= 0.25
  }

  if (
    playability < 7.5 &&
    weighted >= 8.4
  ) {
    weighted -= 0.25
  }

  const finalScore = Number(
    clamp(
      6 + (weighted - 5) * 0.72,
      6.0,
      9.8
    ).toFixed(1)
  )

  return {
    baseRating: Number(baseRating.toFixed(2)),
    playability: Number(playability.toFixed(2)),
    content: Number(content.toFixed(2)),
    freshness: Number(freshness.toFixed(2)),
    completeness: Number(completeness.toFixed(2)),
    providerAdjustment: Number(
      providerAdjustment.toFixed(2)
    ),
    finalScore,
  }
}

/**
 * Human-readable label.
 */
export function getArcadeNexaScoreLabel(
  score: number
): string {
  if (score >= 9.5) {
    return 'Exceptional'
  }

  if (score >= 9.0) {
    return 'Excellent'
  }

  if (score >= 8.5) {
    return 'Very Good'
  }

  if (score >= 8.0) {
    return 'Good'
  }

  if (score >= 7.5) {
    return 'Above Average'
  }

  if (score >= 7.0) {
    return 'Average'
  }

  if (score >= 6.5) {
    return 'Fair'
  }

  return 'Basic'
}
