'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getStripe } from './stripe'

// While the CMS is unplugged (USE_CMS is not "true"), forms succeed without saving anything.
const CMS_ENABLED = process.env.USE_CMS === 'true'
const getPayloadClient = async () => (await import('./payload')).getPayloadClient()

export type FormState = { ok: boolean; message: string } | null

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const str = (fd: FormData, k: string, max = 500) => String(fd.get(k) ?? '').trim().slice(0, max)

/* -------------------------------------------------------------------------- */
/* Newsletter                                                                 */
/* -------------------------------------------------------------------------- */
export async function subscribe(_prev: FormState, fd: FormData): Promise<FormState> {
  // Honeypot: bots fill every field.
  if (str(fd, 'company')) return { ok: true, message: "You're on the list." }

  const email = str(fd, 'email', 254).toLowerCase()
  if (!EMAIL_RE.test(email)) return { ok: false, message: 'Please enter a valid email address.' }

  if (!CMS_ENABLED) return { ok: true, message: "You're on the list." }

  const payload = await getPayloadClient()
  const existing = await payload.find({
    collection: 'subscribers',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })

  if (existing.docs[0]) {
    if (existing.docs[0].status !== 'subscribed') {
      await payload.update({
        collection: 'subscribers',
        id: existing.docs[0].id,
        data: { status: 'subscribed' },
        overrideAccess: true,
      })
    }
  } else {
    await payload.create({
      collection: 'subscribers',
      data: { email, status: 'subscribed', source: 'website' },
      overrideAccess: true,
    })
  }

  return { ok: true, message: "You're on the list." }
}

/* -------------------------------------------------------------------------- */
/* Contact form                                                               */
/* -------------------------------------------------------------------------- */
const TOPICS = ['private', 'tickets', 'collab', 'other'] as const
const EVENT_TYPES = ['murder-mystery', 'traitors', 'dinner-party', 'private', 'unsure'] as const

export async function sendContact(_prev: FormState, fd: FormData): Promise<FormState> {
  if (str(fd, 'company')) return { ok: true, message: 'sent' }

  const name = str(fd, 'name', 120)
  const email = str(fd, 'email', 254).toLowerCase()
  if (!name) return { ok: false, message: 'Please tell me your name.' }
  if (!EMAIL_RE.test(email)) return { ok: false, message: 'Please enter a valid email address.' }

  const topic = str(fd, 'topic') as (typeof TOPICS)[number]
  const eventType = str(fd, 'eventType') as (typeof EVENT_TYPES)[number]
  const guests = Number(str(fd, 'guests')) || undefined
  const preferredDate = str(fd, 'preferredDate') || undefined

  if (!CMS_ENABLED) return { ok: true, message: 'sent' }

  const payload = await getPayloadClient()
  await payload.create({
    collection: 'contact-submissions',
    data: {
      name,
      email,
      topic: TOPICS.includes(topic) ? topic : 'other',
      eventType: EVENT_TYPES.includes(eventType) ? eventType : undefined,
      guests: guests && guests > 0 ? Math.min(guests, 10000) : undefined,
      preferredDate: preferredDate ? new Date(preferredDate).toISOString() : undefined,
      message: str(fd, 'message', 5000),
      status: 'new',
    },
    overrideAccess: true,
  })

  return { ok: true, message: 'sent' }
}

/* -------------------------------------------------------------------------- */
/* Ticket checkout (Stripe Checkout)                                          */
/* -------------------------------------------------------------------------- */
export async function startCheckout(_prev: FormState, fd: FormData): Promise<FormState> {
  const eventId = str(fd, 'eventId', 64)
  if (!CMS_ENABLED) return { ok: false, message: 'Ticket checkout will be available once the site is connected.' }
  const stripe = getStripe()
  if (!stripe) return { ok: false, message: 'Ticket sales are not set up yet. Please check back soon.' }

  const payload = await getPayloadClient()
  const event = await payload.findByID({ collection: 'events', id: eventId, depth: 0 }).catch(() => null)

  if (!event || event.status !== 'on-sale' || new Date(event.startsAt) < new Date()) {
    return { ok: false, message: 'Tickets for this event are no longer available.' }
  }
  if (event.price == null) return { ok: false, message: 'Pricing for this event is coming soon.' }

  const left = event.capacity ? event.capacity - (event.ticketsSold ?? 0) : 10
  if (left <= 0) return { ok: false, message: 'Sorry, this event just sold out.' }

  const origin =
    process.env.NEXT_PUBLIC_SERVER_URL || `https://${(await headers()).get('host') ?? 'localhost:3000'}`

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        quantity: 1,
        adjustable_quantity: { enabled: true, minimum: 1, maximum: Math.max(1, Math.min(10, left)) },
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(event.price * 100),
          product_data: {
            name: event.theme ? `${event.title}: ${event.theme}` : event.title,
            description: new Date(event.startsAt).toLocaleString('en-US', {
              dateStyle: 'full',
              timeStyle: 'short',
              timeZone: process.env.NEXT_PUBLIC_SITE_TIMEZONE || 'America/New_York',
            }),
          },
        },
      },
    ],
    metadata: { eventId: String(event.id) },
    customer_creation: 'if_required',
    billing_address_collection: 'auto',
    phone_number_collection: { enabled: false },
    success_url: `${origin}/tickets/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/#events`,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
  })

  if (!session.url) return { ok: false, message: 'Could not start checkout. Please try again.' }
  redirect(session.url)
}
