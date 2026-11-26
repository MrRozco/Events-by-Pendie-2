import { ContactForm } from '@/components/ContactForm'
import { Faq } from '@/components/Faq'
import { PageHero } from '@/components/HeroBackground'
import { ArrowRight, Clock, Instagram, Mail, Pin } from '@/components/icons'
import { Reveal } from '@/components/motion'
import { getSettings } from '@/lib/data'
import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 60
export const metadata: Metadata = { title: 'Contact us' }

export default async function ContactPage() {
  const s = await getSettings()
  const faqs = (s.faqs ?? []).map((f) => ({ question: f.question, answer: f.answer }))

  return (
    <>
      <PageHero crumb="Contact us" line1="Let's plan something" accent="memorable" short />

      <section className="section">
        <div className="wrap c-grid">
          <Reveal className="c-form">
            <ContactForm responseTime={s.responseTime} />
          </Reveal>
          <Reveal as="aside" className="c-side" delay={0.12}>
            <div>
              <p className="eyebrow">Get in touch</p>
              <p className="lead">
                Questions about a ticket, or ready to plan your own night? Send a note and I&apos;ll reply personally.
              </p>
            </div>
            {s.email && (
              <div className="info">
                <div className="icon"><Mail /></div>
                <div><small>Email</small><a href={`mailto:${s.email}`}>{s.email}</a></div>
              </div>
            )}
            <div className="info">
              <div className="icon"><Pin /></div>
              <div><small>Based in</small>{s.city}</div>
            </div>
            <div className="info">
              <div className="icon"><Clock /></div>
              <div><small>Reply time</small>{s.responseTime}</div>
            </div>
            {s.instagram && (
              <div className="info">
                <div className="icon"><Instagram /></div>
                <div><small>Instagram</small><a href={s.instagram} target="_blank" rel="noopener">Follow along</a></div>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="section faq-sec">
          <div className="wrap">
            <Reveal className="center-head">
              <p className="eyebrow">Before you ask</p>
              <h2 className="h2">
                Good <span className="accent">questions</span>
              </h2>
            </Reveal>
            <Faq items={faqs} />
          </div>
        </section>
      )}

      <section className="section cta-band">
        <Reveal className="wrap center-head" style={{ gap: 40 }}>
          <h2 className="h2">
            Rather just grab a <span className="accent">seat</span>?
          </h2>
          <Link className="btn btn-primary" href="/#events">
            See upcoming events <ArrowRight />
          </Link>
        </Reveal>
      </section>
    </>
  )
}
