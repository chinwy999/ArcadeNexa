'use client'

import { useEffect, useState } from 'react'
import { Trophy, RefreshCw, Users } from 'lucide-react'

interface LeaderboardEntry {
  username: string
  gameSlug: string
  gameTitle: string
  score: number
  lastPlayed: string
}

const LEADERBOARD_KEY = 'arcade-nexa-leaderboard'

function getTopPlayers(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return []

  try {
    const data = localStorage.getItem(LEADERBOARD_KEY)
    if (!data) return []

    const entries = JSON.parse(data)

    if (!Array.isArray(entries)) return []

    return entries
      .filter(
        (entry): entry is LeaderboardEntry =>
          entry &&
          typeof entry.username === 'string' &&
          typeof entry.gameTitle === 'string' &&
          typeof entry.score === 'number'
      )
      .sort((a, b) => b.score - a.score)
      .slice(0, 50)
  } catch {
    return []
  }
}

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<LeaderboardEntry[]>([])
  const [updated, setUpdated] = useState(false)

  const refreshLeaderboard = () => {
    setPlayers(getTopPlayers())
    setUpdated(true)

    window.setTimeout(() => {
      setUpdated(false)
    }, 1200)
  }

  useEffect(() => {
    refreshLeaderboard()

    const handleUpdate = () => {
      refreshLeaderboard()
    }

    window.addEventListener(
      'arcade-nexa-score-updated',
      handleUpdate
    )

    window.addEventListener('storage', handleUpdate)

    return () => {
      window.removeEventListener(
        'arcade-nexa-score-updated',
        handleUpdate
      )

      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">

        <div>
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-nexa-gold" />

            <h1 className="text-4xl font-bold text-nexa-text-primary">
              Top Players
            </h1>
          </div>

          <p className="text-nexa-text-secondary">
            ArcadeNexa Arena rankings
          </p>
        </div>

        <button
          onClick={refreshLeaderboard}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-nexa-text-primary hover:bg-white/10 transition"
        >
          <RefreshCw
            className={`w-4 h-4 ${updated ? 'animate-spin' : ''}`}
          />

          Refresh Rankings
        </button>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

        <div className="bg-nexa-surface rounded-2xl border border-white/5 p-5">
          <Users className="w-6 h-6 text-nexa-violet mb-3" />

          <p className="text-nexa-text-secondary text-sm">
            Recorded Players
          </p>

          <p className="text-2xl font-black text-nexa-text-primary mt-1">
            {players.length}
          </p>
        </div>

        <div className="bg-nexa-surface rounded-2xl border border-white/5 p-5">
          <Trophy className="w-6 h-6 text-nexa-gold mb-3" />

          <p className="text-nexa-text-secondary text-sm">
            Highest Score
          </p>

          <p className="text-2xl font-black text-nexa-text-primary mt-1">
            {players.length
              ? players[0].score.toLocaleString()
              : '—'}
          </p>
        </div>

        <div className="bg-nexa-surface rounded-2xl border border-white/5 p-5">
          <p className="text-nexa-text-secondary text-sm">
            Ranking Type
          </p>

          <p className="text-lg font-bold text-nexa-emerald mt-1">
            Arena Trials
          </p>

          <p className="text-xs text-nexa-text-muted mt-1">
            Stored on this device
          </p>
        </div>

      </div>

      {players.length === 0 ? (

        <div className="text-center py-20 bg-nexa-surface rounded-2xl border border-white/5">

          <p className="text-6xl mb-4">
            🏆
          </p>

          <p className="text-xl text-nexa-text-secondary mb-2">
            No Arena scores yet
          </p>

          <p className="text-nexa-text-muted max-w-md mx-auto">
            Complete an ArcadeNexa Arena Trial to record your score
            and appear here.
          </p>

        </div>

      ) : (

        <div className="bg-nexa-surface rounded-2xl overflow-hidden border border-white/5">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-nexa-black">

                <tr>
                  <th className="p-4 text-left text-nexa-text-secondary font-medium">
                    Rank
                  </th>

                  <th className="p-4 text-left text-nexa-text-secondary font-medium">
                    Player
                  </th>

                  <th className="p-4 text-left text-nexa-text-secondary font-medium">
                    Game
                  </th>

                  <th className="p-4 text-right text-nexa-text-secondary font-medium">
                    Score
                  </th>
                </tr>

              </thead>

              <tbody>

                {players.map((player, index) => (

                  <tr
                    key={`${player.gameSlug}-${player.lastPlayed}-${index}`}
                    className="border-t border-white/5 hover:bg-white/5 transition-colors"
                  >

                    <td className="p-4 text-xl">
                      {index === 0
                        ? '🥇'
                        : index === 1
                          ? '🥈'
                          : index === 2
                            ? '🥉'
                            : `#${index + 1}`}
                    </td>

                    <td className="p-4 font-bold text-nexa-text-primary">
                      {player.username}
                    </td>

                    <td className="p-4 text-nexa-text-secondary">
                      {player.gameTitle}
                    </td>

                    <td className="p-4 text-right text-nexa-gold font-bold">
                      {player.score.toLocaleString()}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

      <div className="mt-6 p-4 rounded-xl border border-white/5 bg-white/[0.02] text-xs text-nexa-text-muted">
        Rankings currently use local browser storage. A true global
        leaderboard requires a server-side database and authenticated
        player accounts.
      </div>

    </div>
  )
}
