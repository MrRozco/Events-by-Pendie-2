import { getPayloadClient } from '@/lib/payload'
import { getStripe } from '@/lib/stripe'
import type Stripe from 'stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Stripe → Payload. Point a Stripe webhook at https://YOUR_DOMAIN/webhooks/stripe
 * listening for `checkout.session.completed`.
 */
export async function POST(req: Request) {
  const stripe = getStripe()
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !secret) return new Response('Stripe not configured', { status: 501 })

  const signature = req.headers.get('stripe-signature')
  if (!signature) return new Response('Missing signature', { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(await req.text(), signature, secret)
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') return Response.json({ received: true })

  const session = event.data.object as Stripe.Checkout.Session
  if (session.payment_status !== 'paid') return Response.json({ received: true })

  const eventId = session.metadata?.eventId
  if (!eventId) return Response.json({ received: true })

  const payload = await getPayloadClient()

  // Idempotency: Stripe can deliver the same event more than once.
  const existing = await payload.find({
    collection: 'orders',
    where: { stripeSessionId: { equals: session.id } },
    limit: 1,
    overrideAccess: true,
  })
  if (existing.docs.length) return Response.json({ received: true })

  const items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 10 })
  const quantity = items.data.reduce((n, li) => n + (li.quantity ?? 0), 0) || 1

  await payload.create({
    collection: 'orders',
    data: {
      event: Number(eventId),
      email: session.customer_details?.email ?? 'unknown@unknown',
      name: session.customer_details?.name ?? undefined,
      quantity,
      amountTotal: session.amount_total ?? 0,
      currency: session.currency ?? 'usd',
      status: 'paid',
      stripeSessionId: session.id,
    },
    overrideAccess: true,
  })

  const ev = await payload.findByID({ collection: 'events', id: eventId, depth: 0, overrideAccess: true })
  const ticketsSold = (ev.ticketsSold ?? 0) + quantity
  await payload.update({
    collection: 'events',
    id: eventId,
    data: {
      ticketsSold,
      ...(ev.capacity && ticketsSold >= ev.capacity ? { status: 'sold-out' as const } : {}),
    },
    overrideAccess: true,
  })

  return Response.json({ received: true })
}
