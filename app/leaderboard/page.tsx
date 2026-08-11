'use client'

import { useEffect, useState } from 'react'

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
  const data = localStorage.getItem(LEADERBOARD_KEY)
  const entries: LeaderboardEntry[] = data ? JSON.parse(data) : []
  return entries.sort((a, b) => b.score - a.score).slice(0, 50)
}

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<LeaderboardEntry[]>([])
  
  useEffect(() => {
    setPlayers(getTopPlayers())
  }, [])
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-2 text-white">🏆 Global Rankings</h1>
      <p className="text-gray-400 mb-8">أفضل اللاعبين - يتم التحديث تلقائياً من لعبك</p>
      
      {players.length === 0 ? (
        <div className="text-center py-20 bg-elevated rounded-lg border border-white/5">
          <p className="text-6xl mb-4">🎮</p>
          <p className="text-xl text-gray-400 mb-2">لا توجد نقاط بعد</p>
          <p className="text-gray-500">ابدأ اللعب لكسب النقاط وظهورك في القائمة!</p>
        </div>
      ) : (
        <div className="bg-elevated rounded-lg overflow-hidden border border-white/5">
          <table className="w-full">
            <thead className="bg-space-black">
              <tr>
                <th className="p-4 text-left text-gray-400 font-medium">الترتيب</th>
                <th className="p-4 text-left text-gray-400 font-medium">اللاعب</th>
                <th className="p-4 text-left text-gray-400 font-medium">اللعبة</th>
                <th className="p-4 text-left text-gray-400 font-medium">النقاط</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr key={index} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-2xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </td>
                  <td className="p-4 font-bold text-white">{player.username}</td>
                  <td className="p-4 text-gray-400">{player.gameTitle}</td>
                  <td className="p-4 text-yellow-400 font-bold">{player.score.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
