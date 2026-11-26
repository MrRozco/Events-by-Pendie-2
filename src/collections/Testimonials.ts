import type { CollectionConfig } from 'payload'
import { authenticated } from '../access'
import { revalidateAfterChange, revalidateAfterDelete } from '../lib/revalidate'

/** Real guest reviews shown on Our work. */
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: { useAsTitle: 'guestName', group: 'Content', defaultColumns: ['guestName', 'event', 'published'] },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  access: {
    read: ({ req: { user } }) => (user ? true : { published: { equals: true } }),
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    { name: 'guestName', type: 'text', required: true },
    { name: 'event', type: 'relationship', relationTo: 'events' },
    { name: 'published', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
}
