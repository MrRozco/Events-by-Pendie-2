import 'server-only'
import type { Event, Media, SiteSetting, Testimonial } from '@/payload-types'
import { eventTypeLabel } from './constants'
import { dateParts } from './format'
import { mockEvents, mockSettings, mockTestimonials } from './mock-data'
import type { EventCardData, MediaLite, PastEventData } from './types'

/**
 * Set USE_CMS=true in .env once Postgres + Payload are ready.
 * Until then every read below returns static placeholder data and
 * Payload is never loaded (no database needed).
 */
export const CMS_ENABLED = process.env.USE_CMS === 'true'

const getPayloadClient = async () => (await import('./payload')).getPayloadClient()

export const toMedia = (m: number | string | Media | null | undefined, size?: 'card' | 'hero' | 'thumb'): MediaLite => {
  if (!m || typeof m !== 'object' || !m.url) return null
  const sized = size ? m.sizes?.[size] : undefined
  return {
    url: sized?.url || m.url,
    alt: m.alt,
    width: sized?.width ?? m.width,
    height: sized?.height ?? m.height,
  }
}

export async function getSettings(): Promise<SiteSetting> {
  if (!CMS_ENABLED) return mockSettings
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
}

async function findUpcoming(): Promise<Event[]> {
  if (!CMS_ENABLED) {
    const now = Date.now()
    return mockEvents
      .filter((e) => ['on-sale', 'sold-out'].includes(e.status) && new Date(e.startsAt).getTime() >= now)
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
  }
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'events',
    where: {
      and: [
        { status: { in: ['on-sale', 'sold-out'] } },
        { startsAt: { greater_than_equal: new Date().toISOString() } },
      ],
    },
    sort: 'startsAt',
    limit: 24,
    depth: 0,
  })
  return docs
}

export async function getUpcomingEvents(): Promise<EventCardData[]> {
  const docs = await findUpcoming()
  return docs.map((e: Event) => ({
    id: String(e.id),
    title: e.title,
    theme: e.theme,
    type: e.type,
    typeLabel: eventTypeLabel(e.type),
    startsAt: e.startsAt,
    venue: e.venue,
    city: e.city,
    price: e.price,
    status: e.status,
    seatsLeft: e.capacity ? Math.max(0, e.capacity - (e.ticketsSold ?? 0)) : null,
  }))
}

async function findPast(): Promise<Event[]> {
  if (!CMS_ENABLED) {
    return mockEvents.filter((e) => e.status === 'past').sort((a, b) => b.startsAt.localeCompare(a.startsAt))
  }
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'events',
    where: { status: { equals: 'past' } },
    sort: '-startsAt',
    limit: 60,
    depth: 1,
  })
  return docs
}

export async function getPastEvents() {
  const docs = await findPast()
  const featured = docs.find((e) => e.featured) ?? docs[0] ?? null
  const gallery: PastEventData[] = docs.map((e) => ({
    id: String(e.id),
    title: e.title,
    type: e.type,
    typeLabel: eventTypeLabel(e.type),
    monthYear: dateParts(e.startsAt).monthYear,
    guestCount: e.guestCount,
    image: toMedia(e.cover, 'card'),
  }))
  return { featured, gallery }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!CMS_ENABLED) return mockTestimonials
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'testimonials', limit: 6, depth: 1, sort: '-createdAt' })
  return docs
}
