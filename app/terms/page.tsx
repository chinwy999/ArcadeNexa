import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'ArcadeNexa terms of service — rules of the arena',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <div className="py-20 px-4 sm:px-6 max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-5xl font-black text-white mb-2">Terms of Service</h1>
      <p className="text-text-secondary mb-8">The rules of the arena</p>
      <div className="space-y-6 text-text-secondary">
        <section><h2 className="text-white font-bold text-xl">Acceptance</h2><p>By accessing ArcadeNexa you agree to these terms. If disagree, may not access.</p></section>
        <section><h2 className="text-white font-bold text-xl">Eligibility (13+)</h2><p>Must be 13+; 13-18 requires parental consent. Info must be accurate.</p></section>
        <section><h2 className="text-white font-bold text-xl">Account Responsibilities</h2><p>Confidential credentials, all activities under account. No sharing/selling accounts.</p></section>
        <section><h2 className="text-white font-bold text-xl">Prohibited Conduct</h2><p>Cheating, bug exploiting, harassment, hate speech, doxxing, malware prohibited. Bans, forfeiture, legal action.</p></section>
        <section><h2 className="text-white font-bold text-xl">Tournaments & Prizes</h2><p>Rules specific per event. Payouts within 30 days. Winners responsible for taxes.</p></section>
        <section><h2 className="text-white font-bold text-xl">Intellectual Property</h2><p>All content, logos, designs property of ArcadeNexa or licensed. User content remains yours but grants display license.</p></section>
        <section><h2 className="text-white font-bold text-xl">Termination</h2><p>May suspend/terminate for violations, fraud, inactivity. You may terminate anytime via support.</p></section>
        <section><h2 className="text-white font-bold text-xl">Governing Law</h2><p>EU laws, binding arbitration in Luxembourg unless prohibited.</p></section>
        <p className="text-xs">Last updated: August 7, 2026 — legal@bespoke-daffodil-e35130.netlify.app</p>
      </div>
    </div>
  )
}
