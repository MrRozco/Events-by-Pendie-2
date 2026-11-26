export const EVENT_TYPES = [
  { label: 'Murder Mystery', value: 'murder-mystery' },
  { label: 'Traitors', value: 'traitors' },
  { label: 'Dinner Party', value: 'dinner-party' },
  { label: 'Private Event', value: 'private' },
] as const

export type EventType = (typeof EVENT_TYPES)[number]['value']

export const eventTypeLabel = (value?: string | null): string =>
  EVENT_TYPES.find((t) => t.value === value)?.label ?? 'Event'

export const EVENT_STATUSES = [
  { label: 'Draft (hidden)', value: 'draft' },
  { label: 'On sale', value: 'on-sale' },
  { label: 'Sold out', value: 'sold-out' },
  { label: 'Past (shows in Our work)', value: 'past' },
  { label: 'Cancelled', value: 'cancelled' },
] as const

/** Timezone used to display event dates. */
export const SITE_TIMEZONE = process.env.NEXT_PUBLIC_SITE_TIMEZONE || 'America/New_York'
