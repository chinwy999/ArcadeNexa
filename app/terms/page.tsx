import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - ArcadeNexa',
  description: 'ArcadeNexa terms of service',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <div className="py-20 px-4 sm:px-6 max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-5xl font-black text-white mb-2">Terms of Service</h1>
      <p className="text-text-secondary mb-10">Please read these terms carefully before using ArcadeNexa.</p>

      <div className="space-y-6 text-text-secondary">

        <section className="glass p-6 rounded-xl border border-white/5">
          <h2 className="text-white font-bold text-xl mb-3">1. Acceptance of Terms</h2>
          <p>By accessing and using ArcadeNexa, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.</p>
        </section>

        <section className="glass p-6 rounded-xl border border-white/5">
          <h2 className="text-white font-bold text-xl mb-3">2. Use of the Platform</h2>
          <p>ArcadeNexa is a free browser gaming platform. You may use it for personal, non-commercial purposes. You agree not to misuse the platform, attempt to hack or disrupt services, or use automated tools to access games.</p>
        </section>

        <section className="glass p-6 rounded-xl border border-white/5">
          <h2 className="text-white font-bold text-xl mb-3">3. Age Requirements</h2>
          <p>ArcadeNexa is suitable for users aged 13 and above. Users under 18 should have parental consent before using the platform.</p>
        </section>

        <section className="glass p-6 rounded-xl border border-white/5">
          <h2 className="text-white font-bold text-xl mb-3">4. Intellectual Property</h2>
          <p>All games on ArcadeNexa are provided by third-party developers and providers such as GamePix. ArcadeNexa does not claim ownership of these games. The ArcadeNexa name, logo, and design are our intellectual property.</p>
        </section>

        <section className="glass p-6 rounded-xl border border-white/5">
          <h2 className="text-white font-bold text-xl mb-3">5. Disclaimer</h2>
          <p>ArcadeNexa is provided "as is" without warranties of any kind. We are not responsible for issues caused by third-party game providers. We reserve the right to modify or discontinue the service at any time.</p>
        </section>

        <section className="glass p-6 rounded-xl border border-white/5">
          <h2 className="text-white font-bold text-xl mb-3">6. Changes to Terms</h2>
          <p>We may update these terms from time to time. Continued use of ArcadeNexa after changes constitutes acceptance of the new terms.</p>
        </section>

        <section className="glass p-6 rounded-xl border border-white/5">
          <h2 className="text-white font-bold text-xl mb-3">7. Contact</h2>
          <p>For questions about these terms, please use our <a href="/contact" className="text-electric-violet hover:underline">Contact page</a>.</p>
        </section>

        <p className="text-xs text-center">Last updated: August 2026</p>
      </div>
    </div>
  )
}
