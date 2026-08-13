'use client'
import { useState } from 'react'

export default function ContactClient() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('https://formspree.io/f/xbgrkdyv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (response.ok) {
        setSent(true)
        setForm({ name: '', email: '', subject: 'General', message: '' })
        setTimeout(() => setSent(false), 5000)
      } else {
        setError('Failed to send message. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-20 px-4 sm:px-6 max-w-5xl mx-auto animate-fade-in">
      <h1 className="text-5xl font-black text-white mb-4">Contact Us</h1>
      <p className="text-text-secondary text-lg mb-12">Have a question, bug report, or partnership inquiry? We'd love to hear from you.</p>

      <div className="grid md:grid-cols-2 gap-12">

        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Name</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                placeholder="Your name"
                className="w-full bg-elevated border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-electric-violet outline-none placeholder:text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                placeholder="your@email.com"
                className="w-full bg-elevated border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-electric-violet outline-none placeholder:text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Subject</label>
              <select
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                className="w-full bg-elevated border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-electric-violet outline-none"
              >
                <option>General</option>
                <option>Bug Report</option>
                <option>Game Request</option>
                <option>Partnership</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Message</label>
              <textarea
                rows={5}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                required
                placeholder="Tell us how we can help..."
                className="w-full bg-elevated border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-electric-violet outline-none placeholder:text-gray-600 resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-electric-violet hover:bg-violet-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition"
            >
              {loading ? 'Sending...' : 'SEND MESSAGE'}
            </button>
            {sent && (
              <div className="bg-neon-green/10 border border-neon-green/30 text-neon-green text-sm p-4 rounded-xl text-center">
                ✅ Message sent successfully! We will get back to you soon.
              </div>
            )}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-4 rounded-xl text-center">
                ❌ {error}
              </div>
            )}
          </form>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>

          <div className="glass p-6 rounded-xl border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">📧</span>
              <h3 className="text-white font-bold">Email Support</h3>
            </div>
            <p className="text-text-secondary text-sm">mostapha.bensasi@gmail.com</p>
            <p className="text-text-secondary text-sm mt-1">We typically respond within 24 hours.</p>
          </div>

          <div className="glass p-6 rounded-xl border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🐛</span>
              <h3 className="text-white font-bold">Bug Reports</h3>
            </div>
            <p className="text-text-secondary text-sm">Found a bug? Please include the game name, device, browser, and steps to reproduce the issue.</p>
          </div>

          <div className="glass p-6 rounded-xl border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🤝</span>
              <h3 className="text-white font-bold">Partnerships</h3>
            </div>
            <p className="text-text-secondary text-sm">Interested in partnering with ArcadeNexa? We're open to game developers, sponsors, and content creators.</p>
          </div>

          <div className="glass p-6 rounded-xl border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">⏱️</span>
              <h3 className="text-white font-bold">Response Time</h3>
            </div>
            <p className="text-text-secondary text-sm">We aim to respond to all inquiries within 24-48 hours on business days.</p>
          </div>
        </div>

      </div>
    </div>
  )
}
