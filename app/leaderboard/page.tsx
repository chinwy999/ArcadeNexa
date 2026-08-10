import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Leaderboard',
  description: 'Global rankings — best esports players on ArcadeNexa',
  alternates: { canonical: '/leaderboard' },
}

const players = [
  { rank: 1, name: 'Faker', team: 'T1', region: 'KR', points: 9850, winRate: '78%' },
  { rank: 2, name: 's1mple', team: 'NAVI', region: 'EU', points: 9720, winRate: '74%' },
  { rank: 3, name: 'TenZ', team: 'Sentinels', region: 'NA', points: 9650, winRate: '71%' },
  { rank: 4, name: 'yay', team: 'Cloud9', region: 'NA', points: 9580, winRate: '69%' },
  { rank: 5, name: 'ZywOo', team: 'Vitality', region: 'EU', points: 9540, winRate: '73%' },
  { rank: 6, name: 'Chovy', team: 'Gen.G', region: 'KR', points: 9490, winRate: '76%' },
  { rank: 7, name: 'dev1ce', team: 'Astralis', region: 'EU', points: 9420, winRate: '70%' },
  { rank: 8, name: 'aspas', team: 'Leviatán', region: 'BR', points: 9380, winRate: '68%' },
  { rank: 9, name: 'ShowMaker', team: 'DK', region: 'KR', points: 9350, winRate: '75%' },
  { rank: 10, name: 'NiKo', team: 'G2', region: 'EU', points: 9310, winRate: '72%' },
]

export default function LeaderboardPage() {
  return (
    <div className="py-20 px-4 sm:px-6 max-w-6xl mx-auto animate-fade-in">
      <h1 className="text-5xl font-black text-white mb-4">Global Rankings</h1>
      <p className="text-text-secondary mb-8">The best of the best — updated daily</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {['All Games','Valorant','CS2','League of Legends','Dota 2'].map(g => (
          <button key={g} className={`px-4 py-2 rounded-full text-xs font-bold border ${g==='All Games'?'bg-electric-violet text-white border-electric-violet':'bg-white/5 text-text-secondary border-white/10'}`}>{g}</button>
        ))}
      </div>
      <div className="flex gap-2 mb-8">
        {['Global','NA','EU','MENA','Asia'].map(r => (
          <button key={r} className={`px-3 py-1.5 rounded-full text-xs border ${r==='Global'?'bg-white text-space-black border-white':'bg-transparent text-text-secondary border-white/10'}`}>{r}</button>
        ))}
      </div>

      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-elevated text-left text-xs uppercase text-text-secondary">
              <tr>
                <th className="px-6 py-3">Rank</th>
                <th className="px-6 py-3">Player</th>
                <th className="px-6 py-3">Team</th>
                <th className="px-6 py-3">Region</th>
                <th className="px-6 py-3">Points</th>
                <th className="px-6 py-3">Win Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {players.map(p => (
                <tr key={p.rank} className="hover:bg-white/5 transition text-sm">
                  <td className="px-6 py-4 font-black text-gold">#{p.rank}</td>
                  <td className="px-6 py-4 text-white font-bold">{p.name}</td>
                  <td className="px-6 py-4 text-text-secondary">{p.team}</td>
                  <td className="px-6 py-4 text-text-secondary">{p.region}</td>
                  <td className="px-6 py-4 text-white">{p.points.toLocaleString()}</td>
                  <td className="px-6 py-4 text-neon-green">{p.winRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
