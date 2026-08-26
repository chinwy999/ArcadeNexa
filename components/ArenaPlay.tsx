'use client'
import { useState, useCallback } from 'react'
import { Play, Trophy, RefreshCw, Sparkles, ExternalLink, Info } from 'lucide-react'
import type { Game } from '@/lib/games'

interface Props {
  game: Game
  onClose?: () => void
  isModal?: boolean
}

export default function ArenaPlay({ game, onClose, isModal = false }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [earned, setEarned] = useState(0)

  const startGame = useCallback(() => {
    setIsPlaying(true)
    setScore(0)
    setIsCompleted(false)
    setEarned(0)
  }, [])

  const handleClick = useCallback(() => {
    if (!isPlaying || isCompleted) return
    const newScore = score + 1
    setScore(newScore)
    if (newScore >= 15) {
      setIsCompleted(true)
      setIsPlaying(false)
      setEarned(150)
    }
  }, [score, isPlaying, isCompleted])

  return (
    <div className={`${isModal ? '' : 'w-full'} glass rounded-3xl p-6 sm:p-8 border border-nexa-violet/40 shadow-[0_0_50px_rgba(124,58,237,0.4)]`}>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${game.gradient} font-black text-2xl text-[color:var(--text-primary)] shadow-lg`}>{game.initials}</div>
          <div>
            <h2 className="text-2xl font-black text-[color:var(--text-primary)]">{game.name} — Arena Trial</h2>
            <p className="text-[color:var(--text-secondary)] text-sm">Interactive skill check — earn NexCoins for tournament credits</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] bg-[color:var(--white-05)] p-2 rounded-full hover:bg-[color:var(--white-10)] transition" aria-label="Close trial">
            ✕
          </button>
        )}
      </div>

      <div className="bg-nexa-navy/50 border border-[color:var(--white-05)] rounded-xl p-3 mb-4 flex gap-2 items-start text-xs text-[color:var(--text-secondary)]">
        <Info className="w-4 h-4 text-nexa-emerald flex-shrink-0 mt-0.5" />
        <span>
          <strong className="text-[color:var(--text-primary)]">Disclaimer:</strong> {game.name} is a trademark of its respective owner. This is a ArcadeNexa skill trial, not the full commercial game.
          {game.officialUrl && (
            <> Play the official game at <a href={game.officialUrl} target="_blank" rel="noopener noreferrer" className="text-nexa-violet hover:underline inline-flex items-center gap-1">{game.officialUrl} <ExternalLink className="w-3 h-3" /></a></>
          )}
        </span>
      </div>

      <div className="relative w-full h-[360px] bg-nexa-navy rounded-2xl border border-[color:var(--white-10)] overflow-hidden flex flex-col items-center justify-center p-6 text-center shadow-inner">
        {!isPlaying && !isCompleted && (
          <div className="space-y-4 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-nexa-violet/20 text-nexa-violet flex items-center justify-center mx-auto mb-2 animate-bounce">
              <Play className="w-10 h-10 ml-1" />
            </div>
            <h3 className="text-xl font-bold text-[color:var(--text-primary)]">Ready for Trial?</h3>
            <p className="text-[color:var(--text-secondary)] text-sm max-w-md mx-auto">Click the glowing orb as fast as you can 15 times to prove your reflexes and unlock <span className="text-nexa-gold font-bold">+150 NexCoins</span>!</p>
            <button onClick={startGame} className="bg-gradient-to-r from-nexa-violet to-nexa-emerald text-nexa-black font-black px-8 py-3.5 rounded-xl text-base shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-105 transition-all">
              START TRIAL NOW
            </button>
          </div>
        )}

        {isPlaying && (
          <div onClick={handleClick} className="w-full h-full flex flex-col items-center justify-center cursor-pointer select-none relative group" role="button" tabIndex={0} onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleClick()
            }
          }} aria-label="Click to score">
            <div className="absolute top-4 left-4 text-xs font-bold text-nexa-emerald bg-nexa-emerald/10 px-3 py-1 rounded-full border border-nexa-emerald/30">SCORE: {score} / 15</div>
            <div className="absolute top-4 right-4 text-xs text-[color:var(--text-secondary)]">Click fast!</div>
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-nexa-violet to-nexa-violet flex items-center justify-center text-[color:var(--text-primary)] font-black text-2xl shadow-[0_0_30px_rgba(236,72,153,0.6)] animate-pulse transform active:scale-95 transition-transform">
              CLICK!
            </div>
            <p className="text-[color:var(--text-secondary)] text-xs mt-6">Aim training — rapid clicks, no purchase required</p>
          </div>
        )}

        {isCompleted && (
          <div className="space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-nexa-emerald/20 text-nexa-emerald flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-[color:var(--text-primary)]">Trial Completed!</h3>
            <p className="text-[color:var(--text-secondary)] text-sm">You finished the {game.name} trial and earned <span className="text-nexa-gold font-bold">+{earned} NexCoins</span>!</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={startGame} className="flex items-center gap-2 bg-[color:var(--white-10)] hover:bg-[color:var(--white-20)] text-[color:var(--text-primary)] font-bold px-6 py-3 rounded-xl text-sm transition-colors">
                <RefreshCw className="w-4 h-4" /> Play Again
              </button>
              {onClose && (
                <button onClick={onClose} className="bg-nexa-violet hover:bg-violet-600 text-[color:var(--text-primary)] font-bold px-6 py-3 rounded-xl text-sm transition-colors">Collect & Close</button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 text-xs text-[color:var(--text-secondary)]">
        <span>Supported by ArcadeNexa Challenge System — Free to Play</span>
        <span className="flex items-center gap-1 text-nexa-emerald font-bold"><Sparkles className="w-3.5 h-3.5" /> Skill Based</span>
      </div>
    </div>
  )
}
