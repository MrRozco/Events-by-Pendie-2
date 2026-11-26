'use client'

import { useEffect, useState } from 'react'

const pad = (n: number) => String(n).padStart(2, '0')

/** Live countdown. Renders placeholders on the server to avoid hydration mismatch. */
export function Countdown({ target }: { target: string }) {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    const tick = () => setNow(Date.now())
    const first = setTimeout(tick, 0)
    const id = setInterval(tick, 1000)
    return () => {
      clearTimeout(first)
      clearInterval(id)
    }
  }, [])

  const diff = now == null ? null : Math.max(0, new Date(target).getTime() - now)
  const units =
    diff == null
      ? ['--', '--', '--', '--']
      : [
          pad(Math.floor(diff / 86_400_000)),
          pad(Math.floor(diff / 3_600_000) % 24),
          pad(Math.floor(diff / 60_000) % 60),
          pad(Math.floor(diff / 1000) % 60),
        ]

  return (
    <div className="countdown" role="timer" aria-label="Time until the next event">
      <span className="lbl">Next event in</span>
      {['Days', 'Hrs', 'Min', 'Sec'].map((l, i) => (
        <div className="cd-unit" key={l}>
          <b>{units[i]}</b>
          <small>{l}</small>
        </div>
      ))}
    </div>
  )
}
