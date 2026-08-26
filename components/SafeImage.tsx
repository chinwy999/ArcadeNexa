'use client'
import { useState } from 'react'
import Image from 'next/image'

interface Props {
  src: string
  alt: string
  gradient?: string
  initials?: string
  sizes?: string
  className?: string
}

export default function SafeImage({ src, alt, gradient, initials, sizes, className }: Props) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  if (error) {
    return (
      <div className={`absolute inset-0 flex items-center justify-center ${gradient || 'bg-gradient-to-br from-purple-500/30 to-blue-500/30'}`}>
        {initials && <span className="text-5xl font-black text-nexa-text-primary/30">{initials}</span>}
      </div>
    )
  }

  return (
    <>
      {loading && (
        <div className={`absolute inset-0 flex items-center justify-center ${gradient || 'bg-gradient-to-br from-purple-500/30 to-blue-500/30'}`}>
          <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        loading="lazy"
        className={className}
        sizes={sizes}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false)
          setError(true)
        }}
      />
    </>
  )
}
