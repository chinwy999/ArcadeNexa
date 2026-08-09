'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginClient() {
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [loading,setLoading]=useState(false)
  const [message,setMessage]=useState('')
  const [errors,setErrors]=useState<{email?:string,password?:string}>({})

  const validate = () => {
    const e: any = {}
    if (!email.includes('@')) e.email = 'Valid email required'
    if (password.length < 6) e.password = 'Min 6 characters'
    setErrors(e)
    return Object.keys(e).length===0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setTimeout(() => { setLoading(false); setMessage('Login successful! (Demo — no backend). Redirect would happen here.'); }, 1200)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 animate-fade-in">
      <div className="w-full max-w-md glass rounded-2xl p-8 border border-white/10">
        <h1 className="text-3xl font-black text-white mb-2">Welcome Back</h1>
        <p className="text-text-secondary mb-6">Login to continue your journey</p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm text-text-secondary mb-1">Email</label>
            <input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-elevated border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-electric-violet outline-none" placeholder="you@example.com" required aria-invalid={!!errors.email} />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-text-secondary mb-1">Password</label>
            <input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-elevated border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-electric-violet outline-none" placeholder="••••••••" required aria-invalid={!!errors.password} />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-text-secondary"><input type="checkbox" className="rounded" /> Remember me</label>
            <Link href="/contact" className="text-electric-violet hover:underline">Forgot password?</Link>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-electric-violet hover:bg-violet-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition">
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>

          {message && <div className="bg-neon-green/10 border border-neon-green/30 text-neon-green text-sm p-3 rounded-xl">{message}</div>}
        </form>

        <div className="mt-6 text-center text-sm text-text-secondary">
          Do not have an account? <Link href="/register" className="text-electric-violet hover:underline font-bold">Sign Up</Link>
        </div>
      </div>
    </div>
  )
}
