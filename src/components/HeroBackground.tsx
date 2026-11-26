import type { MediaLite } from '@/lib/types'

/** Espresso base + optional photo + slow sunburst + rising embers + olive overlay. */
export function HeroBackground({ photo }: { photo?: MediaLite }) {
  return (
    <>
      <div className="hero-bg" aria-hidden>
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="hero-photo" src={photo.url} alt="" fetchPriority="high" />
        )}
        <svg className="sunburst" viewBox="0 0 200 200" fill="none" stroke="#EDE7DB" strokeWidth=".25">
          <circle cx="100" cy="100" r="30" />
          <circle cx="100" cy="100" r="46" />
          <circle cx="100" cy="100" r="70" strokeDasharray="1 2" />
          <path d="M100 0V200M0 100H200M29 29L171 171M171 29L29 171M62 8L138 192M138 8L62 192M8 62L192 138M8 138L192 62" />
        </svg>
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className="ember" />
        ))}
      </div>
      <div className="hero-overlay" />
    </>
  )
}

export function Flourish() {
  return (
    <svg className="flourish" viewBox="0 0 520 40" fill="none" aria-hidden>
      <path d="M10 20 C 120 4, 200 36, 260 20 S 400 4, 510 20" stroke="#EDE7DB" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function PageHero({
  crumb,
  line1,
  accent,
  short,
}: {
  crumb: string
  line1: string
  accent: string
  short?: boolean
}) {
  return (
    <header className={short ? 'page-hero short' : 'page-hero'}>
      <HeroBackground />
      <div className="hero-inner">
        <p className="crumb">{crumb}</p>
        <h1 className="hero-title">
          <span className="l1">{line1}</span>
          <span className="l2 accent">{accent}</span>
        </h1>
        <Flourish />
      </div>
    </header>
  )
}
