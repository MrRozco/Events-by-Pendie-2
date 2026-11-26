import { PageHero } from '@/components/HeroBackground'
import { ArrowRight } from '@/components/icons'
import { Reveal, RevealGroup, RevealItem } from '@/components/motion'
import { WorkGallery } from '@/components/WorkGallery'
import { eventTypeLabel } from '@/lib/constants'
import { getPastEvents, getTestimonials, toMedia } from '@/lib/data'
import { dateParts } from '@/lib/format'
import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 60
export const metadata: Metadata = { title: 'Our work' }

export default async function OurWorkPage() {
  const [{ featured, gallery }, testimonials] = await Promise.all([getPastEvents(), getTestimonials()])
  const featPhoto = featured ? toMedia(featured.cover, 'hero') : null

  return (
    <>
      <PageHero crumb="Our work" line1="Nights we've" accent="hosted" />

      {featured && (
        <section className="section">
          <div className="wrap feat">
            <Reveal className="media-frame">
              {featPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={featPhoto.url} alt={featPhoto.alt} loading="lazy" />
              ) : (
                <span className="ph-label">Photo: your signature event</span>
              )}
            </Reveal>
            <Reveal className="feat-copy" delay={0.12}>
              <p className="eyebrow">Featured night</p>
              <h2 className="h2">{featured.title}</h2>
              {featured.summary && <p>{featured.summary}</p>}
              <div className="facts">
                <div><small>Format</small>{eventTypeLabel(featured.type)}</div>
                <div><small>Guests</small>{featured.guestCount ?? '—'}</div>
                <div><small>Venue</small>{featured.venue ?? '—'}</div>
                <div><small>Date</small>{dateParts(featured.startsAt).monthYear}</div>
              </div>
              <div className="row-btns">
                <Link className="btn btn-primary" href="/#events">Book the next one</Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <section className="section gallery-sec">
        <div className="wrap">
          <Reveal className="g-head">
            <div>
              <p className="eyebrow">The archive</p>
              <h2 className="h2">
                Past <span className="accent">events</span>
              </h2>
            </div>
          </Reveal>
          <WorkGallery events={gallery} />
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="section">
          <div className="wrap">
            <Reveal className="center-head">
              <p className="eyebrow">Guest words</p>
              <h2 className="h2">
                What guests <span className="accent">say</span>
              </h2>
            </Reveal>
            <RevealGroup className="quotes">
              {testimonials.map((t) => (
                <RevealItem key={t.id}>
                  <figure className="q">
                    <span className="mark" aria-hidden>&ldquo;</span>
                    <p>{t.quote}</p>
                    <small>
                      {t.guestName}
                      {t.event && typeof t.event === 'object' ? ` · ${t.event.title}` : ''}
                    </small>
                  </figure>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      <section className="section cta-band">
        <Reveal className="wrap center-head" style={{ gap: 40 }}>
          <h2 className="h2">
            The next story starts <span className="accent">soon</span>
          </h2>
          <div className="row-btns" style={{ justifyContent: 'center' }}>
            <Link className="btn btn-primary" href="/#events">
              See upcoming events <ArrowRight />
            </Link>
            <Link className="btn btn-primary" href="/contact">Plan a private event</Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
