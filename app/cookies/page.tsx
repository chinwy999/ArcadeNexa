import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy - ArcadeNexa',
  description: 'How we use cookies on ArcadeNexa',
  alternates: { canonical: '/cookies' },
}

export default function CookiesPage() {
  return (
    <div className="py-20 px-4 sm:px-6 max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-5xl font-black text-nexa-text-primary mb-2">Cookie Policy</h1>
      <p className="text-text-secondary mb-10">How we use cookies on ArcadeNexa</p>

      <div className="space-y-6 text-text-secondary">

        <section className="glass p-6 rounded-xl border border-white/5">
          <h2 className="text-nexa-text-primary font-bold text-xl mb-3">What Are Cookies?</h2>
          <p>Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and improve your experience.</p>
        </section>

        <section className="glass p-6 rounded-xl border border-white/5">
          <h2 className="text-nexa-text-primary font-bold text-xl mb-3">How We Use Cookies</h2>
          <p className="mb-4">ArcadeNexa uses minimal cookies to ensure the platform works correctly:</p>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-nexa-emerald font-bold">✅</span>
              <div><strong className="text-nexa-text-primary">Essential Cookies</strong> — Required for the platform to function properly, such as remembering your preferences.</div>
            </li>
            <li className="flex gap-3">
              <span className="text-nexa-cyan font-bold">📊</span>
              <div><strong className="text-nexa-text-primary">Analytics Cookies</strong> — Help us understand how visitors use the platform so we can improve it. Data is anonymized.</div>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 font-bold">⚙️</span>
              <div><strong className="text-nexa-text-primary">Preference Cookies</strong> — Remember your settings such as theme or display preferences.</div>
            </li>
          </ul>
        </section>

        <section className="glass p-6 rounded-xl border border-white/5">
          <h2 className="text-nexa-text-primary font-bold text-xl mb-3">Third-Party Cookies</h2>
          <p>Games provided by third-party providers like GamePix and GameMonetize may set their own cookies. We do not control these cookies. Please refer to the respective provider's cookie policy for more information.</p>
        </section>

        <section className="glass p-6 rounded-xl border border-white/5">
          <h2 className="text-nexa-text-primary font-bold text-xl mb-3">How to Manage Cookies</h2>
          <p className="mb-3">You can control and manage cookies through your browser settings:</p>
          <ul className="space-y-2">
            <li>• <strong className="text-nexa-text-primary">Chrome:</strong> Settings → Privacy and Security → Cookies</li>
            <li>• <strong className="text-nexa-text-primary">Firefox:</strong> Settings → Privacy & Security → Cookies</li>
            <li>• <strong className="text-nexa-text-primary">Safari:</strong> Preferences → Privacy → Cookies</li>
            <li>• <strong className="text-nexa-text-primary">Edge:</strong> Settings → Privacy → Cookies</li>
          </ul>
          <p className="mt-3">Note: Disabling essential cookies may affect some platform features.</p>
        </section>

        <section className="glass p-6 rounded-xl border border-white/5">
          <h2 className="text-nexa-text-primary font-bold text-xl mb-3">Contact Us</h2>
          <p>If you have questions about our cookie policy, please reach out via our <a href="/contact" className="text-nexa-violet hover:underline">Contact page</a>.</p>
        </section>

        <p className="text-xs text-center">Last updated: August 2026</p>
      </div>
    </div>
  )
}
