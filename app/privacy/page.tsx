import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'ArcadeNexa privacy policy — your data, your control',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <div className="py-20 px-4 sm:px-6 max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-5xl font-black text-white mb-2">Privacy Policy</h1>
      <p className="text-text-secondary mb-8">Your data, your control</p>
      <div className="prose prose-invert max-w-none space-y-6 text-text-secondary">
        <section><h2 className="text-white font-bold text-xl">Information We Collect</h2><p>We collect personal information you provide directly (name, email, username), automatically collected data (IP, browser, device), and gameplay data (statistics, match history, rankings).</p></section>
        <section><h2 className="text-white font-bold text-xl">How We Use Your Data</h2><p>Provide and improve services, process tournaments, manage prizes, personalize experience, send event notifications.</p></section>
        <section><h2 className="text-white font-bold text-xl">Cookies & Tracking</h2><p>We use cookies to maintain sessions, remember preferences, analyze traffic, deliver targeted content. Manage in browser settings.</p></section>
        <section><h2 className="text-white font-bold text-xl">Data Sharing</h2><p>We do not sell personal data. May share with trusted partners for tournaments, payments, analytics under confidentiality.</p></section>
        <section><h2 className="text-white font-bold text-xl">Your Rights (GPXPR)</h2><p>Right to access, rectify, erase, restrict, object, portability. Contact us, respond within 30 days.</p></section>
        <section><h2 className="text-white font-bold text-xl">Data Security</h2><p>TLS 1.3 encryption, secure servers, regular audits, access controls, EU-compliant data centers.</p></section>
        <section><h2 className="text-white font-bold text-xl">Children&apos;s Privacy</h2><p>Intended for 13+ only. No data from under 13 knowingly collected.</p></section>
        <p className="text-xs">Last updated: August 7, 2026 — Contact: privacy@arcade-nexa-3gxg.vercel.app</p>
      </div>
    </div>
  )
}
