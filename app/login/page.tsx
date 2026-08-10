import type { Metadata } from 'next'
import LoginClient from './LoginClient'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to ArcadeNexa — continue your journey',
  alternates: { canonical: '/login' },
}

export default function LoginPage() {
  return <LoginClient />
}
