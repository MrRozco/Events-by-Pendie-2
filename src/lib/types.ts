/** Lightweight shapes passed from server components to client components. */
export type MediaLite = { url: string; alt: string; width?: number | null; height?: number | null } | null

export type EventCardData = {
  id: string
  title: string
  theme?: string | null
  type: string
  typeLabel: string
  startsAt: string
  venue?: string | null
  city?: string | null
  price?: number | null
  seatsLeft: number | null
  status: string
}

export type PastEventData = {
  id: string
  title: string
  type: string
  typeLabel: string
  monthYear: string
  guestCount?: number | null
  image: MediaLite
}

export type Faq = { question: string; answer: string }
