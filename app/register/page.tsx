import type { Metadata } from 'next'
import RegisterClient from './RegisterClient'

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create ArcadeNexa account — join the arena',
  alternates: { canonical: '/register' },
}

export default function RegisterPage() {
  return <RegisterClient />
}
