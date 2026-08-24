import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - ArcadeNexa',
  description: 'ArcadeNexa privacy policy',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <div className="py-20 px-4 sm:px-6 max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-5xl font-black text-white mb-2">Privacy Policy</h1>
      <p className="text-text-secondary mb-10">Your privacy matters to us. Here is how we handle your data.</p>

      <div className="space-y-6 text-text-secondary">

        <section className="glass p-6 rounded-xl border border-white/5">
          <h2 className="text-white font-bold text-xl mb-3">1. Information We Collect</h2>
          <p>ArcadeNexa does not require registration or login. We may automatically collect basic technical data such as browser type and device type solely to improve the platform experience. We do not collect personal information unless you contact us voluntarily.</p>
        </section>

        <section className="glass p-6 rounded-xl border border-white/5">
          <h2 className="text-white font-bold text-xl mb-3">2. Cookies</h2>
          <p>We may use cookies to remember your preferences and analyze platform usage. You can disable cookies in your browser settings at any time without affecting your ability to play games.</p>
        </section>

        <section className="glass p-6 rounded-xl border border-white/5">
          <h2 className="text-white font-bold text-xl mb-3">3. Third-Party Games</h2>
          <p>Games on ArcadeNexa are provided by third-party providers such as GamePix and GameMonetize. These providers may have their own privacy policies. We encourage you to review them when playing their games.</p>
        </section>

        <section className="glass p-6 rounded-xl border border-white/5">
          <h2 className="text-white font-bold text-xl mb-3">4. Data Sharing</h2>
          <p>We do not sell, trade, or share your personal data with third parties for marketing purposes. Any data shared is solely for the purpose of operating the platform.</p>
        </section>

        <section className="glass p-6 rounded-xl border border-white/5">
          <h2 className="text-white font-bold text-xl mb-3">5. Children's Privacy</h2>
          <p>ArcadeNexa is not directed to children under 13. We do not knowingly collect personal information from children under 13.</p>
        </section>

        <section className="glass p-6 rounded-xl border border-white/5">
          <h2 className="text-white font-bold text-xl mb-3">6. Security</h2>
          <p>We take reasonable measures to protect any data we handle. However, no method of transmission over the internet is 100% secure.</p>
        </section>

        <section className="glass p-6 rounded-xl border border-white/5">
          <h2 className="text-white font-bold text-xl mb-3">7. Contact Us</h2>
          <p>If you have questions about our privacy practices, please reach out via our <a href="/contact" className="text-nexa-violet hover:underline">Contact page</a>.</p>
        </section>

        <p className="text-xs text-center">Last updated: August 2026</p>
      </div>
    </div>
  )
}
