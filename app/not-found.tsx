import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-nexa-violet to-nexa-emerald flex items-center justify-center transform rotate-45 mb-6 shadow-[0_0_40px_var(--nexa-violet-shadow-strong)]">
        <span className="text-nexa-black font-black text-3xl transform -rotate-45">!</span>
      </div>
      <h1 className="text-7xl font-black text-[color:var(--text-primary)] mb-4">404</h1>
      <h2 className="text-2xl font-bold text-[color:var(--text-primary)] mb-2">Arena Not Found</h2>
      <p className="text-[color:var(--text-secondary)] max-w-md mb-8">The battlefield you are looking for does not exist, has been moved, or is under maintenance. Check the URL or return to the arena.</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/" className="bg-nexa-cyan hover:brightness-110 text-[color:var(--text-primary)] px-6 py-3 rounded-xl font-bold transition">Go Home</Link>
        <Link href="/games" className="border border-[color:var(--white-20)] hover:bg-[color:var(--white-10)] text-[color:var(--text-primary)] px-6 py-3 rounded-xl font-bold transition">Browse Games</Link>
        <Link href="/search" className="border border-nexa-emerald text-nexa-emerald hover:bg-nexa-emerald/10 px-6 py-3 rounded-xl font-bold transition">Search Games</Link>
      </div>
      <p className="text-xs text-[color:var(--text-secondary)] mt-8">If you believe this is an error, contact mostapha.bensasi@gmail.com</p>
    </div>
  )
}
