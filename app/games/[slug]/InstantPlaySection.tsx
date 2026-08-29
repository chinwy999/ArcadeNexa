'use client'
import { useRef, useState, useEffect } from 'react'
import { Maximize2, Gamepad2, ExternalLink } from 'lucide-react'
import type { Game } from '@/lib/games'

export default function InstantPlaySection({ game }: { game: Game }) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
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
  }, [game.iframeUrl])

  const retry = () => {
    setHasError(false)
    setIsLoading(true)
    if (iframeRef.current) iframeRef.current.src = game.iframeUrl
  }



  return (
    <div
      ref={containerRef}
      className="glass rounded-3xl overflow-hidden border border-nexa-violet/25 shadow-[0_0_40px_var(--nexa-violet-shadow)] bg-nexa-navy"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-nexa-surface/90 border-b border-[color:var(--white-05)]">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${game.gradient} font-black text-[color:var(--text-primary)] text-sm`}>
            {game.initials}
          </div>
          <div className="min-w-0">
            <h3 className="text-[color:var(--text-primary)] font-bold text-sm truncate">{game.name} — Instant Play</h3>
            <p className="text-[10px] text-nexa-emerald">LIVE • {game.width}x{game.height} • {providerName}</p>
          </div>
        </div>
        <button
          onClick={toggleFullscreen}
          className="w-8 h-8 rounded-lg bg-[color:var(--white-05)] border border-[color:var(--white-10)] hover:bg-[color:var(--white-10)] text-[color:var(--text-primary)] flex items-center justify-center"
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
          <div className="absolute inset-0 z-10 bg-nexa-navy flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-nexa-violet/20 border-t-nexa-violet rounded-full animate-spin" />
            <p className="text-[color:var(--text-secondary)] text-sm">Loading {game.name}...</p>
          </div>
        )}
        {hasError ? (
          <div className="absolute inset-0 z-20 bg-nexa-navy flex flex-col items-center justify-center p-6 text-center">
            <p className="text-[color:var(--text-primary)] font-bold mb-2">Game could not be loaded</p>
            <p className="text-[color:var(--text-secondary)] text-xs mb-4">Check your connection and try again.</p>
            <button onClick={retry} className="bg-nexa-violet text-[color:var(--text-primary)] px-4 py-2 rounded-lg text-sm">Retry</button>
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

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 py-3 bg-nexa-surface/80 border-t border-[color:var(--white-05)] text-[11px] text-[color:var(--text-secondary)]">
        <span className="flex items-center gap-2">
          <Gamepad2 className="w-3 h-3" />
          Play instantly on this page • ESC to exit fullscreen
        </span>
        <div className="flex items-center gap-3">
          {game.officialUrl && (
            <a
              href={game.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-nexa-violet hover:text-[color:var(--text-primary)]"
            >
              Official Page
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {game.instructions && (
        <div className="px-4 py-3 bg-nexa-surface/50 border-t border-[color:var(--white-05)]">
          <p className="text-[color:var(--text-primary)] font-bold text-xs mb-1">How to Play:</p>
          <p className="text-[color:var(--text-secondary)] text-xs leading-relaxed">{game.instructions}</p>
        </div>
      )}


    </div>
  )
}
