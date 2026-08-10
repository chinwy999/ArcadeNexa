import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'How we use cookies on ArcadeNexa',
  alternates: { canonical: '/cookies' },
}

export default function CookiesPage() {
  return (
    <div className="py-20 px-4 sm:px-6 max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-5xl font-black text-white mb-2">Cookie Policy</h1>
      <p className="text-text-secondary mb-8">How we use cookies on ArcadeNexa</p>

      <div className="space-y-6 text-text-secondary">
        <section><h2 className="text-white font-bold text-xl">What Are Cookies</h2><p>Small text files stored on device to remember preferences, keep logged in, understand usage.</p></section>
        <section>
          <h2 className="text-white font-bold text-xl">Types We Use</h2>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong className="text-white">Essential (Required)</strong> — session, security, auth</li>
            <li><strong className="text-white">Analytics</strong> — anonymized interaction data</li>
            <li><strong className="text-white">Preferences</strong> — language, theme, notifications</li>
          </ul>
        </section>
        <section>
          <h2 className="text-white font-bold text-xl">Cookie Table</h2>
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm glass rounded-xl border border-white/5 overflow-hidden">
              <thead className="bg-elevated text-left"><tr><th className="px-4 py-2">Cookie</th><th className="px-4 py-2">Type</th><th className="px-4 py-2">Duration</th><th className="px-4 py-2">Purpose</th></tr></thead>
              <tbody className="divide-y divide-white/5">
                <tr><td className="px-4 py-2">nex_session</td><td className="px-4 py-2">Essential</td><td className="px-4 py-2">Session</td><td className="px-4 py-2">Maintains login state</td></tr>
                <tr><td className="px-4 py-2">nex_auth</td><td className="px-4 py-2">Essential</td><td className="px-4 py-2">30 days</td><td className="px-4 py-2">Authentication token</td></tr>
                <tr><td className="px-4 py-2">nex_lang</td><td className="px-4 py-2">Preferences</td><td className="px-4 py-2">1 year</td><td className="px-4 py-2">Language preference</td></tr>
                <tr><td className="px-4 py-2">_ga</td><td className="px-4 py-2">Analytics</td><td className="px-4 py-2">2 years</td><td className="px-4 py-2">Google Analytics tracking</td></tr>
                <tr><td className="px-4 py-2">nex_consent</td><td className="px-4 py-2">Essential</td><td className="px-4 py-2">1 year</td><td className="px-4 py-2">Cookie consent status</td></tr>
              </tbody>
            </table>
          </div>
        </section>
        <section><h2 className="text-white font-bold text-xl">How to Manage</h2><p>Control via browser settings. Disabling essential may prevent features.</p></section>
        <p className="text-xs">Last updated: August 7, 2026</p>
      </div>
    </div>
  )
}
