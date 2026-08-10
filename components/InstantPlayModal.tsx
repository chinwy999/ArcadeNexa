'use client'
import { useEffect, useState, useRef } from 'react'
import { X, Maximize2, AlertTriangle } from 'lucide-react'

interface InstantPlayModalProps {
  url: string | null
  title: string
  onClose: () => void
  // Optional game metadata for better display
  width?: number
  height?: number
  aspectRatio?: string
  provider?: string
}

export default function InstantPlayModal({ url, title, onClose, width, height, aspectRatio, provider }: InstantPlayModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [resolvedUrl, setResolvedUrl] = useState('')
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const loadTimeoutRef = useRef<number | null>(null)

  const isGamePix = provider === 'gamepix' || (url?.includes('gamepix.com') ?? false)

  const resolveUrl = (raw: string) => {
    if (!raw) return ''
    raw = raw.trim()
    if (/^(https?:)?\/\//i.test(raw) || raw.startsWith('data:') || raw.startsWith('blob:')) {
      return raw.replace(/^http:\/\//i, 'https://')
    }
    if (typeof window === 'undefined') return raw
    try {
      if (raw.startsWith('/')) return new URL(raw, window.location.origin).toString()
      return new URL(raw, window.location.origin + '/').toString()
    } catch {
      return raw
    }
  }

  useEffect(() => {
    if (!url) return
    const abs = resolveUrl(url)
    setResolvedUrl(abs)
    setIsLoading(true)
    setHasError(false)

    loadTimeoutRef.current = window.setTimeout(() => {
      setIsLoading(false)
    }, 8000)

    return () => {
      if (loadTimeoutRef.current) window.clearTimeout(loadTimeoutRef.current)
    }
  }, [url])

  useEffect(() => {
    if (!url) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.classList.add('modal-open')

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onEsc)

    return () => {
      document.body.style.overflow = prevOverflow
      document.body.classList.remove('modal-open')
      document.removeEventListener('keydown', onEsc)
    }
  }, [url, onClose])

  const handleIframeLoad = () => {
    if (loadTimeoutRef.current) window.clearTimeout(loadTimeoutRef.current)
    setIsLoading(false)
    setHasError(false)
  }

  const handleIframeError = () => {
    if (loadTimeoutRef.current) window.clearTimeout(loadTimeoutRef.current)
    setIsLoading(false)
    setHasError(true)
  }

  const toggleFullscreen = async () => {
    if (!containerRef.current) return
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (err) {
      console.warn('Fullscreen API failed', err)
    }
  }

  if (!url) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-4 bg-black/90 backdrop-blur-md animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="instant-play-title">
      <div className="absolute inset-0" onClick={onClose} aria-hidden />

      <div ref={containerRef} className="relative w-full h-full md:w-[95vw] md:h-[90vh] md:max-w-[1400px] bg-[#0a0a1a] md:rounded-2xl border border-electric-violet/30 flex flex-col overflow-hidden shadow-[0_0_50px_rgba(124,58,237,0.4)] animate-slide-up">
        <header className="flex items-center justify-between px-4 py-3 bg-[#15152a]/95 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <h2 id="instant-play-title" className="text-white font-black text-base md:text-lg truncate">{title}</h2>
            <span className="hidden sm:inline text-[10px] font-bold bg-neon-green/15 text-neon-green border border-neon-green/30 px-2.5 py-1 rounded-full">● INSTANT PLAY</span>
            {width && height && <span className="hidden md:inline text-[10px] bg-white/5 border border-white/10 text-text-secondary px-2 py-1 rounded-full">{width}x{height} • {aspectRatio || `${width}/${height}`}</span>}
            {isGamePix && <span className="hidden md:inline text-[10px] bg-blue-500/15 text-blue-400 border border-blue-500/30 px-2 py-1 rounded-full">GamePix</span>}
            {isLoading && <span className="text-xs text-text-secondary animate-pulse">Loading...</span>}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={toggleFullscreen} className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-text-secondary hover:text-white hover:bg-white/10 flex items-center justify-center transition" aria-label="Toggle fullscreen">
              <Maximize2 className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-text-secondary hover:text-white hover:bg-red-500/15 hover:border-red-500/30 flex items-center justify-center transition" aria-label="Close game">
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center" style={aspectRatio ? { aspectRatio } : undefined}>
          {isLoading && (
            <div className="absolute inset-0 z-10 bg-[#0a0a1a] flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-electric-violet/20 border-t-electric-violet rounded-full animate-spin" />
              <p className="text-text-secondary text-sm">Loading {title}...</p>
              <p className="text-[11px] text-text-secondary/60 max-w-[320px] text-center px-4 truncate">{resolvedUrl}</p>
            </div>
          )}

          {hasError ? (
            <div className="absolute inset-0 z-20 bg-[#0a0a1a] flex flex-col items-center justify-center p-6 text-center">
              <AlertTriangle className="w-12 h-12 text-gold mb-4" />
              <h3 className="text-white font-bold text-xl mb-2">Failed to Load</h3>
              <p className="text-text-secondary text-sm max-w-md mb-4">
                {isGamePix ? 'GamePix game failed to load. This may be due to ad-blocker or network.' : 'Game cannot be embedded (X-Frame-Options).'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={onClose} className="border border-white/10 hover:bg-white/10 text-white px-6 py-2.5 rounded-xl font-bold text-sm">
                  Close
                </button>
              </div>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              src={resolvedUrl}
              title={title}
              className="w-full h-full border-0 block bg-black"
              // Per Phase 5: For GPX games, no overly restrictive sandbox, allow fullscreen
              {...(isGamePix ? {
                allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; gamepad; keyboard-map; xr-spatial-tracking",
                allowFullScreen: true,
                sandbox: "allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups allow-popups-to-escape-sandbox",
                referrerPolicy: "strict-origin-when-cross-origin" as const,
                loading: "eager" as const,
              } : {
                allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen",
                allowFullScreen: true,
                sandbox: "allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock",
                loading: "eager" as const,
              })}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            />
          )}
        </div>

        <footer className="hidden md:flex items-center justify-between px-4 py-2 bg-[#15152a]/90 border-t border-white/5 text-[11px] text-[#64748b] shrink-0">
          <span>ESC to close • Fullscreen for best experience • {width}x{height} • {aspectRatio}</span>
          <span className="font-mono opacity-60 truncate max-w-[300px]">{resolvedUrl.split('?')[0]}</span>
        </footer>
      </div>
    </div>
  )
}
