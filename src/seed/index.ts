/**
 * Dev seed: `npm run seed`
 * Fills Site settings + FAQ and adds sample events so the site renders
 * with content. Safe to re-run (skips if events already exist).
 */
import config from '@payload-config'
import { getPayload } from 'payload'

const payload = await getPayload({ config })

const inDays = (d: number, hour = 19) => {
  const date = new Date()
  date.setDate(date.getDate() + d)
  date.setHours(hour, 0, 0, 0)
  return date.toISOString()
}

await payload.updateGlobal({
  slug: 'site-settings',
  data: {
    brandName: '[Your Brand]',
    hostName: '[Your name]',
    city: '[City, State]',
    email: 'hello@example.com',
    responseTime: 'Within 48 hours',
    faqs: [
      { question: 'Do I need to come with a group?', answer: 'Not at all. Plenty of guests come solo, and every event is designed so you meet people from the first minute.' },
      { question: 'Do I have to dress up or act?', answer: 'Costumes are encouraged but never required. You get your role ahead of time and can play it as big or as quietly as you like.' },
      { question: 'Is food and drink included?', answer: '[Explain what each ticket includes: dinner, drinks, dietary options.]' },
      { question: 'What is your refund policy?', answer: '[Your refund and transfer policy.]' },
      { question: 'How far ahead should I book a private event?', answer: '[Your recommended lead time for private bookings.]' },
    ],
  },
})

const { totalDocs } = await payload.count({ collection: 'events' })
if (totalDocs === 0) {
  const samples = [
    { title: 'Murder Mystery Dinner', theme: '[Theme]', type: 'murder-mystery', startsAt: inDays(17), status: 'on-sale' },
    { title: 'Traitors Night', theme: '[Theme]', type: 'traitors', startsAt: inDays(24, 19), status: 'on-sale' },
    { title: 'Supper Club', theme: '[Menu theme]', type: 'dinner-party', startsAt: inDays(45), status: 'on-sale' },
    { title: 'Murder Mystery Dinner', theme: '[Theme]', type: 'murder-mystery', startsAt: inDays(59), status: 'on-sale' },
    { title: '[Past event name]', type: 'murder-mystery', startsAt: inDays(-30), status: 'past', featured: true, guestCount: 24, summary: '[Two or three sentences on the theme, the twist and the moment the room erupted.]' },
    { title: '[Past event name]', type: 'traitors', startsAt: inDays(-60), status: 'past', guestCount: 18 },
    { title: '[Past event name]', type: 'dinner-party', startsAt: inDays(-90), status: 'past', guestCount: 12 },
    { title: '[Past event name]', type: 'private', startsAt: inDays(-120), status: 'past', guestCount: 30 },
  ] as const

  for (const s of samples) {
    await payload.create({
      collection: 'events',
      data: { ...s, venue: '[Venue]', city: '[City]', price: s.status === 'on-sale' ? 75 : undefined, capacity: 24 },
    })
  }
  payload.logger.info(`Seeded ${samples.length} events`)
}

payload.logger.info('Seed complete')
process.exit(0)
