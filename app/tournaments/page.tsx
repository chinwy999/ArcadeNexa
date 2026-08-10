import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tournaments',
  description: 'ArcadeNexa tournament features are currently in development.',
  alternates: { canonical: '/tournaments' },
}

export default function TournamentsPage() {
  return (
    <div className="py-20 px-4 sm:px-6 max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-5xl font-black text-white mb-4">Tournaments</h1>
      <p className="text-text-secondary text-lg mb-10">Tournament features are currently in development.</p>
      <div className="glass rounded-2xl border border-white/5 p-8 text-center">
        <h2 className="text-2xl font-black text-white mb-2">Coming soon</h2>
        <p className="text-text-secondary">
          Real tournament listings will appear here once the tournament system is available.
        </p>
      </div>
    </div>
  )
}
