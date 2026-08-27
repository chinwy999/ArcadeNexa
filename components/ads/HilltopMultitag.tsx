'use client'

import { useEffect, useRef } from 'react'

export default function HilltopMultitag() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    if (container.dataset.loaded === 'true') return

    const script = document.createElement('script')

    ;(script as HTMLScriptElement & { settings?: Record<string, unknown> }).settings = {}

    script.src =
      '//fond-appointment.com/b.XbVSsRdGG/lb0yYuW-cB/me/mm9Ku_ZJUwlckvPpTdcizSN/TEkP1DOSDAUwt/NyzOMw1-OSTyUE4xO/Qd'

    script.async = true
    script.referrerPolicy = 'no-referrer-when-downgrade'

    container.appendChild(script)
    container.dataset.loaded = 'true'

    return () => {
      script.remove()
    }
  }, [])

  return (
    <div className="w-full flex justify-center my-8">
      <div
        ref={containerRef}
        className="w-full max-w-[300px] min-h-[250px] flex items-center justify-center overflow-hidden"
        aria-label="Advertisement"
      />
    </div>
  )
}
