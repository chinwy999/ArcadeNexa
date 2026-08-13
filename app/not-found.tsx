import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-electric-violet to-neon-green flex items-center justify-center transform rotate-45 mb-6 shadow-[0_0_40px_rgba(124,58,237,0.4)]">
        <span className="text-space-black font-black text-3xl transform -rotate-45">!</span>
      </div>
      <h1 className="text-7xl font-black text-white mb-4">404</h1>
      <h2 className="text-2xl font-bold text-white mb-2">Arena Not Found</h2>
      <p className="text-text-secondary max-w-md mb-8">The battlefield you are looking for does not exist, has been moved, or is under maintenance. Check the URL or return to the arena.</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/" className="bg-electric-violet hover:bg-violet-600 text-white px-6 py-3 rounded-xl font-bold transition">Go Home</Link>
        <Link href="/games" className="border border-white/20 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-bold transition">Browse Games</Link>
        <Link href="/search" className="border border-neon-green text-neon-green hover:bg-neon-green/10 px-6 py-3 rounded-xl font-bold transition">Search Arena</Link>
      </div>
      <p className="text-xs text-text-secondary mt-8">If you believe this is an error, contact mostapha.bensasi@gmail.com</p>
    </div>
  )
}
