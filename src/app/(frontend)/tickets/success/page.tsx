import { Flourish, HeroBackground } from '@/components/HeroBackground'
import { getStripe } from '@/lib/stripe'
import type { Metadata } from 'next'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: "You're in", robots: { index: false } }

export default async function TicketSuccess({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams
  const stripe = getStripe()
  const session = stripe && session_id ? await stripe.checkout.sessions.retrieve(session_id).catch(() => null) : null
  const email = session?.customer_details?.email

  return (
    <header className="hero">
      <HeroBackground />
      <div className="hero-inner" style={{ gap: 24 }}>
        <p className="hero-eyebrow">Tickets confirmed</p>
        <h1 className="hero-title">
          <span className="l1">You&apos;re on the</span>
          <span className="l2 accent">guest list</span>
        </h1>
        <Flourish />
        <p style={{ maxWidth: '46ch', fontSize: 20 }}>
          {email ? `A receipt is on its way to ${email}.` : 'A receipt is on its way to your inbox.'} Character details
          and arrival info will follow before the night.
        </p>
        <Link className="btn btn-primary" href="/">
          Back to the site
        </Link>
      </div>
    </header>
  )
}
