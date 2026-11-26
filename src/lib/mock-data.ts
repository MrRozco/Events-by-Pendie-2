/**
 * Static placeholder content used while the CMS is unplugged (USE_CMS is not "true").
 * Mirrors what `npm run seed` would put in the database, so the frontend renders
 * exactly as it will once Payload + Postgres are connected.
 */
import type { Event, SiteSetting, Testimonial } from '@/payload-types'

const inDays = (d: number, hour = 19) => {
  const date = new Date()
  date.setDate(date.getDate() + d)
  date.setHours(hour, 0, 0, 0)
  return date.toISOString()
}

const now = new Date().toISOString()

export const mockSettings: SiteSetting = {
  id: 1,
  brandName: '[Your Brand]',
  hostName: '[Your name]',
  city: '[City, State]',
  email: 'hello@example.com',
  instagram: 'https://instagram.com/',
  tiktok: 'https://tiktok.com/',
  responseTime: 'Within 48 hours',
  heroImage: null,
  hostPhoto: null,
  privateEventPhoto: null,
  eventsHosted: '[#]',
  guestsWelcomed: '[#]',
  storylinesWritten: '[#]',
  faqs: [
    { question: 'Do I need to come with a group?', answer: 'Not at all. Plenty of guests come solo, and every event is designed so you meet people from the first minute.' },
    { question: 'Do I have to dress up or act?', answer: 'Costumes are encouraged but never required. You get your role ahead of time and can play it as big or as quietly as you like.' },
    { question: 'Is food and drink included?', answer: '[Explain what each ticket includes: dinner, drinks, dietary options.]' },
    { question: 'What is your refund policy?', answer: '[Your refund and transfer policy.]' },
    { question: 'How far ahead should I book a private event?', answer: '[Your recommended lead time for private bookings.]' },
  ],
}

type Sample = Pick<Event, 'title' | 'type' | 'startsAt' | 'status'> & Partial<Event>

const samples: Sample[] = [
  { title: 'Murder Mystery Dinner', theme: '[Theme]', type: 'murder-mystery', startsAt: inDays(17), status: 'on-sale' },
  { title: 'Traitors Night', theme: '[Theme]', type: 'traitors', startsAt: inDays(24), status: 'on-sale' },
  { title: 'Supper Club', theme: '[Menu theme]', type: 'dinner-party', startsAt: inDays(45), status: 'on-sale' },
  { title: 'Murder Mystery Dinner', theme: '[Theme]', type: 'murder-mystery', startsAt: inDays(59), status: 'on-sale' },
  { title: '[Past event name]', type: 'murder-mystery', startsAt: inDays(-30), status: 'past', featured: true, guestCount: 24, summary: '[Two or three sentences on the theme, the twist and the moment the room erupted.]' },
  { title: '[Past event name]', type: 'traitors', startsAt: inDays(-60), status: 'past', guestCount: 18 },
  { title: '[Past event name]', type: 'dinner-party', startsAt: inDays(-90), status: 'past', guestCount: 12 },
  { title: '[Past event name]', type: 'private', startsAt: inDays(-120), status: 'past', guestCount: 30 },
]

export const mockEvents: Event[] = samples.map((s, i) => ({
  id: i + 1,
  venue: '[Venue]',
  city: '[City]',
  price: s.status === 'on-sale' ? 75 : null,
  capacity: 24,
  ticketsSold: 0,
  cover: null,
  updatedAt: now,
  createdAt: now,
  ...s,
}))

export const mockTestimonials: Testimonial[] = [
  { id: 1, quote: '[A guest quote about the night: the twist, the food, the people they met.]', guestName: '[Guest name]', event: mockEvents[4], updatedAt: now, createdAt: now },
  { id: 2, quote: '[A second quote. Short and specific works best.]', guestName: '[Guest name]', event: mockEvents[5], updatedAt: now, createdAt: now },
  { id: 3, quote: '[A third quote, ideally from a private event host.]', guestName: '[Guest name]', event: mockEvents[7], updatedAt: now, createdAt: now },
]
