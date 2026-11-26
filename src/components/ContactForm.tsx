'use client'

import { sendContact } from '@/lib/actions'
import { AnimatePresence, motion } from 'motion/react'
import { useActionState, useState } from 'react'
import { ArrowRight } from './icons'

const TOPICS = [
  { value: 'private', label: 'Private event' },
  { value: 'tickets', label: 'Tickets question' },
  { value: 'collab', label: 'Venue or collaboration' },
  { value: 'other', label: 'Something else' },
]

export function ContactForm({ responseTime }: { responseTime?: string | null }) {
  const [state, action, pending] = useActionState(sendContact, null)
  const [dismissed, setDismissed] = useState(false)
  const sent = state?.ok && !dismissed

  return (
    <AnimatePresence mode="wait" initial={false}>
      {sent ? (
        <motion.div
          key="sent"
          className="sent"
          role="status"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <span className="accent">Thank you</span>
          <p className="lead">
            Your note is on its way. I&apos;ll get back to you {responseTime ? responseTime.toLowerCase() : 'soon'}.
          </p>
          <button className="btn btn-primary" type="button" onClick={() => setDismissed(true)}>
            Send another
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          action={(fd) => {
            setDismissed(false)
            return action(fd)
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -12 }}
        >
          <h2>
            Send a <span className="accent">note</span>
          </h2>
          <fieldset className="f">
            <legend>What can I help with?</legend>
            <div className="chips">
              {TOPICS.map((t, i) => (
                <label className="chip" key={t.value}>
                  <input type="radio" name="topic" value={t.value} defaultChecked={i === 0} />
                  <span>{t.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="two">
            <div className="f">
              <label htmlFor="c-name">Full name</label>
              <input id="c-name" name="name" type="text" autoComplete="name" required maxLength={120} />
            </div>
            <div className="f">
              <label htmlFor="c-email">Email</label>
              <input id="c-email" name="email" type="email" autoComplete="email" required />
            </div>
          </div>
          <div className="two">
            <div className="f">
              <label htmlFor="c-type">Event type</label>
              <select id="c-type" name="eventType" defaultValue="murder-mystery">
                <option value="murder-mystery">Murder Mystery</option>
                <option value="traitors">Traitors</option>
                <option value="dinner-party">Dinner Party</option>
                <option value="unsure">Not sure yet</option>
              </select>
            </div>
            <div className="f">
              <label htmlFor="c-guests">Number of guests</label>
              <input id="c-guests" name="guests" type="number" min={1} placeholder="e.g. 12" />
            </div>
          </div>
          <div className="f">
            <label htmlFor="c-date">Preferred date</label>
            <input id="c-date" name="preferredDate" type="date" />
          </div>
          <div className="f">
            <label htmlFor="c-msg">Tell me about the occasion</label>
            <textarea
              id="c-msg"
              name="message"
              maxLength={5000}
              placeholder="Who's coming, what you're celebrating, any ideas you already love."
            />
          </div>
          <div className="hp" aria-hidden>
            <label htmlFor="c-company">Company</label>
            <input id="c-company" name="company" tabIndex={-1} autoComplete="off" />
          </div>
          <div>
            <button className="btn btn-primary" type="submit" disabled={pending}>
              {pending ? 'Sending…' : 'Send message'} <ArrowRight />
            </button>
            {state && !state.ok && (
              <p className="form-error" role="alert">
                {state.message}
              </p>
            )}
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
