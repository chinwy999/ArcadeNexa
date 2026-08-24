'use client'
import { useEffect } from 'react'
import { X } from 'lucide-react'
import ArenaPlay from './ArenaPlay'
import type { Game } from '@/lib/games'

export default function GameModal({ game, onClose, onEarn }: { game: Game | null, onClose: () => void, onEarn?: (msg: string) => void }) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onEsc)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!game) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nexa-black/90 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-modal-title"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 id="game-modal-title" className="sr-only">
          {game.name} trial
        </h2>
        <ArenaPlay game={game} onClose={onClose} isModal />
      </div>
    </div>
  )
}
