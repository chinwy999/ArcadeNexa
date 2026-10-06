import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact Arcadlo support',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return <ContactClient />
}
