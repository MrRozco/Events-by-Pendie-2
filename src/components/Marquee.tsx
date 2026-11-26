import { Diamond } from './icons'

const ITEMS = ['Murder Mystery', 'Traitors', 'Dinner Parties', 'Private Events']

function Track() {
  return (
    <div className="marquee-track">
      {ITEMS.map((t) => (
        <span key={t} style={{ display: 'contents' }}>
          <span className="item">{t}</span>
          <Diamond color="#1A0F09" />
        </span>
      ))}
    </div>
  )
}

/** Infinite scrolling band — two identical tracks for a seamless loop. */
export function Marquee() {
  return (
    <div className="marquee" aria-hidden>
      <Track />
      <Track />
    </div>
  )
}
