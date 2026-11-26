'use client'

import { EVENT_TYPES } from '@/lib/constants'
import type { PastEventData } from '@/lib/types'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'

const FILTERS = [{ label: 'All', value: 'all' }, ...EVENT_TYPES]
// Repeating bento rhythm for the grid.
const SHAPES = ['tall', '', '', 'wide', 'tall', '', '']

export function WorkGallery({ events }: { events: PastEventData[] }) {
  const [filter, setFilter] = useState('all')
  const visible = useMemo(
    () => (filter === 'all' ? events : events.filter((e) => e.type === filter)),
    [events, filter],
  )

  return (
    <>
      <div className="filters" role="group" aria-label="Filter past events">
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
      <motion.div className="gallery" layout>
        <AnimatePresence mode="popLayout">
          {visible.map((e, i) => (
            <motion.div
              key={e.id}
              layout
              className={`tile-cell ${SHAPES[i % SHAPES.length]}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
            >
              {/* Hover transform lives on the inner figure so Motion's inline transform can't override it */}
              <figure className="tile" tabIndex={0}>
                {e.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={e.image.url} alt={e.image.alt} loading="lazy" />
                )}
                <span className="badge tag">{e.typeLabel}</span>
                <figcaption className="ov">
                  <h3>{e.title}</h3>
                  <span>
                    {e.typeLabel} · {e.monthYear}
                    {e.guestCount ? ` · ${e.guestCount} guests` : ''}
                  </span>
                </figcaption>
              </figure>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {visible.length === 0 && <p className="empty-state">Photos from past events will appear here.</p>}
    </>
  )
}
