'use client'

import { EVENT_TYPES } from '@/lib/constants'
import { dateParts, formatPrice } from '@/lib/format'
import type { EventCardData } from '@/lib/types'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Countdown } from './Countdown'
import { Reveal } from './motion'
import { TicketButton } from './TicketButton'

const FILTERS = [{ label: 'All', value: 'all' }, ...EVENT_TYPES.filter((t) => t.value !== 'private')]

export function UpcomingEvents({ events }: { events: EventCardData[] }) {
  const [filter, setFilter] = useState<string>('all')
  const visible = useMemo(
    () => (filter === 'all' ? events : events.filter((e) => e.type === filter)),
    [events, filter],
  )
  const next = events[0]

  return (
    <section className="section" id="events">
      <div className="wrap">
        <Reveal className="ev-head">
          <div>
            <p className="eyebrow">On sale now</p>
            <h2 className="h2">
              Upcoming <span className="accent">events</span>
            </h2>
          </div>
          {next && <Countdown target={next.startsAt} />}
        </Reveal>

        <div className="filters" role="group" aria-label="Filter events">
          {FILTERS.map((f) => {
            const on = filter === f.value
            return (
              <button
                key={f.value}
                type="button"
                className={on ? 'pill on' : 'pill'}
                aria-pressed={on}
                onClick={() => setFilter(f.value)}
              >
                {on && <span className="dot" aria-hidden />}
                {f.label}
              </button>
            )
          })}
        </div>

        <div className="ev-list">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((e, i) => {
              const d = dateParts(e.startsAt)
              const soldOut = e.status === 'sold-out' || e.seatsLeft === 0
              return (
                <motion.article
                  key={e.id}
                  layout
                  className="ev"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.05 } }}
                  exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
                >
                  <div className="date">
                    <small>{d.mon}</small>
                    <b>{d.day}</b>
                  </div>
                  <div>
                    <span className="badge">{e.typeLabel}</span>
                    <h3>{e.theme ? `${e.title}: ${e.theme}` : e.title}</h3>
                    <p className="where">
                      {d.weekday} · {d.time}
                      {(e.venue || e.city) && ` · ${[e.venue, e.city].filter(Boolean).join(', ')}`}
                    </p>
                  </div>
                  <div className="price">
                    <b>{formatPrice(e.price)}</b>
                    <small>
                      {soldOut ? 'Sold out' : e.seatsLeft != null ? `${e.seatsLeft} seats left` : 'Limited seats'}
                    </small>
                  </div>
                  <TicketButton eventId={e.id} soldOut={soldOut} />
                </motion.article>
              )
            })}
          </AnimatePresence>
          {visible.length === 0 && (
            <p className="empty-state">
              No dates on sale right now. <Link href="#newsletter">Join the list</Link> to hear first when new ones drop.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
