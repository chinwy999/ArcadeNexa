'use client'
import { useState } from 'react'

export default function ContactClient() {
  const [form,setForm]=useState({name:'',email:'',subject:'General',message:''})
  const [loading,setLoading]=useState(false)
  const [sent,setSent]=useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setSent(true); setForm({name:'',email:'',subject:'General',message:''}); setTimeout(()=>setSent(false),4000) }, 1000)
  }

  return (
    <div className="py-20 px-4 sm:px-6 max-w-5xl mx-auto animate-fade-in">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h1 className="text-5xl font-black text-white mb-4">Contact Us</h1>
          <p className="text-text-secondary mb-8">We would love to hear from you — bug reports, sponsorships, partnerships.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm text-text-secondary mb-1">Name</label>
              <input id="name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required className="w-full bg-elevated border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-electric-violet outline-none" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm text-text-secondary mb-1">Email</label>
              <input id="email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required className="w-full bg-elevated border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-electric-violet outline-none" />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm text-text-secondary mb-1">Subject</label>
              <select id="subject" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} className="w-full bg-elevated border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-electric-violet outline-none">
                <option>General</option><option>Bug Report</option><option>Sponsorship</option><option>Tournament</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm text-text-secondary mb-1">Message</label>
              <textarea id="message" rows={5} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required className="w-full bg-elevated border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-electric-violet outline-none"></textarea>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-electric-violet hover:bg-violet-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition">{loading ? 'Sending...' : 'SEND MESSAGE'}</button>
            {sent && <div className="bg-neon-green/10 border border-neon-green/30 text-neon-green text-sm p-3 rounded-xl">Message sent! We will respond within 24h (demo).</div>}
          </form>
        </div>

        <div className="space-y-6">
          <div className="glass p-6 rounded-xl border border-white/5">
            <h3 className="text-white font-bold mb-2">Email Us</h3>
            <p className="text-text-secondary text-sm">support@arcade-nexa-3gxg.vercel.app</p>
            <p className="text-text-secondary text-sm">privacy@arcade-nexa-3gxg.vercel.app</p>
            <p className="text-text-secondary text-sm">legal@arcade-nexa-3gxg.vercel.app</p>
          </div>
          <div className="glass p-6 rounded-xl border border-white/5">
            <h3 className="text-white font-bold mb-2">Join Discord</h3>
            <a href="https://discord.gg/" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm">Join Server</a>
          </div>
          <div className="glass p-6 rounded-xl border border-white/5">
            <h3 className="text-white font-bold mb-2">Office</h3>
            <p className="text-text-secondary text-sm">ArcadeNexa HQ<br/>Luxembourg, EU<br/>GPXPR Compliant</p>
          </div>
        </div>
      </div>
    </div>
  )
}
