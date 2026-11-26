import { Flourish, HeroBackground } from '@/components/HeroBackground'
import { ArrowRight, Check, Glass, Magnifier, Mask, Sparkle } from '@/components/icons'
import { Marquee } from '@/components/Marquee'
import { Reveal, RevealGroup, RevealItem } from '@/components/motion'
import { NewsletterForm } from '@/components/NewsletterForm'
import { UpcomingEvents } from '@/components/UpcomingEvents'
import { getSettings, getUpcomingEvents, toMedia } from '@/lib/data'
import Link from 'next/link'

export const revalidate = 60

const SERVICES = [
  { icon: <Magnifier />, title: 'Murder Mystery', text: 'Arrive in character, follow the clues and unmask the killer before dessert is served.', meta: '[#]–[#] guests · about [#] hours', href: '#events', cta: 'See dates' },
  { icon: <Mask />, title: 'Traitors', text: 'Faithful or traitor? A night of secret roles, round-table votes and dramatic banishments.', meta: '[#]–[#] guests · about [#] hours', href: '#events', cta: 'See dates' },
  { icon: <Glass />, title: 'Dinner Parties', text: 'A long table, a seasonal menu and good company. Conversation is the main course.', meta: '[#]–[#] guests · about [#] hours', href: '#events', cta: 'See dates' },
  { icon: <Sparkle />, title: 'Private Events', text: 'Any of the above, built around your birthday, team or celebration and hosted by me.', meta: 'Custom group size · your date', href: '/contact', cta: 'Enquire' },
]

const STEPS = [
  { n: '01', title: 'Pick your night', text: 'Browse upcoming events below and choose the experience that fits your crowd.' },
  { n: '02', title: 'Grab your tickets', text: 'Check out in under a minute. Your confirmation and any character details land in your inbox.' },
  { n: '03', title: 'Show up and play', text: 'I take care of the story, the setting and the table. You just bring the drama.' },
]

export default async function HomePage() {
  const [settings, events] = await Promise.all([getSettings(), getUpcomingEvents()])
  const heroPhoto = toMedia(settings.heroImage, 'hero')
  const privatePhoto = toMedia(settings.privateEventPhoto, 'card')

  return (
    <>
      {/* 1 — Hero: 100vh, centred title, no CTA */}
      <header className="hero">
        <HeroBackground photo={heroPhoto} />
        <div className="hero-inner">
          <p className="hero-eyebrow">Murder mysteries · Traitors · Dinner parties</p>
          <h1 className="hero-title">
            <span className="l1">Nights you&apos;ll</span>
            <span className="l2 accent">never forget</span>
          </h1>
          <Flourish />
        </div>
        <div className="scroll-cue" aria-hidden>
          Scroll
          <span className="bar" />
        </div>
      </header>

      {/* 2 — Intro */}
      <section className="section" id="intro">
        <div className="wrap intro-grid">
          <Reveal className="intro-left">
            <p className="eyebrow">Hello, I&apos;m your host</p>
            <h2 className="h2">
              Every guest gets a <span className="accent">role</span> to play.
            </h2>
          </Reveal>
          <Reveal className="intro-right" delay={0.12}>
            <p className="lead">
              I plan, write and host every event myself, from the first clue to the final toast. Each night is built
              around one idea: get a room full of people talking, scheming and laughing together.
            </p>
            <p>
              Come with friends or come solo. Whether you&apos;re solving a murder, hunting for traitors or just sitting
              down to a long, slow dinner, you&apos;ll leave with a story to tell.
            </p>
            <p className="sig">{settings.hostName}</p>
            <Link className="text-link" href="/about">
              More about me <ArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>

      <Marquee />

      {/* 3 — Our events */}
      <section className="section services" id="services">
        <div className="wrap">
          <Reveal className="sv-head">
            <div>
              <p className="eyebrow">What I host</p>
              <h2 className="h2">
                Our <span className="accent">events</span>
              </h2>
            </div>
            <p className="lead" style={{ maxWidth: '44ch' }}>
              Four ways to spend an evening. All of them hosted in person, all of them designed to get strangers talking.
            </p>
          </Reveal>
          <RevealGroup className="cards">
            {SERVICES.map((s) => (
              <RevealItem key={s.title}>
                <article className="card">
                  <div className="icon">{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <p className="meta">{s.meta}</p>
                  <Link className="text-link" href={s.href}>
                    {s.cta} <ArrowRight />
                  </Link>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 4 — Funnel: how it works → events → private → newsletter → final CTA */}
      <section className="section how">
        <div className="wrap">
          <Reveal className="center-head">
            <p className="eyebrow on-dark">How it works</p>
            <h2 className="h2">
              From invitation to <span className="accent">finale</span>
            </h2>
          </Reveal>
          <RevealGroup className="steps">
            {STEPS.map((s) => (
              <RevealItem key={s.n} className="step">
                <span className="num">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <UpcomingEvents events={events} />

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap private-grid">
          <Reveal className="media-frame private-media">
            {privatePhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={privatePhoto.url} alt={privatePhoto.alt} loading="lazy" />
            ) : (
              <span className="ph-label">Photo: a private event you&apos;ve hosted</span>
            )}
          </Reveal>
          <Reveal className="private-copy" delay={0.12}>
            <p className="eyebrow">Private events</p>
            <h2 className="h2">
              Make it <span className="accent">yours</span>
            </h2>
            <p className="lead">
              Birthdays, team nights, bachelorettes, anniversaries. Tell me the occasion and I&apos;ll build a mystery, a
              game or a dinner around it.
            </p>
            <ul className="checks">
              <li><Check />A storyline written for your group</li>
              <li><Check />Hosted at your place or a venue I source</li>
              <li><Check />Invitations, roles and props handled for you</li>
            </ul>
            <div className="row-btns">
              <Link className="btn btn-primary" href="/contact">
                Plan a private event <ArrowRight />
              </Link>
              <Link className="btn btn-primary" href="/our-work">
                See past events
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section news" id="newsletter">
        <Reveal className="wrap center-head">
          <p className="eyebrow">The guest list</p>
          <h2 className="h2">
            Be first in <span className="accent">line</span>
          </h2>
          <p className="lead" style={{ marginTop: 20 }}>
            Seats are limited. Join the list to hear about new dates before they go public.
          </p>
          <NewsletterForm />
        </Reveal>
      </section>

      <section className="section final">
        <svg className="final-orn" viewBox="0 0 200 200" fill="none" stroke="#1A0F09" strokeWidth=".3" aria-hidden>
          <circle cx="100" cy="100" r="60" />
          <circle cx="100" cy="100" r="80" strokeDasharray="1 2" />
          <path d="M100 10V190M10 100H190M36 36L164 164M164 36L36 164" />
        </svg>
        <Reveal className="wrap center-head" style={{ position: 'relative', gap: 40 }}>
          <h2 className="h2">
            Your seat at the table
            <br />
            is <span className="accent">waiting</span>
          </h2>
          <Link className="btn btn-primary" href="#events">
            See upcoming events <ArrowRight />
          </Link>
        </Reveal>
      </section>
    </>
  )
}
