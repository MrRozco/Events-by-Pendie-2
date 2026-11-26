import { PageHero } from '@/components/HeroBackground'
import { ArrowRight } from '@/components/icons'
import { Reveal, RevealGroup, RevealItem } from '@/components/motion'
import { getSettings, toMedia } from '@/lib/data'
import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 60
export const metadata: Metadata = { title: 'About us' }

const VALUES = [
  { n: 'one', title: 'Story first', text: "Every event starts with a narrative worth following, whether it's a murder, a betrayal or a menu with a point of view." },
  { n: 'two', title: 'Everyone plays', text: 'No wallflowers. Roles, prompts and seating are designed so the quiet guest has as much fun as the loudest.' },
  { n: 'three', title: 'Sweat the details', text: 'Candles lit, clues planted, glasses full. I handle the logistics so you can stay in the moment.' },
]
const PROCESS = [
  { title: 'Concept', text: 'A theme, a setting and a hook that makes people want to dress the part.' },
  { title: 'Script', text: 'Characters, clues and twists written and play-tested before tickets go live.' },
  { title: 'Set the scene', text: 'Venue, table, lighting, music and menu, all dressed to match the story.' },
  { title: 'Host', text: 'I run the night live, keep the pace up and save the best reveal for last.' },
]

export default async function AboutPage() {
  const s = await getSettings()
  const photo = toMedia(s.hostPhoto, 'card')

  return (
    <>
      <PageHero crumb="About us" line1="The host behind" accent="the curtain" />

      <section className="section">
        <div className="wrap story">
          <Reveal className="media-frame">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo.url} alt={photo.alt} loading="lazy" />
            ) : (
              <span className="ph-label">Photo: you, mid-host</span>
            )}
          </Reveal>
          <Reveal className="story-copy" delay={0.12}>
            <p className="eyebrow">My story</p>
            <h2 className="h2">
              Hi, I&apos;m <span className="accent">{s.hostName}</span>
            </h2>
            <p className="lead">
              [Write two or three sentences on how you started hosting: the first party, the first mystery, the moment
              you knew people wanted more.]
            </p>
            <p className="pull">
              &ldquo;The best nights aren&apos;t watched. They&apos;re played, argued over and remembered for years.&rdquo;
            </p>
            <p>
              Today I plan, write and host every event under {s.brandName}. No franchises, no boxed scripts. Every
              storyline, menu and twist is built by me for the people in the room.
            </p>
            <div className="row-btns">
              <Link className="btn btn-primary" href="/#events">
                See upcoming events <ArrowRight />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section values">
        <div className="wrap">
          <Reveal className="center-head">
            <p className="eyebrow">What I believe</p>
            <h2 className="h2">
              Three <span className="accent">house rules</span>
            </h2>
          </Reveal>
          <RevealGroup className="v-grid">
            {VALUES.map((v) => (
              <RevealItem key={v.n}>
                <article className="v">
                  <span className="vn" aria-hidden>{v.n}</span>
                  <h3>{v.title}</h3>
                  <p>{v.text}</p>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">How a night comes together</p>
            <h2 className="h2">
              From idea to <span className="accent">curtain call</span>
            </h2>
          </Reveal>
          <RevealGroup className="process">
            {PROCESS.map((p, i) => (
              <RevealItem key={p.title} className="p-step">
                <small>Step {i + 1}</small>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="section cta-band">
        <div className="wrap">
          <Reveal className="center-head">
            <p className="eyebrow on-dark">So far</p>
            <h2 className="h2">
              A few <span className="accent">numbers</span>
            </h2>
          </Reveal>
          <RevealGroup className="stats">
            <RevealItem className="stat"><b>{s.eventsHosted}</b><span>Events hosted</span></RevealItem>
            <RevealItem className="stat"><b>{s.guestsWelcomed}</b><span>Guests welcomed</span></RevealItem>
            <RevealItem className="stat"><b>{s.storylinesWritten}</b><span>Original storylines written</span></RevealItem>
          </RevealGroup>
          <Reveal className="row-btns" style={{ marginTop: 72, justifyContent: 'center' }}>
            <Link className="btn btn-primary" href="/#events">
              Get tickets <ArrowRight />
            </Link>
            <Link className="btn btn-primary" href="/contact">
              Work with me
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
