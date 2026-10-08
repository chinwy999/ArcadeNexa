'use client'

import { X, Maximize2 } from 'lucide-react'
import { Game } from '@/lib/games'
import { useClientTranslations } from '@/lib/i18n/client'

interface Props {
  game: Game
  onClose: () => void
}

export default function InstantPlayModal({ game, onClose }: Props) {
  const { t } = useClientTranslations()

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl h-[90vh] bg-nexa-black rounded-xl overflow-hidden">
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            type="button"
            onClick={() => window.open(game.iframeUrl, '_blank')}
            aria-label={`${t.games.openNewWindow}: ${game.name}`}
            className="bg-nexa-surface hover:bg-nexa-surface p-2 rounded-lg"
          >
            <Maximize2 className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.games.closeGame}
            className="bg-nexa-surface hover:bg-nexa-surface p-2 rounded-lg"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <iframe
          src={game.iframeUrl}
          title={`${game.name} ${t.games.gameTitle}`}
          className="w-full h-full"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    </div>
  )
}
