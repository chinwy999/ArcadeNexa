'use client'
import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h2 className="text-3xl font-black text-nexa-text-primary mb-3">Something went wrong!</h2>
      <p className="text-text-secondary mb-6 max-w-md">An unexpected error occurred in the arena. Our team has been notified.</p>
      <button onClick={() => reset()} className="bg-nexa-violet hover:bg-violet-600 text-nexa-text-primary px-6 py-3 rounded-xl font-bold">Try Again</button>
      <p className="text-xs text-text-secondary mt-4">{error.message}</p>
    </div>
  )
}
