'use client'

import { startCheckout } from '@/lib/actions'
import { useActionState } from 'react'
import { ArrowRight } from './icons'

export function TicketButton({ eventId, soldOut }: { eventId: string; soldOut: boolean }) {
  const [state, action, pending] = useActionState(startCheckout, null)

  if (soldOut) {
    return (
      <span className="btn btn-primary" aria-disabled="true">
        Sold out
      </span>
    )
  }

  return (
    <form action={action}>
      <input type="hidden" name="eventId" value={eventId} />
      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? 'Opening checkout…' : 'Get tickets'} <ArrowRight />
      </button>
      {state && !state.ok && (
        <p className="form-error" role="alert">
          {state.message}
        </p>
      )}
    </form>
  )
}
