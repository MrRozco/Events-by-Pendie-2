'use client'

import { subscribe } from '@/lib/actions'
import { useActionState } from 'react'

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribe, null)
  const done = state?.ok

  return (
    <form className="news-form" action={action} noValidate>
      <div className="field">
        <label htmlFor="news-email">Email address</label>
        <input id="news-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required disabled={done} />
      </div>
      <div className="hp" aria-hidden>
        <label htmlFor="news-company">Company</label>
        <input id="news-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <button className="btn btn-primary" type="submit" disabled={pending || done}>
        {done ? "You're on the list" : pending ? 'Joining…' : 'Join the list'}
      </button>
      <p role="status" aria-live="polite" style={{ flexBasis: '100%' }} className={state && !state.ok ? 'form-error' : undefined}>
        {state && !state.ok ? state.message : ''}
      </p>
    </form>
  )
}
