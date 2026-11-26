import { SITE_TIMEZONE } from './constants'

const part = (date: Date, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-US', { timeZone: SITE_TIMEZONE, ...opts }).format(date)

export function dateParts(iso: string) {
  const d = new Date(iso)
  return {
    mon: part(d, { month: 'short' }),
    day: part(d, { day: '2-digit' }),
    weekday: part(d, { weekday: 'short' }),
    time: part(d, { hour: 'numeric', minute: '2-digit' }),
    monthYear: part(d, { month: 'long', year: 'numeric' }),
  }
}

export const formatPrice = (price?: number | null) =>
  price == null
    ? '[$Price]'
    : new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: price % 1 === 0 ? 0 : 2,
      }).format(price)
