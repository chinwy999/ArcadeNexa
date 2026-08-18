'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'

export default function RegisterClient() {
  const [username,setUsername]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [confirm,setConfirm]=useState('')
  const [loading,setLoading]=useState(false)
  const [message,setMessage]=useState('')

  const strength = useMemo(() => {
    if (!password) return null
    let score = 0
    if (password.length >= 6) score++
    if (password.length >= 10) score++
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    if (score <= 1) return { label: 'Weak', color: 'text-red-400' }
    if (score === 2) return { label: 'Medium', color: 'text-gold' }
    return { label: 'Strong', color: 'text-neon-green' }
  }, [password])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setMessage('Passwords do not match'); return }
    if (password.length < 6) { setMessage('Password too short'); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); setMessage('Account created! (Demo — verify email would be sent).'); setUsername(''); setEmail(''); setPassword(''); setConfirm('') }, 1200)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 animate-fade-in">
      <div className="w-full max-w-md glass rounded-2xl p-8 border border-white/10">
        <h1 className="text-3xl font-black text-white mb-2">Create Account</h1>
        <p className="text-text-secondary mb-6">Join the arena and forge your legend</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm text-text-secondary mb-1">Username</label>
            <input id="username" value={username} onChange={e=>setUsername(e.target.value)} className="w-full bg-elevated border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-electric-violet outline-none" placeholder="Legend123" required />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-text-secondary mb-1">Email</label>
            <input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-elevated border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-electric-violet outline-none" placeholder="you@example.com" required />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-text-secondary mb-1">Password</label>
            <input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-elevated border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-electric-violet outline-none" placeholder="••••••••" required />
            {strength && <p className={`text-xs mt-1 ${strength.color}`}>Strength: {strength.label}</p>}
          </div>
          <div>
            <label htmlFor="confirm" className="block text-sm text-text-secondary mb-1">Confirm Password</label>
            <input id="confirm" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} className="w-full bg-elevated border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-electric-violet outline-none" placeholder="••••••••" required />
          </div>
          <label htmlFor="register-terms" className="flex gap-2 text-xs text-text-secondary"><input id="register-terms" type="checkbox" required /> I agree to the <Link href="/terms" className="text-electric-violet hover:underline">Terms</Link> and <Link href="/privacy" className="text-electric-violet hover:underline">Privacy</Link></label>

          <button type="submit" disabled={loading} className="w-full bg-electric-violet hover:bg-violet-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition">{loading ? 'Creating...' : 'CREATE ACCOUNT'}</button>
          {message && <div className="bg-neon-green/10 border border-neon-green/30 text-neon-green text-sm p-3 rounded-xl">{message}</div>}
        </form>

        <div className="mt-6 text-center text-sm text-text-secondary">Already have an account? <Link href="/login" className="text-electric-violet hover:underline font-bold">Login</Link></div>
      </div>
    </div>
  )
}
