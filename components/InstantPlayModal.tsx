'use client'

import { X, Maximize2 } from 'lucide-react'
import { Game } from '@/lib/games'

interface Props {
  game: Game
  onClose: () => void
}

export default function InstantPlayModal({ game, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl h-[90vh] bg-gray-900 rounded-xl overflow-hidden">
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button onClick={() => window.open(game.iframeUrl, '_blank')} className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg">
            <Maximize2 className="w-5 h-5" />
          </button>
          <button onClick={onClose} className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <iframe
          src={game.iframeUrl}
          title={`${game.name} game`}
          className="w-full h-full"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    </div>
  )
}
