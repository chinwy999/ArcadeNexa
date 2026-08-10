import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about ArcadeNexa',
  alternates: { canonical: '/faq' },
}

const faqs = [
  { q: 'How do I create an account?', a: "Click JOIN NOW on homepage or go to Register page. Fill username, email, password. Verify email, ready to compete!" },
  { q: 'How do I join a tournament?', a: "Browse Tournaments page, find an event, click REGISTER. Some require team, others solo. Check rules." },
  { q: 'Is ArcadeNexa free?', a: "Yes! Basic features free. Premium tournaments may require entry fee, clearly indicated." },
  { q: 'Which languages are supported?', a: "English (default), Arabic (RTL), French, Spanish. Switch via globe icon in nav. Full i18n coming." },
  { q: 'How do I reset my password?', a: "Go to Login, click Forgot password?, enter email, receive link (expires 24h)." },
  { q: 'How are leaderboards calculated?', a: "Based on tournament performance, match wins, consistency, peak performance. Higher-tier events give more points." },
  { q: 'How do I report a bug?', a: "Contact page, select Bug Report, include details, steps, screenshots, browser info." },
  { q: 'How do I contact support?', a: "Contact form, support@arcade-nexa-3gxg.vercel.app, or Discord. Response within 24h." },
]

export default function FAQPage() {
  return (
    <div className="py-20 px-4 sm:px-6 max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-5xl font-black text-white mb-8">FAQ</h1>
      <p className="text-text-secondary mb-10">Frequently Asked Questions</p>
      <div className="space-y-4">
        {faqs.map((f,i) => (
          <details key={i} className="glass rounded-xl border border-white/5 p-5 group">
            <summary className="text-white font-bold cursor-pointer list-none flex justify-between items-center">
              {f.q}
              <span className="text-text-secondary group-open:rotate-180 transition">▼</span>
            </summary>
            <p className="text-text-secondary text-sm mt-3 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
