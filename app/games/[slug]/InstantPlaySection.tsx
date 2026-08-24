'use client'
import { useRef, useState, useEffect } from 'react'
import { Maximize2, Gamepad2, ExternalLink, Trophy } from 'lucide-react'
import type { Game } from '@/lib/games'

const LEADERBOARD_KEY = 'arcade-nexa-leaderboard'

function saveScore(game: Game, username: string, score: number) {
  try {
    const existing = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]')
    const entry = {
      username,
      gameSlug: game.slug,
      gameTitle: game.title,
      score,
      lastPlayed: new Date().toISOString(),
    }
    existing.push(entry)
    existing.sort((a: any, b: any) => b.score - a.score)
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(existing.slice(0, 100)))
    window.dispatchEvent(new Event('arcade-nexa-score-updated'))
  } catch {}
}

export default function InstantPlaySection({ game }: { game: Game }) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [showScoreModal, setShowScoreModal] = useState(false)
  const [username, setUsername] = useState('')
  const [score, setScore] = useState('')
  const [scoreSaved, setScoreSaved] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const providerName = 'ArcadeNexa'

  const toggleFullscreen = async () => {
    if (!containerRef.current) return
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch {}
  }

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  useEffect(() => {
    setIsLoading(true)
    setHasError(false)
    setScoreSaved(false)
  }, [game.iframeUrl])

  const retry = () => {
    setHasError(false)
    setIsLoading(true)
    if (iframeRef.current) iframeRef.current.src = game.iframeUrl
  }

  const handleSaveScore = () => {
    if (!username.trim() || !score.trim()) return
    const numScore = parseInt(score)
    if (isNaN(numScore) || numScore < 0) return
    saveScore(game, username.trim(), numScore)
    setScoreSaved(true)
    setShowScoreModal(false)
    setUsername('')
    setScore('')
  }

  return (
    <div
      ref={containerRef}
      className="glass rounded-3xl overflow-hidden border border-nexa-violet/30 shadow-[0_0_40px_rgba(124,58,237,0.2)] bg-[#0a0a1a]"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-[#15152a]/90 border-b border-white/5">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${game.gradient} font-black text-white text-sm`}>
            {game.initials}
          </div>
          <div className="min-w-0">
            <h3 className="text-white font-bold text-sm truncate">{game.name} — Instant Play</h3>
            <p className="text-[10px] text-nexa-emerald">LIVE • {game.width}x{game.height} • {providerName}</p>
          </div>
        </div>
        <button
          onClick={toggleFullscreen}
          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center"
          aria-label="Toggle fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      <div
        className="relative w-full bg-black overflow-hidden"
        style={{ aspectRatio: game.aspectRatio, maxHeight: isFullscreen ? '100vh' : '70vh', minHeight: '320px' }}
      >
        {isLoading && !hasError && (
          <div className="absolute inset-0 z-10 bg-[#0a0a1a] flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-nexa-violet/20 border-t-nexa-violet rounded-full animate-spin" />
            <p className="text-text-secondary text-sm">Loading {game.name}...</p>
          </div>
        )}
        {hasError ? (
          <div className="absolute inset-0 z-20 bg-[#0a0a1a] flex flex-col items-center justify-center p-6 text-center">
            <p className="text-white font-bold mb-2">Game could not be loaded</p>
            <p className="text-text-secondary text-xs mb-4">Check your connection and try again.</p>
            <button onClick={retry} className="bg-nexa-violet text-white px-4 py-2 rounded-lg text-sm">Retry</button>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={game.iframeUrl}
            title={`${game.title} — ${providerName}`}
            className="w-full h-full border-0 block bg-black"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; gamepad; keyboard-map; xr-spatial-tracking"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups allow-popups-to-escape-sandbox"
            referrerPolicy="strict-origin-when-cross-origin"
            loading="eager"
            scrolling="no"
            onLoad={() => { setIsLoading(false); setHasError(false) }}
            onError={() => { setIsLoading(false); setHasError(true) }}
          />
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 py-3 bg-[#15152a]/80 border-t border-white/5 text-[11px] text-text-secondary">
        <span className="flex items-center gap-2">
          <Gamepad2 className="w-3 h-3" />
          Play instantly on this page • ESC to exit fullscreen
        </span>
        <div className="flex items-center gap-3">
          {scoreSaved && (
            <span className="text-nexa-emerald font-bold flex items-center gap-1">
              <Trophy className="w-3 h-3" /> Score saved!
            </span>
          )}
          <button
            onClick={() => setShowScoreModal(true)}
            className="inline-flex items-center gap-1 text-yellow-400 hover:text-white transition font-bold"
          >
            <Trophy className="w-3 h-3" />
            Submit Score
          </button>
          {game.officialUrl && (
            <a
              href={game.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-nexa-violet hover:text-white"
            >
              Official Page
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {game.instructions && (
        <div className="px-4 py-3 bg-nexa-surface/50 border-t border-white/5">
          <p className="text-white font-bold text-xs mb-1">How to Play:</p>
          <p className="text-text-secondary text-xs leading-relaxed">{game.instructions}</p>
        </div>
      )}

      {showScoreModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#15152a] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-white font-black text-xl mb-1 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" /> Submit Score
            </h3>
            <p className="text-gray-400 text-sm mb-4">Record your score for <span className="text-white font-bold">{game.title}</span></p>
            <div className="space-y-3 mb-4">
              <div>
                <label htmlFor="score-username" className="text-gray-400 text-xs mb-1 block">Your Name</label>
                <input
                  id="score-username"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter your name..."
                  maxLength={20}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-nexa-violet/60"
                />
              </div>
              <div>
                <label htmlFor="score-value" className="text-gray-400 text-xs mb-1 block">Your Score</label>
                <input
                  id="score-value"
                  type="number"
                  value={score}
                  onChange={e => setScore(e.target.value)}
                  placeholder="Enter your score..."
                  min="0"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-nexa-violet/60"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowScoreModal(false)}
                className="flex-1 py-2 rounded-xl border border-white/10 text-gray-400 text-sm hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveScore}
                disabled={!username.trim() || !score.trim()}
                className="flex-1 py-2 rounded-xl bg-nexa-violet text-white text-sm font-bold disabled:opacity-40"
              >
                Save Score
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
